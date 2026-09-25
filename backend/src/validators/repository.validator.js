import { z } from "zod";

export const createRepositorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Repository name is required")
    .max(100, "Repository name cannot exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .nullable(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .default("PRIVATE")
});

export const updateRepositorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .optional()
});