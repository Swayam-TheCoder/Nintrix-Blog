import { supabaseAdmin } from "../config/supabase.js";

export const createBlog = async ({
  repositoryId,
  authorId,
  title,
  slug,
  content,
  excerpt
}) => {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .insert({
      repository_id: repositoryId,
      author_id: authorId,
      title,
      slug,
      content,
      excerpt,
      status: "DRAFT"
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A blog with this slug already exists in this repository"
      );
    }

    throw new Error(error.message);
  }

  return data;
};

export const getBlogsByRepository = async (
  repositoryId
) => {
  const { data, error } = await supabaseAdmin
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
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getBlogById = async (
  repositoryId,
  blogId
) => {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", blogId)
    .eq("repository_id", repositoryId)
    .single();

  if (error || !data) {
    throw new Error("Blog not found");
  }

  return data;
};

export const updateBlog = async ({
  repositoryId,
  blogId,
  updates
}) => {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", blogId)
    .eq("repository_id", repositoryId)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A blog with this slug already exists in this repository"
      );
    }

    throw new Error(error.message);
  }

  return data;
};

export const deleteBlog = async ({
  repositoryId,
  blogId
}) => {
  const { error } = await supabaseAdmin
    .from("blogs")
    .delete()
    .eq("id", blogId)
    .eq("repository_id", repositoryId);

  if (error) {
    throw new Error(error.message);
  }
};