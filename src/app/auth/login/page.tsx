"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const result = await signIn({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
            });

            if (result.error) {
                setError(
                    result.error.message ||
                        "Login failed. Please check your credentials.",
                );
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                            🧭 Toolsail
                        </h1>
                    </Link>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-8 shadow-sm">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Google Sign In */}
                    {process.env.NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH ===
                        "true" && (
                        <>
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors font-medium text-light-text-primary dark:text-dark-text-primary"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-light-border dark:border-dark-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-tertiary dark:text-dark-text-tertiary">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
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
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full pl-11 pr-4 py-3 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full pl-11 pr-12 py-3 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            rememberMe: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 rounded border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                                />
                                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-light-text-primary dark:text-dark-text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
