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
