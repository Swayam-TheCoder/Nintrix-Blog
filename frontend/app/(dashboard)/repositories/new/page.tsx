"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderGit2, Globe2, Lock, Sparkles } from "lucide-react";

import { createRepository } from "@/services/repository.service";

export default function NewRepositoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);

    // Automatically generate slug only while
    // the user hasn't manually changed it.
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Repository slug is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await createRepository({
        name,
        slug,
        description,
        visibility,
      });

      const repository = response.repository;

      if (!repository?.id) {
        console.error("Unexpected response:", response);
        throw new Error("Repository ID missing from API response.");
      }

      router.push(`/repositories/${repository.id}`);
    } catch (error: any) {
      console.error("Create repository error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create repository.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5">
        <Link
          href="/repositories"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to repositories
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-8 py-12">
        {/* Heading */}
        <div className="mb-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <FolderGit2 size={23} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Create a repository
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
            A repository is your workspace for organizing blogs, collaborators
            and future versions of your content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic information */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-6">
              <h2 className="font-medium">Repository details</h2>

              <p className="mt-1 text-xs text-white/35">
                Give your workspace an identity.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm text-white/70">Name</label>

                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="My Tech Blog"
                  maxLength={100}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                />

                <p className="mt-2 text-xs text-white/25">{name.length}/100</p>
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm text-white/70">Slug</label>

                <div className="flex items-center rounded-xl border border-white/10 bg-black/20 focus-within:border-white/25">
                  <span className="pl-4 text-sm text-white/25">
                    nintrixblog/
                  </span>

                  <input
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="my-tech-blog"
                    maxLength={100}
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <p className="mt-2 text-xs text-white/25">
                  Lowercase letters, numbers and hyphens only.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Description
                  <span className="ml-2 text-white/25">Optional</span>
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A place where I publish my thoughts about technology..."
                  rows={4}
                  maxLength={1000}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
                />

                <p className="mt-2 text-right text-xs text-white/25">
                  {description.length}/1000
                </p>
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-6">
              <h2 className="font-medium">Visibility</h2>

              <p className="mt-1 text-xs text-white/35">
                Choose who can access this repository.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <VisibilityOption
                selected={visibility === "PRIVATE"}
                icon={<Lock size={19} />}
                title="Private"
                description="Only you and invited collaborators can access it."
                onClick={() => setVisibility("PRIVATE")}
              />

              <VisibilityOption
                selected={visibility === "PUBLIC"}
                icon={<Globe2 size={19} />}
                title="Public"
                description="Anyone can view published blogs in this repository."
                onClick={() => setVisibility("PUBLIC")}
              />
            </div>
          </section>

          {/* Info */}
          <div className="flex gap-3 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-4">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-violet-300" />

            <p className="text-xs leading-5 text-white/40">
              You can change repository visibility later. Public repositories
              only expose published blogs through the public reading experience.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/repositories"
              className="rounded-xl px-5 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VisibilityOption({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-violet-400/40 bg-violet-500/10"
          : "border-white/10 bg-black/10 hover:border-white/20"
      }`}
    >
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${
          selected
            ? "bg-violet-500/15 text-violet-300"
            : "bg-white/5 text-white/40"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-medium">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-white/35">{description}</p>
    </button>
  );
}
