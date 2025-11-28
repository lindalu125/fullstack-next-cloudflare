import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { BlogCard } from "@/components/blog-card";

// Mock data
const mockPost = {
    id: "1",
    title: "Getting Started with AI Writing Tools",
    slug: "getting-started-ai-writing",
    content: `# Getting Started with AI Writing Tools

AI writing tools have revolutionized content creation. Here's everything you need to know to get started.

## What are AI Writing Tools?

AI writing tools use machine learning to help you create content faster and more efficiently. They can:

- Generate ideas and outlines
- Write full articles and blog posts
- Create marketing copy
- Improve existing content

## Top Tools to Try

### 1. ChatGPT

ChatGPT is great for conversations and brainstorming. It's versatile and can help with various writing tasks.

### 2. Jasper

Perfect for marketing copy and professional content creation.

### 3. Copy.ai

Ideal for social media content and short-form copy.

## Tips for Success

> Always review and edit AI-generated content. Use AI as a tool, not a replacement for human creativity.

**Key Points:**
- Be specific with your prompts
- Provide context and examples
- Iterate and refine the output
- Add your personal touch

## Conclusion

AI writing tools are powerful assistants that can significantly boost your productivity. Start experimenting today!`,
    excerpt:
        "Learn how to leverage AI writing tools to boost your productivity and create better content faster.",
    featuredImage: null,
    category: { id: "tutorials", name: "Tutorials" },
    author: { name: "Toolsail Team", id: "admin" },
    publishedAt: new Date("2025-01-15"),
    readingTime: "5 min",
    tags: ["AI", "Writing", "Productivity"],
};

const relatedPosts = [
    {
        id: "2",
        title: "Top 10 AI Writing Tools in 2025",
        slug: "top-ai-writing-tools-2025",
        excerpt: "Comprehensive list of the best AI writing tools available.",
        featuredImage: null,
        category: { id: "lists", name: "Top Lists" },
        publishedAt: new Date("2025-01-10"),
        readingTime: "8 min",
        tags: ["AI", "Tools"],
    },
    {
        id: "3",
        title: "ChatGPT vs Jasper: Which is Better?",
        slug: "chatgpt-vs-jasper",
        excerpt: "Detailed comparison of two leading AI writing assistants.",
        featuredImage: null,
        category: { id: "reviews", name: "Reviews" },
        publishedAt: new Date("2025-01-08"),
        readingTime: "6 min",
        tags: ["AI", "Comparison"],
    },
    {
        id: "4",
        title: "Writing Prompts That Actually Work",
        slug: "writing-prompts-that-work",
        excerpt: "Master the art of prompt engineering for better AI outputs.",
        featuredImage: null,
        category: { id: "tutorials", name: "Tutorials" },
        publishedAt: new Date("2025-01-05"),
        readingTime: "7 min",
        tags: ["AI", "Tips"],
    },
];

/**
 * Blog Detail Page
 * Displays full blog post with Markdown rendering
 * Route: /blog/[slug]
 * Based on DESIGN_LAYOUT.md Section 5
 */
export default function BlogDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = mockPost;

    return (
        <div className="w-full">
            {/* Back Button */}
            <section className="border-b bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </div>
            </section>

            {/* Article Header */}
            <section className="py-12 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Category Badge */}
                        <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                                {post.category.name}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            {post.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <time dateTime={post.publishedAt.toISOString()}>
                                    {format(post.publishedAt, "MMMM dd, yyyy")}
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{post.readingTime} read</span>
                            </div>
                            <div>
                                <span>By {post.author.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-light-text-primary dark:prose-a:text-dark-text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-blockquote:border-l-light-border dark:border-l-dark-border">
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                {post.content}
                            </ReactMarkdown>
                        </article>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Share Section */}
            <section className="py-8 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Share this article
                            </h3>
                            <div className="flex gap-3">
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    Twitter
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    LinkedIn
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard
                                    key={relatedPost.id}
                                    {...relatedPost}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
