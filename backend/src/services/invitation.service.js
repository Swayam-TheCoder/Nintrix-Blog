import { supabaseAdmin } from "../config/supabase.js";

const verifyRepositoryOwner = async (repositoryId, userId) => {
  const { data, error } = await supabaseAdmin
    .from("repositories")
    .select("id, owner_id")
    .eq("id", repositoryId)
    .single();

  if (error || !data) {
    throw new Error("Repository not found");
  }

  if (data.owner_id !== userId) {
    throw new Error("Only the repository owner can send invitations");
  }

  return data;
};

export const createInvitation = async ({
  repositoryId,
  ownerId,
  invitedUserId,
  role,
}) => {
  await verifyRepositoryOwner(repositoryId, ownerId);

  if (ownerId === invitedUserId) {
    throw new Error("You cannot invite yourself");
  }

  // Check user exists
  const { data: user, error: userError } = await supabaseAdmin
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", invitedUserId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  // Already a member?
  const { data: existingMember } = await supabaseAdmin
    .from("repository_members")
    .select("id")
    .eq("repository_id", repositoryId)
    .eq("user_id", invitedUserId)
    .maybeSingle();

  if (existingMember) {
    throw new Error("User is already a member of this repository");
  }

  // Existing pending invitation?
  const { data: existingInvitation } = await supabaseAdmin
    .from("invitations")
    .select("id")
    .eq("repository_id", repositoryId)
    .eq("invited_user_id", invitedUserId)
    .eq("status", "PENDING")
    .maybeSingle();

  if (existingInvitation) {
    throw new Error("A pending invitation already exists");
  }

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabaseAdmin
    .from("invitations")
    .insert({
      repository_id: repositoryId,
      invited_by: ownerId,
      invited_user_id: invitedUserId,
      role,
      status: "PENDING",
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getMyInvitations = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from("invitations")
    .select(
      `
      id,
      repository_id,
      invited_by,
      role,
      status,
      expires_at,
      created_at,
      repositories (
        id,
        name,
        slug,
        description,
        visibility
      ),
      profiles!invitations_invited_by_fkey (
        username,
        display_name,
        avatar_url
      )
    `,
    )
    .eq("invited_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const respondToInvitation = async ({ invitationId, userId, status }) => {
  const { data: invitation, error } = await supabaseAdmin
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("invited_user_id", userId)
    .single();

  if (error || !invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== "PENDING") {
    throw new Error("This invitation has already been processed");
  }

  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    await supabaseAdmin
      .from("invitations")
      .update({ status: "EXPIRED" })
      .eq("id", invitationId);

    throw new Error("This invitation has expired");
  }

  // REJECT
  if (status === "REJECTED") {
    const { data, error: updateError } = await supabaseAdmin
      .from("invitations")
      .update({ status: "REJECTED" })
      .eq("id", invitationId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return data;
  }

  // ACCEPT
  const { data: existingMember } = await supabaseAdmin
    .from("repository_members")
    .select("id")
    .eq("repository_id", invitation.repository_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingMember) {
    const { error: memberError } = await supabaseAdmin
      .from("repository_members")
      .insert({
        repository_id: invitation.repository_id,
        user_id: userId,
        role: invitation.role,
      });

    if (memberError) {
      throw new Error(memberError.message);
    }
  }

  const { data, error: updateError } = await supabaseAdmin
    .from("invitations")
    .update({ status: "ACCEPTED" })
    .eq("id", invitationId)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return data;
};
