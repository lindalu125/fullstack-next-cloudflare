"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Category } from "../page";

interface DeleteCategoryModalProps {
    category: Category;
    onClose: () => void;
    onConfirm: (id: string) => void;
}

export default function DeleteCategoryModal({
    category,
    onClose,
    onConfirm,
}: DeleteCategoryModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);

        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));

        onConfirm(category.id);
        setIsDeleting(false);
    };

    const hasTools = category.toolCount > 0;
    const hasChildren = category.children && category.children.length > 0;
    const canDelete = !hasTools && !hasChildren;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-2xl max-w-md w-full">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        删除分类
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>
                </div>

                {/* 内容 */}
                <div className="p-6 space-y-4">
                    {/* 警告图标 */}
                    <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>

                    {/* 提示文字 */}
                    <div className="text-center">
                        <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                            确定要删除「{category.name}」吗？
                        </p>

                        {canDelete ? (
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                此操作无法撤销，请谨慎操作
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {hasChildren && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        该分类包含 {category.children!.length}{" "}
                                        个子分类，无法删除
                                    </p>
                                )}
                                {hasTools && (
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        该分类下有 {category.toolCount}{" "}
                                        个工具，无法删除
                                    </p>
                                )}
                                <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                    请先删除或移动子分类和工具
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 分类信息 */}
                    <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                            {category.icon && (
                                <span className="text-2xl">
                                    {category.icon}
                                </span>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                    {category.name}
                                </p>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    {category.slug}
                                </p>
                            </div>
                            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                {category.toolCount} 个工具
                            </span>
                        </div>
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-light-border dark:border-dark-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!canDelete || isDeleting}
                        className="px-6 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isDeleting ? "删除中..." : "确定删除"}
                    </button>
                </div>
            </div>
        </div>
    );
}
