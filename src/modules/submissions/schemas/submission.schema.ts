import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "@/modules/categories/schemas/category.schema";
import { user } from "@/modules/auth/schemas/auth.schema";
import { tools } from "@/modules/tools/schemas/tool.schema";

/**
 * Tool Submissions Table
 * Stores user-submitted tools pending review
 * Supports both guest and registered user submissions
 */
export const toolSubmissions = sqliteTable("tool_submissions", {
    id: text("id").primaryKey(),

    // Tool information
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description").notNull(),
    logoUrl: text("logo_url"),
    categoryId: text("category_id")
        .notNull()
        .references(() => categories.id),

    // Submitter information
    submittedBy: text("submitted_by").references(() => user.id, {
        onDelete: "cascade",
    }), // null for guests
    email: text("email"), // for guest submissions
    emailVerified: integer("email_verified", { mode: "boolean" }).default(
        false,
    ),

    // Review workflow
    status: text("status", {
        enum: ["pending", "changes_requested", "approved", "rejected"],
    })
        .notNull()
        .default("pending"),
    feedbackComments: text("feedback_comments"), // JSON array
    rejectionReason: text("rejection_reason"),

    // Featured flag
    isFeatured: integer("is_featured", { mode: "boolean" }).default(false),

    // Admin review tracking
    reviewedBy: text("reviewed_by").references(() => user.id),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
    rejectedBy: text("rejected_by").references(() => user.id),
    rejectedAt: integer("rejected_at", { mode: "timestamp" }),

    // Link to created tool
    toolId: text("tool_id")
        .unique()
        .references(() => tools.id),

    // Soft delete
    deletedAt: integer("deleted_at", { mode: "timestamp" }),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Verification Tokens Table
 * For email verification of guest submissions
 */
export const verificationTokens = sqliteTable("verification_tokens", {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    submissionId: text("submission_id")
        .notNull()
        .references(() => toolSubmissions.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    usedAt: integer("used_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
});

export type ToolSubmission = typeof toolSubmissions.$inferSelect;
export type NewToolSubmission = typeof toolSubmissions.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
