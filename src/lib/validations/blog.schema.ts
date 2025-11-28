import { z } from "zod";

/**
 * Blog API Validation Schemas
 */

// Create Blog Post Schema (Admin)
export const createBlogPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(200, "Slug too long")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug must contain only lowercase letters, numbers, and hyphens",
        ),
    content: z.string().min(100, "Content too short (min 100 characters)"),
    excerpt: z
        .string()
        .max(160, "Excerpt too long (max 160 characters)")
        .optional(),
    featuredImage: z.string().url("Invalid image URL").optional(),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "scheduled", "published"]).default("draft"),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().datetime().optional(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.string().max(255).optional(),
});

// Update Blog Post Schema (Admin)
export const updateBlogPostSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    slug: z
        .string()
        .min(1)
        .max(200)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
    content: z.string().min(100).optional(),
    excerpt: z.string().max(160).optional(),
    featuredImage: z.string().url().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "scheduled", "published"]).optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.string().datetime().optional().nullable(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.string().max(255).optional(),
});

// Blog Query Parameters
export const blogQuerySchema = z.object({
    category: z.string().optional(),
    tag: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(["latest", "popular"]).default("latest"),
});

// Blog Category Schema
export const createBlogCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(100, "Slug too long")
        .regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional(),
    displayOrder: z.number().int().min(0).default(0),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogQueryParams = z.infer<typeof blogQuerySchema>;
export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
