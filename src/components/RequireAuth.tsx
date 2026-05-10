import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

/**
 * Wraps protected routes. Redirects to /login when the user is not authenticated.
 * Shows a minimal loading screen while the auth check is in progress.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user, loading, unauthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && unauthenticated && !user) {
            navigate('/login', { replace: true });
        }
    }, [loading, unauthenticated, user, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Authenticeren…</span>
                </div>
            </div>
        );
    }

    if (unauthenticated && !user) return null;

    return <>{children}</>;
}
