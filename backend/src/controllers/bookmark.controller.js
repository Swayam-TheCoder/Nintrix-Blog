
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  checkBookmark
} from "../services/bookmark.service.js";

// Add bookmark
export const add = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const bookmark = await addBookmark(blogId, userId);

    return res.status(201).json({
      success: true,
      message: "Blog bookmarked successfully",
      bookmark
    });
  } catch (error) {
    return res.status(
      error.message === "Blog not found" ? 404 : 403
    ).json({
      success: false,
      message: error.message
    });
  }
};

// Remove bookmark
export const remove = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const result = await removeBookmark(blogId, userId);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(
      error.message === "Blog not found" ? 404 : 403
    ).json({
      success: false,
      message: error.message
    });
  }
};

// Get logged-in user's bookmarks
export const getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await getUserBookmarks(userId);

    return res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks"
    });
  }
};

// Check bookmark status
export const check = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const isBookmarked = await checkBookmark(blogId, userId);

    return res.status(200).json({
      success: true,
      isBookmarked
    });
  } catch (error) {
    return res.status(
      error.message === "Blog not found" ? 404 : 403
    ).json({
      success: false,
      message: error.message
    });
  }
};
