"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090c] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}