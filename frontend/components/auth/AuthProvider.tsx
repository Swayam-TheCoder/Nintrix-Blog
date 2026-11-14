
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "nintrix_session_started_at";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authEventReceived = false;

    let expiryTimer: ReturnType<typeof setTimeout> | undefined;

    const clearExpiryTimer = () => {
      if (expiryTimer) {
        clearTimeout(expiryTimer);
        expiryTimer = undefined;
      }
    };

    const applySession = (
      nextSession: Session | null,
      event?: string
    ) => {
      if (!mounted) return;

      clearExpiryTimer();

      if (!nextSession) {
        localStorage.removeItem(SESSION_STARTED_AT_KEY);

        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      let startedAt = Number(
        localStorage.getItem(SESSION_STARTED_AT_KEY)
      );

      // Start a new 7-day period on login.
      // Existing sessions without a timestamp start now.
      if (event === "SIGNED_IN" || !startedAt) {
        startedAt = Date.now();

        localStorage.setItem(
          SESSION_STARTED_AT_KEY,
          String(startedAt)
        );
      }

      const expiresAt = startedAt + SESSION_DURATION_MS;
      const remainingTime = expiresAt - Date.now();

      // Session has expired.
      if (!Number.isFinite(startedAt) || remainingTime <= 0) {
        localStorage.removeItem(SESSION_STARTED_AT_KEY);

        setSession(null);
        setUser(null);
        setLoading(false);

        // Run outside the auth callback.
        setTimeout(() => {
          void supabase.auth.signOut().catch(console.error);
        }, 0);

        return;
      }

      // Automatically log out after 7 days.
      expiryTimer = setTimeout(() => {
        localStorage.removeItem(SESSION_STARTED_AT_KEY);

        setSession(null);
        setUser(null);

        void supabase.auth.signOut().catch(console.error);
      }, remainingTime);

      setSession(nextSession);
      setUser(nextSession.user);
      setLoading(false);
    };

    // Subscribe to auth events first.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authEventReceived = true;

      applySession(nextSession, event);
    });

    // Load an existing session.
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted && !authEventReceived) {
          applySession(session);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);

        if (mounted && !authEventReceived) {
          applySession(null);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearExpiryTimer();
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    localStorage.removeItem(SESSION_STARTED_AT_KEY);

    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
