import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { eq, isNull, sql } from "drizzle-orm";

/**
 * GET /api/categories
 * List all categories with hierarchical structure
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const parent = searchParams.get("parent");
        const db = await getDb();

        // Get all categories
        const allCategories = await db
            .select()
            .from(categories)
            .orderBy(categories.displayOrder);

        // If parent parameter is provided, filter subcategories
        if (parent) {
            const [parentCategory] = await db
                .select()
                .from(categories)
                .where(eq(categories.slug, parent))
                .limit(1);

            if (!parentCategory) {
                return apiSuccess([]);
            }

            const subcategories = allCategories.filter(
                (c) => c.parentId === parentCategory.id,
            );
            return apiSuccess(subcategories);
        }

        // Build tree structure
        const parentCategories = allCategories.filter((c) => !c.parentId);

        const tree = parentCategories.map((parent) => ({
            ...parent,
            children: allCategories.filter((c) => c.parentId === parent.id),
        }));

        return apiSuccess(tree);
    } catch (error) {
        return handleApiError(error);
    }
}
