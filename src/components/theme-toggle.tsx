"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Theme Toggle Component
 * Switches between light and dark mode
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
        </button>
    );
}
