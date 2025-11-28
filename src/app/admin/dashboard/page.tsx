import Link from "next/link";
import StatCard from "@/components/admin/stat-card";
import {
    Package,
    CheckCircle,
    PlusCircle,
    TrendingUp,
    Clock,
    XCircle,
} from "lucide-react";

// Mock 数据 - 后续从 API 获取
const stats = {
    totalTools: 1250,
    pendingSubmissions: 23,
    monthlyNewTools: 48,
    monthlyVisits: 5420,
};

const recentActivities = [
    {
        id: 1,
        time: "01:30 PM",
        action: "提交审核通过",
        content: "ChatGPT",
        user: "Admin",
    },
    {
        id: 2,
        time: "12:45 PM",
        action: "文章发布",
        content: "AI工具评测",
        user: "Admin",
    },
    {
        id: 3,
        time: "11:20 AM",
        action: "工具编辑",
        content: "Notion",
        user: "Admin",
    },
    {
        id: 4,
        time: "10:15 AM",
        action: "分类创建",
        content: "AI 写作",
        user: "Admin",
    },
    {
        id: 5,
        time: "09:00 AM",
        action: "设置更新",
        content: "SEO 信息",
        user: "Admin",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    仪表盘
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    欢迎回来！这是您的管理概览
                </p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="总工具数"
                    value={stats.totalTools.toLocaleString()}
                    change={{ value: 5.2, trend: "up", label: "相比上月" }}
                    icon={<Package className="w-6 h-6" />}
                />

                <StatCard
                    title="待审核提交"
                    value={stats.pendingSubmissions}
                    change={{ value: -2, trend: "down" }}
                    icon={<Clock className="w-6 h-6" />}
                />

                <StatCard
                    title="本月新增"
                    value={stats.monthlyNewTools}
                    change={{ value: 12, trend: "up", label: "相比上月" }}
                    icon={<PlusCircle className="w-6 h-6" />}
                />

                <StatCard
                    title="本月访问量"
                    value={stats.monthlyVisits.toLocaleString()}
                    change={{ value: 8.1, trend: "up", label: "相比上月" }}
                    icon={<TrendingUp className="w-6 h-6" />}
                />
            </div>

            {/* 快捷操作 */}
            <div>
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    快捷操作
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link
                        href="/admin/submissions"
                        className="flex items-center gap-3 p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors group"
                    >
                        <div className="w-12 h-12 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg flex items-center justify-center group-hover:bg-light-bg-tertiary dark:group-hover:bg-dark-bg-tertiary transition-colors">
                            <CheckCircle className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
                        </div>
                        <div>
                            <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                查看待审核
                            </p>
                            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                {stats.pendingSubmissions} 个待处理
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/tools/new"
                        className="flex items-center gap-3 p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors group"
                    >
                        <div className="w-12 h-12 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg flex items-center justify-center group-hover:bg-light-bg-tertiary dark:group-hover:bg-dark-bg-tertiary transition-colors">
                            <Package className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
                        </div>
                        <div>
                            <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                添加新工具
                            </p>
                            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                快速添加工具
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/blog/new"
                        className="flex items-center gap-3 p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors group"
                    >
                        <div className="w-12 h-12 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg flex items-center justify-center group-hover:bg-light-bg-tertiary dark:group-hover:bg-dark-bg-tertiary transition-colors">
                            <PlusCircle className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
                        </div>
                        <div>
                            <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                写新文章
                            </p>
                            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                发布博客内容
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* 最近活动 */}
            <div>
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    最近活动
                </h2>
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        时间
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        操作
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        内容
                                    </th>
                                    <th className="px-6 py-3 text-left font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        操作人
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivities.map((activity, index) => (
                                    <tr
                                        key={activity.id}
                                        className={`border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors`}
                                    >
                                        <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                                            {activity.time}
                                        </td>
                                        <td className="px-6 py-4 text-light-text-primary dark:text-dark-text-primary">
                                            {activity.action}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-light-text-primary dark:text-dark-text-primary">
                                            {activity.content}
                                        </td>
                                        <td className="px-6 py-4 text-light-text-secondary dark:text-dark-text-secondary">
                                            {activity.user}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 查看更多 */}
                    <div className="px-6 py-4 border-t border-light-border dark:border-dark-border text-center">
                        <button className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
                            查看更多活动
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
