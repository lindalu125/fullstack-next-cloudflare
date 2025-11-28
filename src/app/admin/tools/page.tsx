"use client";

import { useState } from "react";
import Link from "next/link";
import DataTable, {
    type ColumnDef,
    type DataTableAction,
} from "@/components/admin/data-table";
import FilterBar, { type FilterConfig } from "@/components/admin/filter-bar";
import { Plus, Edit, Trash2, Upload, Star } from "lucide-react";

// Mock 数据类型
interface Tool {
    id: string;
    name: string;
    url: string;
    logoUrl: string;
    category: string;
    pricing: "Free" | "Freemium" | "Paid";
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
}

// Mock 数据
const mockTools: Tool[] = [
    {
        id: "1",
        name: "ChatGPT",
        url: "https://chat.openai.com",
        logoUrl: "https://via.placeholder.com/48",
        category: "AI 写作",
        pricing: "Freemium",
        isFeatured: true,
        isPublished: true,
        createdAt: "2025-01-15",
    },
    {
        id: "2",
        name: "Claude",
        url: "https://claude.ai",
        logoUrl: "https://via.placeholder.com/48",
        category: "AI 写作",
        pricing: "Paid",
        isFeatured: false,
        isPublished: true,
        createdAt: "2025-01-14",
    },
    {
        id: "3",
        name: "Notion",
        url: "https://notion.so",
        logoUrl: "https://via.placeholder.com/48",
        category: "生产力",
        pricing: "Freemium",
        isFeatured: true,
        isPublished: true,
        createdAt: "2025-01-13",
    },
];

export default function ToolsPage() {
    const [searchValue, setSearchValue] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 筛选配置
    const filters: FilterConfig[] = [
        {
            key: "category",
            label: "分类",
            type: "select",
            options: [
                { value: "ai-writing", label: "AI 写作" },
                { value: "ai-design", label: "AI 设计" },
                { value: "productivity", label: "生产力" },
            ],
        },
        {
            key: "pricing",
            label: "定价",
            type: "select",
            options: [
                { value: "free", label: "免费" },
                { value: "freemium", label: "Freemium" },
                { value: "paid", label: "付费" },
            ],
        },
        {
            key: "featured",
            label: "精选",
            type: "select",
            options: [
                { value: "true", label: "是" },
                { value: "false", label: "否" },
            ],
        },
        {
            key: "published",
            label: "状态",
            type: "select",
            options: [
                { value: "true", label: "已发布" },
                { value: "false", label: "草稿" },
            ],
        },
    ];

    // 表格列定义
    const columns: ColumnDef<Tool>[] = [
        {
            key: "logo",
            label: "Logo",
            width: "w-20",
            render: (_, row) => (
                <img
                    src={row.logoUrl}
                    alt={row.name}
                    className="w-10 h-10 rounded-lg object-cover"
                />
            ),
        },
        {
            key: "name",
            label: "名称",
            sortable: true,
            render: (value, row) => (
                <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                        {value}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate max-w-xs">
                        {row.url}
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
            key: "pricing",
            label: "定价",
            render: (value) => {
                const colors = {
                    Free: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
                    Freemium:
                        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
                    Paid: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
                };
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            colors[value as keyof typeof colors]
                        }`}
                    >
                        {value}
                    </span>
                );
            },
        },
        {
            key: "isFeatured",
            label: "精选",
            align: "center",
            render: (value) =>
                value ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                    <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                        -
                    </span>
                ),
        },
        {
            key: "isPublished",
            label: "状态",
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        value
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    }`}
                >
                    {value ? "已发布" : "草稿"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "创建时间",
            sortable: true,
        },
    ];

    // 表格操作
    const actions: DataTableAction<Tool>[] = [
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

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                        工具管理
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        管理所有工具，包括新建、编辑和删除操作
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/tools/batch-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        批量上传
                    </Link>

                    <Link
                        href="/admin/tools/new"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        添加工具
                    </Link>
                </div>
            </div>

            {/* 筛选栏 */}
            <FilterBar
                searchPlaceholder="搜索工具名称或描述..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />

            {/* 批量操作（选中时显示） */}
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border border-light-border dark:border-dark-border">
                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                        已选中{" "}
                        <span className="font-semibold">
                            {selectedRows.length}
                        </span>{" "}
                        项
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                            设置精选
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                            取消精选
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
                data={mockTools}
                isLoading={false}
                selectable={true}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                actions={actions}
                pagination={{
                    currentPage,
                    pageSize,
                    totalItems: mockTools.length,
                    totalPages: Math.ceil(mockTools.length / pageSize),
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                }}
                emptyState={{
                    title: "没有找到工具",
                    message: "暂时没有符合条件的工具，或者尝试清除筛选条件",
                    action: {
                        label: "添加新工具",
                        onClick: () => {
                            // TODO: 导航到新建页
                        },
                    },
                }}
            />
        </div>
    );
}
