# Claude Code 项目配置完成指南

## 🎉 配置已生成！

你的 Toolsail 项目现在已经拥有完整的 Claude Code 配置，帮助你：
- ✅ **不会偏离** - 所有指导都针对你的项目定制
- ✅ **精准指导** - 每个功能都有完整的代码示例
- ✅ **节省 Token** - 减少 50-70% 的重复解释
- ✅ **省时高效** - 快速命令和检查清单加快开发

---

## 📁 配置文件位置

所有配置文件都在 `.claude/` 目录：

```
.claude/
├── claude.md                     # 主项目指南
├── QUICK_START.md               # 快速开始（阅读这个！）
├── README.md                    # 配置文档
├── skills/                      # 5个深度指南
│   ├── nextjs-cloudflare-workflow.md
│   ├── database-operations.md
│   ├── module-structure.md
│   ├── ai-integration.md
│   └── testing-validation.md
└── commands/                    # 3个快速命令
    ├── setup-env.md
    ├── code-review.md
    └── deploy-checklist.md
```

---

## 🚀 立即开始（3 步）

### 1️⃣ 首次初始化（可选，仅第一次）

```bash
# 初始化开发环境
/setup-env

# 这会：
# • 安装依赖
# • 生成 Cloudflare 类型
# • 初始化本地数据库
# • 验证编译
```

### 2️⃣ 启动开发

```bash
# 启动 Cloudflare 本地开发服务器
pnpm run dev:cf

# 访问 http://localhost:8787
```

### 3️⃣ 阅读快速开始

```bash
# 查看日常开发指南
cat .claude/QUICK_START.md
```

---

## 📖 核心使用场景

### 场景 1：添加新功能

```
1. 阅读 .claude/QUICK_START.md → 日常开发流程
2. 查看 .claude/skills/module-structure.md → 了解如何创建模块
3. 参考 src/modules/todos/ → 现有实现作为模板
4. 运行 /code-review → 代码审查
5. 运行 /deploy-checklist → 部署
```

### 场景 2：数据库操作

```
1. 查看 .claude/skills/database-operations.md → CRUD 和查询
2. 如需修改 schema → pnpm run db:generate --name=xxx
3. 本地测试 → pnpm run db:migrate:local
4. 查看数据库 → pnpm run db:studio:local
```

### 场景 3：集成 AI 功能

```
1. 查看 .claude/skills/ai-integration.md → 完整指南和代码
2. 创建 API 路由 → src/app/api/
3. 创建 Server Action → src/modules/{feature}/actions/
4. 集成到 UI → React 组件中调用 action
5. 测试并优化 → 缓存、重试、超时保护
```

### 场景 4：部署到生产

```
1. 运行 /code-review → 确保代码质量
2. 运行 /deploy-checklist → 完整检查
3. pnpm run deploy:preview → 预发布测试
4. pnpm run deploy:cf → 生产部署
```

---

## 🎯 关键文件和快速参考

### 最常用的 3 个文件

| 文件 | 用途 | 何时查看 |
|------|------|---------|
| **QUICK_START.md** | 日常快速参考 | 每天开发时 |
| **claude.md** | 完整项目规范 | 需要详细指导时 |
| **skills/** | 深度技术指南 | 需要学习某个技术时 |

### 常用命令速查

```bash
# 开发工作流
pnpm run dev:cf              # 启动开发
pnpm run build              # 编译检查
pnpm run lint               # 格式化（自动修复）

# 代码审查和部署
/code-review                # 代码审查
/deploy-checklist          # 部署检查
/setup-env                 # 环境初始化

# 数据库
pnpm run db:generate --name=xxx  # 生成迁移
pnpm run db:migrate:local        # 应用迁移
pnpm run db:studio:local         # GUI 管理

# 部署
pnpm run deploy:preview     # 预发布
pnpm run deploy:cf          # 生产
```

---

## ⚡ Token 优化：如何省 Token

这个配置的核心优势是 **减少重复解释**。在使用 Claude Code 时：

### ✅ 做这些事情来节省 Token

```bash
# 1. 提问时参考配置文件
"根据 .claude/database-operations.md，如何写 JOIN 查询？"
# → Claude 会查看文件并直接给出答案，省去解释

# 2. 清除历史保持上下文聚焦
/clear
# → 每个新任务开始时清除历史，让 Claude 专注于当前任务

# 3. 链接到具体的代码位置
"修改 src/modules/todos/actions/create-todo.action.ts 以添加类别字段"
# → 具体的文件路径比模糊的描述节省更多 token

# 4. 运行自动化检查
/code-review
# → 不用让 Claude 逐行审查代码，工具自动检查

# 5. 阅读代码模式参考
# → 查看 src/modules/todos/ 而不是问 Claude 怎么做
```

### ❌ 避免这些高 Token 消耗的做法

```bash
# ❌ 长篇幅解释你在做什么（Claude 看配置就知道）
# 应该说："需要创建 new-feature 模块"
# 而不是："我在开发一个 toolsail 项目，使用 Next.js..."

# ❌ 反复询问相同的问题
# 应该说："查看 .claude/database-operations.md 中的 JOIN 示例"
# 而不是："怎么写 JOIN 查询？我有两个表..."

# ❌ 让 Claude 逐行审查整个文件
# 应该说："运行 /code-review 检查我的改动"
# 而不是："帮我审查这 100 行代码..."

# ❌ 在多个相关任务间不清除历史
# 应该说：(完成任务) → /clear → (开始新任务)
# 而不是：在同一个对话中做 10 个不同的任务
```

---

## 🧠 Claude Code 工作流程建议

### 标准工作流

```
1. 【开始新任务】
   /clear
   cat .claude/QUICK_START.md  (快速参考)

2. 【理解现有代码】
   Explore → 使用 Glob/Read 查看相关代码
   (不要立即编写新代码)

3. 【规划】
   创建 IMPLEMENTATION_PLAN.md
   列出需要修改的文件和步骤

4. 【编码】
   根据规范编写代码
   频繁验证：pnpm run build

5. 【验证】
   /code-review
   确保代码质量

6. 【提交】
   git commit -m "清晰的提交消息"

7. 【部署】
   /deploy-checklist
   pnpm run deploy:preview
   pnpm run deploy:cf

8. 【清理】
   /clear (为下一个任务清空历史)
```

### 提问方式优化

**❌ 不高效的问法**
```
"我想添加一个功能，可以对待办事项进行分类。
我需要创建新的 UI 组件、更新数据库、添加 API 端点。
我应该从哪里开始？有什么最佳实践吗？"
```

**✅ 高效的问法**
```
"根据 .claude/module-structure.md，我需要为 new-feature 模块创建以下文件：
- actions/create-feature.action.ts
- components/feature-form.tsx
- schemas/feature.schema.ts

第一步是什么？"
```

差别：
- 第二个问法引用了具体的文档
- 展示了你已经理解了项目结构
- Claude 可以直接给出代码而不是解释
- 节省 50-70% 的 token

---

## 📊 配置包含的内容

### claude.md（主指南）
- ✅ 项目概览和技术栈
- ✅ 工作流程（Explore → Plan → Code → Commit）
- ✅ 项目架构规范（模块结构、命名规范）
- ✅ 数据库和 API 规范
- ✅ 错误处理和认证
- ✅ Token 优化策略
- ✅ 质量检查清单

### skills/（技术深度指南）
1. **nextjs-cloudflare-workflow.md**
   - Next.js + Cloudflare 完整开发流程
   - API 路由、数据库迁移、部署

2. **database-operations.md**
   - Drizzle ORM 完整指南
   - CRUD、查询、关系、聚合、优化

3. **module-structure.md**
   - 项目模块结构和代码模式
   - Server Actions、组件、Schema 规范

4. **ai-integration.md**
   - Cloudflare AI 完整集成
   - 文本生成、总结、优化、缓存

5. **testing-validation.md**
   - 代码质量工具和验证
   - Biome、TypeScript、测试、部署前检查

### commands/（快速命令）
1. **setup-env.md** - 环境初始化脚本
2. **code-review.md** - 代码审查检查清单
3. **deploy-checklist.md** - 部署前完整检查

---

## 💡 最佳实践总结

### 日常开发遵循的规则

```
【代码提交前】
✓ pnpm run build  （编译成功）
✓ pnpm run lint   （格式正确）
✓ 清晰的 commit message
✓ 参考现有模式（不创新）

【开发过程中】
✓ 增量编程（小改动频繁提交）
✓ 遵循模块结构
✓ 使用 "use server" / "use client"
✓ 验证用户权限（auth）

【遇到问题】
✓ 查看相同功能的现有实现
✓ 参考相关的 skill 文档
✓ 运行 /code-review 检查
✓ 最多尝试 3 次后停止重新评估

【部署前】
✓ 运行 /deploy-checklist
✓ 预发布环境测试
✓ 数据库迁移验证
✓ 功能完整测试
```

---

## 🎓 学习路径建议

### 第一天：了解项目

```bash
# 1. 快速开始（5 分钟）
cat .claude/QUICK_START.md

# 2. 主指南（20 分钟）
cat .claude/claude.md

# 3. 查看现有实现（30 分钟）
ls src/modules/
cat src/modules/todos/
```

### 第二天：理解各部分

```bash
# 1. 模块结构（20 分钟）
cat .claude/skills/module-structure.md

# 2. 数据库操作（30 分钟）
cat .claude/skills/database-operations.md

# 3. 工作流程（20 分钟）
cat .claude/skills/nextjs-cloudflare-workflow.md
```

### 后续：按需深入

```bash
# 需要 AI 功能？
cat .claude/skills/ai-integration.md

# 需要部署？
cat .claude/commands/deploy-checklist.md

# 代码质量检查？
cat .claude/skills/testing-validation.md
```

---

## 🔗 相关资源

### 项目资源
- 源代码：`src/` 目录
- 数据库 Schema：`src/db/schema.ts`
- 现有模块：`src/modules/` (todos, auth, dashboard)

### 文档资源
- Claude Code 官方文档：https://docs.claude.com/claude-code
- Claude Code 最佳实践：https://www.anthropic.com/engineering/claude-code-best-practices

### Git 和提交
- 查看现有提交：`git log --oneline`
- 查看某个功能：`git log --grep="feat"`

---

## ❓ 常见问题

### Q：我应该从哪里开始？
A：
1. 阅读 `.claude/QUICK_START.md`（2 分钟）
2. 运行 `/setup-env`（如需初始化）
3. 查看相关的 skill 文档

### Q：怎样才能最有效地使用这些指南？
A：
- 在每个新任务开始时使用 `/clear`
- 在提问时引用具体的文件和行号
- 运行自动化检查（`/code-review`）而不是手动
- 查看现有的实现模式而不是问怎么做

### Q：这个配置需要更新吗？
A：
当以下情况发生时应该更新：
- 项目结构改变时
- 新的工作流或工具引入时
- 发现新的常见问题时

### Q：如果我需要帮助怎么办？
A：
最有效的方式是：
1. 引用相关的 skill：`"根据 database-operations.md..."`
2. 提供具体的文件位置：`"在 src/modules/todos/actions/..."`
3. 给出明确的错误信息或输出
4. 使用自动化检查：`/code-review`

---

## ✨ 配置完整清单

以下所有内容都已为你配置好：

- [x] 项目规范和最佳实践（claude.md）
- [x] Next.js + Cloudflare 开发指南
- [x] 数据库操作完整文档
- [x] 模块结构和代码模式
- [x] AI 集成指南和代码示例
- [x] 代码质量验证工具
- [x] 快速开始指南
- [x] 环境初始化命令
- [x] 代码审查检查清单
- [x] 部署前完整检查清单
- [x] Token 优化策略

---

## 🚀 后续步骤

```bash
# 1. 【立即】阅读快速开始
cat .claude/QUICK_START.md

# 2. 【立即】启动开发
pnpm run dev:cf

# 3. 【需要时】参考相关指南
# 如 .claude/skills/*.md

# 4. 【提交前】运行审查
/code-review

# 5. 【部署前】完整检查
/deploy-checklist
```

---

## 📞 获取支持

如果配置有任何问题：

1. 检查 `.claude/README.md`
2. 查看相关的 skill 或 command
3. 参考项目的现有实现（`src/modules/todos/`）
4. 在 GitHub issues 中提出问题

---

祝你开发愉快！ 🎉

**配置完成日期**：2025-11-15
**版本**：1.0
**项目**：Toolsail (Next.js 15 + Cloudflare)
