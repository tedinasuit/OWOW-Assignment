import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '~/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isGuest: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check for guest mode in localStorage (client-side only)
        if (typeof window !== 'undefined') {
            const guestMode = localStorage.getItem('isGuest');
            if (guestMode === 'true') {
                setIsGuest(true);
            }
        }

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session && typeof window !== 'undefined') {
                setIsGuest(false);
                localStorage.removeItem('isGuest');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsGuest(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isGuest');
        }
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('isGuest', 'true');
        }
    };

    // Show loading state until mounted on client
    if (!mounted) {
        return (
            <AuthContext.Provider value={{
                user: null,
                session: null,
                isGuest: false,
                loading: true,
                signIn,
                signUp,
                signOut,
                continueAsGuest,
            }}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isGuest,
            loading,
            signIn,
            signUp,
            signOut,
            continueAsGuest,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
