"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(
        window.location.search
      );

      const code = params.get("code");

      if (!code) {
        router.replace("/login");
        return;
      }

      const { error } =
        await supabase.auth.exchangeCodeForSession(
          code
        );

      if (error) {
        console.error(error);

        router.replace(
          `/login?error=${encodeURIComponent(
            error.message
          )}`
        );

        return;
      }

      router.replace("/dashboard");
    };

    handleCallback();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090c] text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

        <p className="text-sm text-white/60">
          Completing authentication...
        </p>
      </div>
    </main>
  );
}