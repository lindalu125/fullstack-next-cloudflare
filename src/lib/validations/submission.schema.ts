import { z } from "zod";

/**
 * Tool Submission Validation Schemas
 */

// Create Submission Schema (Guest/User)
export const createSubmissionSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    url: z.string().url("Invalid URL format"),
    description: z
        .string()
        .min(10, "Description too short (min 10 characters)")
        .max(500, "Description too long (max 500 characters)"),
    logoUrl: z.string().url("Invalid logo URL").optional(),
    categoryId: z.string().min(1, "Category is required"),
    isFeatured: z.boolean().default(false),
    // Email required for guests, forbidden for authenticated users
    email: z.string().email("Invalid email format").optional(),
});

// Verify Email Schema
export const verifySubmissionSchema = z.object({
    token: z.string().min(1, "Verification token is required"),
});

// Review Submission Schema (Admin)
export const reviewSubmissionSchema = z.object({
    action: z.enum(["approve", "reject", "request_changes"]),
    rejectionReason: z
        .string()
        .min(10, "Rejection reason required (min 10 characters)")
        .optional(),
    feedbackComments: z.array(z.string()).optional(),
});

// Approval Options
export const approveSubmissionSchema = z.object({
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(true),
});

// Rejection Schema
export const rejectSubmissionSchema = z.object({
    reason: z.string().min(10, "Rejection reason is required"),
});

// Request Changes Schema
export const requestChangesSchema = z.object({
    feedback: z.array(z.string()).min(1, "At least one feedback item required"),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type VerifySubmissionInput = z.infer<typeof verifySubmissionSchema>;
export type ApproveSubmissionInput = z.infer<typeof approveSubmissionSchema>;
export type RejectSubmissionInput = z.infer<typeof rejectSubmissionSchema>;
export type RequestChangesInput = z.infer<typeof requestChangesSchema>;
