import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tools } from "@/modules/tools/schemas/tool.schema";

/**
 * Tool Promotions Table
 * Manages paid promotions for featured/pinned tools
 */
export const toolPromotions = sqliteTable("tool_promotions", {
    id: text("id").primaryKey(),
    toolId: text("tool_id")
        .notNull()
        .unique()
        .references(() => tools.id, { onDelete: "cascade" }),

    // Promotion tier
    tier: text("tier", { enum: ["featured", "premium", "standard"] })
        .notNull()
        .default("standard"),
    priceUSD: real("price_usd").notNull(),

    // Duration
    startDate: integer("start_date", { mode: "timestamp" }).notNull(),
    endDate: integer("end_date", { mode: "timestamp" }).notNull(),

    // Auto-renewal
    autoRenew: integer("auto_renew", { mode: "boolean" }).default(false),

    // Payment
    paymentMethod: text("payment_method"), // 'stripe' | 'paypal'
    transactionId: text("transaction_id"),

    // Status
    status: text("status", {
        enum: ["pending", "active", "expired", "cancelled"],
    })
        .notNull()
        .default("pending"),

    // Cancellation
    cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
    cancellationReason: text("cancellation_reason"),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export type ToolPromotion = typeof toolPromotions.$inferSelect;
export type NewToolPromotion = typeof toolPromotions.$inferInsert;
