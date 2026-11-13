import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  GitPullRequest,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";
import AuthRedirect from "./auth/AuthRedirect";

const features = [
  {
    icon: BookOpen,
    title: "Write & Organize",
    description:
      "Keep all your blogs organized inside repositories instead of scattered across platforms.",
  },
  {
    icon: Users,
    title: "Collaborate",
    description:
      "Invite writers, editors, and viewers to work together on the same repository.",
  },
  {
    icon: GitBranch,
    title: "Version Everything",
    description:
      "Track changes to your content and keep a history of how your blogs evolve.",
  },
  {
    icon: GitPullRequest,
    title: "Built for Teams",
    description:
      "Branches, pull requests, reviews and more are designed for future collaboration.",
  },
  {
    icon: Shield,
    title: "Private by Default",
    description:
      "Control exactly who can access your repositories and their content.",
  },
  {
    icon: Sparkles,
    title: "Publish Beautifully",
    description:
      "Turn your finished writing into clean, public experiences for your readers.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090c] text-white">

      <AuthRedirect />
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#08090c]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <BookOpen size={18} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              NintrixBlog
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>

            <a href="#how-it-works" className="transition hover:text-white">
              How it works
            </a>

            <a href="#about" className="transition hover:text-white">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-4 py-2 text-sm text-zinc-300 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-28 text-center md:pb-36 md:pt-36">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-zinc-400">
            <Sparkles size={15} />
            <span>The collaborative home for writers</span>
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl">
            Write together.
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Build something bigger.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            A modern blogging platform inspired by the way developers
            collaborate. Create repositories, write blogs, invite your team,
            track changes, and publish your work.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Start writing
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Explore features
            </a>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-20 max-w-6xl px-4">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-10 -z-10 overflow-hidden">
              <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />
              <div className="absolute right-[5%] top-[20%] h-80 w-80 rounded-full bg-cyan-500/15 blur-[130px]" />
              <div className="absolute bottom-0 left-[40%] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[110px]" />
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#080a0f]/90 shadow-2xl shadow-black/60 backdrop-blur-xl">
              {/* Animated border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/[0.05]" />

              {/* Browser bar */}
              <div className="relative flex h-14 items-center gap-2 border-b border-white/[0.07] bg-white/[0.025] px-5">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_12px_rgba(248,113,113,0.35)]" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80 shadow-[0_0_12px_rgba(250,204,21,0.35)]" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.35)]" />
                </div>

                {/* Address bar */}
                <div className="ml-5 flex h-8 flex-1 items-center rounded-lg border border-white/[0.06] bg-white/[0.035] px-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 text-sm font-medium text-white">Welcome to NintrixBlog</div>
                  <div className="ml-3 h-2 w-44 rounded-full bg-white/[0.08] sm:w-64" />

                  <div className="ml-auto hidden h-2 w-16 rounded-full bg-white/[0.05] sm:block" />
                </div>
              </div>

              {/* Dashboard */}
              <div className="grid min-h-[430px] grid-cols-[190px_1fr] text-left">
                {/* Sidebar */}
                <aside className="relative border-r border-white/[0.07] bg-white/[0.015] p-5">
                  {/* Logo */}
                  <div className="mb-9 flex items-center gap-2.5">
                    <div className="relative h-7 w-7 overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/20">
                      <div className="absolute inset-[5px] rounded-md bg-black/30" />
                    </div>

                    <div className="h-3 w-20 rounded-full bg-white/[0.14]" />
                  </div>

                  {/* Navigation */}
                  <div className="space-y-2">
                    {/* Active */}
                    <div className="relative flex h-10 items-center gap-3 overflow-hidden rounded-xl border border-violet-400/10 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/5 px-3">
                      <div className="absolute left-0 h-5 w-0.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

                      <div className="h-4 w-4 rounded-md bg-violet-400/30" />
                      <div className="h-2 w-20 rounded-full bg-white/[0.18]" />
                    </div>

                    <div className="flex h-10 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-white/[0.03]">
                      <div className="h-4 w-4 rounded-md bg-cyan-400/15" />
                      <div className="h-2 w-16 rounded-full bg-white/[0.07]" />
                    </div>

                    <div className="flex h-10 items-center gap-3 rounded-xl px-3">
                      <div className="h-4 w-4 rounded-md bg-fuchsia-400/15" />
                      <div className="h-2 w-24 rounded-full bg-white/[0.07]" />
                    </div>

                    <div className="flex h-10 items-center gap-3 rounded-xl px-3">
                      <div className="h-4 w-4 rounded-md bg-emerald-400/15" />
                      <div className="h-2 w-14 rounded-full bg-white/[0.07]" />
                    </div>
                  </div>

                  {/* Bottom profile */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400" />

                    <div className="flex-1">
                      <div className="h-2 w-16 rounded-full bg-white/[0.12]" />
                      <div className="mt-2 h-1.5 w-11 rounded-full bg-white/[0.05]" />
                    </div>
                  </div>
                </aside>

                {/* Main */}
                <main className="relative overflow-hidden p-6 sm:p-8">
                  {/* subtle grid */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.025]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Header */}
                  <div className="relative flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-48 rounded-lg bg-gradient-to-r from-white/[0.14] to-white/[0.05]" />

                        <div className="hidden rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 sm:block">
                          <div className="h-1.5 w-10 rounded-full bg-emerald-400/40" />
                        </div>
                      </div>

                      <div className="mt-3 h-3 w-64 rounded-full bg-white/[0.04]" />
                    </div>

                    <div className="hidden h-9 w-24 rounded-xl border border-white/[0.06] bg-white/[0.03] sm:block" />
                  </div>

                  {/* Stats */}
                  <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        glow: "bg-violet-500/10",
                        icon: "bg-violet-400/25",
                        value: "6",
                      },
                      {
                        glow: "bg-cyan-500/10",
                        icon: "bg-cyan-400/25",
                        value: "24",
                      },
                      {
                        glow: "bg-fuchsia-500/10",
                        icon: "bg-fuchsia-400/25",
                        value: "12",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-white/[0.12]"
                      >
                        <div
                          className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${item.glow} blur-2xl`}
                        />

                        <div className="relative">
                          <div className={`h-7 w-7 rounded-lg ${item.icon}`} />

                          <div className="mt-5 h-2 w-16 rounded-full bg-white/[0.08]" />

                          <div className="mt-3 flex items-end gap-2">
                            <div className="h-7 w-10 rounded-lg bg-white/[0.13]" />
                            <div className="mb-1 h-2 w-14 rounded-full bg-white/[0.04]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Repository cards */}
                  <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                      <div
                        key={item}
                        className="group/card relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04]"
                      >
                        {/* Card glow */}
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/5 blur-3xl transition duration-500 group-hover/card:bg-violet-500/15" />

                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-8 w-8 rounded-lg ${
                                  item === 0
                                    ? "bg-violet-400/15"
                                    : item === 1
                                      ? "bg-cyan-400/15"
                                      : "bg-fuchsia-400/15"
                                }`}
                              />

                              <div className="h-3 w-24 rounded-full bg-white/[0.1]" />
                            </div>

                            <div className="h-5 w-5 rounded-md bg-white/[0.04]" />
                          </div>

                          <div className="mt-6 h-2 w-full rounded-full bg-white/[0.045]" />
                          <div className="mt-2 h-2 w-4/5 rounded-full bg-white/[0.035]" />

                          <div className="mt-7 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-violet-400/40 to-cyan-400/30" />
                              <div className="h-1.5 w-12 rounded-full bg-white/[0.04]" />
                            </div>

                            <div className="h-5 w-12 rounded-full bg-white/[0.04]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating activity indicator */}
                  <div className="absolute bottom-7 right-7 hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0d1016]/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-md sm:flex">
                    <div className="relative">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
                    </div>

                    <div>
                      <div className="h-1.5 w-20 rounded-full bg-white/[0.1]" />
                      <div className="mt-1.5 h-1.5 w-12 rounded-full bg-white/[0.05]" />
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Bottom glow */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/[0.06] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Blogging, but built for collaboration.
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              From your first draft to your final publication, everything stays
              organized inside a workspace designed for teams.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="bg-[#08090c] p-7 transition hover:bg-white/[0.025]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                    <Icon size={19} className="text-zinc-300" />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-white/[0.06] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500">SIMPLE WORKFLOW</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              From idea to publication.
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Create a repository",
                text: "Start a private or public workspace for your writing.",
              },
              {
                number: "02",
                title: "Collaborate",
                text: "Invite people and work together with role-based access.",
              },
              {
                number: "03",
                title: "Publish",
                text: "Turn your finished work into a beautiful public blog.",
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <span className="text-sm font-mono text-zinc-600">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="border-t border-white/[0.06] py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Your ideas deserve a workspace.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-zinc-400">
            Stop treating collaboration like an afterthought. Build, organize,
            and publish together.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Create your workspace
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-600 sm:flex-row">
          <span>© 2026 NintrixBlog</span>

          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

