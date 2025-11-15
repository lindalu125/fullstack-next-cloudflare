---
name: nextjs-cloudflare-workflow
description: Next.js 15 + Cloudflare 应用的完整开发工作流程，包括本地开发、测试和部署
---

# Next.js + Cloudflare 开发工作流程

## 本地开发环境

### 启动开发服务器

```bash
# 方式1：标准 Next.js 开发（不包括 Cloudflare Workers 特性）
pnpm run dev
# ➜ 访问：http://localhost:3000

# 方式2：Cloudflare Workers 本地开发（推荐用于调试 Worker-only 功能）
pnpm run dev:cf
# ➜ 使用 Wrangler 本地模拟 Cloudflare Workers 环境

# 方式3：远程 Cloudflare 绑定开发（测试真实绑定）
pnpm run dev:remote
# ⚠️  需要 Cloudflare 账户连接
```

### 快速编译检查

```bash
# 检查 TypeScript 错误，不生成输出
pnpm run build

# 成功标志
# ✓ compiled successfully

# 失败排查
# □ Type errors found
# 检查: tsconfig.json 中的 paths 配置
# 检查: 导入路径是否正确（@/* 别名）
```

---

## API 路由开发

### 创建新 API 路由

```typescript
// src/app/api/[feature]/route.ts

import type { NextRequest } from "next/server";

// Cloudflare Bindings 通过 env 参数传递
export async function POST(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  // 获取环境变量和绑定
  const { env } = process as unknown as {
    env: {
      DB: D1Database;
      AI: Ai;
      R2_BUCKET: R2Bucket;
    };
  };

  try {
    const body = await request.json();

    // 业务逻辑
    const result = await someOperation(body, env);

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

### 访问数据库

```typescript
// D1 通过 Drizzle ORM 访问
import { db } from "@/db";
import { todosTable } from "@/db/schema";

const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, userId));
```

### 调用 AI（Cloudflare AI）

```typescript
// 使用 Llama 2 进行文本生成
const ai = new Ai(env.AI);
const result = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
  prompt: "Your prompt here"
});

// 支持的模型列表
// @cf/meta/llama-2-7b-chat-int8 - 推荐用于中文和英文
// @cf/mistral/mistral-7b-instruct-v0.2
// ...更多模型见 Cloudflare 文档
```

### R2 存储操作

```typescript
// 上传文件到 R2
const uploadUrl = await env.R2_BUCKET.put(
  `uploads/${Date.now()}-${filename}`,
  fileContent,
  {
    httpMetadata: { contentType: "application/octet-stream" }
  }
);

// 下载文件
const obj = await env.R2_BUCKET.get(key);
if (!obj) throw new Error("File not found");
const content = await obj.arrayBuffer();
```

---

## 构建和预览

### 构建 Cloudflare 版本

```bash
# 生成 Cloudflare Workers 构建
pnpm run build:cf

# 成功后生成
# .wrangler/
# ├── functions/
# ├── static/
# └── ... Cloudflare 相关文件
```

### 本地预览构建结果

```bash
# 预发布环境（实际测试）
pnpm run preview:cf

# 这会使用真实的 Cloudflare 账户绑定
# 但在暂存环境（preview）中运行
```

---

## 部署流程

### 预发布部署（推荐先做这个）

```bash
pnpm run deploy:preview

# 这会：
# 1. 编译 Next.js 代码
# 2. 上传到 Cloudflare (preview 环境)
# 3. 运行数据库迁移 (preview)
# 4. 返回预发布 URL

# 验证：访问返回的 URL，测试所有功能
# 特别注意：
# - 认证流程
# - 数据库操作
# - 文件上传
# - AI 调用
```

### 生产部署

```bash
# ⚠️  部署前检查清单
# [ ] 预发布环境测试通过
# [ ] 数据库迁移已在预发布验证
# [ ] 提交了所有更改
# [ ] 确认没有 console.log 敏感信息

pnpm run deploy:cf

# 或使用标准命令
pnpm run deploy

# 这会：
# 1. 生产环境部署
# 2. 应用 D1 迁移到生产
# 3. 更新所有绑定
```

---

## 数据库迁移管理

### 更新数据库 Schema

```bash
# 1. 编辑 src/db/schema.ts
# 示例：添加新字段
/*
export const todosTable = sqliteTable("todos", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"), // 新字段
  completed: integer("completed").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
*/

# 2. 生成迁移文件
pnpm run db:generate --name=add_description_field

# 这会创建 src/drizzle/migrations/
```

### 应用迁移

```bash
# 本地开发环境
pnpm run db:migrate:local

# 预发布环境
pnpm run db:migrate:preview

# 生产环境（谨慎！）
pnpm run db:migrate:prod

# 验证迁移
pnpm run db:inspect:local  # 查看本地表
pnpm run db:inspect:preview  # 预发布表
pnpm run db:inspect:prod  # 生产表
```

### 数据库可视化和管理

```bash
# 启动 Drizzle Studio（本地）
pnpm run db:studio:local

# ➜ 打开浏览器查看和管理数据
# 可视化表结构、编辑数据、运行 SQL 查询
```

### 紧急情况：重置本地数据库

```bash
# 清除本地 D1 数据库并重新迁移
pnpm run db:reset:local

# ⚠️  这会删除所有本地数据！仅用于开发
```

---

## 环境变量和 Secrets

### 设置 Cloudflare Secrets

```bash
# 交互式设置 secret
pnpm run cf:secret OPENAI_API_KEY
# 提示输入值，不会显示在历史记录中

# 多个 secrets
pnpm run cf:secret STRIPE_API_KEY
pnpm run cf:secret ANTHROPIC_API_KEY
```

### 类型生成

```bash
# 生成 Cloudflare 环境类型定义
pnpm run cf-typegen

# 这更新 cloudflare-env.d.ts
# 使 TypeScript 识别所有环境变量
```

### 访问环境变量

```typescript
// 在 API 路由中
const { env } = process as unknown as {
  env: {
    DATABASE_URL?: string;
    API_KEY: string;
    // ... 其他变量
  };
};

// 在 Server Components 中
import { env } from "@/env.server"; // 如果有定义
```

---

## 调试技巧

### 查看构建输出

```bash
# 详细编译信息
NODE_DEBUG=* pnpm run build

# 只查看警告
pnpm run build 2>&1 | grep -i warn
```

### 查看数据库查询

```typescript
// 在 action 中添加日志
console.log("SQL:", generateSQL(query));  // Drizzle 会输出 SQL

// 或在 Drizzle Studio 中查看查询
pnpm run db:studio:local
```

### 测试 API 路由

```bash
# 本地测试 POST API
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"content": "test"}'

# 或使用 VS Code REST Client 扩展
# 在项目根创建 test.http
POST http://localhost:3000/api/summarize
Content-Type: application/json

{
  "content": "test content"
}
```

---

## 常见问题排查

### "Cannot find module '@/*'"

```bash
# 原因：TypeScript paths 配置或编译缓存
# 解决：
rm -rf .next
pnpm run build
```

### "D1_BIND not found"

```bash
# 原因：本地开发缺少 Cloudflare 绑定
# 解决：
pnpm run dev:cf  # 使用 Wrangler，而不是 next dev

# 或检查 wrangler.toml 中的 d1_databases 配置
```

### 迁移失败 "SQLITE_CANTOPEN"

```bash
# 原因：D1 数据库文件不存在或权限问题
# 解决：
pnpm run db:reset:local
# 然后重新应用迁移
pnpm run db:migrate:local
```

### AI 模型超时

```bash
# 原因：模型响应太慢或网络问题
# 解决：
// 添加超时和重试逻辑
const result = await Promise.race([
  ai.run("@cf/meta/llama-2-7b-chat-int8", { prompt }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 30000)
  )
]);
```

---

## 性能优化

### 减少 API 调用

```typescript
// ❌ 在循环中调用 AI
for (const todo of todos) {
  const summary = await ai.run(...);  // N 次 AI 调用
}

// ✅ 批量处理
const summaries = await Promise.all(
  todos.map(todo => ai.run(...))  // 并发调用
);
```

### 缓存数据库结果

```typescript
// 使用 Cloudflare KV 缓存
const cached = await env.KV.get(`todo:${id}`);
if (cached) return JSON.parse(cached);

const data = await db.query.todosTable.findFirst({ where: ... });
await env.KV.put(`todo:${id}`, JSON.stringify(data), {
  expirationTtl: 3600  // 1 小时过期
});
```

---

## 部署检查清单

```markdown
部署前必须检查：

数据库
- [ ] 迁移文件已生成
- [ ] 在预发布环境测试通过
- [ ] 没有破坏性的 schema 更改

功能
- [ ] 所有功能在 preview 环境通过测试
- [ ] 认证流程完整
- [ ] 错误处理正确

安全
- [ ] 所有 secrets 已设置
- [ ] 没有硬编码的 API 密钥
- [ ] 用户数据被正确隔离

性能
- [ ] 没有 N+1 查询问题
- [ ] 大数据集使用分页
- [ ] AI 调用有超时保护

提交
- [ ] 代码已格式化 (pnpm run lint)
- [ ] 编译成功 (pnpm run build)
- [ ] 提交消息清晰
```
