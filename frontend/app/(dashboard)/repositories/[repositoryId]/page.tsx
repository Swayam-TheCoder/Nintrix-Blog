"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRepositoryBlogs, type Blog } from "@/services/blog.service";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderGit2,
  Globe2,
  Lock,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { getRepository, type Repository } from "@/services/repository.service";

export default function RepositoryPage() {
  const params = useParams();

  const repositoryId = params.repositoryId as string;

  const [repository, setRepository] = useState<Repository | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const loadRepository = async () => {
      try {
        const repository = await getRepository(repositoryId);

        setRepository(repository);

        const blogs = await getRepositoryBlogs(repositoryId);
        setBlogs(blogs);
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message || "Failed to load repository.",
        );
      } finally {
        setLoading(false);
        setBlogsLoading(false);
      }
    };

    if (repositoryId) {
      loadRepository();
    }
  }, [repositoryId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
            <FolderGit2 size={22} />
          </div>

          <h1 className="mt-4 text-lg font-semibold">Repository not found</h1>

          <p className="mt-2 text-sm text-white/40">
            {error || "This repository doesn't exist."}
          </p>

          <Link
            href="/repositories"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <ArrowLeft size={16} />
            Back to repositories
          </Link>
        </div>
      </div>
    );
  }

  const isPublic = repository.visibility === "PUBLIC";

  return (
    <div className="min-h-screen">
      {/* Repository Header */}
      <header className="border-b border-white/10">
        <div className="px-8 py-6">
          <Link
            href="/repositories"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Repositories
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                <FolderGit2 size={26} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {repository.name}
                  </h1>

                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/40">
                    {isPublic ? (
                      <span className="flex items-center gap-1.5">
                        <Globe2 size={11} />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Lock size={11} />
                        Private
                      </span>
                    )}
                  </span>
                </div>

                <p className="mt-1 text-sm text-white/35">{repository.slug}</p>

                {repository.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                    {repository.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/repositories/${repository.id}/members`}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <Users size={16} />
                Members
              </Link>

              <Link
                href={`/repositories/${repository.id}/settings`}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <Settings size={16} />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-8">
          <button className="border-b-2 border-white px-1 pb-3 text-sm font-medium">
            Overview
          </button>

          <Link
            href={`/repositories/${repository.id}/members`}
            className="border-b-2 border-transparent px-1 pb-3 text-sm text-white/40 transition hover:text-white"
          >
            Members
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="space-y-8 p-8">
        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<FileText size={18} />}
            label="Blog posts"
            value={String(blogs.length)}
          />

          <StatCard
            icon={<Users size={18} />}
            label="Collaborators"
            value="1"
          />

          <StatCard
            icon={isPublic ? <Globe2 size={18} /> : <Lock size={18} />}
            label="Visibility"
            value={isPublic ? "Public" : "Private"}
          />
        </section>

        {/* Blogs */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Blog posts</h2>

              <p className="mt-1 text-sm text-white/35">
                Write and manage content in this repository.
              </p>
            </div>

            <Link
              href={`/repositories/${repository.id}/blogs/new`}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Plus size={17} />
              New Blog
            </Link>
          </div>

          {blogsLoading ? (
            <div className="rounded-2xl border border-white/10 p-12 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="mt-4 text-sm text-white/40">
                Loading blog posts...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <BookOpen size={21} className="text-white/30" />
              </div>

              <h3 className="mt-4 font-medium">No blog posts yet</h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                Start writing your first blog and build your repository's
                content.
              </p>

              <Link
                href={`/repositories/${repository.id}/blogs/new`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                <Plus size={16} />
                Create your first blog
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/repositories/${repository.id}/blogs/${blog.id}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium transition group-hover:text-white">
                        {blog.title}
                      </h3>

                      <p className="mt-1 text-sm text-white/35">/{blog.slug}</p>

                      {blog.excerpt && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
                        blog.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : blog.status === "ARCHIVED"
                            ? "bg-red-500/10 text-red-300"
                            : "bg-yellow-500/10 text-yellow-300"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-white/25">
                    Updated {new Date(blog.updated_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Repository information */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-medium">Repository information</h2>

          <div className="mt-5 grid gap-5 text-sm md:grid-cols-2">
            <InfoItem label="Repository ID" value={repository.id} />

            <InfoItem
              label="Created"
              value={new Date(repository.created_at).toLocaleDateString()}
            />

            <InfoItem
              label="Last updated"
              value={new Date(repository.updated_at).toLocaleDateString()}
            />

            <InfoItem label="Visibility" value={repository.visibility} />
          </div>
        </section>
      </main>
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
      <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/50">
        {icon}
      </div>

      <p className="text-sm text-white/35">{label}</p>

      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-white/25">{label}</p>

      <p className="mt-1 truncate text-sm text-white/60">{value}</p>
    </div>
  );
}
