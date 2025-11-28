"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    CheckCircle,
    FolderTree,
    FileText,
    Settings,
    TrendingUp,
} from "lucide-react";

const navItems = [
    {
        icon: LayoutDashboard,
        label: "仪表盘",
        href: "/admin/dashboard",
    },
    {
        icon: Package,
        label: "工具管理",
        href: "/admin/tools",
    },
    {
        icon: CheckCircle,
        label: "提交审核",
        href: "/admin/submissions",
        badge: 0, // 待审核数量，后续从 API 获取
    },
    {
        icon: FolderTree,
        label: "分类管理",
        href: "/admin/categories",
    },
    {
        icon: FileText,
        label: "博客管理",
        href: "/admin/blog",
    },
    {
        icon: Settings,
        label: "网站设置",
        href: "/admin/settings",
    },
    {
        icon: TrendingUp,
        label: "置顶推广",
        href: "/admin/promotions",
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-col w-64 bg-light-bg-primary dark:bg-dark-bg-primary border-r border-light-border dark:border-dark-border">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-light-border dark:border-dark-border">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2"
                >
                    <span className="text-2xl">🧭</span>
                    <span className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        Toolsail
                    </span>
                </Link>
            </div>

            {/* 导航菜单 */}
            <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                  ${
                      isActive
                          ? "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary font-medium"
                          : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                  }
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>

                                {/* 待审核徽章 */}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-600 dark:bg-red-500 text-white text-xs font-semibold rounded-full">
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* 底部信息 */}
            <div className="p-4 border-t border-light-border dark:border-dark-border">
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    <p>Toolsail Admin v1.0</p>
                    <p className="mt-1">© 2025 All rights reserved</p>
                </div>
            </div>
        </aside>
    );
}
