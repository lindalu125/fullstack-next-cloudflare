"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("basic");
    const [isSaving, setIsSaving] = useState(false);

    const [basicSettings, setBasicSettings] = useState({
        siteTitleZh: "Toolsail",
        siteTitleEn: "Toolsail",
        siteDescription: "发现最好的AI和数字工具",
        contactEmail: "contact@toolsail.com",
    });

    const [seoSettings, setSeoSettings] = useState({
        metaDescription: "Toolsail - 发现最好的AI和数字工具",
        googleAnalyticsId: "",
        googleSearchConsoleCode: "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        // TODO: API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const tabs = [
        { id: "basic", label: "基本信息" },
        { id: "seo", label: "SEO 设置" },
        { id: "ads", label: "广告设置" },
        { id: "social", label: "社交媒体" },
        { id: "other", label: "其他设置" },
    ];

    return (
        <div className="space-y-6">
            {/* 页面头部 */}
            <div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    网站设置
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    管理网站的各项配置
                </p>
            </div>

            {/* 选项卡导航 */}
            <div className="border-b border-light-border dark:border-dark-border">
                <div className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? "border-light-text-primary dark:border-dark-text-primary text-light-text-primary dark:text-dark-text-primary"
                                    : "border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 设置表单 */}
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                {/* 基本信息 */}
                {activeTab === "basic" && (
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            基本信息
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                网站标题（中文）
                            </label>
                            <input
                                type="text"
                                value={basicSettings.siteTitleZh}
                                onChange={(e) =>
                                    setBasicSettings({
                                        ...basicSettings,
                                        siteTitleZh: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                网站标题（英文）
                            </label>
                            <input
                                type="text"
                                value={basicSettings.siteTitleEn}
                                onChange={(e) =>
                                    setBasicSettings({
                                        ...basicSettings,
                                        siteTitleEn: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                网站描述
                            </label>
                            <textarea
                                value={basicSettings.siteDescription}
                                onChange={(e) =>
                                    setBasicSettings({
                                        ...basicSettings,
                                        siteDescription: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                联系邮箱
                            </label>
                            <input
                                type="email"
                                value={basicSettings.contactEmail}
                                onChange={(e) =>
                                    setBasicSettings({
                                        ...basicSettings,
                                        contactEmail: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>
                    </div>
                )}

                {/* SEO 设置 */}
                {activeTab === "seo" && (
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            SEO 设置
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                Meta 描述
                            </label>
                            <textarea
                                value={seoSettings.metaDescription}
                                onChange={(e) =>
                                    setSeoSettings({
                                        ...seoSettings,
                                        metaDescription: e.target.value,
                                    })
                                }
                                rows={3}
                                maxLength={160}
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                            />
                            <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary text-right">
                                {seoSettings.metaDescription.length}/160
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                Google Analytics ID
                            </label>
                            <input
                                type="text"
                                value={seoSettings.googleAnalyticsId}
                                onChange={(e) =>
                                    setSeoSettings({
                                        ...seoSettings,
                                        googleAnalyticsId: e.target.value,
                                    })
                                }
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            />
                        </div>
                    </div>
                )}

                {/* 其他标签页占位符 */}
                {(activeTab === "ads" ||
                    activeTab === "social" ||
                    activeTab === "other") && (
                    <div className="text-center py-12">
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            {activeTab === "ads" && "广告设置"}
                            {activeTab === "social" && "社交媒体设置"}
                            {activeTab === "other" && "其他设置"}
                        </p>
                        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
                            配置项暂未实现，可根据需求添加
                        </p>
                    </div>
                )}
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "保存中..." : "保存设置"}
                </button>
            </div>
        </div>
    );
}
