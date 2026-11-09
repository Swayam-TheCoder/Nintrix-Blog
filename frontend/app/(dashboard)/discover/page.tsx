"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Compass,
  UserRound,
  Users,
  Check,
  UserPlus,
} from "lucide-react";

import {
  searchProfiles,
  type DiscoverProfile,
} from "@/services/profile.service";

import { followUser, unfollowUser } from "@/services/follow.service";
import Link from "next/link";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [busyIds, setBusyIds] = useState<string[]>([]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setProfiles([]);
      setSearched(false);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchProfiles(trimmedQuery);

        if (!cancelled) {
          setProfiles(results);
          setSearched(true);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to search users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleFollow = async (profile: DiscoverProfile) => {
    if (busyIds.includes(profile.id)) return;

    setBusyIds((current) => [...current, profile.id]);
    setError("");

    try {
      if (profile.is_following) {
        await unfollowUser(profile.id);
      } else {
        await followUser(profile.id);
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id
            ? { ...item, is_following: !item.is_following }
            : item,
        ),
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to update follow status.",
      );
    } finally {
      setBusyIds((current) => current.filter((id) => id !== profile.id));
    }
  };

  return (
    <main className="min-h-screen p-5 sm:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-violet-300">
          <Compass size={16} />
          Community
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Discover people
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Find developers, explore profiles and follow people you like.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-8 max-w-2xl">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by username or display name..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50 focus:bg-white/[0.05]"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Search state */}
      {query.trim().length < 2 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <Users size={25} />
          </div>

          <h2 className="mt-5 font-medium">Find your community</h2>

          <p className="mt-2 text-sm text-white/40">
            Enter at least 2 characters to search for people.
          </p>
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-sm text-white/40">
          Searching people...
        </div>
      ) : searched && profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
          <Search size={28} className="mx-auto text-white/30" />

          <h2 className="mt-4 font-medium">No people found</h2>

          <p className="mt-2 text-sm text-white/40">
            Try another username or display name.
          </p>
        </div>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/70">
              Search results
            </h2>

            <span className="text-xs text-white/35">
              {profiles.length} people
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile) => {
              const busy = busyIds.includes(profile.id);

              return (
                <article
                  key={profile.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-violet-500/10 text-violet-300">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={22} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium">
                        <Link
                        href={`/users/${encodeURIComponent(profile.username)}`}
                      >{profile.display_name || profile.username}</Link>
                      </h3>

                      <Link
                        href={`/users/${encodeURIComponent(profile.username)}`}
                        className="truncate text-xs text-violet-300 hover:text-violet-200"
                      >
                        @{profile.username}
                      </Link>
                    </div>
                  </div>

                  <p className="mt-4 min-h-10 line-clamp-2 text-sm leading-5 text-white/45">
                    {profile.bio || "No bio added yet."}
                  </p>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleFollow(profile)}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      profile.is_following
                        ? "border border-white/10 bg-white/5 text-white/70 hover:bg-red-500/10 hover:text-red-300"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {profile.is_following ? (
                      <>
                        <Check size={16} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Follow
                      </>
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
