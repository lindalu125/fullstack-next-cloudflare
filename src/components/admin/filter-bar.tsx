"use client";

import SearchInput from "./search-input";
import { X } from "lucide-react";

export interface FilterConfig {
    key: string;
    label: string;
    type: "select" | "multiselect";
    options: Array<{ value: string; label: string }>;
}

interface FilterBarProps {
    searchPlaceholder?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    filters?: FilterConfig[];
    filterValues: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    onReset?: () => void;
}

export default function FilterBar({
    searchPlaceholder = "搜索...",
    searchValue,
    onSearchChange,
    filters = [],
    filterValues,
    onFilterChange,
    onReset,
}: FilterBarProps) {
    const hasActiveFilters =
        searchValue ||
        Object.values(filterValues).some(
            (v) => v !== null && v !== "" && v !== undefined,
        );

    return (
        <div className="space-y-4 mb-6">
            {/* 搜索框 */}
            <SearchInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={onSearchChange}
            />

            {/* 筛选器 + 重置按钮 */}
            {filters.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                    {filters.map((filter) => (
                        <div key={filter.key} className="min-w-[180px]">
                            <select
                                value={filterValues[filter.key] || ""}
                                onChange={(e) =>
                                    onFilterChange(
                                        filter.key,
                                        e.target.value || null,
                                    )
                                }
                                className="w-full px-3 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                            >
                                <option value="">{filter.label}（全部）</option>
                                {filter.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {/* 清除筛选按钮 */}
                    {hasActiveFilters && onReset && (
                        <button
                            onClick={onReset}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            清除筛选
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
