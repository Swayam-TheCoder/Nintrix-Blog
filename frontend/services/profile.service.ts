import { api } from "@/lib/api";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

export const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data.profile;
};

export const updateProfile = async (
  data: UpdateProfileData
) => {
  const response = await api.patch("/profile", data);

  return response.data.profile;
};

export const getProfileRepositories = async (
  page: number = 1,
  limit: number = 4
) => {
  const response = await api.get(
    `/repositories?page=${page}&limit=${limit}`
  );

  return response.data;
};