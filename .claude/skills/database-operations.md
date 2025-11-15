---
name: database-operations
description: Drizzle ORM + Cloudflare D1 数据库操作的完整指南，包括 CRUD、关系查询和性能优化
---

# 数据库操作指南

## Drizzle ORM 基础

### 导入

```typescript
import { db } from "@/db";
import {
  todosTable,
  usersTable,
  categoriesTable,
  eq,
  and,
  or,
  desc,
  asc,
  like,
  count,
  sql,
  inArray
} from "@/db/schema";
```

---

## CRUD 操作

### CREATE（创建）

```typescript
// 单条插入
const result = await db
  .insert(todosTable)
  .values({
    id: generateId(),
    userId: "user-123",
    title: "New Todo",
    description: "Description",
    category: "work",
    completed: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

// 多条插入
await db.insert(todosTable).values([
  { id: "1", userId: "user-123", title: "Todo 1", ... },
  { id: "2", userId: "user-123", title: "Todo 2", ... }
]);

// 带返回值
const [inserted] = await db
  .insert(todosTable)
  .values({ ... })
  .returning();

console.log("Created todo:", inserted.id);
```

### READ（读取）

```typescript
// 获取单个记录
const todo = await db.query.todosTable.findFirst({
  where: eq(todosTable.id, "todo-123")
});

// 获取多个记录
const todos = await db.query.todosTable.findMany({
  where: eq(todosTable.userId, "user-123"),
  orderBy: [desc(todosTable.createdAt)],
  limit: 10
});

// 使用 select() 语法（更灵活）
const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, userId))
  .orderBy(desc(todosTable.createdAt))
  .limit(20);

// 计数查询
const count = await db
  .select({ count: count() })
  .from(todosTable)
  .where(eq(todosTable.userId, userId));

console.log("Total todos:", count[0].count);
```

### UPDATE（更新）

```typescript
// 更新单条
const result = await db
  .update(todosTable)
  .set({
    title: "Updated Title",
    completed: 1,
    updatedAt: new Date().toISOString()
  })
  .where(eq(todosTable.id, "todo-123"));

// 条件更新
await db
  .update(todosTable)
  .set({ completed: 1 })
  .where(and(
    eq(todosTable.userId, userId),
    eq(todosTable.category, "work")
  ));

// 带返回值
const [updated] = await db
  .update(todosTable)
  .set({ ... })
  .where(eq(todosTable.id, id))
  .returning();
```

### DELETE（删除）

```typescript
// 删除单条
await db
  .delete(todosTable)
  .where(eq(todosTable.id, "todo-123"));

// 批量删除
await db
  .delete(todosTable)
  .where(inArray(todosTable.id, ["todo-1", "todo-2"]));

// 条件删除
await db
  .delete(todosTable)
  .where(and(
    eq(todosTable.userId, userId),
    eq(todosTable.completed, 1)
  ));
```

---

## 查询条件

### WHERE 子句

```typescript
// 相等
where: eq(todosTable.id, "value")

// 不相等
where: ne(todosTable.status, "deleted")

// 比较
where: gt(todosTable.createdAt, "2025-01-01")     // 大于
where: gte(todosTable.createdAt, "2025-01-01")    // 大于等于
where: lt(todosTable.createdAt, "2025-12-31")     // 小于
where: lte(todosTable.createdAt, "2025-12-31")    // 小于等于

// 模糊查询
where: like(todosTable.title, "%javascript%")
where: ilike(todosTable.title, "%JavaScript%")    // 不区分大小写

// 列表包含
where: inArray(todosTable.category, ["work", "personal"])

// IS NULL / IS NOT NULL
where: isNull(todosTable.deletedAt)
where: isNotNull(todosTable.summary)

// 逻辑组合
where: and(
  eq(todosTable.userId, userId),
  eq(todosTable.completed, 0),
  like(todosTable.title, "%urgent%")
)

where: or(
  eq(todosTable.category, "work"),
  eq(todosTable.category, "important")
)

// 嵌套逻辑
where: and(
  eq(todosTable.userId, userId),
  or(
    eq(todosTable.category, "work"),
    and(
      eq(todosTable.category, "personal"),
      eq(todosTable.priority, "high")
    )
  )
)
```

### ORDER BY 排序

```typescript
// 单个字段
orderBy: asc(todosTable.title)      // 升序 A-Z
orderBy: desc(todosTable.createdAt) // 降序

// 多个字段
orderBy: [
  desc(todosTable.completed),  // 先按完成状态
  asc(todosTable.title)         // 再按标题
]
```

### LIMIT 和 OFFSET

```typescript
// 分页
const pageSize = 10;
const page = 1;
const offset = (page - 1) * pageSize;

const todos = await db.query.todosTable.findMany({
  where: eq(todosTable.userId, userId),
  limit: pageSize,
  offset: offset
});
```

---

## 关系查询和 Join

### 一对多关系示例

```typescript
// 获取用户及其所有待办事项
const user = await db.query.usersTable.findFirst({
  where: eq(usersTable.id, userId),
  with: {
    todos: {
      orderBy: desc(todosTable.createdAt),
      limit: 20
    }
  }
});

console.log(user.name);
console.log(user.todos); // 嵌套数组
```

### 手动 JOIN

```typescript
import { sql } from "drizzle-orm";

// 获取待办事项及其创建者
const results = await db
  .select({
    todo: todosTable,
    userName: usersTable.name,
    userEmail: usersTable.email
  })
  .from(todosTable)
  .leftJoin(usersTable, eq(todosTable.userId, usersTable.id))
  .where(eq(todosTable.id, todoId));

console.log(results[0].todo);
console.log(results[0].userName);
```

---

## 聚合查询

### COUNT、SUM、AVG

```typescript
import { count, sum, avg, min, max } from "drizzle-orm";

// 计数
const result = await db
  .select({ total: count() })
  .from(todosTable)
  .where(eq(todosTable.userId, userId));

// 多个聚合
const stats = await db
  .select({
    totalTodos: count(),
    completedTodos: count(todosTable.id)
      .where(eq(todosTable.completed, 1)),
    categories: count(todosTable.category, { distinct: true })
  })
  .from(todosTable)
  .where(eq(todosTable.userId, userId));

console.log(stats[0]);
// { totalTodos: 15, completedTodos: 8, categories: 3 }
```

### GROUP BY

```typescript
import { count, sql } from "drizzle-orm";

// 按类别分组统计
const byCategory = await db
  .select({
    category: todosTable.category,
    count: count()
  })
  .from(todosTable)
  .where(eq(todosTable.userId, userId))
  .groupBy(todosTable.category);

// 结果
// [
//   { category: "work", count: 7 },
//   { category: "personal", count: 5 },
//   { category: "shopping", count: 3 }
// ]
```

---

## Server Actions 中的数据库使用

### 正确的 Action 模式

```typescript
// src/modules/todos/actions/get-todos.action.ts
"use server";

import { db } from "@/db";
import { todosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function getMyTodos(limit = 20) {
  // 1. 验证用户
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 2. 查询数据库
  const todos = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.userId, session.user.id))
    .orderBy(desc(todosTable.createdAt))
    .limit(limit);

  // 3. 返回数据
  return todos;
}

// src/modules/todos/actions/create-todo.action.ts
"use server";

import { db } from "@/db";
import { todosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createTodoSchema } from "@/modules/todos/schemas/todo.schema";

export async function createTodo(formData: unknown) {
  // 1. 验证用户
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 2. 验证输入
  const parsed = createTodoSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  // 3. 插入数据库
  const [newTodo] = await db
    .insert(todosTable)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      completed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .returning();

  return newTodo;
}
```

---

## 事务（Transactions）

### 多步骤事务

```typescript
// Cloudflare D1 通过 Drizzle 支持事务
export async function moveToCategory(todoId: string, newCategory: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 开始事务：如果任何操作失败，全部回滚
  await db.transaction(async (tx) => {
    // 步骤1：获取待办事项
    const todo = await tx.query.todosTable.findFirst({
      where: and(
        eq(todosTable.id, todoId),
        eq(todosTable.userId, session.user.id)
      )
    });

    if (!todo) throw new Error("Todo not found");

    // 步骤2：更新类别
    await tx
      .update(todosTable)
      .set({ category: newCategory })
      .where(eq(todosTable.id, todoId));

    // 步骤3：记录日志（如果有日志表）
    // await tx.insert(logsTable).values({ ... });
  });
}
```

---

## Schema 定义和类型

### 查看当前 Schema

```typescript
// src/db/schema.ts

export const todosTable = sqliteTable("todos", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  completed: integer("completed").default(0),
  summary: text("summary"),  // AI 生成的总结
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

// 生成 TypeScript 类型
export type Todo = typeof todosTable.$inferSelect;
export type NewTodo = typeof todosTable.$inferInsert;
```

### 使用类型

```typescript
import type { Todo } from "@/db/schema";

function processTodo(todo: Todo) {
  console.log(todo.title);  // TypeScript 检查
  console.log(todo.invalidField);  // ❌ TypeScript 错误
}
```

---

## 性能优化技巧

### 避免 N+1 查询问题

```typescript
// ❌ 不好：在循环中查询
const todos = await db.select().from(todosTable);
for (const todo of todos) {
  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.id, todo.category)
  });  // N+1 查询！
}

// ✅ 好：一次查询获取所有
const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, userId));

const categories = await db
  .select()
  .from(categoriesTable);

// 在应用中匹配
const todosWithCategories = todos.map(todo => ({
  ...todo,
  categoryData: categories.find(c => c.id === todo.category)
}));
```

### 使用选择特定列

```typescript
// ❌ 获取所有列（可能包含大文本字段）
const todos = await db.select().from(todosTable);

// ✅ 只获取需要的列
const todos = await db
  .select({
    id: todosTable.id,
    title: todosTable.title,
    completed: todosTable.completed
  })
  .from(todosTable);
```

### 添加分页

```typescript
// ✅ 分页查询
async function getUserTodos(userId: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const [todos, countResult] = await Promise.all([
    db
      .select()
      .from(todosTable)
      .where(eq(todosTable.userId, userId))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(todosTable)
      .where(eq(todosTable.userId, userId))
  ]);

  return {
    todos,
    total: countResult[0].count,
    pages: Math.ceil(countResult[0].count / limit)
  };
}
```

---

## 常见错误和解决方案

### "Column not found"

```typescript
// ❌ 错误的列名
where: eq(todosTable.userId, id)  // 字段叫 user_id

// ✅ 正确的列名
where: eq(todosTable.userId, id)  // 检查 schema 定义
```

### "Type mismatch"

```typescript
// ❌ 类型不匹配
const id: number = "123";
where: eq(todosTable.id, id);  // schema 中 id 是 text

// ✅ 类型正确
const id: string = "123";
where: eq(todosTable.id, id);
```

### "Unauthorized access"

```typescript
// ❌ 没有验证用户
const todos = await db.select().from(todosTable);

// ✅ 检查用户权限
const session = await auth();
if (!session?.user?.id) throw new Error("Unauthorized");

const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, session.user.id));
```

---

## 数据库迁移工作流

### 添加新字段

```typescript
// 1. 编辑 src/db/schema.ts
export const todosTable = sqliteTable("todos", {
  // ... 现有字段
  priority: text("priority").default("medium"),  // 新字段
});

// 2. 生成迁移
pnpm run db:generate --name=add_priority_field

// 3. 应用迁移
pnpm run db:migrate:local
pnpm run db:migrate:preview  // 测试
pnpm run db:migrate:prod     // 生产
```

### 修改现有字段

```typescript
// 需要谨慎！创建新列或迁移脚本

// 生成迁移文件后，编辑 SQL 文件进行正确的转换
// 例：从 string 改为 integer
// ALTER TABLE todos ADD COLUMN new_priority INTEGER;
// UPDATE todos SET new_priority = CASE WHEN priority = 'high' THEN 1 ELSE 0 END;
// ALTER TABLE todos DROP COLUMN priority;
// ALTER TABLE todos RENAME COLUMN new_priority TO priority;
```
