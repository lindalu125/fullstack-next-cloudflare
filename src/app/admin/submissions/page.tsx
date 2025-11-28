"use client";

import { useState } from "react";
import DataTable, {
    type ColumnDef,
    type DataTableAction,
} from "@/components/admin/data-table";
import FilterBar, { type FilterConfig } from "@/components/admin/filter-bar";
import SubmissionDetailModal from "./_components/submission-detail-modal";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";

// 提交数据类型
interface Submission {
    id: string;
    toolName: string;
    submitterName: string;
    submitterEmail: string;
    category: string;
    pricing: string;
    status: "pending" | "approved" | "rejected" | "changes_requested";
    submittedAt: string;
    logoUrl: string;
    url: string;
    description: string;
}

// Mock 数据
const mockSubmissions: Submission[] = [
    {
        id: "1",
        toolName: "AI Image Generator",
        submitterName: "John Doe",
        submitterEmail: "john@example.com",
        category: "AI 设计",
        pricing: "Freemium",
        status: "pending",
        submittedAt: "2025-01-20 14:30",
        logoUrl: "https://via.placeholder.com/48",
        url: "https://example.com",
        description: "AI 图像生成工具，支持文生图...",
    },
    {
        id: "2",
        toolName: "Code Assistant",
        submitterName: "Jane Smith",
        submitterEmail: "jane@example.com",
        category: "AI 编程",
        pricing: "Paid",
        status: "pending",
        submittedAt: "2025-01-20 12:15",
        logoUrl: "https://via.placeholder.com/48",
        url: "https://example.com",
        description: "AI 代码助手，智能补全...",
    },
    {
        id: "3",
        toolName: "Task Manager Pro",
        submitterName: "Mike Johnson",
        submitterEmail: "mike@example.com",
        category: "生产力",
        pricing: "Free",
        status: "approved",
        submittedAt: "2025-01-19 16:45",
        logoUrl: "https://via.placeholder.com/48",
        url: "https://example.com",
        description: "任务管理工具...",
    },
];

export default function SubmissionsPage() {
    const [searchValue, setSearchValue] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        status: null,
    });
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedSubmission, setSelectedSubmission] =
        useState<Submission | null>(null);

    // 筛选配置
    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "状态",
            type: "select",
            options: [
                { value: "pending", label: "待审核" },
                { value: "approved", label: "已通过" },
                { value: "rejected", label: "已拒绝" },
                { value: "changes_requested", label: "要求修改" },
            ],
        },
    ];

    // 状态徽章渲染
    const renderStatusBadge = (status: Submission["status"]) => {
        const statusConfig = {
            pending: {
                label: "待审核",
                className:
                    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
                icon: <Clock className="w-3 h-3" />,
            },
            approved: {
                label: "已通过",
                className:
                    "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
                icon: <CheckCircle className="w-3 h-3" />,
            },
            rejected: {
                label: "已拒绝",
                className:
                    "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
                icon: <XCircle className="w-3 h-3" />,
            },
            changes_requested: {
                label: "要求修改",
                className:
                    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
                icon: <Clock className="w-3 h-3" />,
            },
        };

        const config = statusConfig[status];
        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium ${config.className}`}
            >
                {config.icon}
                {config.label}
            </span>
        );
    };

    // 表格列定义
    const columns: ColumnDef<Submission>[] = [
        {
            key: "toolName",
            label: "工具名称",
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
            key: "submitterName",
            label: "提交者",
            render: (value, row) => (
                <div>
                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                        {value}
                    </p>
                    <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        {row.submitterEmail}
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
        },
        {
            key: "status",
            label: "状态",
            render: (value) => renderStatusBadge(value as Submission["status"]),
        },
        {
            key: "submittedAt",
            label: "提交时间",
            sortable: true,
        },
    ];

    // 表格操作
    const actions: DataTableAction<Submission>[] = [
        {
            label: "查看",
            icon: <Eye className="w-4 h-4" />,
            onClick: (row) => setSelectedSubmission(row),
        },
    ];

    const handleFilterChange = (key: string, value: any) => {
        setFilterValues({ ...filterValues, [key]: value });
    };

    const handleReset = () => {
        setSearchValue("");
        setFilterValues({ status: null });
    };

    const handleApprove = (id: string) => {
        console.log("Approve submission:", id);
        // TODO: API 调用
        setSelectedSubmission(null);
    };

    const handleReject = (id: string, reason: string) => {
        console.log("Reject submission:", id, reason);
        // TODO: API 调用
        setSelectedSubmission(null);
    };

    const handleRequestChanges = (id: string, feedback: string) => {
        console.log("Request changes:", id, feedback);
        // TODO: API 调用
        setSelectedSubmission(null);
    };

    // 筛选数据
    const filteredData = mockSubmissions.filter((item) => {
        if (filterValues.status && item.status !== filterValues.status) {
            return false;
        }
        if (
            searchValue &&
            !item.toolName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    // 统计数量
    const statusCounts = {
        all: mockSubmissions.length,
        pending: mockSubmissions.filter((s) => s.status === "pending").length,
        approved: mockSubmissions.filter((s) => s.status === "approved").length,
        rejected: mockSubmissions.filter((s) => s.status === "rejected").length,
    };

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    提交审核
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    审核用户提交的工具，通过、拒绝或要求修改
                </p>
            </div>

            {/* 状态统计标签 */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => handleFilterChange("status", null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !filterValues.status
                            ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary"
                            : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    }`}
                >
                    全部 ({statusCounts.all})
                </button>
                <button
                    onClick={() => handleFilterChange("status", "pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterValues.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    }`}
                >
                    待审核 ({statusCounts.pending})
                </button>
                <button
                    onClick={() => handleFilterChange("status", "approved")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterValues.status === "approved"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    }`}
                >
                    已通过 ({statusCounts.approved})
                </button>
                <button
                    onClick={() => handleFilterChange("status", "rejected")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterValues.status === "rejected"
                            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                    }`}
                >
                    已拒绝 ({statusCounts.rejected})
                </button>
            </div>

            {/* 搜索栏 */}
            <FilterBar
                searchPlaceholder="搜索工具名称..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={[]}
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
                        项
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
                            批量通过
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                            批量拒绝
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
                    title: "没有找到提交",
                    message: "暂时没有符合条件的提交记录",
                }}
            />

            {/* 审核详情弹窗 */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestChanges={handleRequestChanges}
                />
            )}
        </div>
    );
}
