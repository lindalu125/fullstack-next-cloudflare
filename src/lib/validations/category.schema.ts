import { z } from "zod";

/**
 * Category CRUD Validation Schemas
 */

// Create Category Schema (Admin)
export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .max(100, "Slug too long")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug must contain only lowercase letters, numbers, and hyphens",
        ),
    icon: z.string().min(1, "Icon is required"),
    description: z.string().max(500).optional(),
    parentId: z.string().nullable().optional(),
    displayOrder: z.number().int().min(0).default(0),
});

// Update Category Schema (Admin)
export const updateCategorySchema = z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z
        .string()
        .min(1)
        .max(100)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
    icon: z.string().optional(),
    description: z.string().max(500).optional(),
    parentId: z.string().nullable().optional(),
    displayOrder: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
