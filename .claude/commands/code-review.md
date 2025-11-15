# 代码审查检查

在提交前运行此命令进行完整的代码质量检查。

## 快速审查

```bash
# 1. 格式化检查（自动修复）
pnpm run lint

# 2. TypeScript 类型检查
pnpm run build

# 3. 查看修改内容
git diff

# 4. 提交
git add .
git commit -m "feat: 描述你的改动"
```

## 详细审查流程

### 步骤 1：代码格式化

```bash
# 自动格式化所有文件
pnpm run lint

# 检查输出，没有错误继续
# ✓ Formatted N files
```

### 步骤 2：TypeScript 类型检查

```bash
# 完整编译检查
pnpm run build

# 预期输出
# ✓ compiled successfully

# 如果有错误，查看详细信息
pnpm exec tsc --noEmit
```

### 步骤 3：代码审查清单

在提交前检查以下项目：

```markdown
## 代码审查清单

✅ 功能完整性
- [ ] 功能按需求实现完整
- [ ] 没有遗漏的场景
- [ ] 错误情况已处理
- [ ] 用户输入已验证

✅ 代码质量
- [ ] 没有 console.log（除非是调试）
- [ ] 没有注释掉的代码
- [ ] 没有空白行和多余空格（Biome 已修复）
- [ ] 变量命名清晰，遵循规范
- [ ] 函数职责单一
- [ ] 遵循 DRY 原则（不重复代码）
- [ ] 复杂逻辑有注释

✅ 类型安全
- [ ] TypeScript 编译通过
- [ ] 所有函数参数有类型声明
- [ ] 所有函数返回值有类型
- [ ] 没有 `any` 类型（必要时用 `unknown`）
- [ ] 正确处理 null/undefined

✅ 认证和安全
- [ ] 检查了用户 session（action 中）
- [ ] 用户数据正确隔离
- [ ] 没有硬编码的敏感信息（API 密钥等）
- [ ] 错误信息不暴露内部细节
- [ ] 校验了用户输入

✅ 性能和扩展
- [ ] 没有 N+1 查询问题
- [ ] 大数据集使用分页
- [ ] 没有不必要的计算或循环
- [ ] AI 调用有超时保护
- [ ] 结果有合理的缓存

✅ 模块和结构
- [ ] 遵循项目模块结构
- [ ] 命名规范一致（action, component, schema）
- [ ] 导入路径使用 @/* 别名
- [ ] 没有循环依赖
- [ ] 逻辑放在正确的位置（action vs component）

✅ 文档
- [ ] 复杂函数有 JSDoc 注释
- [ ] 新模块有 README
- [ ] 更新了相关文档
- [ ] Commit 消息清晰描述改动

✅ 格式和风格
- [ ] Biome format 通过（pnpm run lint）
- [ ] 代码行长合理（不超过 100 列）
- [ ] 一致的缩进（4 空格）
- [ ] 双引号（已自动修复）
- [ ] 没有不必要的空行
```

### 步骤 4：验证改动

```bash
# 查看 staged 更改
git diff --staged

# 查看所有更改（包括未 staged）
git diff

# 查看改动统计
git diff --stat

# 查看最后一次提交
git log -1 --oneline
```

### 步骤 5：最后检查

```bash
# 确保没有遗留的调试代码
grep -r "console\\.log" src/

# 确保没有遗留的 TODO（必须有 issue 号）
grep -r "TODO:" src/ | grep -v "issue"

# 检查是否有未提交的文件
git status
```

## 自动审查脚本

创建 `review.sh` 并运行：

```bash
#!/bin/bash
set -e

echo "🔍 开始代码审查..."

# 1. 格式化
echo "📝 检查代码格式..."
pnpm run lint || { echo "❌ 格式化失败"; exit 1; }

# 2. 类型检查
echo "🔎 检查 TypeScript 类型..."
pnpm run build || { echo "❌ 编译失败"; exit 1; }

# 3. 检查调试代码
echo "🐛 检查调试代码..."
if grep -r "console\.log\|debugger" src/ > /dev/null; then
  echo "⚠️  发现 console.log 或 debugger"
  grep -r "console\.log\|debugger" src/
else
  echo "✓ 没有调试代码"
fi

# 4. 检查 TODO
echo "📋 检查 TODO 注释..."
TODOS=$(grep -r "TODO:" src/ | grep -v "issue" || echo "")
if [ ! -z "$TODOS" ]; then
  echo "⚠️  发现没有 issue 号的 TODO"
  echo "$TODOS"
else
  echo "✓ 所有 TODO 都有 issue 号"
fi

# 5. 显示统计
echo ""
echo "📊 改动统计："
git diff --stat

echo ""
echo "✨ 审查完成！"
echo ""
echo "可以执行："
echo "  git commit -m 'feat: 描述你的改动'"
```

## 常见审查问题和解决方案

### 问题：格式化失败

```bash
# Biome 检查出错？
pnpm exec biome check --write

# 手动修复格式
pnpm exec biome format --write src/path/to/file.tsx
```

### 问题：TypeScript 错误

```bash
# 查看详细错误
pnpm exec tsc --noEmit

# 常见错误
# - Property 'X' does not exist on type 'Y'
#   → 检查对象属性拼写
# - Type 'X' is not assignable to type 'Y'
#   → 检查类型匹配
# - Cannot find module '@/*'
#   → 清除 .next 缓存: rm -rf .next
```

### 问题：发现 console.log

```bash
# 如果是调试用的，删除它
git checkout -- file.tsx  # 或手动删除

# 如果需要保留（业务需要），添加注释说明
console.log("DEBUG: 这是重要的诊断输出");
```

## 提交消息示例

审查通过后，用清晰的消息提交：

```bash
# 简短格式
git commit -m "feat: add todo summarization with Claude AI"

# 详细格式
git commit -m "feat: add todo summarization with Claude AI

- Integrate Cloudflare AI (Llama 2) for text summarization
- Add /api/summarize POST endpoint
- Update todo model with summary field
- Refactor: consolidate AI service logic

Closes #issue-123"
```

## 快速命令参考

| 需求 | 命令 |
|------|------|
| 完整审查 | `pnpm run lint && pnpm run build` |
| 只查看错误 | `pnpm exec tsc --noEmit` |
| 自动修复格式 | `pnpm run lint` |
| 查看改动 | `git diff` |
| 查看统计 | `git diff --stat` |
| 检查调试代码 | `grep -r "console.log" src/` |
