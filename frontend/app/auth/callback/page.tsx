
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        // Supabase may return an OAuth error instead of a code.
        const oauthError =
          params.get("error_description") ||
          params.get("error");

        if (oauthError) {
          throw new Error(oauthError);
        }

        const code = params.get("code");

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;
        }

        // Confirm that Supabase actually created a session.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          throw new Error("Google login failed. No active session found.");
        }

        console.log("Google login successful:", session.user);

        if (active) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Google callback error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Google login failed";

        if (active) {
          router.replace(
            `/login?error=${encodeURIComponent(message)}`
          );
        }
      }
    };

    handleCallback();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing Google login...</p>
    </div>
  );
}
