# Toolsail Next.js + Cloudflare 项目开发指南

这个文件是Claude Code的个性化配置，所有交互都遵循这些指南。

---

## 项目概览

**项目**：Toolsail - 待办事项管理应用（Next.js 15 + Cloudflare）

**技术栈**：
- **框架**：Next.js 15.4 + React 19
- **后端**：Cloudflare Workers + Wrangler
- **数据库**：Cloudflare D1 (SQLite)
- **ORM**：Drizzle ORM 0.44
- **认证**：Better Auth 1.3
- **存储**：Cloudflare R2
- **UI**：Radix UI + Tailwind CSS
- **代码检查**：Biome 2.2.4
- **形式验证**：React Hook Form + Zod

---

## 核心工作流程

所有开发工作遵循 **Explore → Plan → Code → Commit** 流程：

### 1. 探索阶段（Explore）
```
任务来临时：
├─ 阅读相关代码文件 (src/modules/{feature}/)
├─ 检查现有模式 (actions, schemas, components)
├─ 查看相关的API路由
└─ 记录发现：文件位置、依赖关系、约定
```

**使用的工具**：
- Glob + Grep 查找相关文件
- Read 深入理解现有实现
- **不要立即编辑**

### 2. 规划阶段（Plan）
```
创建 IMPLEMENTATION_PLAN.md 文档：

## Stage 1: [具体目标]
- **目标**：[可交付成果]
- **成功标准**：[可测试的结果]
- **相关文件**：[需要修改的文件列表]
- **测试用例**：[需要验证的场景]
- **状态**：Not Started

## Stage 2: [下一阶段]
...
```

**检查清单**：
- [ ] 理解现有架构
- [ ] 确定修改范围
- [ ] 验证API/数据流
- [ ] 列出所有受影响的文件
- [ ] 规划测试策略

### 3. 编码阶段（Code）
```
遵循增量编程：

1. 写测试（如果有测试框架）
2. 最小化实现通过测试
3. 重构保持测试通过
4. 频繁验证编译和运行
```

**关键原则**：
- ✅ 每个更改都必须**编译成功**
- ✅ **增量提交**，不要大改
- ✅ **遵循现有模式**（模块化结构、命名规范）
- ❌ 不引入新库，除非充分证明必要性
- ❌ 不破坏现有功能

### 4. 提交阶段（Commit）
```
每个逻辑单元提交一次：

格式：
fix|feat|refactor|docs: [简短描述]

[具体改动说明]
[为什么这样做]

例：
feat: add todo summarization with Claude AI

- Integrate Cloudflare AI (Llama 2) for todo summarization
- Add /api/summarize POST endpoint
- Update todo model with summary field
- Refactor: consolidate AI service logic

相关：#issue-123
```

**提交标准**：
- [ ] 代码编译且测试通过
- [ ] 遵循 Biome lint/format 规则
- [ ] 清晰的提交消息
- [ ] 功能完整但可独立发布

---

## 项目架构规范

### 模块结构（必须遵循）

```
src/modules/{feature}/
├── actions/              # Server Actions (异步、数据库操作)
│   ├── get-{feature}.action.ts
│   ├── create-{feature}.action.ts
│   ├── update-{feature}.action.ts
│   └── delete-{feature}.action.ts
├── components/          # React 组件
│   ├── {feature}-form.tsx
│   ├── {feature}-card.tsx
│   └── {feature}-list.tsx
├── schemas/             # Zod 验证 Schema
│   ├── {feature}.schema.ts
│   └── index.ts
├── models/              # TypeScript 类型 & 枚举
│   ├── {feature}.model.ts
│   └── {feature}.enum.ts
├── {feature}.page.tsx   # 页面组件
├── {feature}.layout.tsx # 布局
├── {feature}.route.ts   # 路由配置
└── README.md           # 模块文档
```

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| **Action** | `{verb}-{noun}.action.ts` | `get-todos.action.ts` |
| **Component** | `{noun}-{type}.tsx` | `todo-form.tsx` |
| **Schema** | `{noun}.schema.ts` | `todo.schema.ts` |
| **Model** | `{noun}.model.ts` | `todo.model.ts` |
| **Function** | camelCase | `getTodoById()` |
| **Type** | PascalCase | `TodoWithCategory` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_TODO_LENGTH` |

### 代码风格（自动化）

```bash
# Biome 自动格式化 (4空格缩进，双引号)
pnpm run lint

# Biome 配置 (biome.json)
- 缩进：4空格
- 引号：双引号
- 自动组织导入
```

---

## 数据库操作规范

### Drizzle Schema 更新流程

```bash
# 1. 修改 src/db/schema.ts
# 2. 生成迁移文件
pnpm run db:generate --name=meaningful_name

# 3. 本地验证
pnpm run db:migrate:local

# 4. 验证表
pnpm run db:inspect:local

# 5. 预发布验证
pnpm run db:migrate:preview

# 6. 生产部署
pnpm run db:migrate:prod
```

### Action 书写规范

```typescript
// ✅ 正确做法
// src/modules/todos/actions/get-todos.action.ts
"use server";

import { getTodos } from "@/db";
import { auth } from "@/lib/auth";

export async function getMyTodos() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const todos = await getTodos(session.user.id);
  return todos;
}

// ❌ 避免
// - 在 action 中进行复杂的业务逻辑
// - 忘记验证 session
// - 返回敏感数据
```

---

## API 路由规范

### Cloudflare AI 集成

```typescript
// src/app/api/summarize/route.ts
export async function POST(request: Request) {
  const { content } = await request.json();

  const ai = new Ai(env.AI);
  const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
    prompt: `Summarize: ${content}`
  });

  return Response.json(response);
}
```

### R2 上传/下载

```typescript
// 使用 src/lib/r2.ts 中的工具函数
import { r2Upload, r2Download } from "@/lib/r2";

await r2Upload(env.R2_BUCKET, key, data);
```

---

## Token 优化策略

### 减少 Context 消耗

| 策略 | 效果 | 何时使用 |
|------|------|---------|
| 使用 `/clear` | 清除历史 | 任务完成或切换功能 |
| 阅读小文件 | 少 token | 查询特定实现 |
| 指定行范围 | 更精准 | Read 工具：offset/limit |
| Task + Explore agent | 100+token 节省 | 大型代码探索 |
| Glob 替代 `find` | 快速 + 精确 | 文件模式查询 |
| grep 替代 `grep` 命令 | 结构化输出 | 代码搜索 |

### 避免低效做法

❌ **高 Token 消耗**：
- 在 bash 中使用 `find` + `cat` 查看整个目录
- 一次 Read 整个 node_modules
- 反复查看相同文件
- 过度注释和解释

✅ **高效做法**：
- Glob `src/modules/*/actions/*.ts`
- 用行号 Read 大文件：`limit: 50, offset: 100`
- 利用 shell 历史和记忆
- 直接行动，最小化对话

---

## 常用命令速查表

### 开发

```bash
# 启动本地开发
pnpm run dev

# Cloudflare 本地开发
pnpm run dev:cf

# 编译检查
pnpm run build

# 格式化代码
pnpm run lint
```

### 数据库

```bash
# 生成迁移
pnpm run db:generate --name=add_field

# 本地应用
pnpm run db:migrate:local

# 查看数据库表
pnpm run db:inspect:local

# 数据库可视化
pnpm run db:studio:local
```

### 部署

```bash
# 构建 Cloudflare 版本
pnpm run build:cf

# 预发布部署
pnpm run deploy:preview

# 生产部署
pnpm run deploy:cf
```

### 环境变量

```bash
# 设置 Cloudflare secret
pnpm run cf:secret OPENAI_API_KEY

# 生成类型
pnpm run cf-typegen
```

---

## 错误处理规范

### 基本错误流程

```typescript
// ✅ 正确
import { ApiError } from "@/lib/api-error";

try {
  // 操作
} catch (error) {
  throw new ApiError(
    "描述性错误信息",
    error instanceof Error ? error.message : "Unknown"
  );
}

// ❌ 避免
console.log(error); // 不输出日志到控制台
throw error; // 不直接抛出原始错误
```

### API 响应格式

```typescript
// 成功
Response.json({ data: result }, { status: 200 });

// 错误
Response.json(
  { error: "描述", details: "..." },
  { status: 400 }
);
```

---

## 认证和授权

### Better Auth 集成

所有需要用户的操作都需要：

```typescript
import { auth } from "@/lib/auth";

const session = await auth();
if (!session?.user?.id) {
  throw new Error("Unauthorized");
}
```

### 数据隔离

```typescript
// ✅ 正确：获取当前用户的待办事项
const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, session.user.id));

// ❌ 不要：获取所有待办事项，后续过滤
const allTodos = await db.select().from(todosTable);
```

---

## 遇到问题的解决流程

### 第一次尝试失败

1. **理解错误**
   - 阅读完整的错误信息
   - 检查相关的日志
   - 验证输入和环境

2. **快速修复**
   - 搜索类似的代码模式
   - 查看相关文件的实现
   - 修改并验证

### 第二次尝试仍失败

1. **深入分析**
   - 画出数据流
   - 检查类型定义
   - 验证 Schema 和数据库

2. **查看相似实现**
   - `src/modules/todos/` 中有完整例子
   - `src/modules/auth/` 有认证例子
   - 参考这些模式

### 第三次尝试仍然卡住

**停止并重新评估**：
- 文档中的规范是否适用？
- 是否需要不同的架构方式？
- 这个功能能否拆分成更小的任务？
- 是否需要外部资源（库、API）？

---

## 质量检查清单

### 提交前验证

- [ ] 编译成功：`pnpm run build` 无错误
- [ ] 格式化：`pnpm run lint` 无警告
- [ ] 功能测试：手动测试核心场景
- [ ] 数据验证：Zod schema 验证正确
- [ ] 认证检查：session 验证正确
- [ ] 错误处理：异常被正确捕获
- [ ] 性能：没有不必要的数据库查询

### 代码审查（自己）

- [ ] 变量名清晰有意义
- [ ] 函数单一职责
- [ ] 没有注释注解的复杂逻辑
- [ ] 遵循现有模式
- [ ] 没有 TODO 注释（或附带 issue 号）

---

## 快速参考

### 重要文件位置

| 功能 | 位置 |
|------|------|
| 认证 | `src/modules/auth/` |
| 待办事项 | `src/modules/todos/` |
| 仪表板 | `src/modules/dashboard/` |
| 数据库 | `src/db/schema.ts` |
| API 路由 | `src/app/api/` |
| 配置 | `next.config.ts`, `wrangler.toml` |
| 验证 Schema | `src/constants/validation.constant.ts` |

### 关键的导出

```typescript
// 认证
import { auth } from "@/lib/auth";

// 数据库
import { db } from "@/db";
import { todosTable, usersTable } from "@/db/schema";

// 工具函数
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-error";

// UI 组件
import { Button, Dialog, Form } from "@/components/ui/";
```

---

## 相关资源

- **Skills**：`.claude/skills/` 目录
- **Commands**：`.claude/commands/` 目录
- **项目文档**：根目录下的 README.md
- **数据库**：`src/db/schema.ts` 有 schema 定义

---

**更新于**：2025-11-15
**版本**：1.0
