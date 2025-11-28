import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories, tools, blogCategories, blogPosts, user } from "@/db/schema";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { nanoid } from "nanoid";

/**
 * POST /api/dev/seed
 * Seed database with test data (Development only)
 */
export async function POST(request: NextRequest) {
    try {
        // Security check: Only allow in development
        if (process.env.NODE_ENV === "production") {
            return apiError("Not available in production", "FORBIDDEN", 403);
        }

        const db = await getDb();

        // 1. Create Parent Categories (顶级分类 - 显示在Header)
        const parentCategories = [
            {
                id: nanoid(),
                name: "AI Tools",
                slug: "ai-tools",
                icon: "cpu",
                description: "Artificial Intelligence powered tools",
                displayOrder: 1,
            },
            {
                id: nanoid(),
                name: "Digital Tools",
                slug: "digital-tools",
                icon: "code",
                description: "Digital tools for productivity and creativity",
                displayOrder: 2,
            },
        ];

        console.log("Seeding Parent Categories...");
        for (const cat of parentCategories) {
            await db.insert(categories).values({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                description: cat.description,
                displayOrder: cat.displayOrder,
                // parentId 不传，让数据库使用默认 NULL
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();
        }

        const aiToolsId = parentCategories[0].id;
        const digitalToolsId = parentCategories[1].id;

        // 2. Create Subcategories (子分类 - 显示在分类按钮组)
        const subcategories = [
            // AI Tools 子分类
            {
                id: nanoid(),
                name: "AI 写作",
                slug: "ai-writing",
                icon: "✍️",
                description: "AI-powered writing and content generation tools",
                displayOrder: 1,
                parentId: aiToolsId,
            },
            {
                id: nanoid(),
                name: "AI 设计",
                slug: "ai-design",
                icon: "🎨",
                description: "AI tools for creative design and artwork",
                displayOrder: 2,
                parentId: aiToolsId,
            },
            {
                id: nanoid(),
                name: "AI 编程",
                slug: "ai-coding",
                icon: "💻",
                description: "AI-powered coding assistants",
                displayOrder: 3,
                parentId: aiToolsId,
            },
            {
                id: nanoid(),
                name: "AI 视频",
                slug: "ai-video",
                icon: "🎬",
                description: "AI video generation and editing tools",
                displayOrder: 4,
                parentId: aiToolsId,
            },
            // Digital Tools 子分类
            {
                id: nanoid(),
                name: "代码编辑器",
                slug: "code-editors",
                icon: "📝",
                description: "Code editors and IDEs",
                displayOrder: 1,
                parentId: digitalToolsId,
            },
            {
                id: nanoid(),
                name: "开发框架",
                slug: "frameworks",
                icon: "⚙️",
                description: "Development frameworks and libraries",
                displayOrder: 2,
                parentId: digitalToolsId,
            },
        ];

        console.log("Seeding Subcategories...");
        for (const cat of subcategories) {
            await db.insert(categories).values({
                ...cat,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();
        }

        // 3. Create Tools (关联到子分类)
        const toolData = [
            // AI 写作工具
            {
                id: nanoid(),
                name: "ChatGPT",
                url: "https://chat.openai.com",
                description: "Advanced AI language model for conversation and assistance.",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
                categoryId: subcategories[0].id, // AI 写作
                isFeatured: true,
                isPublished: true,
                viewCount: 1250,
            },
            {
                id: nanoid(),
                name: "Jasper",
                url: "https://jasper.ai",
                description: "AI content platform for creating marketing copy and content.",
                logoUrl: null,
                categoryId: subcategories[0].id, // AI 写作
                isFeatured: false,
                isPublished: true,
                viewCount: 650,
            },
            // AI 设计工具
            {
                id: nanoid(),
                name: "Midjourney",
                url: "https://midjourney.com",
                description: "AI art generator that creates images from text descriptions.",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png",
                categoryId: subcategories[1].id, // AI 设计
                isFeatured: true,
                isPublished: true,
                viewCount: 980,
            },
            {
                id: nanoid(),
                name: "DALL-E",
                url: "https://openai.com/dall-e",
                description: "Create realistic images and art from text descriptions.",
                logoUrl: null,
                categoryId: subcategories[1].id, // AI 设计
                isFeatured: false,
                isPublished: true,
                viewCount: 720,
            },
            // AI 编程工具
            {
                id: nanoid(),
                name: "GitHub Copilot",
                url: "https://github.com/features/copilot",
                description: "AI pair programmer that helps you write code faster.",
                logoUrl: null,
                categoryId: subcategories[2].id, // AI 编程
                isFeatured: true,
                isPublished: true,
                viewCount: 890,
            },
            {
                id: nanoid(),
                name: "Cursor",
                url: "https://cursor.sh",
                description: "AI-first code editor built for pair programming with AI.",
                logoUrl: null,
                categoryId: subcategories[2].id, // AI 编程
                isFeatured: false,
                isPublished: true,
                viewCount: 540,
            },
            // 代码编辑器
            {
                id: nanoid(),
                name: "VS Code",
                url: "https://code.visualstudio.com",
                description: "Code editing. Redefined. Free. Built on open source.",
                logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg",
                categoryId: subcategories[4].id, // 代码编辑器
                isFeatured: true,
                isPublished: true,
                viewCount: 1150,
            },
        ];

        console.log("Seeding Tools...");
        for (const tool of toolData) {
            await db.insert(tools).values({
                ...tool,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();
        }

        // 4. Create Blog Categories
        const blogCatData = [
            {
                id: nanoid(),
                name: "Tutorials",
                slug: "tutorials",
                description: "How-to guides and tutorials",
            },
            {
                id: nanoid(),
                name: "News",
                slug: "news",
                description: "Latest industry news",
            },
        ];

        // 5. Create Blog Posts
        const [firstUser] = await db.select().from(user).limit(1);
        let authorId = firstUser?.id;

        if (!authorId) {
            const dummyUserId = nanoid();
            try {
                await db.insert(user).values({
                    id: dummyUserId,
                    name: "Demo Admin",
                    email: "admin@example.com",
                    emailVerified: true,
                    role: "admin",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                authorId = dummyUserId;
            } catch (e) {
                console.warn("Failed to create dummy user for blog posts:", e);
            }
        }

        const blogPostData = authorId ? [
            {
                id: nanoid(),
                title: "Getting Started with AI Tools",
                slug: "getting-started-ai",
                excerpt: "A comprehensive guide to using AI tools for productivity.",
                content: "# Getting Started\\n\\nAI tools are revolutionizing...",
                categoryId: blogCatData[0].id,
                authorId: authorId,
                isPublished: true,
                publishedAt: new Date(),
                viewCount: 150,
                tags: JSON.stringify(["AI", "Productivity"]),
            },
            {
                id: nanoid(),
                title: "Top 10 Design Trends for 2025",
                slug: "design-trends-2025",
                excerpt: "What to expect in the world of digital design next year.",
                content: "# Design Trends\\n\\n1. Neomorphism\\n2. Glassmorphism...",
                categoryId: blogCatData[1].id,
                authorId: authorId,
                isPublished: true,
                publishedAt: new Date(),
                viewCount: 320,
                tags: JSON.stringify(["Design", "Trends"]),
            },
        ] : [];

        console.log("Seeding Blog Categories...");
        for (const cat of blogCatData) {
            await db.insert(blogCategories).values({
                ...cat,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();
        }

        if (blogPostData.length > 0) {
            console.log("Seeding Blog Posts...");
            for (const post of blogPostData) {
                await db.insert(blogPosts).values({
                    ...post,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).onConflictDoNothing();
            }
        }

        return apiSuccess({
            message: "Database seeded successfully",
            stats: {
                parentCategories: parentCategories.length,
                subcategories: subcategories.length,
                tools: toolData.length,
                blogCategories: blogCatData.length,
                blogPosts: blogPostData.length,
            }
        });

    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/dev/seed
 * Clear all data (Development only)
 */
export async function DELETE(request: NextRequest) {
    try {
        if (process.env.NODE_ENV === "production") {
            return apiError("Not available in production", "FORBIDDEN", 403);
        }

        const db = await getDb();

        // Delete in order of dependencies (child tables first)
        console.log("Clearing tools...");
        await db.delete(tools);
        
        console.log("Clearing blog posts...");
        await db.delete(blogPosts);
        
        console.log("Clearing categories...");
        await db.delete(categories);
        
        console.log("Clearing blog categories...");
        await db.delete(blogCategories);

        return apiSuccess({ message: "Database cleared successfully" });
    } catch (error) {
        return handleApiError(error);
    }
}
