# 环境初始化命令

当需要设置或重置开发环境时使用此命令。

## 快速初始化

```bash
# 1. 安装依赖
pnpm install

# 2. 生成 Cloudflare 类型
pnpm run cf-typegen

# 3. 初始化本地数据库
pnpm run db:migrate:local

# 4. 验证 setup 成功
pnpm run build
```

## 完整 Setup 脚本

```bash
#!/bin/bash
set -e

echo "🚀 初始化 Toolsail 项目..."

# 步骤 1: 安装依赖
echo "📦 安装依赖..."
pnpm install

# 步骤 2: 生成 Cloudflare 类型
echo "⚙️  生成 Cloudflare 类型定义..."
pnpm run cf-typegen

# 步骤 3: 初始化数据库
echo "🗄️  初始化本地数据库..."
pnpm run db:migrate:local

# 步骤 4: 验证
echo "✅ 验证编译..."
pnpm run build

# 步骤 5: 格式化检查
echo "📝 检查代码格式..."
pnpm run lint

echo "✨ Setup 完成！"
echo ""
echo "下一步："
echo "  npm run dev:cf      # 启动 Cloudflare 本地开发"
echo "  npm run db:studio:local  # 打开数据库管理面板"
```

## 常见 Setup 问题

### 问题：`Cannot find module '@/*'`

```bash
# 清除缓存并重建
rm -rf .next
pnpm run build
```

### 问题：`D1_BIND not found`

```bash
# 确保使用 dev:cf 而不是 dev
pnpm run dev:cf
```

### 问题：数据库迁移失败

```bash
# 重置本地数据库
pnpm run db:reset:local

# 重新应用迁移
pnpm run db:migrate:local

# 验证
pnpm run db:inspect:local
```

## 必要的环境变量

创建 `.env.local` 文件（仅本地开发）：

```env
# 如果需要外部 API
# OPENAI_API_KEY=xxx
# ANTHROPIC_API_KEY=xxx

# Cloudflare Secrets（通过命令行设置）
# pnpm run cf:secret STRIPE_API_KEY
```

## 验证 Setup 成功

运行以下命令确认所有工具就绪：

```bash
# ✅ 依赖已安装
ls node_modules | wc -l

# ✅ 类型已生成
ls cloudflare-env.d.ts

# ✅ 数据库已初始化
pnpm run db:inspect:local

# ✅ 编译成功
pnpm run build

# ✅ 代码格式正确
pnpm run lint
```

所有命令都应该成功执行。
