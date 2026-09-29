import { api } from "@/lib/api";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const getMyProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};

export const updateMyProfile = async (
  data: Partial<Profile>
) => {
  const response = await api.patch(
    "/profile",
    data
  );

  return response.data;
};