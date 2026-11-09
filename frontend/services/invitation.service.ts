
import { api } from "@/lib/api";

export interface Invitation {
  id: string;
  repository_id: string;
  invited_by: string;
  role: "EDITOR" | "VIEWER";
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  expires_at: string | null;
  created_at: string;

  repositories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    visibility: "PUBLIC" | "PRIVATE";
  } | null;

  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const getMyInvitations = async (): Promise<Invitation[]> => {
  const response = await api.get("/invitations");
  return response.data.invitations;
};

export const respondToInvitation = async (
  invitationId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  const response = await api.patch(
    `/invitations/${invitationId}`,
    { status }
  );

  return response.data.invitation;
};
