import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/modules/auth/schemas/auth.schema";

/**
 * Blog Categories Table
 * Separate from tool categories
 */
export const blogCategories = sqliteTable("blog_categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    displayOrder: integer("display_order").notNull().default(0),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Blog Posts Table
 * Stores blog articles with Markdown content
 */
export const blogPosts = sqliteTable("blog_posts", {
    id: text("id").primaryKey(),

    // Content
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(), // Markdown with inline HTML support
    excerpt: text("excerpt"),
    featuredImage: text("featured_image"),

    // Organization
    categoryId: text("category_id").references(() => blogCategories.id, {
        onDelete: "set null",
    }),
    tags: text("tags"), // JSON array

    // Author
    authorId: text("author_id")
        .notNull()
        .references(() => user.id, { onDelete: "restrict" }),

    // Publishing
    status: text("status", { enum: ["draft", "scheduled", "published"] })
        .notNull()
        .default("draft"),
    isPublished: integer("is_published", { mode: "boolean" })
        .notNull()
        .default(false),
    publishedAt: integer("published_at", { mode: "timestamp" }),

    // SEO
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),

    // Metrics
    viewCount: integer("view_count").default(0),

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

export type BlogCategory = typeof blogCategories.$inferSelect;
export type NewBlogCategory = typeof blogCategories.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
