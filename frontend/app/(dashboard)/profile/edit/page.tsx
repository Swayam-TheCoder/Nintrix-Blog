"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

import {
  getProfile,
  updateProfile,
  type Profile,
} from "@/services/profile.service";

export default function EditProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [displayName, setDisplayName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [bio, setBio] = useState("");

  const [avatarUrl, setAvatarUrl] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data);
        setDisplayName(data.display_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      } catch (error) {
        console.error(error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateProfile({
        display_name: displayName,
        username,
        bio,
        avatar_url: avatarUrl || undefined,
      });

      window.location.href = "/profile";
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

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
        <p className="text-sm text-white/40">
          Unable to load profile.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 px-8 py-6">
        <Link
          href="/profile"
          className="mb-4 flex w-fit items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <h1 className="text-2xl font-semibold">
          Edit profile
        </h1>

        <p className="mt-1 text-sm text-white/40">
          Update your public profile information.
        </p>
      </header>

      <div className="max-w-2xl p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.02] p-7"
        >
          {/* Display Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Display name
            </label>

            <input
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/25"
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Username
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
              <span className="pl-4 text-white/30">
                @
              </span>

              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="username"
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              rows={5}
              maxLength={500}
              placeholder="Tell people a little about yourself..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/25"
            />

            <p className="mt-1 text-right text-xs text-white/25">
              {bio.length}/500
            </p>
          </div>

          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Avatar URL
            </label>

            <input
              value={avatarUrl}
              onChange={(e) =>
                setAvatarUrl(e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/25"
            />

            <p className="mt-2 text-xs text-white/30">
              We'll add proper image uploading later.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}