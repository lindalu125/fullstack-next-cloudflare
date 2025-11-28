import { NextResponse } from "next/server";

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    meta?: PaginationMeta;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    message: string;
    code: string;
    details?: Record<string, any>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * Standard Error Codes
 */
export const ErrorCodes = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    RATE_LIMITED: "RATE_LIMITED",
    INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

/**
 * Create a success API response
 */
export function apiSuccess<T>(
    data: T,
    meta?: PaginationMeta,
    status: number = 200,
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(meta && { meta }),
        },
        { status },
    );
}

/**
 * Create an error API response
 */
export function apiError(
    message: string,
    code: keyof typeof ErrorCodes = "INTERNAL_ERROR",
    status: number = 500,
    details?: Record<string, any>,
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error: getErrorType(code),
            message,
            code: ErrorCodes[code],
            ...(details && { details }),
        },
        { status },
    );
}

/**
 * Get human-readable error type from code
 */
function getErrorType(code: keyof typeof ErrorCodes): string {
    const types: Record<keyof typeof ErrorCodes, string> = {
        VALIDATION_ERROR: "Validation Error",
        UNAUTHORIZED: "Unauthorized",
        FORBIDDEN: "Forbidden",
        NOT_FOUND: "Not Found",
        CONFLICT: "Conflict",
        RATE_LIMITED: "Rate Limited",
        INTERNAL_ERROR: "Internal Server Error",
    };
    return types[code];
}

/**
 * Parse and validate pagination parameters from URL search params
 */
export function parsePagination(searchParams: URLSearchParams): {
    page: number;
    limit: number;
    offset: number;
} {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get("limit") || "20")),
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
    page: number,
    limit: number,
    total: number,
): PaginationMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
    request: Request,
    schema: any,
): Promise<
    { success: true; data: T } | { success: false; error: NextResponse }
> {
    try {
        const body = await request.json();
        const validated = schema.parse(body);
        return { success: true, data: validated };
    } catch (error: any) {
        if (error.errors) {
            // Zod validation error
            const details = error.errors.reduce(
                (acc: Record<string, string>, err: any) => {
                    const path = err.path.join(".");
                    acc[path] = err.message;
                    return acc;
                },
                {},
            );
            return {
                success: false,
                error: apiError(
                    "Validation failed",
                    "VALIDATION_ERROR",
                    400,
                    details,
                ),
            };
        }
        return {
            success: false,
            error: apiError("Invalid request body", "VALIDATION_ERROR", 400),
        };
    }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
    console.error("API Error:", error);

    if (error instanceof Error) {
        return apiError(error.message, "INTERNAL_ERROR", 500);
    }

    return apiError("An unexpected error occurred", "INTERNAL_ERROR", 500);
}
