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

export interface DiscoverProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_following: boolean;
}

export const searchProfiles = async (
  query: string
): Promise<DiscoverProfile[]> => {
  const response = await api.get("/profile/search", {
    params: { q: query },
  });

  return response.data.profiles;
};



export interface PublicProfile {
  profile: Profile;
  stats: {
    followers: number;
    following: number;
  };
  repositories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
  }[];
  blogs: {
    id: string;
    repository_id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    repositories: {
      id: string;
      name: string;
      slug: string;
      visibility: string;
    } | {
      id: string;
      name: string;
      slug: string;
      visibility: string;
    }[];
  }[];
}

export const getPublicProfile = async (
  username: string
): Promise<PublicProfile> => {
  const response = await api.get(
    `/profile/users/${encodeURIComponent(username)}`
  );

  return response.data;
};
