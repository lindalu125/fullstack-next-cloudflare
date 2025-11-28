"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Category Tabs Component
 * Horizontal scrolling category filter
 * Based on DESIGN_LAYOUT.md specification
 *
 */
export function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
}: {
    categories: Array<{
        id: string;
        name: string;
        slug: string;
        count?: number;
    }>;
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
            container.scrollLeft <
                container.scrollWidth - container.clientWidth,
        );
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [categories]);

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 200;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative">
            {/* Left Scroll Button */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-full p-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors border border-light-border dark:border-dark-border"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {/* Categories Container */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto scrollbar-hide py-4 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* All Category */}
                <button
                    onClick={() => onCategoryChange("all")}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === "all"
                            ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary border border-light-text-primary dark:border-dark-text-primary"
                            : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    }`}
                >
                    All
                </button>

                {/* Category Tabs */}
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === category.id
                                ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary border border-light-text-primary dark:border-dark-text-primary"
                                : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                    >
                        {category.name}
                        {category.count !== undefined && (
                            <span className="ml-2 opacity-75">
                                ({category.count})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Right Scroll Button */}
            {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-light-bg-primary dark:bg-dark-bg-primary shadow-lg rounded-full p-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors border border-light-border dark:border-dark-border"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
