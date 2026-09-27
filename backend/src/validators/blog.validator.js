import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200, "Slug cannot exceed 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  content: z
    .string()
    .optional()
    .nullable(),

  excerpt: z
    .string()
    .trim()
    .max(500, "Excerpt cannot exceed 500 characters")
    .optional()
    .nullable()
});

export const updateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .optional(),

  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
    .optional(),

  content: z
    .string()
    .optional()
    .nullable(),

  excerpt: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
});

export const publishBlogSchema = z.object({
  status: z.enum(["PUBLISHED", "DRAFT"])
});