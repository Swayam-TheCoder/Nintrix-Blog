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
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#08090c]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <BookOpen size={18} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              BlogForge
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
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d0f13] shadow-2xl shadow-black/40">
              {/* Browser bar */}
              <div className="flex h-11 items-center gap-2 border-b border-white/[0.06] px-4">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />

                <div className="ml-4 h-6 flex-1 rounded-md bg-white/[0.04]" />
              </div>

              {/* Fake dashboard */}
              <div className="grid min-h-[320px] grid-cols-[180px_1fr] text-left">
                <aside className="border-r border-white/[0.06] p-5">
                  <div className="mb-8 h-5 w-24 rounded bg-white/[0.08]" />

                  <div className="space-y-3">
                    <div className="h-8 rounded-lg bg-white/[0.07]" />
                    <div className="h-8 rounded-lg bg-white/[0.03]" />
                    <div className="h-8 rounded-lg bg-white/[0.03]" />
                    <div className="h-8 rounded-lg bg-white/[0.03]" />
                  </div>
                </aside>

                <div className="p-7">
                  <div className="h-7 w-48 rounded bg-white/[0.09]" />
                  <div className="mt-3 h-4 w-72 rounded bg-white/[0.04]" />

                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                      >
                        <div className="h-4 w-24 rounded bg-white/[0.08]" />
                        <div className="mt-4 h-3 w-full rounded bg-white/[0.04]" />
                        <div className="mt-2 h-3 w-3/4 rounded bg-white/[0.04]" />
                        <div className="mt-6 h-3 w-16 rounded bg-white/[0.06]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/[0.06] py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Blogging, but built for collaboration.
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              From your first draft to your final publication, everything
              stays organized inside a workspace designed for teams.
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

                  <h3 className="mt-5 font-semibold">
                    {feature.title}
                  </h3>

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
      <section
        id="how-it-works"
        className="border-t border-white/[0.06] py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500">
              SIMPLE WORKFLOW
            </p>

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

                <h3 className="mt-4 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="border-t border-white/[0.06] py-28"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Your ideas deserve a workspace.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-zinc-400">
            Stop treating collaboration like an afterthought. Build,
            organize, and publish together.
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
          <span>© 2026 BlogForge</span>

          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}