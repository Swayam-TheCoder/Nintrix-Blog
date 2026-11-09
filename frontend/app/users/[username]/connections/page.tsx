
"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, UserRound } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { getPublicProfile } from "@/services/profile.service";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  type FollowProfile,
} from "@/services/follow.service";

export default function ConnectionsPage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const type =
    searchParams.get("type") === "following" ? "following" : "followers";

  const [users, setUsers] = useState<FollowProfile[]>([]);
  const [myFollowing, setMyFollowing] = useState<Set<string>>(new Set());
  const [followStatusLoaded, setFollowStatusLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    let active = true;

    const loadConnections = async () => {
      try {
        setLoading(true);
        setError("");
        setUsers([]);
        setMyFollowing(new Set());
        setFollowStatusLoaded(false);

        const profileData = await getPublicProfile(username);
        const profileId = profileData.profile.id;

        const result =
          type === "followers"
            ? await getFollowers(profileId)
            : await getFollowing(profileId);

        if (!active) return;

        setUsers(result);

        if (user) {
          try {
            const following = await getFollowing(user.id);
            if (!active) return;
            setMyFollowing(new Set(following.map((person) => person.id)));
          } catch {
            if (active) setError("Unable to load follow status.");
            return;
          }
        }

        setFollowStatusLoaded(true);
      } catch {
        if (active) {
          setError("Unable to load connections.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadConnections();

    return () => {
      active = false;
    };
  }, [username, type, user, authLoading]);

  const handleFollow = async (userId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!followStatusLoaded || busyId) return;

    try {
      setBusyId(userId);
      setError("");

      if (myFollowing.has(userId)) {
        await unfollowUser(userId);

        setMyFollowing((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      } else {
        await followUser(userId);
        setMyFollowing((prev) => new Set(prev).add(userId));
      }
    } catch {
      setError("Unable to update follow status.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090c] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/users/${username}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <div className="mb-7">
          <h1 className="text-2xl font-semibold">
            {type === "followers" ? "Followers" : "Following"}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {type === "followers"
              ? "People following this user"
              : "People followed by this user"}
          </p>
        </div>

        {error && (
          <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-white/40">Loading connections...</p>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center">
            <Users size={30} className="mx-auto text-white/30" />
            <p className="mt-4 text-white/50">No users found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <Link
                  href={`/users/${person.username}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  {person.avatar_url ? (
                    <img
                      src={person.avatar_url}
                      alt={person.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                      <UserRound size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {person.display_name || person.username}
                    </p>
                    <p className="text-sm text-violet-300">
                      @{person.username}
                    </p>
                    {person.bio && (
                      <p className="mt-1 truncate text-xs text-white/40">
                        {person.bio}
                      </p>
                    )}
                  </div>
                </Link>

                {person.id !== user?.id && (
                  <button
                    disabled={!followStatusLoaded || busyId !== null}
                    onClick={() => handleFollow(person.id)}
                    className="shrink-0 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                  >
                    {busyId === person.id
                      ? "Please wait..."
                      : myFollowing.has(person.id)
                        ? "Following"
                        : "Follow"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
