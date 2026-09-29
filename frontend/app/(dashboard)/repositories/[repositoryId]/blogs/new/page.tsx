"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, FileText, Save } from "lucide-react";

import { createBlog } from "@/services/blog.service";

export default function NewBlogPage() {
  const params = useParams();
  const router = useRouter();

  const repositoryId = params.repositoryId as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Blog slug is required.");
      return;
    }

    if (!content.trim()) {
      setError("Blog content is required.");
      return;
    }

    setLoading(true);

    try {
      const blog = await createBlog(repositoryId, {
        title,
        slug,
        excerpt,
        content,
      });

      router.push(`/repositories/${repositoryId}/blogs/${blog.id}`);
    } catch (error: any) {
      console.error("Create blog error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create blog.",
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
          href={`/repositories/${repositoryId}`}
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to repository
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-8 py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <FileText size={21} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Write a new blog
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Start with a draft. You can publish it whenever you're ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <label className="mb-2 block text-sm text-white/70">Title</label>

            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How I Built My First SaaS"
              maxLength={200}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-lg text-white outline-none placeholder:text-white/20 focus:border-white/25"
            />

            <div className="mt-4">
              <label className="mb-2 block text-xs text-white/40">Slug</label>

              <input
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="how-i-built-my-first-saas"
                maxLength={200}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
              />
            </div>
          </section>

          {/* Excerpt */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <label className="mb-2 block text-sm text-white/70">
              Excerpt
              <span className="ml-2 text-xs text-white/25">Optional</span>
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short introduction that will appear in blog listings..."
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/25"
            />

            <p className="mt-2 text-right text-xs text-white/25">
              {excerpt.length}/500
            </p>
          </section>

          {/* Content */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-6 py-4">
              <label className="text-sm text-white/70">Content</label>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story..."
              className="min-h-[500px] w-full resize-y bg-transparent px-6 py-5 text-[15px] leading-7 text-white outline-none placeholder:text-white/20"
            />

            <div className="border-t border-white/10 px-6 py-3 text-xs text-white/25">
              {content.length} characters
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href={`/repositories/${repositoryId}`}
              className="rounded-xl px-4 py-2.5 text-sm text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />

              {loading ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
