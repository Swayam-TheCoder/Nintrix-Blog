import { supabaseAdmin } from "../config/supabase.js";

export const createRepository = async ({
  ownerId,
  name,
  slug,
  description,
  visibility
}) => {
  const { data: repository, error } = await supabaseAdmin
    .from("repositories")
    .insert({
      owner_id: ownerId,
      name,
      slug,
      description,
      visibility
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Add owner as repository member
  const { error: memberError } = await supabaseAdmin
    .from("repository_members")
    .insert({
      repository_id: repository.id,
      user_id: ownerId,
      role: "OWNER"
    });

  if (memberError) {
    // Cleanup repository if owner membership fails
    await supabaseAdmin
      .from("repositories")
      .delete()
      .eq("id", repository.id);

    throw new Error(memberError.message);
  }

  return repository;
};

export const getMyRepositories = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getRepositoryById = async (repositoryId, userId) => {
  const { data: repository, error } = await supabaseAdmin
    .from("repositories")
    .select("*")
    .eq("id", repositoryId)
    .single();

  if (error) {
    throw new Error("Repository not found");
  }

  // Public repository
  if (repository.visibility === "PUBLIC") {
    return repository;
  }

  // Owner
  if (repository.owner_id === userId) {
    return repository;
  }

  // Check membership
  const { data: member } = await supabaseAdmin
    .from("repository_members")
    .select("role")
    .eq("repository_id", repositoryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!member) {
    throw new Error("You do not have access to this repository");
  }

  return repository;
};

export const updateRepository = async (
  repositoryId,
  userId,
  updates
) => {
  // Only owner can update repository settings
  const { data: repository, error: findError } =
    await supabaseAdmin
      .from("repositories")
      .select("owner_id")
      .eq("id", repositoryId)
      .single();

  if (findError) {
    throw new Error("Repository not found");
  }

  if (repository.owner_id !== userId) {
    throw new Error(
      "Only the repository owner can update this repository"
    );
  }

  const { data, error } = await supabaseAdmin
    .from("repositories")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", repositoryId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteRepository = async (
  repositoryId,
  userId
) => {
  const { data: repository, error: findError } =
    await supabaseAdmin
      .from("repositories")
      .select("owner_id")
      .eq("id", repositoryId)
      .single();

  if (findError) {
    throw new Error("Repository not found");
  }

  if (repository.owner_id !== userId) {
    throw new Error(
      "Only the repository owner can delete this repository"
    );
  }

  const { error } = await supabaseAdmin
    .from("repositories")
    .delete()
    .eq("id", repositoryId);

  if (error) {
    throw new Error(error.message);
  }
};