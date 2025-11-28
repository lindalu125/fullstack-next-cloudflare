import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/modules/auth/schemas/auth.schema";

/**
 * Audit Logs Table
 * Tracks all admin actions for compliance and accountability
 */
export const auditLogs = sqliteTable("audit_logs", {
    id: text("id").primaryKey(),

    // Who did it
    adminId: text("admin_id")
        .notNull()
        .references(() => user.id, { onDelete: "restrict" }),
    adminRole: text("admin_role").notNull(), // Snapshot at time of action

    // What happened
    action: text("action").notNull(), // e.g., 'tool_created', 'submission_approved'
    entityType: text("entity_type").notNull(), // e.g., 'tool', 'submission', 'user'
    entityId: text("entity_id"),

    // Changes
    oldValue: text("old_value"), // JSON
    newValue: text("new_value"), // JSON
    changes: text("changes"), // JSON array of {field, oldValue, newValue}

    // Context
    description: text("description"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
