import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
    categories,
    tools,
    blogCategories,
    blogPosts,
    user,
} from "@/db/schema";
import { nanoid } from "nanoid";

// Initialize database connection
const sqlite = new Database(
    ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/757a32d1-5779-4f09-bcf3-b268013395d4.sqlite",
);
const db = drizzle(sqlite, {
    schema: { categories, tools, blogCategories, blogPosts, user },
});

/**
 * Seed data for Toolsail
 * This script populates the database with initial categories, tools, and blog posts
 */

async function seed() {
    console.log("🌱 Seeding database...");

    // 1. Create admin user
    const adminId = nanoid();
    await db.insert(user).values({
        id: adminId,
        email: "admin@toolsail.top",
        name: "Admin User",
        emailVerified: true,
        role: "admin",
        adminRole: "admin",
    });
    console.log("✅ Created admin user");

    // 2. Create main categories
    const aiToolsId = nanoid();
    const digitalToolsId = nanoid();

    await db.insert(categories).values([
        {
            id: aiToolsId,
            name: "AI Tools",
            slug: "ai-tools",
            icon: "cpu",
            description: "Artificial Intelligence and Machine Learning tools",
            parentId: null,
            displayOrder: 1,
        },
        {
            id: digitalToolsId,
            name: "Digital Tools",
            slug: "digital-tools",
            icon: "wrench",
            description: "Digital productivity and creative tools",
            parentId: null,
            displayOrder: 2,
        },
    ]);
    console.log("✅ Created main categories");

    // 3. Create AI Tools subcategories
    const aiWritingId = nanoid();
    const aiDesignId = nanoid();
    const aiCodingId = nanoid();

    await db.insert(categories).values([
        {
            id: aiWritingId,
            name: "AI Writing",
            slug: "ai-writing",
            icon: "pen-tool",
            description: "AI-powered writing and content generation tools",
            parentId: aiToolsId,
            displayOrder: 1,
        },
        {
            id: aiDesignId,
            name: "AI Design",
            slug: "ai-design",
            icon: "palette",
            description: "AI tools for graphic design and visual creation",
            parentId: aiToolsId,
            displayOrder: 2,
        },
        {
            id: aiCodingId,
            name: "AI Coding",
            slug: "ai-coding",
            icon: "code",
            description: "AI assistants for programming and development",
            parentId: aiToolsId,
            displayOrder: 3,
        },
    ]);
    console.log("✅ Created AI Tools subcategories");

    // 4. Create Digital Tools subcategories
    const designToolsId = nanoid();
    const productivityId = nanoid();
    const devToolsId = nanoid();

    await db.insert(categories).values([
        {
            id: designToolsId,
            name: "Design Tools",
            slug: "design-tools",
            icon: "paintbrush",
            description: "Professional design and creative software",
            parentId: digitalToolsId,
            displayOrder: 1,
        },
        {
            id: productivityId,
            name: "Productivity",
            slug: "productivity",
            icon: "zap",
            description: "Tools to boost your productivity",
            parentId: digitalToolsId,
            displayOrder: 2,
        },
        {
            id: devToolsId,
            name: "Developer Tools",
            slug: "developer-tools",
            icon: "terminal",
            description: "Development and coding tools",
            parentId: digitalToolsId,
            displayOrder: 3,
        },
    ]);
    console.log("✅ Created Digital Tools subcategories");

    // 5. Create sample tools
    await db.insert(tools).values([
        // AI Writing Tools
        {
            id: nanoid(),
            name: "ChatGPT",
            url: "https://chat.openai.com",
            description:
                "AI chatbot by OpenAI for conversations, writing, and problem-solving",
            logoUrl: "https://chat.openai.com/favicon.ico",
            categoryId: aiWritingId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "ChatGPT - AI-powered conversational assistant",
            metaKeywords: "AI, chatbot, GPT, writing, assistant",
        },
        {
            id: nanoid(),
            name: "Jasper",
            url: "https://www.jasper.ai",
            description:
                "AI content platform for creating high-quality marketing copy",
            logoUrl: "https://www.jasper.ai/favicon.ico",
            categoryId: aiWritingId,
            isPublished: true,
            isFeatured: false,
            metaDescription: "Jasper AI - AI content generation platform",
            metaKeywords: "AI, content, marketing, copywriting",
        },
        // AI Design Tools
        {
            id: nanoid(),
            name: "Midjourney",
            url: "https://www.midjourney.com",
            description:
                "AI art generator creating stunning images from text descriptions",
            logoUrl: "https://www.midjourney.com/favicon.ico",
            categoryId: aiDesignId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "Midjourney - AI art generation",
            metaKeywords: "AI, art, image generation, design",
        },
        {
            id: nanoid(),
            name: "DALL-E",
            url: "https://labs.openai.com",
            description:
                "OpenAI's AI system for creating realistic images from text",
            logoUrl: "https://labs.openai.com/favicon.ico",
            categoryId: aiDesignId,
            isPublished: true,
            isFeatured: false,
            metaDescription: "DALL-E - AI image creation by OpenAI",
            metaKeywords: "AI, image, generation, OpenAI",
        },
        // AI Coding Tools
        {
            id: nanoid(),
            name: "GitHub Copilot",
            url: "https://github.com/features/copilot",
            description: "AI pair programmer that helps you write code faster",
            logoUrl: "https://github.githubassets.com/favicons/favicon.svg",
            categoryId: aiCodingId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "GitHub Copilot - AI coding assistant",
            metaKeywords: "AI, coding, programming, GitHub",
        },
        // Design Tools
        {
            id: nanoid(),
            name: "Figma",
            url: "https://www.figma.com",
            description:
                "Collaborative design tool for teams building digital products",
            logoUrl: "https://www.figma.com/favicon.ico",
            categoryId: designToolsId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "Figma - Design collaboration platform",
            metaKeywords: "design, UI, UX, collaboration",
        },
        {
            id: nanoid(),
            name: "Canva",
            url: "https://www.canva.com",
            description:
                "Easy-to-use graphic design platform for creating stunning visuals",
            logoUrl: "https://www.canva.com/favicon.ico",
            categoryId: designToolsId,
            isPublished: true,
            isFeatured: false,
            metaDescription: "Canva - Graphic design made easy",
            metaKeywords: "design, graphics, templates, canva",
        },
        // Productivity Tools
        {
            id: nanoid(),
            name: "Notion",
            url: "https://www.notion.so",
            description:
                "All-in-one workspace for notes, tasks, wikis, and databases",
            logoUrl: "https://www.notion.so/favicon.ico",
            categoryId: productivityId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "Notion - Connected workspace",
            metaKeywords: "productivity, notes, workspace, collaboration",
        },
        // Developer Tools
        {
            id: nanoid(),
            name: "VS Code",
            url: "https://code.visualstudio.com",
            description:
                "Free code editor with built-in debugging and Git control",
            logoUrl: "https://code.visualstudio.com/favicon.ico",
            categoryId: devToolsId,
            isPublished: true,
            isFeatured: true,
            metaDescription: "VS Code - Code editor",
            metaKeywords: "code, editor, IDE, development",
        },
        {
            id: nanoid(),
            name: "Postman",
            url: "https://www.postman.com",
            description: "API platform for building and testing APIs",
            logoUrl: "https://www.postman.com/favicon.ico",
            categoryId: devToolsId,
            isPublished: true,
            isFeatured: false,
            metaDescription: "Postman - API development platform",
            metaKeywords: "API, testing, development, REST",
        },
    ]);
    console.log("✅ Created 10 sample tools");

    // 6. Create blog categories
    const tutorialsId = nanoid();
    const reviewsId = nanoid();

    await db.insert(blogCategories).values([
        {
            id: tutorialsId,
            name: "Tutorials",
            slug: "tutorials",
            description: "Step-by-step guides and tutorials",
            displayOrder: 1,
        },
        {
            id: reviewsId,
            name: "Reviews",
            slug: "reviews",
            description: "Tool reviews and comparisons",
            displayOrder: 2,
        },
    ]);
    console.log("✅ Created blog categories");

    // 7. Create sample blog posts
    await db.insert(blogPosts).values([
        {
            id: nanoid(),
            title: "Getting Started with AI Writing Tools",
            slug: "getting-started-ai-writing",
            content: `# Getting Started with AI Writing Tools

AI writing tools have revolutionized content creation. Here's everything you need to know to get started.

## What are AI Writing Tools?

AI writing tools use machine learning to help you create content faster and more efficiently.

## Top Tools to Try

1. **ChatGPT** - Great for conversations and brainstorming
2. **Jasper** - Perfect for marketing copy
3. **Copy.ai** - Ideal for social media content

## Tips for Success

- Be specific with your prompts
- Review and edit AI-generated content
- Use AI as a tool, not a replacement
`,
            excerpt:
                "Learn how to leverage AI writing tools to boost your productivity",
            categoryId: tutorialsId,
            authorId: adminId,
            status: "published",
            isPublished: true,
            publishedAt: new Date(),
            metaDescription: "Guide to using AI writing tools effectively",
            metaKeywords: "AI, writing, tutorial, ChatGPT",
        },
        {
            id: nanoid(),
            title: "Figma vs Adobe XD: Complete Comparison",
            slug: "figma-vs-adobe-xd",
            content: `# Figma vs Adobe XD: Complete Comparison

Choosing the right design tool can make or break your workflow. Let's compare Figma and Adobe XD.

## Collaboration

**Figma** shines with real-time collaboration, while **Adobe XD** has improved but still lags behind.

## Features

Both tools offer robust design capabilities, but Figma's plugin ecosystem is unmatched.

## Pricing

Figma offers a generous free tier, while Adobe XD requires a Creative Cloud subscription.

## Verdict

For teams prioritizing collaboration, Figma is the clear winner.
`,
            excerpt: "Comprehensive comparison of two leading design tools",
            categoryId: reviewsId,
            authorId: adminId,
            status: "published",
            isPublished: true,
            publishedAt: new Date(),
            metaDescription: "Figma vs Adobe XD comparison guide",
            metaKeywords: "Figma, Adobe XD, design, comparison",
        },
    ]);
    console.log("✅ Created 2 sample blog posts");

    console.log("🎉 Database seeding completed!");
}

seed()
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    })
    .finally(() => {
        sqlite.close();
        process.exit(0);
    });
