import { supabaseAdmin } from "../config/supabase.js";

const getRepository = async (repositoryId) => {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select("id, owner_id")
    .eq("id", repositoryId)
    .single();

  if (error || !data) {
    throw new Error("Repository not found");
  }

  return data;
};

const verifyOwner = async (repositoryId, userId) => {
  const repository = await getRepository(repositoryId);

  if (repository.owner_id !== userId) {
    throw new Error(
      "Only the repository owner can manage members"
    );
  }

  return repository;
};

export const addMember = async ({
  repositoryId,
  ownerId,
  userId,
  role
}) => {
  await verifyOwner(repositoryId, ownerId);

  // Don't allow owner to be added as a member again
  if (userId === ownerId) {
    throw new Error(
      "Repository owner is already a member"
    );
  }

  // Make sure user exists
  const { data: profile, error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .eq("id", userId)
      .single();

  if (profileError || !profile) {
    throw new Error("User not found");
  }

  const { data, error } = await supabaseAdmin
    .from("repository_members")
    .insert({
      repository_id: repositoryId,
      user_id: userId,
      role
    })
    .select(`
      id,
      repository_id,
      user_id,
      role,
      created_at
    `)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "User is already a member of this repository"
      );
    }

    throw new Error(error.message);
  }

  return {
    ...data,
    user: profile
  };
};

export const getMembers = async (
  repositoryId,
  userId
) => {
  const repository = await getRepository(repositoryId);

  // Public repository can expose members
  // Private repository requires membership/owner access
  if (repository.owner_id !== userId) {
    const { data: membership } = await supabaseAdmin
      .from("repository_members")
      .select("role")
      .eq("repository_id", repositoryId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      throw new Error(
        "You do not have access to this repository"
      );
    }
  }

  const { data, error } = await supabaseAdmin
    .from("repository_members")
    .select(`
      id,
      repository_id,
      user_id,
      role,
      created_at,
      profiles (
        id,
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("repository_id", repositoryId)
    .order("created_at", {
      ascending: true
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateMemberRole = async ({
  repositoryId,
  ownerId,
  memberId,
  role
}) => {
  await verifyOwner(repositoryId, ownerId);

  const { data: member, error: memberError } =
    await supabaseAdmin
      .from("repository_members")
      .select("id, user_id, role")
      .eq("id", memberId)
      .eq("repository_id", repositoryId)
      .single();

  if (memberError || !member) {
    throw new Error("Member not found");
  }

  if (member.user_id === ownerId) {
    throw new Error(
      "Repository owner role cannot be changed"
    );
  }

  const { data, error } = await supabaseAdmin
    .from("repository_members")
    .update({ role })
    .eq("id", memberId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const removeMember = async ({
  repositoryId,
  ownerId,
  memberId
}) => {
  await verifyOwner(repositoryId, ownerId);

  const { data: member, error: memberError } =
    await supabaseAdmin
      .from("repository_members")
      .select("id, user_id")
      .eq("id", memberId)
      .eq("repository_id", repositoryId)
      .single();

  if (memberError || !member) {
    throw new Error("Member not found");
  }

  if (member.user_id === ownerId) {
    throw new Error(
      "Repository owner cannot be removed"
    );
  }

  const { error } = await supabaseAdmin
    .from("repository_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(error.message);
  }
};