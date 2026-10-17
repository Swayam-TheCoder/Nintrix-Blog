import { api } from "@/lib/api";

export type RepositoryVisibility = "PUBLIC" | "PRIVATE";

export interface Repository {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: RepositoryVisibility;
  created_at: string;
  updated_at: string;
}

export interface CreateRepositoryData {
  name: string;
  slug: string;
  description?: string;
  visibility: RepositoryVisibility;
}
export interface RepositoryPagination {
  repositories: Repository[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getMyRepositories = async (
  page?: number,
  limit?: number
): Promise<RepositoryPagination> => {
  const response = await api.get("/repositories", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};


export const getRepository = async (repositoryId: string) => {
  const response = await api.get(`/repositories/${repositoryId}`);

  return response.data.repository;
};

export const createRepository = async (
  data: CreateRepositoryData
) => {
  const response = await api.post("/repositories", data);

  return response.data;
};

export const updateRepository = async (
  repositoryId: string,
  data: Partial<CreateRepositoryData>,
) => {
  const response = await api.patch(`/repositories/${repositoryId}`, data);

  return response.data;
};

export const deleteRepository = async (repositoryId: string) => {
  const response = await api.delete(`/repositories/${repositoryId}`);

  return response.data;
};
