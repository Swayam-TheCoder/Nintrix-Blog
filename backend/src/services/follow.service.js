import { supabaseAdmin } from "../config/supabase.js";

// Follow an author
export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  // Check whether target profile exists
  const { data: profile, error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", followingId)
      .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) throw new Error("User not found");

  const { data, error } = await supabaseAdmin
    .from("follows")
    .insert({
      follower_id: followerId,
      following_id: followingId
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("You are already following this user");
    }

    throw new Error(error.message);
  }

  return data;
};

// Unfollow an author
export const unfollowUser = async (followerId, followingId) => {
  const { data, error } = await supabaseAdmin
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("You are not following this user");

  return data;
};

// Get follower and following counts
export const getFollowStats = async (userId) => {
  const { count: followers, error: followersError } =
    await supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);

  if (followersError) throw new Error(followersError.message);

  const { count: following, error: followingError } =
    await supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

  if (followingError) throw new Error(followingError.message);

  return {
    followers: followers || 0,
    following: following || 0
  };
};

// Get all followers of a user
export const getFollowers = async (userId) => {
  const { data: follows, error: followsError } = await supabaseAdmin
    .from("follows")
    .select("follower_id")
    .eq("following_id", userId);

  if (followsError) throw new Error(followsError.message);

  const userIds = (follows || []).map((follow) => follow.follower_id);

  if (userIds.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .in("id", userIds);

  if (profilesError) throw new Error(profilesError.message);

  return profiles || [];
};

// Get all users followed by a user
export const getFollowing = async (userId) => {
  const { data: follows, error: followsError } = await supabaseAdmin
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followsError) throw new Error(followsError.message);

  const userIds = (follows || []).map((follow) => follow.following_id);

  if (userIds.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .in("id", userIds);

  if (profilesError) throw new Error(profilesError.message);

  return profiles || [];
};