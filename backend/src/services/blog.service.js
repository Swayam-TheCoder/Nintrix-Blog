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

  // Create initial version (v1)
  const { error: versionError } = await supabaseAdmin
    .from("blog_versions")
    .insert({
      blog_id: data.id,
      created_by: authorId,
      version_number: 1,
      title,
      content
    });

  if (versionError) {
    // Rollback blog if version creation fails
    await supabaseAdmin
      .from("blogs")
      .delete()
      .eq("id", data.id);

    throw new Error(versionError.message);
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
  userId,
  updates
}) => {
  // Get current blog
  const { data: currentBlog, error: blogError } =
    await supabaseAdmin
      .from("blogs")
      .select("*")
      .eq("id", blogId)
      .eq("repository_id", repositoryId)
      .single();

  if (blogError || !currentBlog) {
    throw new Error("Blog not found");
  }

  // Get latest version number
  const { data: latestVersion, error: versionError } =
    await supabaseAdmin
      .from("blog_versions")
      .select("version_number")
      .eq("blog_id", blogId)
      .order("version_number", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  if (versionError) {
    throw new Error(versionError.message);
  }

  const nextVersion =
    latestVersion?.version_number
      ? latestVersion.version_number + 1
      : 1;

  const newTitle =
    updates.title ?? currentBlog.title;

  const newContent =
    updates.content ?? currentBlog.content;

  // Create version snapshot
  const { error: createVersionError } =
    await supabaseAdmin
      .from("blog_versions")
      .insert({
        blog_id: blogId,
        created_by: userId,
        version_number: nextVersion,
        title: newTitle,
        content: newContent
      });

  if (createVersionError) {
    throw new Error(createVersionError.message);
  }

  // Update current blog
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