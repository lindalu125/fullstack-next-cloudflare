import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Categories Table
 * Stores both main categories (AI Tools, Digital Tools) and subcategories
 * Supports hierarchical structure with parentId
 */
export const categories = sqliteTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull(), // Lucide icon name
    description: text("description"),

    // Hierarchy support
    parentId: text("parent_id").references((): any => categories.id, {
        onDelete: "restrict",
    }),
    displayOrder: integer("display_order").notNull().default(0),

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

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
