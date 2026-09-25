import { z } from "zod";

export const addMemberSchema = z.object({
  userId: z
    .string()
    .uuid("Invalid user ID"),

  role: z
    .enum(["EDITOR", "VIEWER"])
    .default("VIEWER")
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["EDITOR", "VIEWER"])
});