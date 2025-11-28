import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { blogPosts, blogCategories, user } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    parsePagination,
    createPaginationMeta,
    handleApiError,
} from "@/lib/api-utils";
import { blogQuerySchema } from "@/lib/validations/blog.schema";
import { eq, and, desc, sql, like } from "drizzle-orm";

/**
 * GET /api/blog/posts
 * List published blog posts with filtering and pagination
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const db = await getDb();

        // Parse query parameters
        const queryResult = blogQuerySchema.safeParse({
            category: searchParams.get("category"),
            tag: searchParams.get("tag"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            sort: searchParams.get("sort"),
        });

        if (!queryResult.success) {
            return apiError(
                "Invalid query parameters",
                "VALIDATION_ERROR",
                400,
                queryResult.error.flatten().fieldErrors,
            );
        }

        const { category, tag, sort } = queryResult.data;
        const { page, limit, offset } = parsePagination(searchParams);

        // Build conditions
        const conditions = [];

        // Only published posts
        conditions.push(eq(blogPosts.isPublished, true));

        // Filter by category slug
        if (category) {
            const [cat] = await db
                .select()
                .from(blogCategories)
                .where(eq(blogCategories.slug, category))
                .limit(1);

            if (cat) {
                conditions.push(eq(blogPosts.categoryId, cat.id));
            } else {
                return apiSuccess([], createPaginationMeta(page, limit, 0));
            }
        }

        // Filter by tag (tags stored as JSON string array)
        if (tag) {
            conditions.push(like(blogPosts.tags, `%"${tag}"%`));
        }

        // Get total count
        const [{ count: total }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(blogPosts)
            .where(and(...conditions));

        // Get posts with category and author info
        const posts = await db
            .select({
                id: blogPosts.id,
                title: blogPosts.title,
                slug: blogPosts.slug,
                excerpt: blogPosts.excerpt,
                featuredImage: blogPosts.featuredImage,
                category: {
                    id: blogCategories.id,
                    name: blogCategories.name,
                    slug: blogCategories.slug,
                },
                tags: blogPosts.tags,
                author: {
                    id: user.id,
                    name: user.name,
                },
                publishedAt: blogPosts.publishedAt,
                viewCount: blogPosts.viewCount,
            })
            .from(blogPosts)
            .leftJoin(
                blogCategories,
                eq(blogPosts.categoryId, blogCategories.id),
            )
            .leftJoin(user, eq(blogPosts.authorId, user.id))
            .where(and(...conditions))
            .orderBy(
                sort === "popular"
                    ? desc(blogPosts.viewCount)
                    : desc(blogPosts.publishedAt),
            )
            .limit(limit)
            .offset(offset);

        // Parse tags from JSON string
        const postsWithParsedTags = posts.map((post) => ({
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
        }));

        return apiSuccess(
            postsWithParsedTags,
            createPaginationMeta(page, limit, total),
        );
    } catch (error) {
        return handleApiError(error);
    }
}
