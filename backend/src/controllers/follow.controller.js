import {
  followUser,
  unfollowUser,
  getFollowStats
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