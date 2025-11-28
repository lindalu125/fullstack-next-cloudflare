"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SearchInput({
    placeholder = "搜索...",
    value,
    onChange,
    className = "",
}: SearchInputProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </button>
            )}
        </div>
    );
}
