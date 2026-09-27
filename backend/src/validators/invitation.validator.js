import { z } from "zod";

export const createInvitationSchema = z.object({
  invitedUserId: z.string().uuid("Invalid user ID"),
  role: z.enum(["EDITOR", "VIEWER"]).default("VIEWER"),
});

export const respondInvitationSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});
