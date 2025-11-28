import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools, toolSubmissions } from "@/db/schema";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { eq, sql, gte } from "drizzle-orm";

/**
 * GET /api/admin/stats
 * Get dashboard statistics (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Require admin authentication
        await requireAdmin(request);

        const db = await getDb();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total tools
        const [{ count: totalTools }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools);

        // Pending submissions
        const [{ count: pendingSubmissions }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(toolSubmissions)
            .where(eq(toolSubmissions.status, "pending"));

        // Tools added this month
        const [{ count: thisMonthTools }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools)
            .where(gte(tools.createdAt, startOfMonth));

        // Total views
        const [{ sum: totalViews }] = await db
            .select({ sum: sql<number>`sum(${tools.viewCount})` })
            .from(tools);

        // Featured tools
        const [{ count: featuredTools }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools)
            .where(eq(tools.isFeatured, true));

        return apiSuccess({
            totalTools: totalTools || 0,
            pendingSubmissions: pendingSubmissions || 0,
            thisMonthTools: thisMonthTools || 0,
            totalViews: totalViews || 0,
            featuredTools: featuredTools || 0,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
