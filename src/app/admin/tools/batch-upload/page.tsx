"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";

type Step = 1 | 2 | 3;

export default function BatchUploadPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [uploadResult, setUploadResult] = useState<{
        success: number;
        failed: number;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // TODO: 解析 CSV 文件
            // Mock 预览数据
            setPreviewData([
                {
                    name: "ChatGPT",
                    category: "AI 写作",
                    pricing: "Freemium",
                    description: "AI 对话助手",
                },
                {
                    name: "Claude",
                    category: "AI 写作",
                    pricing: "Paid",
                    description: "Claude AI 助手",
                },
                {
                    name: "Notion",
                    category: "生产力",
                    pricing: "Freemium",
                    description: "笔记工具",
                },
            ]);
        }
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((currentStep + 1) as Step);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step);
        }
    };

    const handleImport = () => {
        // TODO: API 调用批量导入
        setTimeout(() => {
            setUploadResult({ success: 3, failed: 0 });
            setCurrentStep(3);
        }, 1500);
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
                        批量上传工具
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        通过 CSV 文件批量添加工具
                    </p>
                </div>
            </div>

            {/* 步骤指示器 */}
            <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                                currentStep === step
                                    ? "border-light-text-primary dark:border-dark-text-primary bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary"
                                    : currentStep > step
                                      ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400 text-white"
                                      : "border-light-border dark:border-dark-border text-light-text-tertiary dark:text-dark-text-tertiary"
                            }`}
                        >
                            {currentStep > step ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                step
                            )}
                        </div>
                        <div className="ml-3 mr-6">
                            <p
                                className={`text-sm font-medium ${
                                    currentStep >= step
                                        ? "text-light-text-primary dark:text-dark-text-primary"
                                        : "text-light-text-tertiary dark:text-dark-text-tertiary"
                                }`}
                            >
                                {step === 1
                                    ? "选择文件"
                                    : step === 2
                                      ? "预览数据"
                                      : "导入完成"}
                            </p>
                        </div>
                        {step < 3 && (
                            <div
                                className={`w-16 h-0.5 ${
                                    currentStep > step
                                        ? "bg-green-600 dark:bg-green-400"
                                        : "bg-light-border dark:border-dark-border"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* 内容区 */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8">
                    {/* Step 1: 选择文件 */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    Step 1: 选择 CSV 文件
                                </h2>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    上传包含工具信息的 CSV 文件
                                </p>
                            </div>

                            {/* 文件上传区 */}
                            <div className="border-2 border-dashed border-light-border dark:border-dark-border rounded-lg p-12 text-center">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <p className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                                    拖拽文件或点击选择
                                </p>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
                                    支持 CSV 文件，最大 10MB
                                </p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 cursor-pointer transition-opacity"
                                >
                                    <FileText className="w-4 h-4" />
                                    浏览文件
                                </label>
                            </div>

                            {/* 已选文件 */}
                            {file && (
                                <div className="flex items-center justify-between p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                                        <div>
                                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                                                {(file.size / 1024).toFixed(2)}{" "}
                                                KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        删除
                                    </button>
                                </div>
                            )}

                            {/* CSV 格式说明 */}
                            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4">
                                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                                    CSV 文件格式要求：
                                </p>
                                <pre className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-mono">
                                    name, url, logo, description, pricing,
                                    category_slug, is_featured
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Step 2: 预览数据 */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    Step 2: 数据预览
                                </h2>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    检测到 {previewData.length}{" "}
                                    个工具，请确认数据无误
                                </p>
                            </div>

                            {/* 预览表格 */}
                            <div className="overflow-x-auto border border-light-border dark:border-dark-border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                #
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                名称
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                分类
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                定价
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold">
                                                描述
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-light-border dark:border-dark-border last:border-0"
                                            >
                                                <td className="px-4 py-3 text-light-text-tertiary dark:text-dark-text-tertiary">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-light-text-primary dark:text-dark-text-primary">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary">
                                                    {item.category}
                                                </td>
                                                <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary">
                                                    {item.pricing}
                                                </td>
                                                <td className="px-4 py-3 text-light-text-secondary dark:text-dark-text-secondary truncate max-w-xs">
                                                    {item.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 确认 Checkbox */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded"
                                    required
                                />
                                <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    我确认数据无误，准备导入
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Step 3: 导入完成 */}
                    {currentStep === 3 && uploadResult && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    导入完成！
                                </h2>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    所有工具已成功导入到系统
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-8">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                                        {uploadResult.success}
                                    </p>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                                        成功
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                                        {uploadResult.failed}
                                    </p>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                                        失败
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/admin/tools")}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                            >
                                返回工具列表
                            </button>
                        </div>
                    )}

                    {/* 底部按钮 */}
                    {currentStep < 3 && (
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                >
                                    上一步
                                </button>
                            )}

                            <button
                                onClick={
                                    currentStep === 1
                                        ? handleNext
                                        : handleImport
                                }
                                disabled={currentStep === 1 && !file}
                                className="px-6 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                {currentStep === 1 ? "下一步" : "确认导入"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
