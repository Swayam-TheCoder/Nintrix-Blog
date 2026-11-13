
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (active && session?.user) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  return null;
}
