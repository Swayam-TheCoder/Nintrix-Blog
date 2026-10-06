import { api } from "@/lib/api";

export interface BlogVersion {
  id: string;
  blog_id: string;
  created_by: string;
  version_number: number;
  title: string;
  content: string | null;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const getBlogVersions = async (
  repositoryId: string,
  blogId: string
): Promise<BlogVersion[]> => {
  const response = await api.get(
    `/repositories/${repositoryId}/blogs/${blogId}/versions`
  );

  return response.data.versions;
};