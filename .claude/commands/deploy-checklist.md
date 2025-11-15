# 部署前检查清单

在部署到 Cloudflare 前运行此检查清单，确保应用质量和安全。

## 快速部署流程

```bash
# 1. 确保代码质量
pnpm run build && pnpm run lint

# 2. 生成迁移（如有数据库改动）
pnpm run db:generate --name=meaningful_name

# 3. 部署到预发布环境
pnpm run deploy:preview

# 4. 测试预发布环境
# 访问返回的 URL，进行全面测试

# 5. 部署到生产
pnpm run deploy:cf
```

## 详细部署检查清单

### 📋 代码和质量

```markdown
## 代码检查
- [ ] 所有测试通过（如有）
- [ ] `pnpm run build` 编译成功
- [ ] `pnpm run lint` 格式正确
- [ ] TypeScript 没有类型错误
- [ ] 没有注释掉的代码
- [ ] 没有 console.log 调试代码
- [ ] 没有 TODO 注释（或都有 issue 号）

## 代码审查
- [ ] 自己审查了所有改动
- [ ] 提交消息清晰
- [ ] 功能完整且符合需求
- [ ] 边界情况都处理了
```

### 🗄️ 数据库检查

```markdown
## 数据库迁移
- [ ] 新的 schema 改动已生成迁移文件
- [ ] 迁移文件在 src/drizzle/migrations/
- [ ] 本地测试迁移：`pnpm run db:migrate:local`
- [ ] 检查本地表：`pnpm run db:inspect:local`
- [ ] 预发布测试迁移：`pnpm run db:migrate:preview`
- [ ] 预发布验证表：`pnpm run db:inspect:preview`

## 数据安全
- [ ] 没有数据丢失风险（如有 DROP，确保备份）
- [ ] 用户数据隔离正确
- [ ] 敏感数据加密（如需）
- [ ] 备份策略已确认
```

### 🔐 安全检查

```markdown
## 认证授权
- [ ] 所有 API 都检查了 session
- [ ] 用户只能访问自己的数据
- [ ] 管理员功能有权限检查
- [ ] CORS 配置正确

## 敏感信息
- [ ] 没有硬编码的 API 密钥
- [ ] 没有硬编码的个人信息
- [ ] 错误消息不暴露内部细节
- [ ] 日志中没有敏感数据

## Secrets 管理
- [ ] 所有 secrets 已通过 `pnpm run cf:secret` 设置
- [ ] 预发布和生产环境 secrets 都设置了
- [ ] 没有密钥遗漏
```

### ⚡ 性能检查

```markdown
## 查询优化
- [ ] 没有 N+1 数据库查询
- [ ] 大数据集使用分页
- [ ] 复杂查询有索引（如需）
- [ ] 不必要的查询已删除

## 超时和限制
- [ ] API 请求有超时设置
- [ ] AI 调用有超时保护（30 秒左右）
- [ ] 上传文件有大小限制
- [ ] 列表有合理的分页大小

## 缓存策略
- [ ] 热数据有缓存（KV 或内存）
- [ ] 缓存 TTL 设置合理
- [ ] 缓存失效逻辑正确
```

### 🚀 功能检查

```markdown
## 核心功能
- [ ] 所有主要功能在预发布环境测试通过
- [ ] 认证流程完整（登录、注册、登出）
- [ ] 数据创建、读取、更新、删除都测试了
- [ ] 错误处理（网络错误、服务器错误等）

## AI 功能（如有）
- [ ] AI 调用在预发布环境成功
- [ ] 提示词没有 hardcode 敏感信息
- [ ] 长内容处理（分块或流式）
- [ ] 缓存避免重复调用

## 用户体验
- [ ] 加载指示正常
- [ ] 错误提示清晰（toast 消息）
- [ ] 表单验证错误提示
- [ ] 没有死链接或 404 页面
```

### 📝 文档和交接

```markdown
## 文档更新
- [ ] README.md 已更新
- [ ] 新功能有文档说明
- [ ] API 端点有注释
- [ ] 复杂逻辑有代码注释

## 部署文档
- [ ] 部署步骤已记录
- [ ] 回滚步骤已准备
- [ ] 已知问题已记录
- [ ] 紧急联系方式已列出

## 其他
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新（如使用语义化）
- [ ] 团队成员已通知
```

### 🔄 预发布环境测试

```markdown
## 部署预发布
```bash
# 1. 部署到预发布
pnpm run deploy:preview

# 返回的 URL 用于测试
# 例：https://project-preview.example.workers.dev
```

## 功能测试（预发布）
- [ ] 访问首页，加载正常
- [ ] 用户认证流程：注册 → 登录 → 登出
- [ ] 核心功能：创建待办 → 编辑 → 完成 → 删除
- [ ] 搜索和过滤功能
- [ ] AI 功能（如有）：调用成功，结果正确
- [ ] 上传文件（如有）：上传、下载成功
- [ ] 错误处理：触发一些错误场景

## 性能和稳定性
- [ ] 页面加载快速（< 3 秒）
- [ ] 交互响应迅速（< 1 秒）
- [ ] 没有控制台错误（F12 检查）
- [ ] 没有明显的 UI bug
```

### 🚀 生产部署

```markdown
## 最终检查
- [ ] 预发布测试完全通过
- [ ] 所有改动已提交
- [ ] 没有未提交的文件
- [ ] 最新的代码在 main 分支

## 生产部署
```bash
pnpm run deploy:cf
```
OR
```bash
pnpm run deploy
```

## 部署后
- [ ] 验证生产 URL 可访问
- [ ] 检查生产环境功能
- [ ] 监视日志查看错误
- [ ] 确认用户反馈正常
```

## 部署完整脚本

创建 `deploy.sh`：

```bash
#!/bin/bash
set -e

echo "🚀 开始部署流程..."

# 1. 代码质量检查
echo "📝 代码检查..."
pnpm run build || { echo "❌ 编译失败"; exit 1; }
pnpm run lint || { echo "❌ 格式检查失败"; exit 1; }

# 2. 数据库检查（如有改动）
if git diff HEAD~1 src/db/schema.ts > /dev/null 2>&1; then
  echo "🗄️  检测到数据库改动"
  pnpm run db:generate --name=auto_generated || true
fi

# 3. 确认分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ 必须在 main 分支部署"
  exit 1
fi

# 4. 确认没有未提交的改动
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 有未提交的改动，请先提交"
  git status
  exit 1
fi

# 5. 部署到预发布
echo "📦 部署到预发布环境..."
pnpm run deploy:preview

echo ""
echo "✅ 部署到预发布成功！"
echo ""
echo "请访问预发布 URL 进行测试"
echo "测试通过后运行："
echo "  pnpm run deploy:cf"

# 可选：自动部署到生产（谨慎！）
# echo ""
# read -p "继续部署到生产? (y/n) " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]; then
#   echo "🚀 部署到生产..."
#   pnpm run deploy:cf
#   echo "✨ 生产部署完成！"
# fi
```

## 回滚计划

如果生产部署出现问题：

```bash
# 1. 立即检查 Cloudflare 仪表板
# https://dash.cloudflare.com/

# 2. 查看最近的部署
pnpm exec wrangler deployments list

# 3. 使用之前的版本回滚（如果支持）
# 或手动部署之前的 commit：
git checkout [previous-commit]
pnpm run deploy:cf

# 4. 验证回滚成功
curl https://your-app-url.com

# 5. 通知团队和用户
```

## 监控和验证

部署后持续监控：

```bash
# 查看实时日志
pnpm exec wrangler tail

# 监控数据库状态
pnpm run db:inspect:prod

# 检查错误率
# 在 Cloudflare 仪表板查看 Analytics

# 用户反馈渠道
# - GitHub Issues
# - 应用内反馈表单
- 错误日志收集
```

## 部署失败应急

| 问题 | 解决方案 |
|------|---------|
| 编译失败 | 检查代码，修复错误后重新部署 |
| 数据库迁移失败 | 手动检查迁移文件，回滚 schema |
| 部署超时 | 检查网络，再试一次或联系 Cloudflare 支持 |
| 功能异常 | 查看日志，识别原因，回滚或修复 |
| API 密钥丢失 | 重新设置 secrets：`pnpm run cf:secret` |

## 部署后确认清单

```markdown
部署完成 1 小时内检查：

- [ ] 应用在生产环境可访问
- [ ] 核心功能工作正常
- [ ] 数据库查询正常
- [ ] AI 功能正常（如有）
- [ ] 错误日志中没有新错误
- [ ] 用户可以正常登录和使用
- [ ] 性能指标正常
- [ ] 通知团队部署完成
```
