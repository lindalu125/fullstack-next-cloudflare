"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ToolCard, ToolCardSkeleton } from "./tool-card";

/**
 * Tool Card Grid Component
 * Displays tools in a responsive grid with infinite scroll
 * Based on COMPONENT_INVENTORY.md specification
 */
export function ToolCardGrid({
    tools,
    isLoading = false,
    hasMore = false,
    onLoadMore,
}: {
    tools: Array<{
        id: string;
        name: string;
        logo?: string | null;
        description: string;
        category: {
            id: string;
            name: string;
        };
        pricing?: "Free" | "Freemium" | "Paid";
        isFeatured?: boolean;
        url: string;
    }>;
    isLoading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
}) {
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    // Auto-load more when scrolled to bottom
    useEffect(() => {
        if (inView && hasMore && !isLoading && onLoadMore) {
            onLoadMore();
        }
    }, [inView, hasMore, isLoading, onLoadMore]);

    if (tools.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No tools found. Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                ))}

                {/* Loading Skeletons */}
                {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <ToolCardSkeleton key={`skeleton-${i}`} />
                    ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && !isLoading && (
                <div
                    ref={ref}
                    className="h-20 flex items-center justify-center"
                >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-text-primary dark:border-dark-text-primary" />
                </div>
            )}

            {/* No More Results */}
            {!hasMore && tools.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        You've reached the end of the list
                    </p>
                </div>
            )}
        </div>
    );
}
