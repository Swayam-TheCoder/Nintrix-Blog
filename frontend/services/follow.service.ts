
import { api } from "@/lib/api";

export const followUser = async (userId: string) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

export const getFollowStats = async (userId: string) => {
  const response = await api.get(`/users/${userId}/follow-stats`);
  return response.data.stats;
};
