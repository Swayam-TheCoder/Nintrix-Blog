"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  FileText,
  FolderGit2,
  Globe,
  UserPlus,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  getPublicProfile,
  searchProfiles,
  type PublicProfile,
} from "@/services/profile.service";

import { followUser, unfollowUser } from "@/services/follow.service";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<PublicProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwnProfile = !!user && data?.profile.id === user.id;

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPublicProfile(username);
      setData(result);

      // Authenticated users can see their follow relationship
      if (user && user.id !== result.profile.id) {
        const searchResults = await searchProfiles(result.profile.username);

        const matchingProfile = searchResults.find(
          (profile) => profile.id === result.profile.id,
        );

        setIsFollowing(matchingProfile?.is_following ?? false);
      } else {
        setIsFollowing(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to load this profile.");
    } finally {
      setLoading(false);
    }
  }, [username, user]);

  useEffect(() => {
    if (!authLoading && username) {
      loadProfile();
    }
  }, [authLoading, username, loadProfile]);

  const handleFollow = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!data || followLoading) return;

    try {
      setFollowLoading(true);
      setError("");

      if (isFollowing) {
        await unfollowUser(data.profile.id);

        setIsFollowing(false);
        setData((current) =>
          current
            ? {
                ...current,
                stats: {
                  ...current.stats,
                  followers: Math.max(0, current.stats.followers - 1),
                },
              }
            : current,
        );
      } else {
        await followUser(data.profile.id);

        setIsFollowing(true);
        setData((current) =>
          current
            ? {
                ...current,
                stats: {
                  ...current.stats,
                  followers: current.stats.followers + 1,
                },
              }
            : current,
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to update follow status.",
      );
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090c] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#08090c] px-6 text-white">
        <UserRound size={40} className="text-white/30" />
        <h1 className="mt-5 text-xl font-semibold">Profile not found</h1>
        <p className="mt-2 text-sm text-white/40">
          {error || "This user does not exist."}
        </p>
        <Link
          href="/discover"
          className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black"
        >
          Discover people
        </Link>
      </main>
    );
  }

  const { profile, stats, repositories, blogs } = data;

  return (
    <main className="min-h-screen bg-[#08090c] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/discover"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Discover
        </Link>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Profile header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/5 p-6 sm:p-9">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={38} className="text-white/30" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                {profile.display_name || profile.username}
              </h1>

              <p className="mt-1 text-sm text-violet-300">
                @{profile.username}
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
                {profile.bio || "This user hasn't added a bio yet."}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/35">
                <CalendarDays size={14} />
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {!isOwnProfile && (
              <button
                type="button"
                disabled={followLoading}
                onClick={handleFollow}
                className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition disabled:opacity-50 ${
                  isFollowing
                    ? "border border-white/10 bg-white/5 text-white hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check size={17} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Follow
                  </>
                )}
              </button>
            )}

            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm hover:bg-white/10"
              >
                Edit profile
              </Link>
            )}
          </div>

          {/* Follow statistics */}
          <div className="relative mt-8 flex gap-8 border-t border-white/10 pt-6">
            <Link
              href={`/users/${profile.username}/connections?type=followers`}
              className="transition hover:text-violet-400"
            >
              <Stat label="Followers" value={stats.followers} />
            </Link>

            <Link
              href={`/users/${profile.username}/connections?type=following`}
              className="transition hover:text-violet-400"
            >
              <Stat label="Following" value={stats.following} />
            </Link>
          </div>
        </section>

        {/* Public repositories */}
        <section className="mt-10">
          <div className="mb-5 flex items-center gap-2">
            <FolderGit2 size={19} className="text-violet-300" />
            <h2 className="text-lg font-semibold">Public repositories</h2>
            <span className="text-sm text-white/30">{repositories.length}</span>
          </div>

          {repositories.length === 0 ? (
            <EmptyState message="No public repositories yet." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {repositories.map((repository) => (
                <Link
                  key={repository.id}
                  href={`/repositories/${repository.id}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <FolderGit2 size={20} className="text-violet-300" />
                    <Globe size={15} className="text-emerald-400" />
                  </div>

                  <h3 className="mt-4 font-medium">{repository.name}</h3>
                  <p className="mt-1 text-xs text-white/35">
                    {repository.slug}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-white/45">
                    {repository.description || "No description provided."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Published blogs */}
        <section className="mt-10 pb-12">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen size={19} className="text-violet-300" />
            <h2 className="text-lg font-semibold">Published blogs</h2>
            <span className="text-sm text-white/30">{blogs.length}</span>
          </div>

          {blogs.length === 0 ? (
            <EmptyState message="No published blogs yet." />
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex items-center gap-2 text-xs text-white/35">
                    <FileText size={14} />
                    {Array.isArray(blog.repositories)
                      ? blog.repositories[0]?.name
                      : blog.repositories?.name || "Public repository"}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold">{blog.title}</h3>

                  {blog.excerpt && (
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {blog.excerpt}
                    </p>
                  )}

                  {blog.published_at && (
                    <p className="mt-4 text-xs text-white/30">
                      Published{" "}
                      {new Date(blog.published_at).toLocaleDateString()}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/40">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
      <BookOpen size={25} className="mx-auto text-white/25" />
      <p className="mt-3 text-sm text-white/40">{message}</p>
    </div>
  );
}
