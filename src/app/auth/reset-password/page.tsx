"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { authClient } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Password strength validation
    const passwordStrength = {
        minLength: formData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
        hasSpecial: /[!@#$%^&*]/.test(formData.password),
    };

    const isPasswordValid = Object.values(passwordStrength).every(Boolean);
    const passwordsMatch =
        formData.password === formData.confirmPassword &&
        formData.confirmPassword.length > 0;

    useEffect(() => {
        if (!token) {
            setError(
                "Invalid reset link. Please request a new password reset.",
            );
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Invalid reset link");
            return;
        }

        if (!isPasswordValid) {
            setError("Password does not meet security requirements");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            await authClient.resetPassword({
                newPassword: formData.password,
                token,
            });
            setSuccess(true);
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err: any) {
            setError(
                err.message || "Failed to reset password. Please try again.",
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
                            Password Reset Successful
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Your password has been reset successfully.
                            Redirecting to login...
                        </p>
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
                        Set your new password
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                            >
                                New Password
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

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordStrength.minLength ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span
                                            className={
                                                passwordStrength.minLength
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordStrength.hasUppercase ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span
                                            className={
                                                passwordStrength.hasUppercase
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            One uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordStrength.hasNumber ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span
                                            className={
                                                passwordStrength.hasNumber
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            One number
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordStrength.hasSpecial ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <X className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span
                                            className={
                                                passwordStrength.hasSpecial
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            One special character
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                            >
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    className="w-full pl-11 pr-12 py-3 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <p
                                    className={`mt-2 text-xs ${passwordsMatch ? "text-green-600" : "text-red-600"}`}
                                >
                                    {passwordsMatch
                                        ? "✓ Passwords match"
                                        : "✗ Passwords do not match"}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !isPasswordValid ||
                                !passwordsMatch ||
                                !token
                            }
                            className="w-full py-3 px-4 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
