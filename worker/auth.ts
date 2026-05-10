/**
 * Cloudflare Zero Trust authentication utilities for Nexus CRM.
 *
 * Flow:
 *  1. Every /api/* request (except /api/auth/*) must carry a valid Cloudflare
 *     Access JWT in the `Cf-Access-Jwt-Assertion` header or `CF_Authorization` cookie.
 *  2. If the JWT is missing or invalid, the failed-attempt counter for that IP is
 *     incremented in the GlobalDurableObject.
 *  3. After MAX_ATTEMPTS (3) consecutive failures the IP is blocked for 24 hours and
 *     an alert email is sent to the configured address.
 *  4. Blocked IPs receive a 403 response on every subsequent request.
 *
 * ⚠️  MAC-address blocking is technically impossible over the public internet.
 *      HTTP/HTTPS only carries IP addresses (OSI Layer 3).  MAC addresses exist only
 *      within a local area network (Layer 2) and are stripped by the first router hop.
 *      Industry-standard mitigation for internet-facing services is IP-based blocking,
 *      which is what this module implements.
 *
 * Required Worker environment variables (set as secrets / vars in wrangler config):
 *   CF_ACCESS_TEAM_DOMAIN  – e.g. "yourteam.cloudflareaccess.com"
 *   CF_ACCESS_AUD          – Application Audience (AUD) from Cloudflare Access dashboard
 *   RESEND_API_KEY         – API key for Resend (https://resend.com) — optional;
 *                            if absent, blocking events are logged but not emailed.
 *   ALERT_EMAIL            – Recipient for security alerts (default: info@kas040.nl)
 */

import type { Env } from './core-utils';
import type { AuthUser } from '@shared/types';

export type { AuthUser };

const BLOCK_DURATION_MS = 24 * 60 * 60 * 1_000; // 24 hours
const MAX_ATTEMPTS = 3;
const DEFAULT_ALERT_EMAIL = 'info@kas040.nl';
const ATTEMPT_WINDOW_MS = 60 * 60 * 1_000; // reset counter after 1 hour with no failure

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getExtra(env: Env) {
    const e = env as any;
    return {
        teamDomain: (e.CF_ACCESS_TEAM_DOMAIN as string | undefined) ?? '',
        aud: (e.CF_ACCESS_AUD as string | undefined) ?? '',
        resendApiKey: (e.RESEND_API_KEY as string | undefined) ?? '',
        alertEmail: (e.ALERT_EMAIL as string | undefined) ?? DEFAULT_ALERT_EMAIL,
    };
}

function getDO(env: Env) {
    const e = env as any;
    const id = e.GlobalDurableObject.idFromName('global');
    return e.GlobalDurableObject.get(id);
}

function b64UrlDecode(s: string): Uint8Array {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function importRsaKey(jwk: JsonWebKey): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
    );
}

// Simple JWKS cache (per-isolate, lives for the isolate lifetime ~minutes)
let jwksCache: { keys: (JsonWebKey & { kid?: string })[]; fetchedAt: number } | null = null;

async function fetchJWKS(teamDomain: string) {
    const now = Date.now();
    if (jwksCache && now - jwksCache.fetchedAt < 10 * 60_000) return jwksCache.keys;
    const resp = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
    if (!resp.ok) throw new Error(`JWKS fetch failed: ${resp.status}`);
    const body = await resp.json<{ keys: (JsonWebKey & { kid?: string })[] }>();
    jwksCache = { keys: body.keys, fetchedAt: now };
    return body.keys;
}

// ─── JWT Validation ───────────────────────────────────────────────────────────

/**
 * Validate a Cloudflare Access JWT.
 * Returns the decoded user payload on success, throws on failure.
 * In dev-bypass mode (env vars absent) it returns a placeholder dev user.
 */
export async function validateAccessJWT(token: string, env: Env): Promise<AuthUser> {
    const { teamDomain, aud } = getExtra(env);

    // Dev-bypass mode: no CF Access env vars configured
    if (!teamDomain || !aud) {
        console.warn('[Auth] Dev-bypass: CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD not set.');
        return { email: 'dev@localhost', name: 'Dev User', sub: 'dev-bypass' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Malformed JWT');

    const [headerB64, payloadB64, sigB64] = parts;

    const header = JSON.parse(new TextDecoder().decode(b64UrlDecode(headerB64))) as {
        kid?: string;
        alg?: string;
    };
    const payload = JSON.parse(new TextDecoder().decode(b64UrlDecode(payloadB64))) as {
        iss?: string;
        aud?: string | string[];
        exp?: number;
        email?: string;
        name?: string;
        sub?: string;
    };

    // Expiry
    const now = Math.floor(Date.now() / 1_000);
    if (payload.exp && payload.exp < now) throw new Error('Token expired');

    // Audience
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud ?? ''];
    if (!audiences.includes(aud)) throw new Error('Invalid audience');

    // Issuer
    if (payload.iss && !payload.iss.includes(teamDomain)) throw new Error('Invalid issuer');

    // Signature
    const keys = await fetchJWKS(teamDomain);
    const jwk = keys.find((k) => k.kid && k.kid === header.kid) ?? keys[0];
    if (!jwk) throw new Error('No matching JWK');
    const key = await importRsaKey(jwk);
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64UrlDecode(sigB64), data);
    if (!valid) throw new Error('Invalid JWT signature');

    return {
        email: payload.email ?? payload.sub ?? 'unknown',
        name: payload.name ?? payload.email ?? 'Unknown',
        sub: payload.sub ?? payload.email ?? 'unknown',
    };
}

// ─── IP Blocking ──────────────────────────────────────────────────────────────

const ipBlockKey = (ip: string) => `auth:block:${ip}`;
const ipAttemptKey = (ip: string) => `auth:attempts:${ip}`;

export async function isIpBlocked(ip: string, env: Env): Promise<boolean> {
    const stub = getDO(env);
    const doc = await stub.getDoc<{ until: number }>(ipBlockKey(ip));
    return doc ? doc.data.until > Date.now() : false;
}

/**
 * Increment the failure counter for an IP.
 * If the counter reaches MAX_ATTEMPTS, the IP is blocked for 24 h and an alert
 * email is dispatched.
 * Returns { blocked, attempts }.
 */
export async function recordFailedAttempt(
    ip: string,
    userAgent: string,
    env: Env,
): Promise<{ blocked: boolean; attempts: number }> {
    const stub = getDO(env);
    const key = ipAttemptKey(ip);
    const now = Date.now();

    // Retry loop for optimistic concurrency
    for (let retry = 0; retry < 5; retry++) {
        const doc = await stub.getDoc<{ count: number; first: number; ua: string }>(key);
        const existing = doc?.data;
        const inWindow = existing && now - existing.first < ATTEMPT_WINDOW_MS;
        const count = inWindow ? existing.count + 1 : 1;
        const first = inWindow ? existing.first : now;

        const result = await stub.casPut(key, doc?.v ?? 0, { count, first, ua: userAgent });
        if (!result.ok) continue; // CAS conflict, retry

        if (count >= MAX_ATTEMPTS) {
            // Block IP
            for (let br = 0; br < 5; br++) {
                const blockDoc = await stub.getDoc<{ until: number }>(ipBlockKey(ip));
                const bres = await stub.casPut(ipBlockKey(ip), blockDoc?.v ?? 0, {
                    until: now + BLOCK_DURATION_MS,
                });
                if (bres.ok) break;
            }
            await sendAlertEmail(ip, userAgent, count, env);
            return { blocked: true, attempts: count };
        }
        return { blocked: false, attempts: count };
    }
    return { blocked: false, attempts: 1 };
}

/** Clear the failure counter on successful auth (optional hygiene) */
export async function clearAttempts(ip: string, env: Env): Promise<void> {
    const stub = getDO(env);
    await stub.del(ipAttemptKey(ip));
}

// ─── Email Alert ──────────────────────────────────────────────────────────────

async function sendAlertEmail(
    ip: string,
    userAgent: string,
    attempts: number,
    env: Env,
): Promise<void> {
    const { resendApiKey, alertEmail } = getExtra(env);
    const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS).toLocaleString('nl-NL', {
        timeZone: 'Europe/Amsterdam',
    });

    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#dc2626">🚨 Nexus CRM — Beveiligingswaarschuwing</h2>
      <p>
        Na <strong>${attempts} mislukte inlogpogingen</strong> is het onderstaande IP-adres
        automatisch geblokkeerd voor <strong>24 uur</strong>.
      </p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px;font-weight:bold">IP-adres</td><td style="padding:6px">${ip}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:6px;font-weight:bold">Browser/Client</td><td style="padding:6px">${userAgent}</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Pogingen</td><td style="padding:6px">${attempts}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:6px;font-weight:bold">Geblokkeerd tot</td><td style="padding:6px">${blockedUntil} (Amsterdam)</td></tr>
        <tr><td style="padding:6px;font-weight:bold">Tijdstip (UTC)</td><td style="padding:6px">${new Date().toISOString()}</td></tr>
      </table>
      <hr style="margin:24px 0">
      <p style="color:#6b7280;font-size:12px">
        <strong>Technische noot over MAC-adres blokkering:</strong><br>
        MAC-adressen zijn alleen zichtbaar binnen een lokaal netwerk (OSI Layer 2) en worden
        door de eerste router-hop verwijderd. Over het internet zijn uitsluitend IP-adressen
        beschikbaar (Layer 3). IP-adres blokkering is de industriestandaard voor
        webapplicaties en voldoende effectief als beveiligingsmaatregel.
      </p>
      <p style="color:#6b7280;font-size:12px">
        Dit bericht is automatisch verzonden door Nexus CRM Security.
      </p>
    </div>
  `;

    if (!resendApiKey) {
        console.warn(
            `[Auth] RESEND_API_KEY not configured — skipping alert email for blocked IP: ${ip}`,
        );
        return;
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Nexus CRM Security <security@the-pot.nl>',
                to: [alertEmail],
                subject: `🚨 IP geblokkeerd: ${ip} — ${attempts} mislukte inlogpogingen`,
                html,
            }),
        });
        if (!res.ok) {
            console.error('[Auth] Alert email failed:', await res.text());
        }
    } catch (err) {
        console.error('[Auth] Alert email error:', err);
    }
}

// ─── Request helpers ──────────────────────────────────────────────────────────

/** Extract the real client IP from Cloudflare request headers */
export function getClientIp(req: Request): string {
    return (
        req.headers.get('CF-Connecting-IP') ??
        req.headers.get('X-Forwarded-For')?.split(',')[0].trim() ??
        '0.0.0.0'
    );
}

/** Extract JWT from Cf-Access-Jwt-Assertion header or CF_Authorization cookie */
export function extractToken(req: Request): string | null {
    const h = req.headers.get('Cf-Access-Jwt-Assertion');
    if (h) return h;
    const cookie = req.headers.get('Cookie') ?? '';
    const m = cookie.match(/CF_Authorization=([^;]+)/);
    return m ? m[1] : null;
}

/** Build the Cloudflare Access login URL from env */
export function buildLoginUrl(env: Env): string {
    const { teamDomain } = getExtra(env);
    if (!teamDomain) return '/login';
    return `https://${teamDomain}/cdn-cgi/access/login`;
}

/** Return the public auth config for the frontend */
export function getAuthConfig(env: Env) {
    const { teamDomain } = getExtra(env);
    const devMode = !teamDomain;
    return {
        teamDomain,
        loginUrl: devMode ? '/login?dev=1' : `https://${teamDomain}/cdn-cgi/access/login`,
        devMode,
    };
}
