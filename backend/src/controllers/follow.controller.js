import {
  followUser,
  unfollowUser,
  getFollowStats,
  getFollowers,
  getFollowing
} from "../services/follow.service.js";

export const followAuthor = async (req, res) => {
  try {
    const result = await followUser(
      req.user.id,
      req.params.userId
    );

    return res.status(201).json({
      success: true,
      message: "User followed successfully",
      follow: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const unfollowAuthor = async (req, res) => {
  try {
    await unfollowUser(
      req.user.id,
      req.params.userId
    );

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getAuthorFollowStats = async (req, res) => {
  try {
    const stats = await getFollowStats(req.params.userId);

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get followers
export const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await getFollowers(userId);

    return res.status(200).json({
      success: true,
      count: followers.length,
      followers
    });
  } catch (error) {
    console.error("Get followers error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get following
export const getUserFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await getFollowing(userId);

    return res.status(200).json({
      success: true,
      count: following.length,
      following
    });
  } catch (error) {
    console.error("Get following error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};