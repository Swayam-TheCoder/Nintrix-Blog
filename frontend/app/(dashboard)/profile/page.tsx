"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  FileText,
  FolderGit2,
  UserRound,
  Users,
} from "lucide-react";

import { getFollowStats } from "@/services/follow.service";

import { getProfile, type Profile } from "@/services/profile.service";

import {
  getMyRepositories,
  type Repository,
} from "@/services/repository.service";
import { getRepositoryBlogs } from "@/services/blog.service";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [totalRepositories, setTotalRepositories] = useState(0);
  const [blogPosts, setBlogPosts] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
  });

  const REPOSITORIES_PER_PAGE = 3;
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();

        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const result = await getMyRepositories(page, REPOSITORIES_PER_PAGE);

        setRepositories(result.repositories);
        setTotalRepositories(result.total);
        setTotalPages(result.totalPages);

        // Get total blog posts
        const blogResults = await Promise.all(
          result.repositories.map((repository) =>
            getRepositoryBlogs(repository.id),
          ),
        );

        const currentPageBlogCount = blogResults.reduce(
          (total, blogs) => total + blogs.length,
          0,
        );

        setBlogPosts(currentPageBlogCount);
      } catch (error) {
        console.error("Failed to load repositories:", error);
      }
    };

    loadRepositories();
  }, [page]);

  useEffect(() => {
    if (!profile) return;

    const loadFollowStats = async () => {
      try {
        const stats = await getFollowStats(profile.id);
        setFollowStats(stats);
      } catch (error) {
        console.error("Failed to load follow stats:", error);
      }
    };

    loadFollowStats();
  }, [profile]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-white/40">Unable to load profile.</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-white/40">Profile</p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Your profile
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Link
              href="/profile/edit"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              <Edit3 size={16} />
              Edit Profile
            </Link>

            <Link
              href={`/users/${profile.username}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              <UserRound size={16} />
              View Public Profile
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <div className="space-y-7 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-7 lg:p-8">
        {/* Profile Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5 p-5 sm:rounded-3xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-24 sm:w-24 sm:rounded-3xl">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={34}
                  className="text-white/30 sm:h-[38px] sm:w-[38px]"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                {profile.display_name || profile.username}
              </h2>

              <p className="mt-1 break-all text-sm text-violet-300">
                @{profile.username}
              </p>

              {profile.bio && (
                <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-white/50 sm:mt-4">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social Stats */}
          <div className="relative mt-6 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6">
            <div className="flex flex-wrap gap-8 sm:gap-10">
              <Link
                href={`/users/${profile.username}/connections?type=followers`}
                className="transition hover:text-violet-400"
              >
                <ProfileStat label="Followers" value={followStats.followers} />
              </Link>

              <Link
                href={`/users/${profile.username}/connections?type=following`}
                className="transition hover:text-violet-400"
              >
                <ProfileStat label="Following" value={followStats.following} />
              </Link>
            </div>
          </div>
        </section>

        {/* Workspace Stats */}
        <section>
          <div className="mb-4">
            <h2 className="font-semibold">Workspace overview</h2>

            <p className="mt-1 text-sm text-white/40">
              Your blogging activity at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            <StatCard
              icon={<FolderGit2 size={18} />}
              label="Repositories"
              value={String(totalRepositories)}
            />

            <StatCard
              icon={<FileText size={18} />}
              label="Blog posts in displayed repositories"
              value={String(blogPosts)}
            />

            <StatCard
              icon={<UserRound size={18} />}
              label="Collaborators"
              value="0"
            />
          </div>
        </section>

        {/* Repositories */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Your repositories</h2>

              <p className="mt-1 text-sm text-white/40">
                Your blogging workspaces
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

          {repositories.length === 0 ? (
            <EmptyRepositories />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {repositories.map((repository) => (
                  <RepositoryCard key={repository.id} repository={repository} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-white/40">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-white/40">{label}</p>
    </div>
  );
}

function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Link
      href={`/repositories/${repository.id}`}
      className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <FolderGit2 size={19} />
        </div>

        <span className="max-w-[50%] truncate rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/40">
          {repository.visibility}
        </span>
      </div>

      <h3 className="mt-4 break-words font-medium transition group-hover:text-violet-300 sm:mt-5">
        {repository.name}
      </h3>

      <p className="mt-1 break-all text-xs text-white/35">
        {repository.slug}
      </p>

      {repository.description && (
        <p className="mt-3 line-clamp-2 break-words text-sm leading-5 text-white/40">
          {repository.description}
        </p>
      )}
    </Link>
  );
}

function EmptyRepositories() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center sm:p-12">
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
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04] sm:p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
        {icon}
      </div>

      <p className="break-words text-sm text-white/40">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}
