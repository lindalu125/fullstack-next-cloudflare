"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export default function TablePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary">
            {/* 左侧：显示范围 */}
            <div className="flex items-center gap-4">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    显示{" "}
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {startItem}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {endItem}
                    </span>{" "}
                    条，共{" "}
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {totalItems}
                    </span>{" "}
                    条
                </p>

                {/* 每页显示数量选择器 */}
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            每页:
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) =>
                                onPageSizeChange(Number(e.target.value))
                            }
                            className="px-2 py-1 text-sm border border-light-border dark:border-dark-border rounded-md bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}
            </div>

            {/* 右侧：分页按钮 */}
            <div className="flex items-center gap-2">
                {/* 上一页 */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                </button>

                {/* 页码 */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                        typeof page === "number" ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                        ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary"
                                        : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span
                                key={index}
                                className="min-w-[36px] h-9 flex items-center justify-center text-sm text-light-text-tertiary dark:text-dark-text-tertiary"
                            >
                                {page}
                            </span>
                        ),
                    )}
                </div>

                {/* 下一页 */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
            </div>
        </div>
    );
}
