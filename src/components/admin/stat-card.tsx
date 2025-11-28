import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        trend: "up" | "down";
        label?: string;
    };
    icon?: React.ReactNode;
    iconBgColor?: string;
}

export default function StatCard({
    title,
    value,
    change,
    icon,
    iconBgColor = "bg-light-bg-tertiary dark:bg-dark-bg-tertiary",
}: StatCardProps) {
    return (
        <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                        {value}
                    </p>

                    {/* 变化趋势 */}
                    {change && (
                        <div className="flex items-center gap-1">
                            {change.trend === "up" ? (
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            )}
                            <span
                                className={`text-sm font-medium ${
                                    change.trend === "up"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {change.value > 0 ? "+" : ""}
                                {change.value}%
                            </span>
                            {change.label && (
                                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary ml-1">
                                    {change.label}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* 图标 */}
                {icon && (
                    <div
                        className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center text-light-text-secondary dark:text-dark-text-secondary`}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
