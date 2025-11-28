"use client";

import { useState } from "react";
import TablePagination from "./table-pagination";
import EmptyState from "./empty-state";
import { ChevronsUpDown } from "lucide-react";

export interface ColumnDef<T = any> {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
    align?: "left" | "center" | "right";
}

export interface DataTableAction<T = any> {
    label: string;
    onClick: (row: T) => void;
    icon?: React.ReactNode;
    variant?: "default" | "danger";
}

interface DataTableProps<T = any> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    selectable?: boolean;
    selectedRows?: string[];
    onSelectedRowsChange?: (ids: string[]) => void;
    actions?: DataTableAction<T>[];
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        onPageSizeChange?: (size: number) => void;
    };
    emptyState?: {
        title?: string;
        message?: string;
        action?: {
            label: string;
            onClick: () => void;
        };
    };
}

export default function DataTable<T extends { id: string }>({
    columns,
    data,
    isLoading = false,
    selectable = false,
    selectedRows = [],
    onSelectedRowsChange,
    actions,
    pagination,
    emptyState,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectedRowsChange?.(data.map((row) => row.id));
        } else {
            onSelectedRowsChange?.([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            onSelectedRowsChange?.([...selectedRows, id]);
        } else {
            onSelectedRowsChange?.(
                selectedRows.filter((rowId) => rowId !== id),
            );
        }
    };

    const allSelected = data.length > 0 && selectedRows.length === data.length;
    const someSelected =
        selectedRows.length > 0 && selectedRows.length < data.length;

    return (
        <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    {/* 表头 */}
                    <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
                        <tr>
                            {/* 全选 Checkbox */}
                            {selectable && (
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el)
                                                el.indeterminate = someSelected;
                                        }}
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-light-border dark:border-dark-border"
                                    />
                                </th>
                            )}

                            {/* 列标题 */}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left font-semibold text-light-text-primary dark:text-dark-text-primary ${col.width || ""}`}
                                >
                                    {col.sortable ? (
                                        <button
                                            onClick={() => handleSort(col.key)}
                                            className="flex items-center gap-2 hover:text-light-text-secondary dark:hover:text-dark-text-secondary transition-colors"
                                        >
                                            {col.label}
                                            <ChevronsUpDown className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            ))}

                            {/* 操作列 */}
                            {actions && actions.length > 0 && (
                                <th className="px-4 py-3 text-right font-semibold text-light-text-primary dark:text-dark-text-primary">
                                    操作
                                </th>
                            )}
                        </tr>
                    </thead>

                    {/* 表体 */}
                    <tbody>
                        {isLoading ? (
                            // 加载骨架屏
                            [...Array(5)].map((_, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-light-border dark:border-dark-border"
                                >
                                    <td
                                        colSpan={
                                            columns.length +
                                            (selectable ? 1 : 0) +
                                            (actions && actions.length > 0
                                                ? 1
                                                : 0)
                                        }
                                        className="px-4 py-3"
                                    >
                                        <div className="h-8 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            // 空状态
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (selectable ? 1 : 0) +
                                        (actions && actions.length > 0 ? 1 : 0)
                                    }
                                >
                                    <EmptyState {...emptyState} />
                                </td>
                            </tr>
                        ) : (
                            // 数据行
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    className={`border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors ${
                                        selectedRows.includes(row.id)
                                            ? "bg-light-bg-secondary dark:bg-dark-bg-secondary"
                                            : ""
                                    }`}
                                >
                                    {/* 行选择 Checkbox */}
                                    {selectable && (
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(
                                                    row.id,
                                                )}
                                                onChange={(e) =>
                                                    handleSelectRow(
                                                        row.id,
                                                        e.target.checked,
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-light-border dark:border-dark-border"
                                            />
                                        </td>
                                    )}

                                    {/* 数据列 */}
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-3 ${
                                                col.align === "center"
                                                    ? "text-center"
                                                    : col.align === "right"
                                                      ? "text-right"
                                                      : ""
                                            }`}
                                        >
                                            {col.render
                                                ? col.render(
                                                      (row as any)[col.key],
                                                      row,
                                                  )
                                                : (row as any)[col.key]}
                                        </td>
                                    ))}

                                    {/* 操作按钮 */}
                                    {actions && actions.length > 0 && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                {actions.map(
                                                    (action, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                action.onClick(
                                                                    row,
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                                                action.variant ===
                                                                "danger"
                                                                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                                                    : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                                                            }`}
                                                        >
                                                            {action.icon}
                                                            {action.label}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 分页 */}
            {pagination && !isLoading && data.length > 0 && (
                <TablePagination {...pagination} />
            )}
        </div>
    );
}
