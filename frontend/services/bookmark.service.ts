
import api from "@/lib/api";

// Get all bookmarks of logged-in user
export const getBookmarks = async () => {
  const response = await api.get("/bookmarks");
  return response.data;
};

// Add bookmark
export const addBookmark = async (blogId: string) => {
  const response = await api.post(`/bookmarks/${blogId}`);
  return response.data;
};

// Remove bookmark
export const removeBookmark = async (blogId: string) => {
  const response = await api.delete(`/bookmarks/${blogId}`);
  return response.data;
};

// Check bookmark status
export const checkBookmark = async (blogId: string) => {
  const response = await api.get(`/bookmarks/${blogId}/check`);
  return response.data;
};
