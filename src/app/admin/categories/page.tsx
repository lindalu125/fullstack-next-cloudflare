"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CategoryTree from "./_components/category-tree";
import CategoryFormModal from "./_components/category-form-modal";
import DeleteCategoryModal from "./_components/delete-category-modal";

// 分类数据类型
export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    parentId: string | null;
    toolCount: number;
    displayOrder: number;
    children?: Category[];
}

// Mock 数据
const mockCategories: Category[] = [
    {
        id: "1",
        name: "AI Tools",
        slug: "ai-tools",
        icon: "🤖",
        description: "AI 相关工具",
        parentId: null,
        toolCount: 156,
        displayOrder: 1,
        children: [
            {
                id: "2",
                name: "AI 写作",
                slug: "ai-writing",
                icon: "✍️",
                description: "AI 写作工具",
                parentId: "1",
                toolCount: 45,
                displayOrder: 1,
            },
            {
                id: "3",
                name: "AI 设计",
                slug: "ai-design",
                icon: "🎨",
                description: "AI 设计工具",
                parentId: "1",
                toolCount: 38,
                displayOrder: 2,
            },
            {
                id: "4",
                name: "AI 编程",
                slug: "ai-coding",
                icon: "💻",
                description: "AI 编程工具",
                parentId: "1",
                toolCount: 73,
                displayOrder: 3,
            },
        ],
    },
    {
        id: "5",
        name: "Digital Tools",
        slug: "digital-tools",
        icon: "🛠️",
        description: "数字工具",
        parentId: null,
        toolCount: 89,
        displayOrder: 2,
        children: [
            {
                id: "6",
                name: "生产力",
                slug: "productivity",
                icon: "📊",
                description: "生产力工具",
                parentId: "5",
                toolCount: 42,
                displayOrder: 1,
            },
            {
                id: "7",
                name: "设计工具",
                slug: "design-tools",
                icon: "🖌️",
                description: "设计类工具",
                parentId: "5",
                toolCount: 27,
                displayOrder: 2,
            },
            {
                id: "8",
                name: "开发工具",
                slug: "dev-tools",
                icon: "⚙️",
                description: "开发者工具",
                parentId: "5",
                toolCount: 20,
                displayOrder: 3,
            },
        ],
    },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(
        null,
    );

    const handleAdd = () => {
        setShowAddModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
    };

    const handleDelete = (category: Category) => {
        setDeletingCategory(category);
    };

    const handleSaveCategory = (data: Partial<Category>) => {
        console.log("Save category:", data);
        // TODO: API 调用
        setShowAddModal(false);
        setEditingCategory(null);
    };

    const handleConfirmDelete = (id: string) => {
        console.log("Delete category:", id);
        // TODO: API 调用
        setDeletingCategory(null);
    };

    const totalCategories = categories.reduce(
        (sum, cat) => sum + 1 + (cat.children?.length || 0),
        0,
    );
    const totalTools = categories.reduce((sum, cat) => sum + cat.toolCount, 0);

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                        分类管理
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        管理工具分类，支持多级分类结构
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    添加分类
                </button>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-4">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        总分类数
                    </p>
                    <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {totalCategories}
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-4">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        主分类
                    </p>
                    <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {categories.length}
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-4">
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        工具总数
                    </p>
                    <p className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {totalTools}
                    </p>
                </div>
            </div>

            {/* 分类树 */}
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border">
                <div className="p-4 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                        分类结构
                    </h2>
                </div>

                <div className="p-4">
                    <CategoryTree
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* 添加分类弹窗 */}
            {showAddModal && (
                <CategoryFormModal
                    mode="create"
                    allCategories={categories}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSaveCategory}
                />
            )}

            {/* 编辑分类弹窗 */}
            {editingCategory && (
                <CategoryFormModal
                    mode="edit"
                    category={editingCategory}
                    allCategories={categories}
                    onClose={() => setEditingCategory(null)}
                    onSave={handleSaveCategory}
                />
            )}

            {/* 删除确认弹窗 */}
            {deletingCategory && (
                <DeleteCategoryModal
                    category={deletingCategory}
                    onClose={() => setDeletingCategory(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
