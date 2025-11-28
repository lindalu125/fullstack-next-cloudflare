"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

interface ToolFormData {
    name: string;
    url: string;
    logoUrl: string;
    description: string;
    categoryId: string;
    pricing: "Free" | "Freemium" | "Paid";
    pricingDetails?: string;
    isFeatured: boolean;
    isPublished: boolean;
}

interface ToolFormProps {
    initialData?: Partial<ToolFormData>;
    mode: "create" | "edit";
    toolId?: string;
}

export default function ToolForm({ initialData, mode, toolId }: ToolFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<ToolFormData>({
        name: initialData?.name || "",
        url: initialData?.url || "",
        logoUrl: initialData?.logoUrl || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || "",
        pricing: initialData?.pricing || "Free",
        pricingDetails: initialData?.pricingDetails || "",
        isFeatured: initialData?.isFeatured || false,
        isPublished: initialData?.isPublished || false,
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (
        field: keyof ToolFormData,
        value: string | boolean,
    ) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (
        e: React.FormEvent,
        continueEditing = false,
    ) => {
        e.preventDefault();
        setIsSaving(true);

        // TODO: API 调用
        console.log("Submit", formData);

        setTimeout(() => {
            setIsSaving(false);
            if (!continueEditing) {
                router.push("/admin/tools");
            }
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* 头部 */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/tools"
                    className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {mode === "create" ? "添加新工具" : "编辑工具"}
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        填写工具的详细信息
                    </p>
                </div>
            </div>

            {/* 表单 */}
            <form
                onSubmit={(e) => handleSubmit(e, false)}
                className="max-w-4xl"
            >
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6 space-y-6">
                    {/* 基本信息 */}
                    <div>
                        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            基本信息
                        </h2>
                        <div className="space-y-4">
                            {/* 工具名称 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    工具名称{" "}
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
                                    placeholder="例：ChatGPT"
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                />
                            </div>

                            {/* 工具网址 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    工具网址{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) =>
                                        handleChange("url", e.target.value)
                                    }
                                    placeholder="https://chat.openai.com"
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                />
                            </div>

                            {/* Logo 地址 + 预览 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    Logo 地址{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        *
                                    </span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <input
                                            type="url"
                                            value={formData.logoUrl}
                                            onChange={(e) =>
                                                handleChange(
                                                    "logoUrl",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://..."
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-md">
                                        {formData.logoUrl ? (
                                            <img
                                                src={formData.logoUrl}
                                                alt="Logo 预览"
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                                Logo 预览
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 工具描述 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    工具描述{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        *
                                    </span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        handleChange(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="描述工具的主要功能和特点..."
                                    required
                                    rows={5}
                                    className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                                />
                                <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                    支持 Markdown 格式
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 分类和定价 */}
                    <div className="pt-6 border-t border-light-border dark:border-dark-border">
                        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            分类和定价
                        </h2>
                        <div className="space-y-4">
                            {/* 分类 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    分类{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        *
                                    </span>
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) =>
                                        handleChange(
                                            "categoryId",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                >
                                    <option value="">选择分类...</option>
                                    <option value="ai-writing">AI 写作</option>
                                    <option value="ai-design">AI 设计</option>
                                    <option value="ai-coding">AI 编程</option>
                                    <option value="productivity">生产力</option>
                                </select>
                            </div>

                            {/* 定价类型 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                                    定价类型{" "}
                                    <span className="text-red-600 dark:text-red-400">
                                        *
                                    </span>
                                </label>
                                <div className="flex gap-4">
                                    {(
                                        ["Free", "Freemium", "Paid"] as const
                                    ).map((type) => (
                                        <label
                                            key={type}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="pricing"
                                                value={type}
                                                checked={
                                                    formData.pricing === type
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        "pricing",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 定价详情 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                    定价详情（可选）
                                </label>
                                <textarea
                                    value={formData.pricingDetails}
                                    onChange={(e) =>
                                        handleChange(
                                            "pricingDetails",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Free: 基础功能
Pro: $20/月，完整功能"
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 发布设置 */}
                    <div className="pt-6 border-t border-light-border dark:border-dark-border">
                        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            发布设置
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) =>
                                        handleChange(
                                            "isFeatured",
                                            e.target.checked,
                                        )
                                    }
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    是否精选推荐
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) =>
                                        handleChange(
                                            "isPublished",
                                            e.target.checked,
                                        )
                                    }
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    是否发布
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 底部操作按钮 */}
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/tools")}
                        className="px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                    >
                        取消
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? "保存中..." : "保存并继续编辑"}
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSaving ? "保存中..." : "保存"}
                    </button>
                </div>
            </form>
        </div>
    );
}
