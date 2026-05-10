import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Zap, ArrowLeft, Loader2, MailCheck } from 'lucide-react';

export function OtpVerifyPage() {
    const { refresh } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const email = params.get('email') ?? '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Redirect if no email in URL
        if (!email) navigate('/login', { replace: true });
    }, [email, navigate]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = code.trim().replace(/\s/g, '');
        if (trimmed.length !== 6 || !/^\d{6}$/.test(trimmed)) {
            setError('Voer de 6-cijferige code in die u per e-mail heeft ontvangen.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token: trimmed }),
                credentials: 'include',
            });
            const data = await res.json<{ success: boolean; error?: string }>();

            if (!res.ok || !data.success) {
                setError(data.error ?? 'Ongeldige of verlopen code. Probeer het opnieuw.');
                setCode('');
                inputRef.current?.focus();
                return;
            }

            setSuccess(true);
            await refresh();
            navigate('/', { replace: true });
        } catch {
            setError('Er is een verbindingsfout opgetreden. Probeer het opnieuw.');
        } finally {
            setLoading(false);
        }
    }

    function handleCodeChange(v: string) {
        // Only allow digits, max 6 characters
        const digits = v.replace(/\D/g, '').slice(0, 6);
        setCode(digits);
        if (error) setError('');
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
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <MailCheck className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <CardTitle className="text-xl text-white font-bold">Controleer uw e-mail</CardTitle>
                        <CardDescription className="text-slate-400">
                            Voer de 6-cijferige code in die verstuurd is naar{' '}
                            <span className="text-indigo-400 font-medium">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="one-time-code"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => handleCodeChange(e.target.value)}
                                    disabled={loading || success}
                                    className="text-center text-3xl font-mono tracking-[0.5em] h-16 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                />
                                {error && (
                                    <p className="text-xs text-red-400 text-center">{error}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                                disabled={loading || success || code.length !== 6}
                            >
                                {loading || success ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{success ? 'Inloggen…' : 'Verifiëren…'}</>
                                ) : (
                                    'Code bevestigen'
                                )}
                            </Button>
                        </form>

                        <div className="text-center space-y-2">
                            <p className="text-xs text-slate-500">
                                De code is 10 minuten geldig en kan slechts één keer worden gebruikt.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Terug naar aanmelden
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Na 3 mislukte pogingen wordt uw IP-adres 24 uur geblokkeerd.
                </p>
            </div>
        </div>
    );
}
