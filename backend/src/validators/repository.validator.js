import { z } from "zod";

export const createRepositorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Repository name must be at least 3 characters")
    .max(100, "Repository name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .default("PRIVATE")
});

export const updateRepositorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),

  visibility: z
    .enum(["PUBLIC", "PRIVATE"])
    .optional()
});