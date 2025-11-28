import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default async function DashboardPage() {
    const auth = await getAuth();
    const session = await auth.api.getSession({
        headers: new Headers(),
    });

    if (!session) {
        redirect("/auth/login");
    }

    // Mock stats - will be replaced with real API calls
    const stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                    Welcome back, {session.user.name}!
                </h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Here's an overview of your activity on Toolsail
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <FileText className="w-8 h-8 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    </div>
                    <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                        {stats.total}
                    </p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Total Submissions
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-light-text-tertiary dark:text-dark-text-tertiary" />
                    </div>
                    <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                        {stats.pending}
                    </p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Pending Review
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                        {stats.approved}
                    </p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Approved
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                        {stats.rejected}
                    </p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Rejected
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/submit"
                        className="flex items-center gap-3 p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <FileText className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        <div>
                            <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                Submit New Tool
                            </p>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                Add a new tool to Toolsail
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/submissions"
                        className="flex items-center gap-3 p-4 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        <FileText className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        <div>
                            <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                View My Submissions
                            </p>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                Check your submission status
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8">
                <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                    Recent Submissions
                </h2>
                <div className="text-center py-12">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                        You haven't submitted any tools yet
                    </p>
                    <Link
                        href="/submit"
                        className="inline-block px-6 py-3 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Submit Your First Tool
                    </Link>
                </div>
            </div>
        </div>
    );
}
