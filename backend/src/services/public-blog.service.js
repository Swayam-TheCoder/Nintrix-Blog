import { supabaseAdmin } from "../config/supabase.js";

export const getPublishedBlogsByRepository = async (repositoryId) => {
  // Repository must be public
  const { data: repository, error: repositoryError } =
    await supabaseAdmin
      .from("repositories")
      .select("id, name, slug, description, visibility")
      .eq("id", repositoryId)
      .eq("visibility", "PUBLIC")
      .single();

  if (repositoryError || !repository) {
    throw new Error("Repository not found");
  }

  const { data: blogs, error: blogError } = await supabaseAdmin
    .from("blogs")
    .select(`
      id,
      repository_id,
      author_id,
      title,
      slug,
      excerpt,
      status,
      published_at,
      created_at,
      updated_at
    `)
    .eq("repository_id", repositoryId)
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false });

  if (blogError) {
    throw new Error(blogError.message);
  }

  return {
    repository,
    blogs
  };
};


export const getPublishedBlogService = async (repositoryId, blogId) => {
  // Repository must be public
  const { data: repository, error: repositoryError } =
    await supabaseAdmin
      .from("repositories")
      .select("id, name, slug, description, visibility")
      .eq("id", repositoryId)
      .eq("visibility", "PUBLIC")
      .single();

  if (repositoryError || !repository) {
    throw new Error("Blog not found");
  }

  const { data: blog, error: blogError } = await supabaseAdmin
    .from("blogs")
    .select(`
      id,
      repository_id,
      author_id,
      title,
      slug,
      content,
      excerpt,
      status,
      published_at,
      created_at,
      updated_at
    `)
    .eq("id", blogId)
    .eq("repository_id", repositoryId)
    .eq("status", "PUBLISHED")
    .single();

  if (blogError || !blog) {
    throw new Error("Blog not found");
  }

  return {
    repository,
    blog
  };
};