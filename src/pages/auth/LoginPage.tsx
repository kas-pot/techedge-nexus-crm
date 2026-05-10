import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Zap, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const OAUTH_ERRORS: Record<string, string> = {
    google_not_configured: 'Google OAuth is nog niet geconfigureerd. Gebruik e-mail inloggen.',
    google_cancelled: 'Google aanmelding geannuleerd.',
    google_token_failed: 'Google authenticatie mislukt. Probeer het opnieuw.',
    google_no_email: 'Geen e-mailadres ontvangen van Google.',
    google_error: 'Er is een fout opgetreden met Google aanmelden.',
    not_authorized: 'Dit account heeft geen toegang tot Nexus CRM.',
};

export function LoginPage() {
    const { user, config, loading } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const isDev = params.get('dev') === '1';
    const oauthError = params.get('error');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        if (!loading && user) navigate('/', { replace: true });
    }, [loading, user, navigate]);

    function handleSSOLogin() {
        // Use real Google OAuth route
        window.location.href = '/api/auth/google';
    }

    async function handleRequestOtp(e: React.FormEvent) {
        e.preventDefault();
        setEmailError('');
        const trimmed = email.trim().toLowerCase();
        if (!trimmed || !/^[^@]+@[^@]+\.[^@]+$/.test(trimmed)) {
            setEmailError('Voer een geldig e-mailadres in.');
            return;
        }
        setEmailLoading(true);
        try {
            await fetch('/api/auth/otp/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed }),
            });
            // Always navigate regardless of result (prevents email enumeration)
            navigate(`/otp?email=${encodeURIComponent(trimmed)}`);
        } catch {
            setEmailError('Er is een fout opgetreden. Probeer het opnieuw.');
        } finally {
            setEmailLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-2xl mb-4">
                        <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">TechEdge Nexus</h1>
                    <p className="text-slate-400 mt-1 text-sm">Enterprise Loyalty Management System</p>
                </div>

                <Card className="border-slate-700/50 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-white font-bold">Welkom terug</CardTitle>
                        <CardDescription className="text-slate-400">
                            Meld u aan met uw organisatieaccount
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-5">
                        {/* OAuth error */}
                        {oauthError && OAUTH_ERRORS[oauthError] && (
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{OAUTH_ERRORS[oauthError]}</span>
                            </div>
                        )}

                        {/* Google OAuth button */}
                        <Button
                            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                            onClick={handleSSOLogin}
                            disabled={loading}
                        >
                            <svg className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Aanmelden met Google
                        </Button>

                        <div className="relative">
                            <Separator className="bg-slate-700/50" />
                            <span className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-slate-800 px-3 text-xs text-slate-500 uppercase tracking-wider">
                                    of via e-mail
                                </span>
                            </span>
                        </div>

                        {/* ── Email OTP form ── */}
                        <form onSubmit={handleRequestOtp} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-300 text-xs font-medium">
                                    E-mailadres
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="uw@emailadres.nl"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                        className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-xs text-red-400">{emailError}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm"
                                disabled={emailLoading || !email.trim()}
                            >
                                {emailLoading ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Versturen…</>
                                ) : (
                                    <><ArrowRight className="h-4 w-4 mr-2" />Eenmalige code versturen</>
                                )}
                            </Button>
                        </form>

                        {/* Trust badges */}
                        <div className="flex items-center justify-center gap-6 text-slate-500 pt-1">
                            <div className="flex items-center gap-1.5 text-xs">
                                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Cloudflare Zero Trust</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <Lock className="h-3.5 w-3.5 text-indigo-400" />
                                <span>OTP / OAuth 2.0</span>
                            </div>
                        </div>

                        {config?.devMode && (
                            <p className="text-center text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2">
                                ⚠️ Dev-modus actief — Cloudflare Access niet geconfigureerd
                            </p>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Na 3 mislukte pogingen wordt uw IP-adres 24 uur geblokkeerd.
                </p>
            </div>
        </div>
    );
}
