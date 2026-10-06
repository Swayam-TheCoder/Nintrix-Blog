"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRepositoryBlogs } from "@/services/blog.service";

import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderGit2,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  getMyRepositories,
  type Repository,
} from "@/services/repository.service";

export default function DashboardPage() {
  const { user } = useAuth();

  const [repositories, setRepositories] = useState<Repository[]>([]);

  const [loading, setLoading] = useState(true);

  const [blogCount, setBlogCount] = useState(0);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Creator";

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const result = await getMyRepositories();

        setRepositories(result.repositories || []);
      } catch (error) {
        console.error("Failed to load repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getMyRepositories();

        setRepositories(result.repositories);

        let totalBlogs = 0;

        for (const repository of repositories || []) {
          const blogs = await getRepositoryBlogs(repository.id);
          totalBlogs += blogs.length;
        }

        setBlogCount(totalBlogs);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm text-white/40">Workspace</p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {firstName}
            </h1>
          </div>

          <Link
            href="/repositories/new"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Plus size={17} />
            New Repository
          </Link>
        </div>
      </header>

      <div className="space-y-8 p-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5 p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <Sparkles size={20} />
            </div>

            <h2 className="text-3xl font-semibold tracking-tight">
              Your ideas deserve a workspace.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              Create repositories, write blogs, invite collaborators and build
              something worth publishing.
            </p>

            <Link
              href="/repositories/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Create a repository
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<FolderGit2 size={19} />}
            label="Repositories"
            value={repositories.length.toString()}
          />

          <StatCard
            icon={<FileText size={19} />}
            label="Blog posts"
            value={blogCount.toString()}
          />

          <StatCard
            icon={<Users size={19} />}
            label="Collaborators"
            value="0"
          />
        </section>

        {/* Repositories */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent repositories</h2>

              <p className="mt-1 text-sm text-white/40">
                Your latest workspaces
              </p>
            </div>

            <Link
              href="/repositories"
              className="flex items-center gap-1 text-sm text-white/50 transition hover:text-white"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 p-10 text-center text-sm text-white/40">
              Loading repositories...
            </div>
          ) : repositories.length === 0 ? (
            <EmptyRepositories />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {repositories.slice(0, 4).map((repository) => (
                <RepositoryCard key={repository.id} repository={repository} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Link
      href={`/repositories/${repository.id}`}
      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <FolderGit2 size={19} />
        </div>

        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/40">
          {repository.visibility}
        </span>
      </div>

      <h3 className="mt-5 font-medium group-hover:text-white">
        {repository.name}
      </h3>

      <p className="mt-1 text-xs text-white/35">{repository.slug}</p>

      {repository.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-5 text-white/40">
          {repository.description}
        </p>
      )}
    </Link>
  );
}

function EmptyRepositories() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
        <BookOpen size={21} className="text-white/40" />
      </div>

      <h3 className="mt-4 font-medium">No repositories yet</h3>

      <p className="mx-auto mt-2 max-w-sm text-sm text-white/40">
        Create your first repository and start writing.
      </p>

      <Link
        href="/repositories/new"
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
      >
        <Plus size={16} />
        Create repository
      </Link>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
        {icon}
      </div>

      <p className="text-sm text-white/40">{label}</p>

      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
