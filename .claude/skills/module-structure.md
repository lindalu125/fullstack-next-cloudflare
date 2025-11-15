---
name: module-structure
description: 项目模块结构和最佳实践，包括如何组织新功能、遵循命名规范和代码模式
---

# 模块结构和最佳实践

## 项目总体结构

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证页面组（公开）
│   │   ├── login/
│   │   └── signup/
│   ├── api/                      # API 路由
│   │   ├── auth/[...all]/        # Auth 路由
│   │   └── summarize/            # 总结 API
│   ├── dashboard/                # 仪表板路由（需认证）
│   │   ├── todos/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页
├── components/                   # 全局组件
│   ├── ui/                       # Radix UI 组件
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── navigation.tsx            # 全局导航
├── modules/                      # 业务模块（推荐结构）
│   ├── auth/                     # 认证模块
│   │   ├── actions/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── auth.route.ts
│   │   └── ...
│   ├── todos/                    # 待办事项模块
│   │   ├── actions/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── models/
│   │   └── ...
│   └── dashboard/                # 仪表板模块
│       ├── components/
│       ├── dashboard.page.tsx
│       └── ...
├── db/                           # 数据库
│   ├── schema.ts                 # Drizzle Schema
│   └── index.ts                  # DB 实例
├── lib/                          # 工具函数库
│   ├── auth.ts                   # 认证工具
│   ├── api-error.ts              # API 错误
│   ├── r2.ts                     # R2 存储
│   └── utils.ts                  # 通用工具
├── services/                     # 第三方服务集成
│   └── summarizer.service.ts     # AI 总结服务
└── constants/                    # 常量
    └── validation.constant.ts    # 验证规则
```

---

## 模块内部结构详解

### 完整模块示例：Todos（待办事项）

```
src/modules/todos/
├── actions/                           # Server Actions
│   ├── create-todo.action.ts
│   ├── update-todo.action.ts
│   ├── delete-todo.action.ts
│   ├── get-todos.action.ts
│   ├── get-todo-by-id.action.ts
│   ├── create-category.action.ts
│   └── get-categories.action.ts
├── components/                        # React 组件
│   ├── todo-form.tsx                 # 表单（新建/编辑）
│   ├── todo-card.tsx                 # 单个待办项显示
│   ├── todo-list.tsx                 # 待办项列表
│   ├── delete-todo.tsx               # 删除确认
│   ├── toggle-complete.tsx           # 完成/未完成切换
│   └── add-category.tsx              # 添加分类
├── schemas/                           # Zod 验证
│   ├── todo.schema.ts
│   ├── category.schema.ts
│   └── index.ts
├── models/                            # 类型定义
│   ├── todo.model.ts
│   ├── todo.enum.ts                  # 枚举（优先级、状态等）
│   └── category.model.ts
├── utils/                             # 模块级工具函数
│   └── todo-formatter.ts             # 格式化待办项
├── todo-list.page.tsx                # 列表页面
├── new-todo.page.tsx                 # 新建页面
├── edit-todo.page.tsx                # 编辑页面
├── todos.route.ts                    # 路由配置
└── README.md                          # 模块文档
```

---

## 每个部分的标准模板

### 1. Server Actions（actions/）

**命名**：`{verb}-{noun}.action.ts`

```typescript
// src/modules/todos/actions/create-todo.action.ts
"use server";

import { db } from "@/db";
import { todosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createTodoSchema } from "@/modules/todos/schemas/todo.schema";
import type { Todo } from "@/db/schema";

/**
 * 创建新的待办事项
 * @param formData - 待办事项数据
 * @returns 新创建的待办事项
 * @throws 如果用户未认证或数据验证失败
 */
export async function createTodo(formData: unknown): Promise<Todo> {
  // 1. 验证认证
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 2. 验证输入
  const parsed = createTodoSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }

  // 3. 业务逻辑
  const newTodo: typeof todosTable.$inferInsert = {
    id: crypto.randomUUID(),
    userId: session.user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    category: parsed.data.category || "default",
    completed: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 4. 数据库操作
  const [created] = await db
    .insert(todosTable)
    .values(newTodo)
    .returning();

  return created;
}
```

**Action 规范**：
- ✅ 每个 Action 单一职责
- ✅ 验证认证和授权
- ✅ 验证输入数据
- ✅ 有清晰的错误处理
- ✅ 返回类型声明清晰
- ❌ 不要在 Action 中进行复杂的业务逻辑

### 2. React 组件（components/）

**命名**：`{noun}-{type}.tsx` 或 `{verb}-{noun}.tsx`

```typescript
// src/modules/todos/components/todo-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTodo } from "@/modules/todos/actions/create-todo.action";
import { createTodoSchema } from "@/modules/todos/schemas/todo.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface TodoFormProps {
  onSuccess?: () => void;
}

export function TodoForm({ onSuccess }: TodoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "default"
    }
  });

  async function onSubmit(data: typeof createTodoSchema._type) {
    setIsLoading(true);
    try {
      await createTodo(data);
      toast.success("待办事项创建成功");
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="待办事项标题"
        {...form.register("title")}
      />
      {form.formState.errors.title && (
        <p className="text-red-500">{form.formState.errors.title.message}</p>
      )}

      <Textarea
        placeholder="详细描述（可选）"
        {...form.register("description")}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "提交中..." : "创建"}
      </Button>
    </form>
  );
}
```

**组件规范**：
- ✅ 使用 "use client" directive（Client Components）
- ✅ Props 有 TypeScript 类型
- ✅ 错误使用 toast 显示
- ✅ 加载状态反馈
- ✅ 清晰的 JSX 结构
- ❌ 不要在组件中进行数据库查询

### 3. Zod Schemas（schemas/）

**命名**：`{noun}.schema.ts`

```typescript
// src/modules/todos/schemas/todo.schema.ts
import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string()
    .min(1, "标题不能为空")
    .max(200, "标题不能超过 200 字符"),
  description: z.string()
    .max(1000, "描述不能超过 1000 字符")
    .optional(),
  category: z.enum(["work", "personal", "shopping", "health"])
    .default("work")
});

export const updateTodoSchema = createTodoSchema.partial();

export const todoIdSchema = z.object({
  id: z.string().uuid("无效的 ID")
});

// 导出类型
export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
```

**Schema 规范**：
- ✅ 使用 Zod 进行运行时验证
- ✅ 有清晰的错误消息（中文）
- ✅ 设置合理的长度限制
- ✅ 导出 TypeScript 类型
- ❌ 不要在数据库 schema 中重复验证规则

### 4. 模型和枚举（models/）

```typescript
// src/modules/todos/models/todo.model.ts
import type { Todo } from "@/db/schema";

export type TodoWithCategory = Todo & {
  categoryName: string;
};

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  byCategory: Record<string, number>;
}

// src/modules/todos/models/todo.enum.ts
export enum TodoCategory {
  WORK = "work",
  PERSONAL = "personal",
  SHOPPING = "shopping",
  HEALTH = "health"
}

export enum TodoPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export const TODO_CATEGORY_LABELS: Record<TodoCategory, string> = {
  [TodoCategory.WORK]: "工作",
  [TodoCategory.PERSONAL]: "个人",
  [TodoCategory.SHOPPING]: "购物",
  [TodoCategory.HEALTH]: "健康"
};
```

### 5. 页面（*.page.tsx）

```typescript
// src/modules/todos/todo-list.page.tsx
import { auth } from "@/lib/auth";
import { getMyTodos } from "@/modules/todos/actions/get-todos.action";
import { TodoCard } from "@/modules/todos/components/todo-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TodoListPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>请先登录</div>;
  }

  const todos = await getMyTodos();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">我的待办事项</h1>
        <Link href="/dashboard/todos/new">
          <Button>新建</Button>
        </Link>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-500">暂无待办事项</p>
      ) : (
        <div className="grid gap-2">
          {todos.map(todo => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**页面规范**：
- ✅ 验证认证
- ✅ 使用 Server Components（默认）
- ✅ 在服务器端获取数据
- ✅ 条件渲染（无数据时提示）
- ✅ 清晰的页面结构

---

## 模块之间的通信

### 依赖关系

```
✅ 正确的依赖方向：
modules/todos/components/ → modules/todos/actions/
modules/todos/actions/ → db/, lib/
lib/ → (不依赖其他)

❌ 避免的循环依赖：
modules/todos/ → modules/auth/
modules/auth/ → modules/todos/
```

### 跨模块调用

```typescript
// ✅ 可以调用其他模块的 public actions
// src/modules/dashboard/components/dashboard-overview.tsx
import { getMyTodos } from "@/modules/todos/actions/get-todos.action";
import { getMyCategories } from "@/modules/todos/actions/get-categories.action";

export async function DashboardOverview() {
  const [todos, categories] = await Promise.all([
    getMyTodos(),
    getMyCategories()
  ]);

  // 使用这些数据
}
```

---

## 添加新模块的步骤

### 1. 创建目录结构

```bash
mkdir -p src/modules/new-feature/{actions,components,schemas,models,utils}
```

### 2. 创建 Schema

```typescript
// src/modules/new-feature/schemas/new-feature.schema.ts
import { z } from "zod";

export const newFeatureSchema = z.object({
  name: z.string().min(1),
  // ...
});
```

### 3. 创建 Action

```typescript
// src/modules/new-feature/actions/create-new-feature.action.ts
"use server";
// ...
```

### 4. 创建组件

```typescript
// src/modules/new-feature/components/new-feature-form.tsx
"use client";
// ...
```

### 5. 创建页面

```typescript
// src/modules/new-feature/new-feature.page.tsx
export default async function NewFeaturePage() {
  // ...
}
```

### 6. 在路由中使用

```typescript
// src/app/dashboard/new-feature/page.tsx
export { NewFeaturePage as default } from "@/modules/new-feature/new-feature.page";
```

### 7. 添加到 README

```markdown
## new-feature 模块

简短描述

### 文件结构
- actions/ - 数据库操作
- components/ - UI 组件
- schemas/ - 验证 Schema
```

---

## 常见命名错误

| ❌ 错误 | ✅ 正确 | 原因 |
|--------|--------|------|
| `TodoAction.ts` | `get-todos.action.ts` | 明确指出是 action 和操作类型 |
| `Todo.tsx` | `todo-card.tsx` | 明确组件用途 |
| `validation.ts` | `todo.schema.ts` | 关联到所属模块 |
| `utils.ts` | `todo-formatter.ts` | 明确工具函数作用 |
| `models.ts` | `todo.model.ts` | 一个文件一个关注点 |

---

## 质量检查清单

添加新模块前检查：

- [ ] 目录结构完整
- [ ] 所有 actions 有 `"use server"` 声明
- [ ] 所有组件有 `"use client"` 声明（如需要）
- [ ] Schema 有清晰的中文错误消息
- [ ] 类型导出清晰（`export type ...`）
- [ ] 模块可独立测试
- [ ] 没有循环依赖
- [ ] 有 README 文档

---

## 参考示例

在项目中查看已有实现：

- **auth** 模块：`src/modules/auth/` - 完整的认证实现
- **todos** 模块：`src/modules/todos/` - 完整的 CRUD 实现
- **dashboard** 模块：`src/modules/dashboard/` - 组合多个模块的页面

这些是最佳实践的参考，新模块应遵循相同的模式。
