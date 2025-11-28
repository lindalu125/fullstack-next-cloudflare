"use client";

import { useState } from "react";
import {
    X,
    CheckCircle,
    XCircle,
    MessageSquare,
    ExternalLink,
} from "lucide-react";

interface Submission {
    id: string;
    toolName: string;
    submitterName: string;
    submitterEmail: string;
    category: string;
    pricing: string;
    status: "pending" | "approved" | "rejected" | "changes_requested";
    submittedAt: string;
    logoUrl: string;
    url: string;
    description: string;
}

interface SubmissionDetailModalProps {
    submission: Submission;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string, reason: string) => void;
    onRequestChanges: (id: string, feedback: string) => void;
}

export default function SubmissionDetailModal({
    submission,
    onClose,
    onApprove,
    onReject,
    onRequestChanges,
}: SubmissionDetailModalProps) {
    const [action, setAction] = useState<
        "approve" | "reject" | "changes" | null
    >(null);
    const [reason, setReason] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!action) return;

        setIsSubmitting(true);

        // 模拟 API 调用
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (action === "approve") {
            onApprove(submission.id);
        } else if (action === "reject" && reason.trim()) {
            onReject(submission.id, reason);
        } else if (action === "changes" && feedback.trim()) {
            onRequestChanges(submission.id, feedback);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        审核提交
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                    </button>
                </div>

                {/* 内容（可滚动） */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 工具信息 */}
                    <div>
                        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            工具信息
                        </h3>
                        <div className="space-y-4">
                            {/* Logo + 名称 */}
                            <div className="flex items-start gap-4">
                                <img
                                    src={submission.logoUrl}
                                    alt={submission.toolName}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
                                        {submission.toolName}
                                    </h4>
                                    <a
                                        href={submission.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                    >
                                        {submission.url}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* 分类和定价 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        分类
                                    </label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary">
                                        {submission.category}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                        定价类型
                                    </label>
                                    <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                        {submission.pricing}
                                    </span>
                                </div>
                            </div>

                            {/* 描述 */}
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                    工具描述
                                </label>
                                <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg">
                                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap">
                                        {submission.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 提交者信息 */}
                    <div className="pt-6 border-t border-light-border dark:border-dark-border">
                        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            提交者信息
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    姓名
                                </label>
                                <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    {submission.submitterName}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    邮箱
                                </label>
                                <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    {submission.submitterEmail}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    提交时间
                                </label>
                                <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    {submission.submittedAt}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                    当前状态
                                </label>
                                <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                                    {submission.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 审核操作 */}
                    {submission.status === "pending" && (
                        <div className="pt-6 border-t border-light-border dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                                审核操作
                            </h3>

                            {/* 操作选项 */}
                            {!action && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setAction("approve")}
                                        className="flex items-center justify-center gap-2 p-4 border-2 border-green-600 dark:border-green-400 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">
                                            通过审核
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setAction("changes")}
                                        className="flex items-center justify-center gap-2 p-4 border-2 border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="font-medium">
                                            要求修改
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setAction("reject")}
                                        className="flex items-center justify-center gap-2 p-4 border-2 border-red-600 dark:border-red-400 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-medium">
                                            拒绝提交
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* 通过审核确认 */}
                            {action === "approve" && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-600 dark:border-green-400">
                                        <p className="text-sm text-green-800 dark:text-green-200">
                                            确认通过此提交？工具将会被创建并发布到平台，提交者将收到邮件通知。
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setAction(null)}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                                        >
                                            取消
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {isSubmitting
                                                ? "处理中..."
                                                : "确认通过"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 拒绝提交表单 */}
                            {action === "reject" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                                            拒绝原因{" "}
                                            <span className="text-red-600 dark:text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) =>
                                                setReason(e.target.value)
                                            }
                                            placeholder="请说明拒绝的原因，提交者将会收到此反馈..."
                                            rows={4}
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setAction(null);
                                                setReason("");
                                            }}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                                        >
                                            取消
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={
                                                !reason.trim() || isSubmitting
                                            }
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {isSubmitting
                                                ? "处理中..."
                                                : "确认拒绝"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 要求修改表单 */}
                            {action === "changes" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                                            修改反馈{" "}
                                            <span className="text-red-600 dark:text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) =>
                                                setFeedback(e.target.value)
                                            }
                                            placeholder="请说明需要修改的内容，提交者将会收到此反馈并可以重新提交..."
                                            rows={4}
                                            required
                                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setAction(null);
                                                setFeedback("");
                                            }}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                                        >
                                            取消
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={
                                                !feedback.trim() || isSubmitting
                                            }
                                            className="flex-1 px-4 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {isSubmitting
                                                ? "处理中..."
                                                : "发送反馈"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 底部（已审核状态） */}
                {submission.status !== "pending" && (
                    <div className="p-6 border-t border-light-border dark:border-dark-border">
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center">
                            此提交已审核，状态：{submission.status}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
