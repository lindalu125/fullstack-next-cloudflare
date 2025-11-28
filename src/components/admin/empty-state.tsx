"use client";

import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({
    title = "没有数据",
    message = "暂时没有符合条件的数据",
    icon,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {/* 图标 */}
            <div className="w-16 h-16 mb-4 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary flex items-center justify-center">
                {icon || (
                    <Inbox className="w-8 h-8 text-light-text-tertiary dark:text-dark-text-tertiary" />
                )}
            </div>

            {/* 标题 */}
            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                {title}
            </h3>

            {/* 消息 */}
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center max-w-md mb-6">
                {message}
            </p>

            {/* 操作按钮 */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
