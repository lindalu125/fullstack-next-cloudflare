import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories, tools, blogPosts, toolSubmissions, user } from "@/db/schema";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { sql } from "drizzle-orm";

/**
 * GET /api/dev/validate
 * Validate database state and return stats (Development only)
 */
export async function GET(request: NextRequest) {
    try {
        if (process.env.NODE_ENV === "production") {
            return apiError("Not available in production", "FORBIDDEN", 403);
        }

        const db = await getDb();

        // Get counts
        const [{ count: categoryCount }] = await db.select({ count: sql<number>`count(*)` }).from(categories);
        const [{ count: toolCount }] = await db.select({ count: sql<number>`count(*)` }).from(tools);
        const [{ count: blogCount }] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
        const [{ count: submissionCount }] = await db.select({ count: sql<number>`count(*)` }).from(toolSubmissions);
        const [{ count: userCount }] = await db.select({ count: sql<number>`count(*)` }).from(user);

        // Check for orphaned tools (tools with invalid categoryId)
        // Note: Drizzle doesn't support "NOT IN" easily with subqueries in sqlite proxy sometimes, 
        // but we can do a left join and check for null
        const orphanedTools = await db
            .select({ id: tools.id, name: tools.name })
            .from(tools)
            .leftJoin(categories, sql`${tools.categoryId} = ${categories.id}`)
            .where(sql`${categories.id} IS NULL`);

        return apiSuccess({
            environment: process.env.NODE_ENV,
            stats: {
                categories: categoryCount,
                tools: toolCount,
                blogPosts: blogCount,
                submissions: submissionCount,
                users: userCount,
            },
            integrity: {
                orphanedTools: orphanedTools.length,
                orphanedToolsList: orphanedTools,
                status: orphanedTools.length === 0 ? "OK" : "WARNING",
            }
        });

    } catch (error) {
        return handleApiError(error);
    }
}
