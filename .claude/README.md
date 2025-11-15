# Claude Code 项目配置

这个目录包含为 Toolsail (Next.js + Cloudflare) 项目定制的 Claude Code 配置。

## 文件结构

```
.claude/
├── claude.md                      # 主要项目指南
├── skills/                        # 可重用的技能模块
│   ├── nextjs-cloudflare-workflow.md    # Next.js + Cloudflare 开发流程
│   ├── database-operations.md           # Drizzle ORM + D1 数据库操作
│   ├── module-structure.md              # 项目模块结构和最佳实践
│   ├── ai-integration.md                # Cloudflare AI 集成指南
│   └── testing-validation.md            # 代码质量验证
├── commands/                      # 快速命令
│   ├── setup-env.md              # 环境初始化
│   ├── code-review.md            # 代码审查检查
│   └── deploy-checklist.md       # 部署前检查
└── README.md                      # 本文件
```

## 快速开始

### 首次设置

```bash
# 1. 阅读主指南
cat .claude/claude.md

# 2. 初始化环境
/setup-env

# 3. 开始开发
pnpm run dev:cf
```

### 开发工作流

```
探索 → 规划 → 编码 → 审查 → 提交 → 部署
```

1. **探索**（Explore）：理解现有代码
2. **规划**（Plan）：创建 IMPLEMENTATION_PLAN.md
3. **编码**（Code）：实现功能，频繁编译验证
4. **审查**（Code Review）：运行 `/code-review` 检查
5. **提交**（Commit）：清晰的提交消息
6. **部署**（Deploy）：运行 `/deploy-checklist`

## 核心指南（claude.md）

**位置**：`.claude/claude.md`

**包含内容**：
- 项目概览（技术栈）
- 核心工作流程（Explore → Plan → Code → Commit）
- 项目架构规范（模块结构、命名规范）
- 数据库操作规范
- API 路由规范
- Token 优化策略
- 常用命令速查
- 错误处理规范
- 质量检查清单

**何时使用**：
- 开始新的开发任务时
- 需要项目特定指导时
- 检查架构规范时
- 提交前进行最终检查时

## Skills（技能模块）

每个 skill 都是一个深度指南，自动被 Claude Code 发现和使用。

### 1. **nextjs-cloudflare-workflow.md**

**用途**：Next.js 15 + Cloudflare Workers 的完整开发流程

**包含**：
- 本地开发环境设置
- API 路由开发
- Cloudflare AI、R2、D1 集成
- 构建和部署流程
- 数据库迁移管理
- 环境变量设置
- 调试技巧
- 常见问题排查

**何时触发**：
- 关于开发工作流的问题
- API 路由开发
- 数据库迁移问题
- 部署和构建问题

### 2. **database-operations.md**

**用途**：Drizzle ORM + Cloudflare D1 的完整数据库指南

**包含**：
- CRUD 操作（Create, Read, Update, Delete）
- 查询条件和排序
- 关系查询和 JOIN
- 聚合查询（COUNT, SUM, AVG）
- Server Actions 中的数据库使用
- 事务（Transactions）
- Schema 定义和类型
- 性能优化技巧
- 常见错误和解决方案

**何时触发**：
- 关于数据库操作的问题
- 需要编写复杂查询时
- Schema 设计问题
- 性能优化问题

### 3. **module-structure.md**

**用途**：项目模块结构和代码模式

**包含**：
- 总体项目结构
- 模块内部结构详解
- Server Actions 标准模板
- React 组件规范
- Zod Schema 规范
- 模型和枚举定义
- 页面组件规范
- 模块之间的通信
- 添加新模块的步骤
- 命名规范和质量清单

**何时触发**：
- 创建新功能或模块
- 代码组织问题
- 命名规范问题
- 模块结构问题

### 4. **ai-integration.md**

**用途**：Cloudflare AI Workers 的完整集成指南

**包含**：
- Cloudflare AI 概述和模型选择
- 环境设置和类型生成
- 基本用法（文本生成、总结等）
- 集成到 Todo 应用的完整示例
- 高级用法（批量处理、缓存、流式响应）
- 错误处理和重试
- 成本优化
- 测试方法
- 常见问题解答

**何时触发**：
- 集成 AI 功能
- 需要文本总结或生成功能
- 关于 Cloudflare AI 的问题
- AI 成本优化

### 5. **testing-validation.md**

**用途**：代码质量保证、验证和测试

**包含**：
- 质量工具链（Biome, TypeScript）
- Biome 代码格式化和 Linting
- TypeScript 类型检查
- 代码审查检查清单
- 自动化验证流程
- 常见错误和修复
- 数据库正确性验证
- API 端点验证
- 性能验证
- 部署前验证清单

**何时触发**：
- 代码质量问题
- TypeScript 错误
- 格式化问题
- 需要进行代码审查

## Commands（快速命令）

快速命令在 Claude Code 中通过 `/` 快捷方式访问。

### 1. **setup-env.md**（环境初始化）

**命令**：`/setup-env`

**快速作用**：
```bash
pnpm install
pnpm run cf-typegen
pnpm run db:migrate:local
pnpm run build
```

**用于**：
- 首次项目设置
- 重置开发环境
- 新开发者 onboarding
- 解决环境问题

### 2. **code-review.md**（代码审查）

**命令**：`/code-review`

**快速作用**：
```bash
pnpm run lint && pnpm run build
git diff --stat
```

**用于**：
- 提交前的自检
- 代码质量验证
- 发现潜在问题
- 准备提交消息

**包含的检查清单**：
- 功能完整性
- 代码质量
- 类型安全
- 认证和安全
- 性能
- 模块结构
- 文档

### 3. **deploy-checklist.md**（部署检查）

**命令**：`/deploy-checklist`

**快速作用**：
```bash
pnpm run build && pnpm run lint
pnpm run deploy:preview
# 测试预发布环境
pnpm run deploy:cf
```

**用于**：
- 部署前的完整检查
- 预发布环境验证
- 确保部署安全
- 回滚计划准备

**包含的检查项**：
- 代码和质量
- 数据库检查
- 安全检查
- 性能检查
- 功能检查
- 文档检查
- 预发布测试
- 回滚计划

## 使用流程示例

### 场景 1：添加新功能（例：待办分类）

```
1. 研究现有代码
   → 查看 src/modules/todos/ 的结构
   → 理解 schema、actions、components 的模式

2. 规划（打开 claude.md）
   → 确认模块结构
   → 列出需要修改的文件

3. 编码（边编码边验证）
   → 更新 schema （database-operations）
   → 创建 actions （module-structure）
   → 创建组件 （module-structure）

4. 验证编译
   → 运行 /code-review
   → 检查 TypeScript 和 Biome

5. 数据库迁移（如需）
   → 按照 nextjs-cloudflare-workflow 生成迁移
   → 本地测试：pnpm run db:migrate:local

6. 提交
   → 清晰的 commit 消息
   → 参考 claude.md 的提交规范

7. 部署
   → 运行 /deploy-checklist
   → 预发布环境测试
   → 生产部署
```

### 场景 2：整合 AI 功能（例：自动总结）

```
1. 学习 AI 集成指南
   → 打开 skills/ai-integration.md
   → 理解 Cloudflare AI 的工作原理

2. 设计数据流
   → 更新 schema（database-operations）
   → 创建 API 路由（nextjs-cloudflare-workflow）
   → 创建 Server Action

3. 实现
   → 遵循 ai-integration.md 的代码示例
   → 添加错误处理和重试
   → 实现缓存优化

4. 测试
   → 按 testing-validation.md 进行验证
   → 测试 API 端点（curl 或 REST Client）

5. 优化
   → 成本优化（条件调用、缓存）
   → 性能优化（超时设置）

6. 部署
   → /code-review 确保代码质量
   → /deploy-checklist 完整部署流程
```

## 关键概念

### 工作流：Explore → Plan → Code → Commit

1. **Explore**：不编写代码，只读和理解
2. **Plan**：创建 IMPLEMENTATION_PLAN.md，列出步骤
3. **Code**：增量编程，频繁验证编译
4. **Commit**：清晰的提交消息，说明"为什么"

### Token 优化

- 使用 `/clear` 命令清除历史，保持上下文聚焦
- 读取小文件而不是大文件
- 使用 `Glob` 和 `Grep` 而不是 `find` 和 `cat`
- 利用这些文件减少解释工作量

### 质量标准

提交前必须满足：
- ✅ 编译成功（`pnpm run build`）
- ✅ 格式正确（`pnpm run lint`）
- ✅ 类型安全（TypeScript 无错误）
- ✅ 测试通过（如有）
- ✅ 文档更新
- ✅ 提交消息清晰

## 常用命令速查

```bash
# 开发
pnpm run dev:cf              # Cloudflare 本地开发
pnpm run build              # 编译检查
pnpm run lint               # 格式化

# 数据库
pnpm run db:generate --name=xxx     # 生成迁移
pnpm run db:migrate:local           # 应用迁移
pnpm run db:inspect:local           # 查看表
pnpm run db:studio:local            # 数据库 GUI

# 部署
pnpm run deploy:preview     # 预发布部署
pnpm run deploy:cf          # 生产部署

# AI + 环境
pnpm run cf:secret KEY=value    # 设置密钥
pnpm run cf-typegen             # 生成类型
```

## 相关资源

- **官方最佳实践**：https://www.anthropic.com/engineering/claude-code-best-practices
- **Claude Code 文档**：https://docs.claude.com/claude-code
- **项目 README**：根目录的 README.md
- **GitHub 仓库**：项目的 Git 历史

## 获取帮助

在开发过程中：

1. **检查相关 skill**
   - 关于工作流？→ `claude.md`
   - 关于数据库？→ `skills/database-operations.md`
   - 关于模块？→ `skills/module-structure.md`

2. **运行快速命令**
   - 代码审查？→ `/code-review`
   - 需要部署？→ `/deploy-checklist`
   - 环境问题？→ `/setup-env`

3. **查看 Git 历史**
   - 如何做 X？→ `git log --oneline` 查看相似改动
   - 模式是什么？→ 查看 `src/modules/todos/` 的完整实现

4. **提问 Claude**
   - 按照提供的指南描述问题
   - Claude 会自动参考这些配置
   - 提供具体的错误信息和文件路径

## 维护和更新

这个配置应该随着项目发展而更新：

- 新的 skill：当发现重复的指导模式时
- 新的 command：当创建新的工作流时
- 更新 claude.md：当项目规范改变时
- 更新 skills：当技术栈改变时

**更新时机**：
- 功能完成后
- 工作流优化后
- 遇到新的常见问题时
- 团队规范改变时

---

**最后更新**：2025-11-15
**版本**：1.0
**适用项目**：Toolsail (Next.js 15 + Cloudflare)
