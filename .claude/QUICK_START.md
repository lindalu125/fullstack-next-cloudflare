# 🚀 快速开始指南

快速参考，用于日常开发工作。

## 首次使用（仅一次）

```bash
# 1. 初始化环境
/setup-env

# 2. 启动开发服务器
pnpm run dev:cf

# 3. 打开浏览器
http://localhost:8787
```

## 日常开发循环

### 1️⃣ 开始新功能

```bash
# 查看类似的现有实现
ls src/modules/

# 创建新模块（如需）
mkdir -p src/modules/new-feature/{actions,components,schemas,models}

# 阅读项目指南
cat .claude/claude.md

# 创建规划文档
cat > IMPLEMENTATION_PLAN.md << 'EOF'
## Stage 1: [目标]
- **目标**：...
- **文件**：...
- **状态**：Not Started
EOF
```

### 2️⃣ 编码

```bash
# 根据模块结构编写代码
# 参考：.claude/skills/module-structure.md

# 如果涉及数据库
# 参考：.claude/skills/database-operations.md

# 如果涉及 AI
# 参考：.claude/skills/ai-integration.md

# 频繁验证编译
pnpm run build

# 如果需要数据库迁移
pnpm run db:generate --name=feature_name
pnpm run db:migrate:local
```

### 3️⃣ 验证（提交前）

```bash
# 运行完整审查
/code-review

# 或手动：
pnpm run build && pnpm run lint

# 查看改动
git diff --stat
```

### 4️⃣ 提交

```bash
# 提交消息格式
git commit -m "feat|fix|refactor: 简短描述

[具体改动]
[为什么这样做]"

# 例：
git commit -m "feat: add todo categorization

- Add category field to todos table
- Create category management UI
- Update todo list filtering

Closes #issue-123"
```

### 5️⃣ 部署

```bash
# 完整部署检查
/deploy-checklist

# 或手动：
pnpm run deploy:preview  # 预发布测试
pnpm run deploy:cf       # 生产部署
```

## 常见任务

| 任务 | 命令 | 相关文档 |
|------|------|---------|
| 启动开发 | `pnpm run dev:cf` | nextjs-cloudflare-workflow |
| 添加数据库字段 | `pnpm run db:generate --name=field_name` | database-operations |
| 查看数据库 | `pnpm run db:studio:local` | database-operations |
| 创建新模块 | `mkdir -p src/modules/feature/{actions,components,schemas}` | module-structure |
| 集成 AI | 参考 skills/ai-integration.md | ai-integration |
| 代码审查 | `/code-review` | testing-validation |
| 部署检查 | `/deploy-checklist` | nextjs-cloudflare-workflow |
| 设置密钥 | `pnpm run cf:secret KEY=VALUE` | nextjs-cloudflare-workflow |

## 文件快速导航

```
需要...                                查看...
---                                    ---
项目概览和规范                         claude.md
Next.js 开发工作流                     skills/nextjs-cloudflare-workflow.md
数据库操作（CRUD、查询等）            skills/database-operations.md
模块结构、代码模式                     skills/module-structure.md
AI 功能集成                            skills/ai-integration.md
代码质量、格式化、类型检查            skills/testing-validation.md
代码审查检查清单                       commands/code-review.md
部署前检查                             commands/deploy-checklist.md
环境初始化                             commands/setup-env.md
完整概览                               README.md
```

## 关键提醒

⚠️ **提交前必须**：
- ✅ `pnpm run build` 成功
- ✅ `pnpm run lint` 成功
- ✅ 清晰的 commit message
- ✅ 相关文档已更新

🚫 **绝对不要**：
- 提交未编译的代码
- Hardcode 敏感信息（使用 secrets）
- N+1 数据库查询
- console.log 调试代码
- 没有错误处理的 API 调用

💡 **性能检查**：
- 使用分页处理大列表
- AI 调用有超时保护（30s）
- 数据库查询有索引
- 缓存热数据

## 快速命令

```bash
# 开发
pnpm run dev:cf              # ⚡ 启动开发
pnpm run build              # 🔍 检查编译
pnpm run lint               # 📝 格式化

# 数据库
pnpm run db:generate --name=xxx  # 生成迁移
pnpm run db:migrate:local        # 本地迁移
pnpm run db:studio:local         # GUI 管理

# 验证
/code-review                # 💯 代码审查
/deploy-checklist          # ✈️ 部署检查

# 部署
pnpm run deploy:preview     # 🧪 预发布
pnpm run deploy:cf          # 🚀 生产
```

## 需要帮助？

| 问题 | 解决方案 |
|------|---------|
| TypeScript 错误 | `pnpm exec tsc --noEmit` + 查看错误 |
| 格式错误 | `pnpm run lint` 自动修复 |
| 数据库问题 | `pnpm run db:inspect:local` 查看表 |
| 忘记模块结构 | 查看 `src/modules/todos/` 参考 |
| 编译失败 | `rm -rf .next && pnpm run build` |
| 环境问题 | `/setup-env` 重置环境 |

## Token 优化

这个配置帮助你：

- 📚 **减少解释**：引用文档而不是重复解释
- ⚡ **快速上手**：skills 提供即用型代码示例
- 🎯 **精准指导**：每个 skill 针对具体任务
- 🔄 **一致性**：所有开发遵循相同规范

使用 `/clear` 命令在任务间清除历史，保持上下文高效。

---

**开始编码** 🎉
```bash
pnpm run dev:cf
```

访问 http://localhost:8787 开始开发。

遇到问题？查看相关 skill 或运行 `/code-review` 进行检查。
