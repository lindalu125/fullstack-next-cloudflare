"use client";

import { useState } from "react";
import DataTable, { type ColumnDef } from "@/components/admin/data-table";
import FilterBar, { type FilterConfig } from "@/components/admin/filter-bar";

// 推广订单类型
interface PromotionOrder {
    id: string;
    toolName: string;
    customerEmail: string;
    duration: "1-week" | "1-month" | "3-months";
    priceUSD: number;
    status: "pending" | "paid" | "expired";
    startDate: string;
    endDate: string;
    createdAt: string;
}

// Mock 数据
const mockOrders: PromotionOrder[] = [
    {
        id: "1",
        toolName: "ChatGPT",
        customerEmail: "john@example.com",
        duration: "1-month",
        priceUSD: 99,
        status: "paid",
        startDate: "2025-01-01",
        endDate: "2025-02-01",
        createdAt: "2024-12-28",
    },
    {
        id: "2",
        toolName: "Notion",
        customerEmail: "jane@example.com",
        duration: "3-months",
        priceUSD: 249,
        status: "paid",
        startDate: "2025-01-15",
        endDate: "2025-04-15",
        createdAt: "2025-01-10",
    },
    {
        id: "3",
        toolName: "Figma",
        customerEmail: "mike@example.com",
        duration: "1-week",
        priceUSD: 29,
        status: "pending",
        startDate: "2025-01-22",
        endDate: "2025-01-29",
        createdAt: "2025-01-20",
    },
];

export default function PromotionsPage() {
    const [searchValue, setSearchValue] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 筛选配置
    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "状态",
            type: "select",
            options: [
                { value: "pending", label: "待支付" },
                { value: "paid", label: "已支付" },
                { value: "expired", label: "已过期" },
            ],
        },
    ];

    // 表格列定义
    const columns: ColumnDef<PromotionOrder>[] = [
        {
            key: "toolName",
            label: "工具名称",
            render: (value) => (
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {value}
                </p>
            ),
        },
        {
            key: "customerEmail",
            label: "客户邮箱",
            render: (value) => (
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {value}
                </p>
            ),
        },
        {
            key: "duration",
            label: "时长",
            render: (value) => {
                const labels = {
                    "1-week": "1周",
                    "1-month": "1个月",
                    "3-months": "3个月",
                };
                return labels[value as keyof typeof labels];
            },
        },
        {
            key: "priceUSD",
            label: "金额",
            align: "right",
            render: (value) => `$${value}`,
        },
        {
            key: "status",
            label: "状态",
            render: (value) => {
                const statusConfig = {
                    pending: {
                        label: "待支付",
                        className:
                            "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
                    },
                    paid: {
                        label: "已支付",
                        className:
                            "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
                    },
                    expired: {
                        label: "已过期",
                        className:
                            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
                    },
                };
                const config = statusConfig[value as keyof typeof statusConfig];
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${config.className}`}
                    >
                        {config.label}
                    </span>
                );
            },
        },
        {
            key: "startDate",
            label: "开始日期",
        },
        {
            key: "endDate",
            label: "结束日期",
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
            <div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    置顶推广
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    管理工具置顶推广订单
                </p>
            </div>

            {/* 筛选栏 */}
            <FilterBar
                searchPlaceholder="搜索工具名称或客户邮箱..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
            />

            {/* 数据表格 */}
            <DataTable
                columns={columns}
                data={mockOrders}
                isLoading={false}
                pagination={{
                    currentPage,
                    pageSize,
                    totalItems: mockOrders.length,
                    totalPages: Math.ceil(mockOrders.length / pageSize),
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                }}
                emptyState={{
                    title: "没有订单",
                    message: "暂时没有推广订单记录",
                }}
            />
        </div>
    );
}
