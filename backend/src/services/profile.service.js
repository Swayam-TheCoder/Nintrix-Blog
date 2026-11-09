import { supabaseAdmin } from "../config/supabase.js";

export const getProfileByUserId = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const searchProfiles = async (query, currentUserId) => {
  const searchTerm = query.replace(/[\\%_]/g, "\\$&");
  const pattern = `%${searchTerm}%`;

  const [usernameResult, displayNameResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .ilike("username", pattern)
      .neq("id", currentUserId)
      .limit(20),

    supabaseAdmin
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .ilike("display_name", pattern)
      .neq("id", currentUserId)
      .limit(20),
  ]);

  if (usernameResult.error) {
    throw new Error(usernameResult.error.message);
  }

  if (displayNameResult.error) {
    throw new Error(displayNameResult.error.message);
  }

  // Merge both results and remove duplicate profiles
  const profiles = new Map();

  for (const profile of [
    ...(usernameResult.data || []),
    ...(displayNameResult.data || []),
  ]) {
    profiles.set(profile.id, profile);
  }

  const results = Array.from(profiles.values()).slice(0, 20);

  if (results.length === 0) {
    return [];
  }

  const profileIds = results.map((profile) => profile.id);

  const { data: follows, error: followsError } = await supabaseAdmin
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUserId)
    .in("following_id", profileIds);

  if (followsError) {
    throw new Error(followsError.message);
  }

  const followingIds = new Set(
    (follows || []).map((follow) => follow.following_id),
  );

  return results.map((profile) => ({
    ...profile,
    is_following: followingIds.has(profile.id),
  }));
};



export const getPublicProfileByUsername = async (username) => {
  // 1. Find the profile
  const { data: profile, error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio, created_at")
      .ilike("username", username)
      .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    throw new Error("User not found");
  }

  const userId = profile.id;

  // 2. Fetch follower and following counts
  const [followersResult, followingResult] = await Promise.all([
    supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId),

    supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId)
  ]);

  if (followersResult.error) {
    throw new Error(followersResult.error.message);
  }

  if (followingResult.error) {
    throw new Error(followingResult.error.message);
  }

  // 3. Fetch public repositories owned by this user
  const { data: repositories, error: repositoryError } =
    await supabaseAdmin
      .from("repositories")
      .select("id, name, slug, description, created_at")
      .eq("owner_id", userId)
      .eq("visibility", "PUBLIC")
      .order("created_at", { ascending: false });

  if (repositoryError) {
    throw new Error(repositoryError.message);
  }

  // 4. Fetch published blogs authored by this user
  // Only include blogs inside public repositories
  const { data: blogs, error: blogError } =
    await supabaseAdmin
      .from("blogs")
      .select(`
        id,
        repository_id,
        title,
        slug,
        excerpt,
        published_at,
        repositories!inner (
          id,
          name,
          slug,
          visibility
        )
      `)
      .eq("author_id", userId)
      .eq("status", "PUBLISHED")
      .eq("repositories.visibility", "PUBLIC")
      .order("published_at", { ascending: false });

  if (blogError) {
    throw new Error(blogError.message);
  }

  return {
    profile,
    stats: {
      followers: followersResult.count || 0,
      following: followingResult.count || 0
    },
    repositories: repositories || [],
    blogs: blogs || []
  };
};
