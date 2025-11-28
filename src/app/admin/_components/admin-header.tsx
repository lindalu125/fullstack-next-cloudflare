"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Bell, Menu, User, LogOut, Settings } from "lucide-react";
import { authClient } from "@/hooks/useAuth";

interface AdminHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
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
        <header className="h-16 bg-light-bg-primary dark:bg-dark-bg-primary border-b border-light-border dark:border-dark-border">
            <div className="h-full flex items-center justify-between px-6">
                {/* 左侧：移动端菜单按钮 */}
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>

                    <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary hidden md:block">
                        后台管理
                    </h1>
                </div>

                {/* 中间：搜索框（可选） */}
                <div className="flex-1 max-w-md mx-4 hidden lg:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        <input
                            type="text"
                            placeholder="搜索工具、用户、文章..."
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                        />
                    </div>
                </div>

                {/* 右侧：通知、主题切换、用户菜单 */}
                <div className="flex items-center gap-2">
                    {/* 通知按钮 */}
                    <button
                        className="relative p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                        {/* 待审核数量徽章 */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full"></span>
                    </button>

                    {/* 主题切换 */}
                    <ThemeToggle />

                    {/* 用户菜单 */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        >
                            {/* 用户头像 */}
                            <div className="w-8 h-8 rounded-full bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary flex items-center justify-center text-sm font-semibold">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name || "User"}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    getInitials(user.name || "Admin")
                                )}
                            </div>

                            <span className="hidden md:block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                {user.name || "Admin"}
                            </span>
                        </button>

                        {/* 下拉菜单 */}
                        {userMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg shadow-lg py-2 z-50">
                                {/* 用户信息 */}
                                <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                                        {user.email}
                                    </p>
                                </div>

                                {/* 菜单项 */}
                                <div className="py-2">
                                    <button
                                        onClick={() =>
                                            router.push("/dashboard")
                                        }
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        用户中心
                                    </button>

                                    <button
                                        onClick={() =>
                                            router.push("/dashboard/settings")
                                        }
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        账户设置
                                    </button>
                                </div>

                                {/* 登出 */}
                                <div className="border-t border-light-border dark:border-dark-border pt-2">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        登出
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
