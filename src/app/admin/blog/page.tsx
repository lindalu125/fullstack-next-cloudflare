"use client";

import { useState } from "react";
import Link from "next/link";
import DataTable, {
    type ColumnDef,
    type DataTableAction,
} from "@/components/admin/data-table";
import FilterBar, { type FilterConfig } from "@/components/admin/filter-bar";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

// 博客数据类型
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    status: "draft" | "published";
    publishedAt: string | null;
    createdAt: string;
    views: number;
}

// Mock 数据
const mockPosts: BlogPost[] = [
    {
        id: "1",
        title: "AI工具评测：ChatGPT vs Claude",
        slug: "chatgpt-vs-claude",
        excerpt: "详细对比两款顶级AI对话工具...",
        category: "AI评测",
        author: "Admin",
        status: "published",
        publishedAt: "2025-01-20",
        createdAt: "2025-01-19",
        views: 1520,
    },
    {
        id: "2",
        title: "2025年最佳生产力工具推荐",
        slug: "best-productivity-tools-2025",
        excerpt: "盘点10款提升效率的必备工具...",
        category: "工具推荐",
        author: "Admin",
        status: "published",
        publishedAt: "2025-01-18",
        createdAt: "2025-01-17",
        views: 2340,
    },
    {
        id: "3",
        title: "如何选择适合自己的AI写作工具",
        slug: "how-to-choose-ai-writing-tool",
        excerpt: "选择AI写作工具的5个关键因素...",
        category: "教程",
        author: "Admin",
        status: "draft",
        publishedAt: null,
        createdAt: "2025-01-20",
        views: 0,
    },
];

export default function BlogPage() {
    const [searchValue, setSearchValue] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 筛选配置
    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "状态",
            type: "select",
            options: [
                { value: "published", label: "已发布" },
                { value: "draft", label: "草稿" },
            ],
        },
        {
            key: "category",
            label: "分类",
            type: "select",
            options: [
                { value: "ai-review", label: "AI评测" },
                { value: "tools", label: "工具推荐" },
                { value: "tutorial", label: "教程" },
            ],
        },
    ];

    // 表格列定义
    const columns: ColumnDef<BlogPost>[] = [
        {
            key: "title",
            label: "标题",
            sortable: true,
            render: (value, row) => (
                <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {value}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate max-w-md">
                        {row.excerpt}
                    </p>
                </div>
            ),
        },
        {
            key: "category",
            label: "分类",
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary">
                    {value}
                </span>
            ),
        },
        {
            key: "status",
            label: "状态",
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        value === "published"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    }`}
                >
                    {value === "published" ? "已发布" : "草稿"}
                </span>
            ),
        },
        {
            key: "views",
            label: "浏览量",
            align: "right",
            render: (value) => value.toLocaleString(),
        },
        {
            key: "publishedAt",
            label: "发布时间",
            sortable: true,
            render: (value) => value || "-",
        },
    ];

    // 表格操作
    const actions: DataTableAction<BlogPost>[] = [
        {
            label: "预览",
            icon: <Eye className="w-4 h-4" />,
            onClick: (row) => {
                window.open(`/blog/${row.slug}`, "_blank");
            },
        },
        {
            label: "编辑",
            icon: <Edit className="w-4 h-4" />,
            onClick: (row) => {
                // TODO: 导航到编辑页
                console.log("Edit", row);
            },
        },
        {
            label: "删除",
            icon: <Trash2 className="w-4 h-4" />,
            variant: "danger",
            onClick: (row) => {
                // TODO: 删除确认
                console.log("Delete", row);
            },
        },
    ];

    const handleFilterChange = (key: string, value: any) => {
        setFilterValues({ ...filterValues, [key]: value });
    };

    const handleReset = () => {
        setSearchValue("");
        setFilterValues({});
    };

    // 筛选数据
    const filteredData = mockPosts.filter((item) => {
        if (filterValues.status && item.status !== filterValues.status) {
            return false;
        }
        if (
            searchValue &&
            !item.title.toLowerCase().includes(searchValue.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                        博客管理
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        管理所有博客文章，支持 Markdown 编辑
                    </p>
                </div>

                <Link
                    href="/admin/blog/new"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    写新文章
                </Link>
            </div>

            {/* 筛选栏 */}
            <FilterBar
                searchPlaceholder="搜索文章标题..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />

            {/* 批量操作 */}
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                        已选中{" "}
                        <span className="font-semibold">
                            {selectedRows.length}
                        </span>{" "}
                        篇文章
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
                            批量发布
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                            批量删除
                        </button>
                    </div>
                </div>
            )}

            {/* 数据表格 */}
            <DataTable
                columns={columns}
                data={filteredData}
                isLoading={false}
                selectable={true}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                actions={actions}
                pagination={{
                    currentPage,
                    pageSize,
                    totalItems: filteredData.length,
                    totalPages: Math.ceil(filteredData.length / pageSize),
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                }}
                emptyState={{
                    title: "没有找到文章",
                    message: "暂时没有符合条件的文章",
                    action: {
                        label: "写新文章",
                        onClick: () => {
                            // TODO: 导航到新建页
                        },
                    },
                }}
            />
        </div>
    );
}
