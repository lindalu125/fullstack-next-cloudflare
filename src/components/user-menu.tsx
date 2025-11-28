"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    ChevronDown,
} from "lucide-react";

export function UserMenu() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/";
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary flex items-center justify-center text-sm font-semibold">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(user.name || "U")
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-lg py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                            {user.name}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                            {user.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-light-border dark:border-dark-border pt-2">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
