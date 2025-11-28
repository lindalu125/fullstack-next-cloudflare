import { z } from "zod";

/**
 * Tool CRUD Validation Schemas
 */

// Create Tool Schema (Admin)
export const createToolSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    url: z.string().url("Invalid URL format"),
    description: z
        .string()
        .min(10, "Description too short")
        .max(1000, "Description too long"),
    logoUrl: z.string().url("Invalid logo URL").optional(),
    categoryId: z.string().min(1, "Category is required"),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.string().max(255).optional(),
});

// Update Tool Schema (Admin)
export const updateToolSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    url: z.string().url().optional(),
    description: z.string().min(10).max(1000).optional(),
    logoUrl: z.string().url().optional().nullable(),
    categoryId: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    metaDescription: z.string().max(160).optional(),
    metaKeywords: z.string().max(255).optional(),
});

// Tool Query Parameters
export const toolQuerySchema = z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.enum(["featured", "newest", "popular"]).default("featured"),
    featured: z.coerce.boolean().optional(),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
export type ToolQueryParams = z.infer<typeof toolQuerySchema>;
