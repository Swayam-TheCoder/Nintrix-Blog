"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser, loginWithGoogle } from "@/services/auth.service";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      await loginUser({
        email,
        password,
      });

      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Google login failed");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl shadow-black/20">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Sign in to continue to your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Email</label>

            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-zinc-300">Password</label>

              <Link
                href="/forgot-password"
                className="text-xs text-zinc-500 transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 pr-10 text-sm outline-none transition placeholder:text-zinc-700 focus:border-white/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-zinc-700">OR</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-white transition hover:text-zinc-300"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
