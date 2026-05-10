import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthUser, AuthConfig } from '@shared/types';

interface AuthState {
    user: AuthUser | null;
    config: AuthConfig | null;
    loading: boolean;
    /** true when the backend confirmed the token is invalid / missing */
    unauthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    logout: () => void;
    /** Manually re-check auth (e.g. after a login redirect lands back) */
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        config: null,
        loading: true,
        unauthenticated: false,
    });

    const fetchAuth = useCallback(async () => {
        setState((s) => ({ ...s, loading: true }));
        try {
            // Fetch config and current user in parallel
            const [cfgRes, meRes] = await Promise.all([
                fetch('/api/auth/config'),
                fetch('/api/auth/me', { credentials: 'include' }),
            ]);

            const cfgData = await cfgRes.json<{ success: boolean; data?: AuthConfig }>();
            const config = cfgData.success ? cfgData.data ?? null : null;

            if (meRes.ok) {
                const meData = await meRes.json<{ success: boolean; data?: AuthUser }>();
                setState({
                    user: meData.success ? meData.data ?? null : null,
                    config,
                    loading: false,
                    unauthenticated: !meData.success,
                });
            } else {
                setState({ user: null, config, loading: false, unauthenticated: true });
            }
        } catch {
            setState((s) => ({ ...s, loading: false, unauthenticated: true }));
        }
    }, []);

    useEffect(() => {
        fetchAuth();
    }, [fetchAuth]);

    const logout = useCallback(() => {
        // Redirect to the Worker logout route which clears the cookie and redirects to /login
        window.location.href = '/api/auth/logout';
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, logout, refresh: fetchAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
