import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity, ChatBoardEntity, TierEntity, VoucherEntity, VenueEntity,
  OutletEntity, MissionEntity, CampaignEntity, InterestEntity,
  LeaderboardEntity, ApprovalEntity, PartnerEntity, BadgeEntity,
  SystemSettingsEntity, LocalizationSettingsEntity, AdEntity, TicketEntity, NewsEntity, GiftCardEntity, FaqEntity,
  ContactSettingsEntity, TermsEntity, PrivacyEntity, WifiEntity, WeatherSettingsEntity,
  SplashScreenEntity, HeroBannerEntity,
  PushCampaignEntity, ActivityLogEntity
} from "./entities";
import { ok, bad, notFound, Index } from './core-utils';
import {
  MOCK_SPLASH_CONFIG,
  MOCK_HERO_BANNER_CONFIG,
  MOCK_WIFI_SETTINGS
} from '@shared/mock-data';
import {
  validateAccessJWT,
  isIpBlocked,
  recordFailedAttempt,
  clearAttempts,
  extractToken,
  getClientIp,
  getAuthConfig,
  isAdminEmail,
  getAdminUser,
  listAdminUsers,
  registerAdminUser,
  storeOtp,
  verifyOtp,
  sendOtpEmail,
  createOtpSession,
  validateOtpSession,
  deleteOtpSession,
} from './auth';
const ENTITY_MAP: Record<string, any> = {
  users: UserEntity,
  tiers: TierEntity,
  vouchers: VoucherEntity,
  venues: VenueEntity,
  outlets: OutletEntity,
  missions: MissionEntity,
  campaigns: CampaignEntity,
  interests: InterestEntity,
  leaderboards: LeaderboardEntity,
  approvals: ApprovalEntity,
  partners: PartnerEntity,
  badges: BadgeEntity,
  ads: AdEntity,
  tickets: TicketEntity,
  news: NewsEntity,
  'gift-cards': GiftCardEntity,
  'push-campaigns': PushCampaignEntity,
  'activity-logs': ActivityLogEntity,
  faqs: FaqEntity
};
async function logActivity(env: Env, action: any, type: string, id: string) {
  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      await ActivityLogEntity.create(env, {
        id: crypto.randomUUID(),
        action,
        entityType: type,
        entityId: id,
        userName: "Nexus Admin",
        timestamp: new Date().toISOString(),
        details: `Automatic audit for ${action} event on ${type}:${id}`
      });
      return;
    } catch (e) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.error("Logging failed after", maxAttempts, "attempts:", e);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {

  // ─── Auth middleware ────────────────────────────────────────────────────────
  // All /api/* routes require either:
  //   a) a valid Cloudflare Access JWT, OR
  //   b) a valid OTP session cookie (nexus_session)
  // Except /api/auth/* which is always public.
  app.use('/api/*', async (c, next) => {
    // Public auth endpoints bypass the check
    if (c.req.path.startsWith('/api/auth/')) return next();

    const ip = getClientIp(c.req.raw);

    // Check if IP is already blocked
    if (await isIpBlocked(ip, c.env)) {
      return c.json({ success: false, error: 'IP blocked due to too many failed login attempts. Try again in 24 hours.' }, 403);
    }

    // Try OTP session cookie first
    const cookieHeader = c.req.header('Cookie') ?? '';
    const sessionMatch = cookieHeader.match(/nexus_session=([^;]+)/);
    if (sessionMatch) {
      const sessionUser = await validateOtpSession(sessionMatch[1], c.env);
      if (sessionUser) {
        (c as any).set('authUser', sessionUser);
        return next();
      }
    }

    // Try Cloudflare Access JWT
    const token = extractToken(c.req.raw);
    if (!token) {
      const ua = c.req.header('User-Agent') ?? '';
      const { blocked } = await recordFailedAttempt(ip, ua, c.env);
      const msg = blocked
        ? 'IP blocked after too many failed attempts. An alert has been sent.'
        : 'Authentication required. Please sign in.';
      return c.json({ success: false, error: msg }, 401);
    }

    try {
      const user = await validateAccessJWT(token, c.env);
      (c as any).set('authUser', user);
      await clearAttempts(ip, c.env);
      return next();
    } catch (err: any) {
      const ua = c.req.header('User-Agent') ?? '';
      const { blocked } = await recordFailedAttempt(ip, ua, c.env);
      const msg = blocked
        ? 'IP blocked after too many failed attempts. An alert has been sent.'
        : `Invalid authentication token: ${err?.message ?? 'unknown error'}`;
      return c.json({ success: false, error: msg }, 401);
    }
  });

  // ─── Public auth routes (no JWT required) ──────────────────────────────────

  /** Return the Cloudflare Access config so the frontend knows the login URL */
  app.get('/api/auth/config', (c) => {
    return c.json({ success: true, data: getAuthConfig(c.env) });
  });

  /** Validate the current JWT or OTP session and return the authenticated user */
  app.get('/api/auth/me', async (c) => {
    const ip = getClientIp(c.req.raw);

    if (await isIpBlocked(ip, c.env)) {
      return c.json({ success: false, error: 'IP blocked.' }, 403);
    }

    // Check OTP session cookie first
    const cookieHeader = c.req.header('Cookie') ?? '';
    const sessionMatch = cookieHeader.match(/nexus_session=([^;]+)/);
    if (sessionMatch) {
      const sessionUser = await validateOtpSession(sessionMatch[1], c.env);
      if (sessionUser) return c.json({ success: true, data: sessionUser });
    }

    const token = extractToken(c.req.raw);
    if (!token) {
      return c.json({ success: false, error: 'Not authenticated' }, 401);
    }

    try {
      const user = await validateAccessJWT(token, c.env);
      await clearAttempts(ip, c.env);
      return c.json({ success: true, data: user });
    } catch (err: any) {
      const ua = c.req.header('User-Agent') ?? '';
      const { blocked } = await recordFailedAttempt(ip, ua, c.env);
      const msg = blocked
        ? 'IP blocked after too many failed attempts.'
        : 'Invalid or expired token.';
      return c.json({ success: false, error: msg }, 401);
    }
  });

  /** Logout: clear both CF_Authorization and nexus_session cookies */
  app.get('/api/auth/logout', async (c) => {
    const cookieHeader = c.req.header('Cookie') ?? '';
    const sessionMatch = cookieHeader.match(/nexus_session=([^;]+)/);
    if (sessionMatch) {
      await deleteOtpSession(sessionMatch[1], c.env).catch(() => { });
    }
    const headers = new Headers();
    headers.append('Set-Cookie', 'CF_Authorization=; Path=/; Max-Age=0; SameSite=Lax');
    headers.append('Set-Cookie', 'nexus_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly');
    headers.set('Location', '/login');
    return new Response(null, { status: 302, headers });
  });

  // ─── Email OTP routes ────────────────────────────────────────────────────────

  /**
   * POST /api/auth/otp/request
   * Body: { email: string }
   * Checks if email belongs to an active admin user — if not, silently returns
   * success (to avoid email enumeration). Only sends OTP to known admins.
   */
  app.post('/api/auth/otp/request', async (c) => {
    try {
      const ip = getClientIp(c.req.raw);

      if (await isIpBlocked(ip, c.env)) {
        return c.json({ success: false, error: 'IP blocked.' }, 403);
      }

      let email: string;
      try {
        const body = await c.req.json<{ email?: string }>();
        email = (body.email ?? '').trim().toLowerCase();
      } catch {
        return bad(c, 'Ongeldig verzoek');
      }

      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        return bad(c, 'Voer een geldig e-mailadres in.');
      }

      // Security: always return the same generic response regardless of whether
      // the email exists — prevents email enumeration attacks.
      const adminExists = await isAdminEmail(email, c.env);
      if (adminExists) {
        const adminUser = await getAdminUser(email, c.env);
        const name = adminUser?.name ?? email;
        const otp = await storeOtp(email, c.env);
        // Email failures are isolated — OTP is already stored in D1 even if send fails
        try {
          await sendOtpEmail(email, otp, name, c.env);
        } catch (emailErr) {
          console.error('[OTP] sendOtpEmail threw:', emailErr);
        }
      }

      // Always return 200 to prevent email enumeration
      return c.json({ success: true, message: 'Als dit e-mailadres bekend is, ontvangt u een code.' });
    } catch (err) {
      console.error('[OTP] /api/auth/otp/request error:', err instanceof Error ? err.message : String(err), err);
      // Still return 200 to prevent enumeration — but error is now in wrangler tail
      return c.json({ success: true, message: 'Als dit e-mailadres bekend is, ontvangt u een code.' });
    }
  });

  /**
   * POST /api/auth/otp/verify
   * Body: { email: string, token: string }
   * On success sets a nexus_session cookie and returns the AuthUser.
   */
  app.post('/api/auth/otp/verify', async (c) => {
    try {
      const ip = getClientIp(c.req.raw);

      if (await isIpBlocked(ip, c.env)) {
        return c.json({ success: false, error: 'IP blocked.' }, 403);
      }

      let email: string, token: string;
      try {
        const body = await c.req.json<{ email?: string; token?: string }>();
        email = (body.email ?? '').trim().toLowerCase();
        token = (body.token ?? '').trim();
      } catch {
        return bad(c, 'Ongeldig verzoek');
      }

      if (!email || !token) return bad(c, 'E-mailadres en code zijn verplicht.');

      const result = await verifyOtp(email, token, c.env);
      if (!result.valid) {
        // Count as failed attempt toward IP blocking
        const ua = c.req.header('User-Agent') ?? '';
        const { blocked } = await recordFailedAttempt(ip, ua, c.env);
        const msg = blocked
          ? 'IP blocked after too many failed attempts.'
          : (result.reason ?? 'Ongeldige code.');
        return c.json({ success: false, error: msg }, 401);
      }

      // Clear failure counter on success
      await clearAttempts(ip, c.env);

      // Look up the admin user info
      const adminUser = await getAdminUser(email, c.env);
      const name = adminUser?.name ?? email;

      // Create session
      const sessionToken = await createOtpSession(email, name, c.env);

      const isProduction = !getAuthConfig(c.env).devMode;
      const cookieFlags = isProduction ? '; Secure' : '';
      const cookieValue = `nexus_session=${sessionToken}; Path=/; Max-Age=${8 * 3600}; SameSite=Lax; HttpOnly${cookieFlags}`;

      return new Response(
        JSON.stringify({ success: true, data: { email, name, sub: email } }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookieValue,
          },
        },
      );
    } catch (err) {
      console.error('[OTP] /api/auth/otp/verify error:', err instanceof Error ? err.message : String(err), err);
      return c.json({ success: false, error: 'Er is een interne fout opgetreden. Probeer het opnieuw.' }, 500);
    }
  });

  /**
   * GET /api/auth/admin-users — list all registered admin users (protected)
   * POST /api/auth/admin-users — register a new admin user (protected)
   */
  app.get('/api/auth/admin-users', async (c) => {
    const users = await listAdminUsers(c.env);
    return c.json({ success: true, data: users });
  });

  app.post('/api/auth/admin-users', async (c) => {
    const { email, name, role } = await c.req.json<{ email: string; name: string; role: string }>();
    if (!email || !name) return bad(c, 'email and name are required');
    await registerAdminUser(email, name, role ?? 'admin', c.env);
    return c.json({ success: true, data: { email: email.toLowerCase().trim(), name, role: role ?? 'admin' } });
  });

  // ─── Specialized Batch Gift Card Generation
  app.post('/api/gift-cards/batch', async (c) => {
    const { count, value, expiryDate } = await c.req.json();
    if (!count || count <= 0) return bad(c, 'Invalid count');
    const results = [];
    for (let i = 0; i < count; i++) {
      const id = crypto.randomUUID();
      const serial = `NXS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const card = await GiftCardEntity.create(c.env, {
        id,
        serial,
        value: Number(value) || 0,
        balance: Number(value) || 0,
        status: 'active',
        expiryDate: expiryDate || '2025-12-31'
      });
      results.push(card);
    }
    await logActivity(c.env, 'Created', 'gift_card_batch', 'batch_mint');
    return ok(c, results);
  });

  // ─── Aggregate Stats (index-count only, no full doc fetch) ─────────────────
  app.get('/api/stats', async (c) => {
    try {
      await Promise.all([
        UserEntity.ensureSeed(c.env),
        CampaignEntity.ensureSeed(c.env),
        ApprovalEntity.ensureSeed(c.env),
        GiftCardEntity.ensureSeed(c.env),
      ].map(p => p.catch(() => { })));
      const [memberIds, campaignIds, approvalIds, giftCardIds] = await Promise.all([
        new Index<string>(c.env, 'members').list().catch(() => [] as string[]),
        new Index<string>(c.env, 'campaigns').list().catch(() => [] as string[]),
        new Index<string>(c.env, 'approvals').list().catch(() => [] as string[]),
        new Index<string>(c.env, 'gift-cards').list().catch(() => [] as string[]),
      ]);
      return ok(c, {
        totalMembers: memberIds.length,
        totalCampaigns: campaignIds.length,
        totalApprovals: approvalIds.length,
        totalGiftCards: giftCardIds.length,
      });
    } catch (e) {
      console.error('[Stats]', e);
      return ok(c, { totalMembers: 0, totalCampaigns: 0, totalApprovals: 0, totalGiftCards: 0 });
    }
  });

  // Generic Entity Routes
  app.get('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c, `Entity type ${type} not found`);
    await EntityClass.ensureSeed(c.env);
    const channel = c.req.query('channel');
    const cursor = c.req.query('cursor');
    const limitParam = c.req.query('limit');
    const limit = limitParam ? Math.max(1, (Number(limitParam) | 0)) : undefined;
    const page = await EntityClass.list(c.env, cursor ?? null, limit);
    if (channel && type === 'campaigns') {
      page.items = page.items.filter((item: any) => item.channel === channel);
    }
    return ok(c, page);
  });
  app.post('/api/:entityType', async (c) => {
    const type = c.req.param('entityType');
    const data = await c.req.json();
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const id = data.id || crypto.randomUUID();
    const result = await EntityClass.create(c.env, { ...data, id });
    await logActivity(c.env, 'Created', type, id);
    return ok(c, result);
  });
  app.put('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const data = await c.req.json();
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const inst = new EntityClass(c.env, id);
    if (!await inst.exists()) return notFound(c);
    await inst.patch(data);
    await logActivity(c.env, 'Updated', type, id);
    return ok(c, await inst.getState());
  });
  app.delete('/api/:entityType/:id', async (c) => {
    const type = c.req.param('entityType');
    const id = c.req.param('id');
    const EntityClass = ENTITY_MAP[type];
    if (!EntityClass) return notFound(c);
    const deleted = await EntityClass.delete(c.env, id);
    if (deleted) await logActivity(c.env, 'Deleted', type, id);
    return deleted ? ok(c, { success: true }) : notFound(c);
  });
  // System Singleton Routes
  app.get('/api/system/settings', async (c) => ok(c, await SystemSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/settings', async (c) => {
    const data = await c.req.json();
    const inst = new SystemSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/system/localization', async (c) => ok(c, await LocalizationSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/localization', async (c) => {
    const data = await c.req.json();
    const inst = new LocalizationSettingsEntity(c.env, "global");
    await inst.patch({ ...data, updatedAt: new Date().toISOString() });
    await logActivity(c.env, 'Updated', 'localization_settings', 'global');
    return ok(c, await inst.getState());
  });
  app.get('/api/system/weather', async (c) => ok(c, await WeatherSettingsEntity.getGlobal(c.env)));
  app.put('/api/system/weather', async (c) => {
    const data = await c.req.json();
    const inst = new WeatherSettingsEntity(c.env, "global");
    await inst.patch(data);
    return ok(c, await inst.getState());
  });
  app.get('/api/reseed-all', async (c) => {
    let count = 0;
    for (const [type, EntityClass] of Object.entries(ENTITY_MAP)) {
      const indexName = (EntityClass as any).indexName;
      if (indexName) {
        if (type === 'activity-logs') continue;
        const idx = new Index<string>(c.env, indexName);
        await idx.clear();
        await EntityClass.ensureSeed(c.env);
        count++;
      }
    }
    await new SplashScreenEntity(c.env, "global").save(MOCK_SPLASH_CONFIG);
    await new HeroBannerEntity(c.env, "global").save(MOCK_HERO_BANNER_CONFIG);
    await new WifiEntity(c.env, "global").save(MOCK_WIFI_SETTINGS);
    return ok(c, { reseeded: count, message: 'All mock entities force-reseeded' });
  });

  // ─── The Pot App — Live D1 Routes ─────────────────────────────────────────
  // All routes are guarded: if THEPOT_DB binding is absent (production), return 404.
  function getDb(c: any): D1Database | null {
    return (c.env as any).THEPOT_DB ?? null;
  }

  // Users
  app.get('/api/thepot/users', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 50);
    const offset = (page - 1) * limit;
    const search = c.req.query('search') ?? '';
    const where = search ? `WHERE u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?` : '';
    const params = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const [rows, total] = await Promise.all([
      db.prepare(`SELECT * FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all(),
      db.prepare(`SELECT COUNT(*) as cnt FROM users ${where}`).bind(...params).first<{ cnt: number }>(),
    ]);
    return ok(c, { items: rows.results, total: total?.cnt ?? 0, page, limit });
  });

  app.get('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first();
    return user ? ok(c, user) : notFound(c);
  });

  app.post('/api/thepot/users', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { first_name, last_name, email, birth_date, gender, user_role, is_active } = await c.req.json();
    if (!first_name || !last_name || !email) return bad(c, 'first_name, last_name and email are required');
    const existing = await db.prepare('SELECT id FROM users WHERE email=?').bind(email).first();
    if (existing) return bad(c, 'A user with this email already exists');
    await db.prepare(
      `INSERT INTO users (email, first_name, last_name, birth_date, gender, is_email_verified, is_active, user_role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, datetime('now'), datetime('now'))`
    ).bind(email, first_name, last_name, birth_date ?? null, gender ?? null, is_active ?? 1, user_role ?? 'user').run();
    const created = await db.prepare('SELECT * FROM users WHERE email=? ORDER BY id DESC LIMIT 1').bind(email).first();
    return ok(c, created);
  });

  app.put('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { first_name, last_name, email, birth_date, gender, is_active, user_role } = await c.req.json();
    await db.prepare(
      `UPDATE users SET first_name=?, last_name=?, email=?, birth_date=?, gender=?, is_active=?, user_role=?, updated_at=datetime('now') WHERE id=?`
    ).bind(first_name, last_name, email, birth_date ?? null, gender ?? null, is_active ?? 1, user_role ?? 'user', c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/users/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare(`UPDATE users SET is_active=0, updated_at=datetime('now') WHERE id=?`).bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Games
  app.get('/api/thepot/games', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const page = Number(c.req.query('page') ?? 1);
    const limit = Number(c.req.query('limit') ?? 50);
    const offset = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      db.prepare(`
        SELECT g.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name,
          (SELECT COUNT(*) FROM game_rounds gr WHERE gr.game_id = g.id) as round_count
        FROM games g
        LEFT JOIN users u ON u.id = g.user_id
        ORDER BY g.id DESC LIMIT ? OFFSET ?
      `).bind(limit, offset).all(),
      db.prepare('SELECT COUNT(*) as cnt FROM games').first<{ cnt: number }>(),
    ]);
    return ok(c, { items: rows.results, total: total?.cnt ?? 0, page, limit });
  });

  app.get('/api/thepot/games/:id', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const [game, teams, rounds] = await Promise.all([
      db.prepare(`
        SELECT g.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
        FROM games g LEFT JOIN users u ON u.id = g.user_id WHERE g.id=?
      `).bind(c.req.param('id')).first(),
      db.prepare('SELECT * FROM game_teams WHERE game_id=? ORDER BY team_index').bind(c.req.param('id')).all(),
      db.prepare('SELECT * FROM game_rounds WHERE game_id=? ORDER BY round_number').bind(c.req.param('id')).all(),
    ]);
    if (!game) return notFound(c);
    return ok(c, { ...game as object, teams: teams.results, rounds: rounds.results });
  });

  app.delete('/api/thepot/games/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM games WHERE id=?').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Challenges
  app.get('/api/thepot/challenges', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const rows = await db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM sub_challenges sc WHERE sc.challenge_id = c.challenge_id) as sub_challenge_count
      FROM challenges c ORDER BY c.is_default DESC, c.id ASC
    `).all();
    return ok(c, { items: rows.results, total: rows.results.length });
  });

  app.post('/api/thepot/challenges', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name, user_id } = await c.req.json();
    if (!name) return bad(c, 'name is required');
    const challenge_id = Date.now().toString();
    await db.prepare(
      `INSERT INTO challenges (challenge_id, name, is_active, is_default, user_id, created_at, updated_at) VALUES (?, ?, 0, 0, ?, datetime('now'), datetime('now'))`
    ).bind(challenge_id, name, user_id ?? null).run();
    const created = await db.prepare('SELECT * FROM challenges WHERE challenge_id=?').bind(challenge_id).first();
    return ok(c, created);
  });

  app.put('/api/thepot/challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name, is_active } = await c.req.json();
    await db.prepare(
      `UPDATE challenges SET name=?, is_active=?, updated_at=datetime('now') WHERE id=?`
    ).bind(name, is_active ?? 0, c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM challenges WHERE id=?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM challenges WHERE id=? AND is_default=0').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Sub-Challenges
  app.get('/api/thepot/challenges/:challengeId/sub-challenges', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const rows = await db.prepare(
      'SELECT * FROM sub_challenges WHERE challenge_id=? ORDER BY id ASC'
    ).bind(c.req.param('challengeId')).all();
    return ok(c, { items: rows.results, total: rows.results.length });
  });

  app.post('/api/thepot/challenges/:challengeId/sub-challenges', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name } = await c.req.json();
    if (!name) return bad(c, 'name is required');
    const sub_challenge_id = `custom-${Date.now()}`;
    const challengeId = c.req.param('challengeId');
    await db.prepare(
      `INSERT INTO sub_challenges (sub_challenge_id, challenge_id, name, is_default, created_at, updated_at) VALUES (?, ?, ?, 0, datetime('now'), datetime('now'))`
    ).bind(sub_challenge_id, challengeId, name).run();
    const created = await db.prepare('SELECT * FROM sub_challenges WHERE sub_challenge_id=?').bind(sub_challenge_id).first();
    return ok(c, created);
  });

  app.put('/api/thepot/sub-challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    const { name } = await c.req.json();
    await db.prepare(
      `UPDATE sub_challenges SET name=?, updated_at=datetime('now') WHERE id=?`
    ).bind(name, c.req.param('id')).run();
    const updated = await db.prepare('SELECT * FROM sub_challenges WHERE id=?').bind(c.req.param('id')).first();
    return ok(c, updated);
  });

  app.delete('/api/thepot/sub-challenges/:id', async (c) => {
    const db = getDb(c);
    if (!db) return bad(c, 'Not available in this environment');
    await db.prepare('DELETE FROM sub_challenges WHERE id=? AND is_default=0').bind(c.req.param('id')).run();
    return ok(c, { success: true });
  });

  // Stats overview
  app.get('/api/thepot/stats', async (c) => {
    const db = getDb(c);
    if (!db) return notFound(c, 'Not available in this environment');
    const [users, games, challenges, subChallenges] = await Promise.all([
      db.prepare('SELECT COUNT(*) as cnt FROM users').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM games').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM challenges').first<{ cnt: number }>(),
      db.prepare('SELECT COUNT(*) as cnt FROM sub_challenges').first<{ cnt: number }>(),
    ]);
    return ok(c, {
      users: users?.cnt ?? 0,
      games: games?.cnt ?? 0,
      challenges: challenges?.cnt ?? 0,
      subChallenges: subChallenges?.cnt ?? 0,
    });
  });
}