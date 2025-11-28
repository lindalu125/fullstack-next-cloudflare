"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, Check } from "lucide-react";
import { authClient } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await authClient.forgetPassword({
                email,
                redirectTo: "/auth/reset-password",
            });
            setSuccess(true);
        } catch (err: any) {
            setError(
                err.message || "Failed to send reset email. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8 shadow-sm text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                            We've sent a password reset link to{" "}
                            <strong>{email}</strong>. Please check your inbox
                            and follow the instructions.
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block px-6 py-3 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                            🧭 Toolsail
                        </h1>
                    </Link>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        Reset your password
                    </p>
                </div>

                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8 shadow-sm">
                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Remember your password?{" "}
                        <Link
                            href="/auth/login"
                            className="text-light-text-primary dark:text-dark-text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
