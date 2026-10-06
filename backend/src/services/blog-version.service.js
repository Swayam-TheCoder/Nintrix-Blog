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

export const restoreBlogVersion = async (
  repositoryId,
  blogId,
  versionId,
  userId
) => {
  // 1. Make sure blog belongs to repository
  const { data: blog, error: blogError } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("id", blogId)
    .eq("repository_id", repositoryId)
    .single();

  if (blogError || !blog) {
    throw new Error("Blog not found");
  }

  // 2. Get the version
  const { data: version, error: versionError } =
    await supabaseAdmin
      .from("blog_versions")
      .select("*")
      .eq("id", versionId)
      .eq("blog_id", blogId)
      .single();

  if (versionError || !version) {
    throw new Error("Version not found");
  }

  // 3. Get latest version number
  const { data: latestVersion, error: latestError } =
    await supabaseAdmin
      .from("blog_versions")
      .select("version_number")
      .eq("blog_id", blogId)
      .order("version_number", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (latestError) {
    throw new Error(latestError.message);
  }

  const nextVersionNumber =
    (latestVersion?.version_number || 0) + 1;

  // 4. Update current blog
  const { data: updatedBlog, error: updateError } =
    await supabaseAdmin
      .from("blogs")
      .update({
        title: version.title,
        content: version.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogId)
      .eq("repository_id", repositoryId)
      .select()
      .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 5. Create a NEW version
  const { data: newVersion, error: versionCreateError } =
    await supabaseAdmin
      .from("blog_versions")
      .insert({
        blog_id: blogId,
        created_by: userId,
        version_number: nextVersionNumber,
        title: version.title,
        content: version.content,
      })
      .select()
      .single();

  if (versionCreateError) {
    throw new Error(versionCreateError.message);
  }

  return {
    blog: updatedBlog,
    version: newVersion,
  };
};