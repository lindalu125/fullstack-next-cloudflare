---
name: ai-integration
description: Cloudflare AI Workers、Llama 模型、AI 总结服务的完整集成指南
---

# AI 集成指南

## Cloudflare AI 概述

Cloudflare AI 提供无服务器 AI 推理，支持多种开源模型：

| 模型 | 用途 | 输入限制 | 成本 |
|------|------|---------|------|
| `@cf/meta/llama-2-7b-chat-int8` | 文本生成、总结、对话 | 4000 tokens | 低 |
| `@cf/mistral/mistral-7b-instruct-v0.2` | 指令遵循、代码生成 | 8000 tokens | 中 |
| `@cf/meta/llama-3-8b-instruct` | 改进的文本生成 | 8000 tokens | 中 |
| `@cf/openai/whisper` | 语音转文字 | 音频文件 | 低 |
| `@cf/together/yoco-7b` | 文本生成 | 4000 tokens | 低 |

**推荐**：对于中文和英文文本处理，使用 `@cf/meta/llama-2-7b-chat-int8`

---

## 设置 AI 环境

### 1. 在 wrangler.toml 中绑定 AI

```toml
# wrangler.toml
[[ai]]
binding = "AI"

# 或在特定环境
[env.preview]
[[ai]]
binding = "AI"

[env.production]
[[ai]]
binding = "AI"
```

### 2. 生成类型定义

```bash
pnpm run cf-typegen
```

这会更新 `cloudflare-env.d.ts`，使 TypeScript 识别 `env.AI`

### 3. 在代码中访问

```typescript
const { env } = process as unknown as {
  env: {
    AI: Ai;  // Cloudflare AI 实例
  };
};
```

---

## 基本用法

### 文本生成

```typescript
// src/app/api/summarize/route.ts
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { env } = process as unknown as {
    env: { AI: Ai };
  };

  const { content } = await request.json();

  if (!content || typeof content !== "string") {
    return Response.json(
      { error: "Missing or invalid 'content' field" },
      { status: 400 }
    );
  }

  try {
    const ai = new Ai(env.AI);
    const response = await ai.run(
      "@cf/meta/llama-2-7b-chat-int8",
      {
        prompt: `请用一句话总结以下内容:\n${content}`
      }
    );

    // 响应格式：{ success: true, result: { response: "..." } }
    const summary = response.result?.response || "";

    return Response.json({
      data: { summary },
      success: true
    });
  } catch (error) {
    console.error("AI Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "AI processing failed",
        success: false
      },
      { status: 500 }
    );
  }
}
```

### 使用提示模板

```typescript
// src/services/summarizer.service.ts
import type { Ai } from "@cloudflare/workers-types";

export class SummarizerService {
  constructor(private ai: Ai) {}

  async summarize(content: string, maxLength = 100): Promise<string> {
    const prompt = `Summarize the following content in ${maxLength} characters or less:

Content:
${content}

Summary:`;

    const response = await this.ai.run(
      "@cf/meta/llama-2-7b-chat-int8",
      { prompt }
    );

    return response.result?.response || "";
  }

  async translateToEnglish(content: string): Promise<string> {
    const prompt = `Translate the following text to English:

${content}

Translation:`;

    const response = await this.ai.run(
      "@cf/meta/llama-2-7b-chat-int8",
      { prompt }
    );

    return response.result?.response || "";
  }

  async extractKeywords(content: string): Promise<string[]> {
    const prompt = `Extract 5 key words from the following text:

${content}

Keywords (comma-separated):`;

    const response = await this.ai.run(
      "@cf/meta/llama-2-7b-chat-int8",
      { prompt }
    );

    const keywords = response.result?.response || "";
    return keywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0);
  }
}
```

---

## 集成到 Todo 应用

### 1. 更新 Schema

```typescript
// src/db/schema.ts
export const todosTable = sqliteTable("todos", {
  // ... 现有字段
  summary: text("summary"),  // AI 生成的总结
  summarizedAt: text("summarized_at"),  // 总结时间
});
```

### 2. 生成迁移

```bash
pnpm run db:generate --name=add_summary_field
pnpm run db:migrate:local
```

### 3. 创建 Server Action

```typescript
// src/modules/todos/actions/summarize-todo.action.ts
"use server";

import { db } from "@/db";
import { todosTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function summarizeTodo(todoId: string): Promise<string> {
  // 验证用户
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // 获取待办项
  const todo = await db.query.todosTable.findFirst({
    where: and(
      eq(todosTable.id, todoId),
      eq(todosTable.userId, session.user.id)
    )
  });

  if (!todo) {
    throw new Error("Todo not found");
  }

  // 调用 AI API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/summarize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `${todo.title}\n${todo.description || ""}`
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  const { data } = await response.json();
  const summary = data.summary;

  // 保存到数据库
  await db
    .update(todosTable)
    .set({
      summary,
      summarizedAt: new Date().toISOString()
    })
    .where(eq(todosTable.id, todoId));

  return summary;
}
```

### 4. 创建 UI 组件

```typescript
// src/modules/todos/components/summarize-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { summarizeTodo } from "@/modules/todos/actions/summarize-todo.action";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface SummarizeButtonProps {
  todoId: string;
  onSuccess?: (summary: string) => void;
}

export function SummarizeButton({ todoId, onSuccess }: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSummarize() {
    setIsLoading(true);
    try {
      const summary = await summarizeTodo(todoId);
      toast.success("总结完成");
      onSuccess?.(summary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "总结失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSummarize}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {isLoading ? "生成中..." : "生成总结"}
    </Button>
  );
}
```

---

## 高级用法

### 批量处理

```typescript
// 并发总结多个待办项
export async function summarizeMultipleTodos(todoIds: string[]): Promise<Map<string, string>> {
  const results = await Promise.allSettled(
    todoIds.map(id => summarizeTodo(id))
  );

  const summaries = new Map<string, string>();
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      summaries.set(todoIds[index], result.value);
    }
  });

  return summaries;
}
```

### 缓存 AI 结果

```typescript
// 避免重复调用 AI（成本优化）
async function getSummaryWithCache(
  todoId: string,
  content: string
): Promise<string> {
  // 从 KV 缓存查询
  const cached = await env.KV.get(`summary:${todoId}`);
  if (cached) return cached as string;

  // 调用 AI
  const summary = await generateSummary(content);

  // 缓存 24 小时
  await env.KV.put(`summary:${todoId}`, summary, {
    expirationTtl: 86400
  });

  return summary;
}
```

### 流式响应（长内容）

```typescript
// 对于很长的内容，使用流式响应
export async function POST(request: NextRequest) {
  const { content } = await request.json();
  const ai = new Ai(env.AI);

  // 分块处理
  const chunks = content.match(/.{1,2000}/g) || [];
  const summaries: string[] = [];

  for (const chunk of chunks) {
    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      prompt: `Summarize:\n${chunk}`
    });
    summaries.push(response.result?.response || "");
  }

  return Response.json({
    data: { summary: summaries.join(" ") }
  });
}
```

---

## 错误处理和重试

### 健壮的实现

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 秒

async function generateSummaryWithRetry(
  content: string,
  retries = MAX_RETRIES
): Promise<string> {
  try {
    const response = await ai.run(
      "@cf/meta/llama-2-7b-chat-int8",
      { prompt: `Summarize:\n${content}` }
    );

    if (!response.result?.response) {
      throw new Error("Empty response from AI");
    }

    return response.result.response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry ${MAX_RETRIES - retries + 1}/${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return generateSummaryWithRetry(content, retries - 1);
    }

    throw new Error(
      `Failed to generate summary after ${MAX_RETRIES} retries: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
```

### 超时保护

```typescript
async function generateSummaryWithTimeout(
  content: string,
  timeoutMs = 30000
): Promise<string> {
  return Promise.race([
    generateSummary(content),
    new Promise<string>((_, reject) =>
      setTimeout(
        () => reject(new Error("AI request timeout")),
        timeoutMs
      )
    )
  ]);
}
```

---

## 成本优化

### 1. 条件调用

```typescript
// ❌ 低效：总是调用 AI
async function createTodo(data) {
  const summary = await generateSummary(data.description);
  // ...
}

// ✅ 高效：只在需要时调用
async function createTodo(data) {
  let summary: string | undefined;
  if (data.shouldSummarize) {  // 可选参数
    summary = await generateSummary(data.description);
  }
  // ...
}
```

### 2. 缓存结果

```typescript
// 使用 KV 存储避免重复调用
const cacheKey = `ai:${hashContent(content)}`;
const cached = await env.KV.get(cacheKey);
if (cached) return cached;

const result = await ai.run(...);
await env.KV.put(cacheKey, result, { expirationTtl: 604800 });  // 7 天
```

### 3. 批量处理

```typescript
// 合并请求
const summaries = await Promise.all(
  todos.map(t => generateSummary(t.content))
);
// 比逐个调用更高效
```

---

## 测试 AI 功能

### 本地测试

```bash
# 测试 API 端点
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"content": "这是待总结的内容"}'
```

### 使用 REST Client 扩展

```http
POST http://localhost:3000/api/summarize
Content-Type: application/json

{
  "content": "这是一个关于Node.js的详细介绍。Node.js是一个基于Chrome V8引擎的JavaScript运行时环境。它允许开发者使用JavaScript编写服务器端代码。Node.js具有高效、轻量级、可扩展等特点。"
}
```

---

## 常见问题

### Q：如何处理 AI 超时？
A：使用 Promise.race 和 retry 逻辑：
```typescript
const result = await Promise.race([
  ai.run(...),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 30000)
  )
]);
```

### Q：如何减少 AI 调用成本？
A：
1. 缓存结果（KV 存储）
2. 批量处理
3. 条件调用（只在需要时）
4. 使用更小的模型

### Q：支持哪些语言？
A：Llama 2 支持多种语言，但对英文优化更好。对中文有基本支持。

### Q：响应格式是什么？
A：
```javascript
{
  success: true,
  result: {
    response: "生成的文本内容"
  }
}
```

### Q：如何处理 API 密钥？
A：在 Cloudflare 中，API 密钥是自动管理的。无需手动设置。
