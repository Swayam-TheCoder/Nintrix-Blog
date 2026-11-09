
import { api } from "@/lib/api";

export interface FollowProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

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

export const getFollowers = async (
  userId: string,
): Promise<FollowProfile[]> => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data.followers;
};

export const getFollowing = async (
  userId: string,
): Promise<FollowProfile[]> => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data.following;
};