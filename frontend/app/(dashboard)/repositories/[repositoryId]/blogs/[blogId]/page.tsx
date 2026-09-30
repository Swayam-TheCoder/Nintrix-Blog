"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive,
  Check,
  Eye,
  FileText,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import {
  getBlog,
  updateBlog,
  deleteBlog,
  changeBlogStatus,
  type Blog,
  archiveBlog,
} from "@/services/blog.service";

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();

  const repositoryId = params.repositoryId as string;
  const blogId = params.blogId as string;

  const [blog, setBlog] = useState<Blog | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBlog(repositoryId, blogId);

        setBlog(data);
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
      } catch (error: any) {
        console.error("Load blog error:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load blog."
        );
      } finally {
        setLoading(false);
      }
    };

    if (repositoryId && blogId) {
      loadBlog();
    }
  }, [repositoryId, blogId]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Blog slug is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedBlog = await updateBlog(
        repositoryId,
        blogId,
        {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim() || undefined,
          content,
        }
      );

      setBlog(updatedBlog);
      setSuccess("Changes saved successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error("Save blog error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!blog) return;

    setPublishing(true);
    setError("");
    setSuccess("");

    try {
      const nextStatus =
        blog.status === "PUBLISHED"
          ? "DRAFT"
          : "PUBLISHED";

      const updatedBlog = await changeBlogStatus(
        repositoryId,
        blogId,
        nextStatus
      );

      setBlog(updatedBlog);

      setSuccess(
        nextStatus === "PUBLISHED"
          ? "Blog published successfully."
          : "Blog moved back to draft."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      console.error("Change blog status error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change blog status."
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
  if (!blog) return;

  setPublishing(true);
  setError("");
  setSuccess("");

  try {
    const updatedBlog = await archiveBlog(
      repositoryId,
      blogId
    );

    setBlog(updatedBlog);
    setSuccess("Blog archived successfully.");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  } catch (error: any) {
    console.error("Archive blog error:", error);

    setError(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to archive blog."
    );
  } finally {
    setPublishing(false);
  }
};

  const handleDelete = async () => {
    if (!blog) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await deleteBlog(repositoryId, blogId);

      router.push(
        `/repositories/${repositoryId}`
      );
    } catch (error: any) {
      console.error("Delete blog error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete blog."
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-white/40"
        />
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
            <FileText size={22} />
          </div>

          <h1 className="mt-4 text-lg font-semibold">
            Blog not found
          </h1>

          <p className="mt-2 text-sm text-white/40">
            {error}
          </p>

          <Link
            href={`/repositories/${repositoryId}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <ArrowLeft size={16} />
            Back to repository
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="flex items-center justify-between px-8 py-5">
          <div>
            <Link
              href={`/repositories/${repositoryId}`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to repository
            </Link>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">
                Edit Blog
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] ${
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
          </div>

          <div className="flex items-center gap-2">
            {blog.status !== "ARCHIVED" && (
              <button
                onClick={handlePublishToggle}
                disabled={publishing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                {publishing ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : blog.status === "PUBLISHED" ? (
                  <Eye size={16} />
                ) : (
                  <Check size={16} />
                )}

                {blog.status === "PUBLISHED"
                  ? "Move to Draft"
                  : "Publish"}
              </button>
            )}

            {blog.status !== "ARCHIVED" && (
              <button
                onClick={handleArchive}
                disabled={publishing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <Archive size={16} />
                Archive
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={16} />
              )}

              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="mx-auto max-w-5xl px-8 py-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm text-white/50">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter blog title"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-2xl font-semibold outline-none transition placeholder:text-white/20 focus:border-white/25"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm text-white/50">
              Slug
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.02]">
              <span className="px-4 text-sm text-white/25">
                /
              </span>

              <input
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                  )
                }
                className="flex-1 bg-transparent py-3 pr-4 text-sm outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-2 block text-sm text-white/50">
              Excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(e) =>
                setExcerpt(e.target.value)
              }
              rows={3}
              placeholder="Short description of your blog..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-white/20 focus:border-white/25"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-2 block text-sm text-white/50">
              Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows={24}
              placeholder="Start writing your blog..."
              className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 text-sm leading-7 outline-none transition placeholder:text-white/20 focus:border-white/25"
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className="text-xs text-white/25">
              Last updated{" "}
              {new Date(
                blog.updated_at
              ).toLocaleString()}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || blog.status === "ARCHIVED"}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save size={16} />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}