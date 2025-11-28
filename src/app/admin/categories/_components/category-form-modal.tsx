"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Category } from "../page";

interface CategoryFormModalProps {
    mode: "create" | "edit";
    category?: Category;
    allCategories: Category[];
    onClose: () => void;
    onSave: (data: Partial<Category>) => void;
}

export default function CategoryFormModal({
    mode,
    category,
    allCategories,
    onClose,
    onSave,
}: CategoryFormModalProps) {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        slug: category?.slug || "",
        icon: category?.icon || "",
        description: category?.description || "",
        parentId: category?.parentId || "",
        displayOrder: category?.displayOrder || 1,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });

        // 自动生成 slug
        if (field === "name") {
            const slug = (value as string)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            setFormData({ ...formData, name: value as string, slug });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));

        onSave({
            ...formData,
            parentId: formData.parentId || null,
        });

        setIsSaving(false);
    };

    // 获取可选的父分类（扁平化，排除自己和自己的子级）
    const flattenCategories = (
        cats: Category[],
        parentId: string | null = null,
    ): Array<{ id: string; name: string; level: number }> => {
        const result: Array<{ id: string; name: string; level: number }> = [];

        cats.forEach((cat) => {
            // 排除正在编辑的分类本身
            if (mode === "edit" && cat.id === category?.id) {
                return;
            }

            result.push({
                id: cat.id,
                name: cat.name,
                level: parentId ? 1 : 0,
            });

            if (cat.children) {
                cat.children.forEach((child) => {
                    // 排除正在编辑的分类本身
                    if (mode === "edit" && child.id === category?.id) {
                        return;
                    }
                    result.push({
                        id: child.id,
                        name: `${cat.name} > ${child.name}`,
                        level: 2,
                    });
                });
            }
        });

        return result;
    };

    const parentOptions = flattenCategories(allCategories);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {mode === "create" ? "添加分类" : "编辑分类"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>
                </div>

                {/* 表单 */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6"
                >
                    <div className="space-y-4">
                        {/* 分类名称 */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                分类名称{" "}
                                <span className="text-red-600 dark:text-red-400">
                                    *
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                placeholder="例：AI 写作"
                                required
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                URL Slug{" "}
                                <span className="text-red-600 dark:text-red-400">
                                    *
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) =>
                                    handleChange("slug", e.target.value)
                                }
                                placeholder="ai-writing"
                                required
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                            <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                自动从名称生成，可手动修改
                            </p>
                        </div>

                        {/* 图标 */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                图标（Emoji）
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) =>
                                    handleChange("icon", e.target.value)
                                }
                                placeholder="✍️"
                                maxLength={2}
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>

                        {/* 描述 */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                描述
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                placeholder="分类描述..."
                                rows={3}
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                            />
                        </div>

                        {/* 父分类 */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                父分类（可选）
                            </label>
                            <select
                                value={formData.parentId}
                                onChange={(e) =>
                                    handleChange("parentId", e.target.value)
                                }
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            >
                                <option value="">无（作为主分类）</option>
                                {parentOptions.map((opt) => (
                                    <option
                                        key={opt.id}
                                        value={opt.id}
                                        disabled={opt.level >= 2}
                                    >
                                        {opt.level > 0
                                            ? "　".repeat(opt.level)
                                            : ""}
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                最多支持 2 级分类
                            </p>
                        </div>

                        {/* 显示顺序 */}
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                显示顺序
                            </label>
                            <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) =>
                                    handleChange(
                                        "displayOrder",
                                        parseInt(e.target.value),
                                    )
                                }
                                min={1}
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                            <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                数字越小越靠前
                            </p>
                        </div>
                    </div>
                </form>

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
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-6 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSaving ? "保存中..." : "保存"}
                    </button>
                </div>
            </div>
        </div>
    );
}
