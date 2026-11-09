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