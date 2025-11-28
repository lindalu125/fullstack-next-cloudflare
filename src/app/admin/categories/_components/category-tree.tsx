"use client";

import { useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    Edit,
    Trash2,
    FolderTree,
} from "lucide-react";
import type { Category } from "../page";

interface CategoryTreeProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

interface CategoryNodeProps {
    category: Category;
    level: number;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

function CategoryNode({
    category,
    level,
    onEdit,
    onDelete,
}: CategoryNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div>
            {/* 分类节点 */}
            <div
                className={`flex items-center gap-2 p-3 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors group ${
                    level > 0 ? "ml-8" : ""
                }`}
            >
                {/* 展开/收起按钮 */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-1 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors ${
                        !hasChildren ? "invisible" : ""
                    }`}
                >
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    )}
                </button>

                {/* 图标 */}
                <div className="w-8 h-8 flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                    {category.icon ? (
                        <span className="text-lg">{category.icon}</span>
                    ) : (
                        <FolderTree className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    )}
                </div>

                {/* 分类信息 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                            {category.name}
                        </p>
                        <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            ({category.slug})
                        </span>
                    </div>
                    {category.description && (
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* 工具数量 */}
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary rounded-md">
                        {category.toolCount} 个工具
                    </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1.5 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                        title="编辑"
                    >
                        <Edit className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="删除"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                </div>
            </div>

            {/* 子分类 */}
            {hasChildren && isExpanded && (
                <div className="mt-1">
                    {category.children!.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CategoryTree({
    categories,
    onEdit,
    onDelete,
}: CategoryTreeProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <FolderTree className="w-12 h-12 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    暂无分类，点击右上角添加分类
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {categories.map((category) => (
                <CategoryNode
                    key={category.id}
                    category={category}
                    level={0}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
