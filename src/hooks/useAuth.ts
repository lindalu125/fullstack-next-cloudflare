"use client";

import { createAuthClient } from "better-auth/react";
import type { Session, User } from "@/lib/auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export function useAuth() {
    const session = authClient.useSession();

    return {
        user: session.data?.user as User | undefined,
        session: session.data as Session | undefined,
        isLoading: session.isPending,
        isAuthenticated: !!session.data?.user,
        error: session.error,
        signIn: authClient.signIn.email,
        signUp: authClient.signUp.email,
        signOut: authClient.signOut,
        signInWithGoogle: authClient.signIn.social,
    };
}
