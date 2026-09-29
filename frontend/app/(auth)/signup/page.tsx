"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // Backend integration comes next.
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 shadow-2xl shadow-black/20">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Start building your writing workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              required
              className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm outline-none placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-sm outline-none placeholder:text-zinc-700 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 pr-10 text-sm outline-none placeholder:text-zinc-700 focus:border-white/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
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
                Create account
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
        >
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-zinc-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}