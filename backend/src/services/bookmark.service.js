
import { supabaseAdmin } from "../config/supabase.js";

// Check whether a user can interact with a blog
const canInteractWithBlog = async (blogId, userId) => {
  const { data: blog, error: blogError } = await supabaseAdmin
    .from("blogs")
    .select("id, repository_id, status")
    .eq("id", blogId)
    .maybeSingle();

  if (blogError) {
    throw new Error(blogError.message);
  }

  if (!blog) {
    throw new Error("Blog not found");
  }

  const { data: repository, error: repositoryError } =
    await supabaseAdmin
      .from("repositories")
      .select("id, owner_id, visibility")
      .eq("id", blog.repository_id)
      .maybeSingle();

  if (repositoryError) {
    throw new Error(repositoryError.message);
  }

  if (!repository) {
    throw new Error("Repository not found");
  }

  // Anyone logged in can interact with public published blogs
  if (
    repository.visibility === "PUBLIC" &&
    blog.status === "PUBLISHED"
  ) {
    return blog;
  }

  // Private, draft or archived blogs require repository membership
  if (repository.owner_id === userId) {
    return blog;
  }

  const { data: member, error: memberError } =
    await supabaseAdmin
      .from("repository_members")
      .select("role")
      .eq("repository_id", blog.repository_id)
      .eq("user_id", userId)
      .maybeSingle();

  if (memberError) {
    throw new Error(memberError.message);
  }

  if (!member) {
    throw new Error("You do not have permission to interact with this blog");
  }

  return blog;
};

// Add bookmark
export const addBookmark = async (blogId, userId) => {
  await canInteractWithBlog(blogId, userId);

  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .upsert(
      {
        blog_id: blogId,
        user_id: userId
      },
      {
        onConflict: "user_id,blog_id"
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Remove bookmark
export const removeBookmark = async (blogId, userId) => {
  await canInteractWithBlog(blogId, userId);

  const { error } = await supabaseAdmin
    .from("bookmarks")
    .delete()
    .eq("blog_id", blogId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Bookmark removed successfully" };
};

// Get all bookmarks of a user
export const getUserBookmarks = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select(`
      id,
      created_at,
      blog:blogs (
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
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Do not expose blogs the user can no longer access
  const accessibleBookmarks = await Promise.all(
    (data || []).map(async (bookmark) => {
      try {
        await canInteractWithBlog(bookmark.blog.id, userId);
        return bookmark;
      } catch {
        return null;
      }
    })
  );

  return accessibleBookmarks.filter(Boolean);
};

// Check whether a blog is bookmarked
export const checkBookmark = async (blogId, userId) => {
  await canInteractWithBlog(blogId, userId);

  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .select("id")
    .eq("blog_id", blogId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
};
