import { api } from "@/lib/api";



export type BlogStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

export interface Blog {
  id: string;
  repository_id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
}

export const getRepositoryBlogs = async (
  repositoryId: string
) => {
  const response = await api.get(
    `/repositories/${repositoryId}/blogs`
  );

  return response.data.blogs;
};

export const getBlog = async (
  repositoryId: string,
  blogId: string
) => {
  const response = await api.get(
    `/repositories/${repositoryId}/blogs/${blogId}`
  );

  return response.data;
};

export const createBlog = async (
  repositoryId: string,
  data: CreateBlogData
) => {
  const response = await api.post(
    `/repositories/${repositoryId}/blogs`,
    data
  );

  return response.data;
};

export const updateBlog = async (
  repositoryId: string,
  blogId: string,
  data: Partial<CreateBlogData>
) => {
  const response = await api.patch(
    `/repositories/${repositoryId}/blogs/${blogId}`,
    data
  );

  return response.data;
};

export const deleteBlog = async (
  repositoryId: string,
  blogId: string
) => {
  const response = await api.delete(
    `/repositories/${repositoryId}/blogs/${blogId}`
  );

  return response.data;
};

export const changeBlogStatus = async (
  repositoryId: string,
  blogId: string,
  status: "PUBLISHED" | "DRAFT"
) => {
  const response = await api.patch(
    `/repositories/${repositoryId}/blogs/${blogId}/status`,
    { status }
  );

  return response.data;
};