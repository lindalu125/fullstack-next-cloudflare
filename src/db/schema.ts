// Auth schemas
export {
    account,
    session,
    user,
    verification,
} from "@/modules/auth/schemas/auth.schema";

// Toolsail schemas
export { categories } from "@/modules/categories/schemas/category.schema";
export { tools } from "@/modules/tools/schemas/tool.schema";
export {
    toolSubmissions,
    verificationTokens,
} from "@/modules/submissions/schemas/submission.schema";
export {
    blogCategories,
    blogPosts,
} from "@/modules/blog/schemas/blog.schema";
export { toolPromotions } from "@/modules/promotions/schemas/promotion.schema";
export { auditLogs } from "@/modules/admin/schemas/audit.schema";

// Legacy todo schemas (can be removed later)
export { categories as todoCategories } from "@/modules/todos/schemas/category.schema";
export { todos } from "@/modules/todos/schemas/todo.schema";
