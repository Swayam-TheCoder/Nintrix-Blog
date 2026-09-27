import { supabaseAdmin } from "../config/supabase.js";

export const getBlogVersions = async (
  repositoryId,
  blogId
) => {
  // Make sure blog belongs to repository
  const { data: blog, error: blogError } =
    await supabaseAdmin
      .from("blogs")
      .select("id")
      .eq("id", blogId)
      .eq("repository_id", repositoryId)
      .single();

  if (blogError || !blog) {
    throw new Error("Blog not found");
  }

  const { data, error } = await supabaseAdmin
    .from("blog_versions")
    .select(`
      id,
      blog_id,
      created_by,
      version_number,
      title,
      content,
      created_at,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("blog_id", blogId)
    .order("version_number", {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};