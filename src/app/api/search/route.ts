import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools, blogPosts } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    parsePagination,
    createPaginationMeta,
    handleApiError,
} from "@/lib/api-utils";
import { or, like, desc } from "drizzle-orm";

/**
 * GET /api/search
 * Search across tools and blog posts
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q");
        const type = searchParams.get("type") || "all"; // 'tools' | 'blog' | 'all'

        if (!q || q.length < 2) {
            return apiError(
                "Search query must be at least 2 characters",
                "VALIDATION_ERROR",
                400,
            );
        }

        const db = await getDb();
        const { page, limit, offset } = parsePagination(searchParams);
        const results: any[] = [];

        // Search tools
        if (type === "all" || type === "tools") {
            const toolResults = await db
                .select({
                    type: tools.id, // Will be replaced with 'tool'
                    id: tools.id,
                    name: tools.name,
                    description: tools.description,
                    logoUrl: tools.logoUrl,
                    url: tools.url,
                })
                .from(tools)
                .where(
                    or(
                        like(tools.name, `%${q}%`),
                        like(tools.description, `%${q}%`),
                    ),
                )
                .limit(type === "all" ? 10 : limit)
                .offset(type === "all" ? 0 : offset);

            results.push(
                ...toolResults.map((r) => ({
                    type: "tool",
                    id: r.id,
                    name: r.name,
                    description: r.description,
                    logoUrl: r.logoUrl,
                    url: r.url,
                    matchedFields: ["name", "description"],
                })),
            );
        }

        // Search blog posts
        if (type === "all" || type === "blog") {
            const blogResults = await db
                .select({
                    type: blogPosts.id, // Will be replaced with 'blog'
                    id: blogPosts.id,
                    title: blogPosts.title,
                    excerpt: blogPosts.excerpt,
                    slug: blogPosts.slug,
                })
                .from(blogPosts)
                .where(
                    or(
                        like(blogPosts.title, `%${q}%`),
                        like(blogPosts.content, `%${q}%`),
                    ),
                )
                .limit(type === "all" ? 10 : limit)
                .offset(type === "all" ? 0 : offset);

            results.push(
                ...blogResults.map((r) => ({
                    type: "blog",
                    id: r.id,
                    title: r.title,
                    excerpt: r.excerpt,
                    slug: r.slug,
                })),
            );
        }

        const total = results.length;

        return apiSuccess(
            { results, query: q },
            type === "all"
                ? undefined
                : createPaginationMeta(page, limit, total),
        );
    } catch (error) {
        return handleApiError(error);
    }
}
