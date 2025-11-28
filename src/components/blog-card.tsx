import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

/**
 * Blog Card Component
 * Displays blog post preview in card format
 * Based on DESIGN_LAYOUT.md Section 4
 */
export function BlogCard({
    id,
    title,
    slug,
    excerpt,
    featuredImage,
    category,
    publishedAt,
    readingTime,
    tags,
}: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string | null;
    category?: {
        id: string;
        name: string;
    };
    publishedAt: Date | string;
    readingTime?: string;
    tags?: string[];
}) {
    const date =
        typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;

    return (
        <Link href={`/blog/${slug}`}>
            <article className="group h-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary hover:scale-[1.02]">
                {/* Featured Image */}
                {featuredImage ? (
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={featuredImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ) : (
                    <div className="h-48 w-full bg-light-text-primary dark:bg-dark-text-primary flex items-center justify-center">
                        <span className="text-light-bg-primary dark:text-dark-bg-primary font-bold text-4xl">
                            {title.charAt(0)}
                        </span>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 line-clamp-2 transition-colors">
                        {title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={date.toISOString()}>
                                {format(date, "MMM dd, yyyy")}
                            </time>
                        </div>
                        {readingTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{readingTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Excerpt */}
                    <p className="text-light-text-secondary dark:text-dark-text-secondary line-clamp-3 mb-4">
                        {excerpt}
                    </p>

                    {/* Tags */}
                    {(tags && tags.length > 0) || category ? (
                        <div className="flex flex-wrap gap-2">
                            {category && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                                    {category.name}
                                </span>
                            )}
                            {tags?.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border border-light-border dark:border-dark-border bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-tertiary dark:text-dark-text-tertiary"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </article>
        </Link>
    );
}

/**
 * Blog Card Skeleton
 * Loading placeholder for blog cards
 */
export function BlogCardSkeleton() {
    return (
        <div className="h-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg overflow-hidden shadow-sm border border-light-border dark:border-dark-border animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 w-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary" />

            {/* Content skeleton */}
            <div className="p-6 space-y-3">
                <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-3/4" />
                <div className="flex gap-4">
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-24" />
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-20" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-full" />
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-5/6" />
                </div>
                <div className="flex gap-2">
                    <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-20" />
                    <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-16" />
                </div>
            </div>
        </div>
    );
}
