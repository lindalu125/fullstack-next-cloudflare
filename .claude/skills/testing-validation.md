---
name: testing-validation
description: 代码质量验证、测试策略、Biome linting、类型检查的完整指南
---

# 测试和验证指南

## 质量保证工具链

项目使用以下工具进行自动化质量检查：

| 工具 | 目的 | 命令 | 修复 |
|------|------|------|------|
| **Biome** | 代码格式化 + Linting | `pnpm run lint` | 自动修复 |
| **TypeScript** | 类型检查 | `pnpm run build` | 手动修复 |
| **React Hot Toast** | 错误通知 | 自动 | N/A |

---

## Biome 代码格式化和 Linting

### 配置

```json
// biome.json 中的关键设置
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 4,    // 4 空格
    "lineWidth": 80      // 行宽
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"  // 使用双引号
    }
  }
}
```

### 运行格式化

```bash
# 自动格式化所有文件
pnpm run lint

# 只检查不修改
pnpm exec biome check --no-errors-on-unmatched

# 格式化特定文件
pnpm exec biome format --write src/modules/todos/
```

### 常见格式化规则

```typescript
// ❌ 不符合格式
const users=db.select().from(usersTable).where(eq(usersTable.id,"123"))
const obj={ a: 1,b: 2 }
const msg='string with single quotes'

// ✅ 正确格式
const users = db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, "123"));

const obj = { a: 1, b: 2 };

const msg = "string with double quotes";
```

---

## TypeScript 类型检查

### 编译检查

```bash
# 完整编译检查
pnpm run build

# 成功输出
# ✓ compiled successfully

# 失败输出示例
# Type Error: Property 'invalid' does not exist on type 'Todo'
#   at src/modules/todos/components/todo-card.tsx:12
```

### 常见类型错误

```typescript
// ❌ 错误 1：缺少必需属性
const todo: Todo = {
  id: "1",
  // 缺少 userId, title, createdAt 等
};

// ✅ 正确
const todo: Todo = {
  id: "1",
  userId: "user-123",
  title: "My Todo",
  completed: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// ❌ 错误 2：类型不匹配
const count: number = await getTodos();  // 应该返回 Todo[]

// ✅ 正确
const todos: Todo[] = await getTodos();
const count: number = todos.length;

// ❌ 错误 3：忘记 null/undefined
function getName(user?: User): string {
  return user.name;  // 可能是 undefined
}

// ✅ 正确
function getName(user?: User): string {
  return user?.name || "Unknown";
}
```

### TypeScript 配置

```json
// tsconfig.json 重要设置
{
  "compilerOptions": {
    "strict": true,                    // 严格模式
    "noEmit": true,                    // 只检查，不生成
    "jsx": "preserve",                 // Next.js 处理 JSX
    "moduleResolution": "bundler",     // Next.js 模块解析
    "paths": {
      "@/*": ["./src/*"]               // 路径别名
    }
  }
}
```

---

## 代码审查检查清单

### 提交前的自检

```markdown
## 代码审查清单

功能完整性
- [ ] 功能按需求实现
- [ ] 边界情况处理
- [ ] 错误情况处理
- [ ] 用户输入验证

代码质量
- [ ] 没有 console.log（除调试）
- [ ] 没有 TODO 注释（无 issue 号）
- [ ] 变量命名清晰
- [ ] 函数单一职责
- [ ] DRY 原则（不重复）

类型和验证
- [ ] TypeScript 编译通过
- [ ] 所有参数有类型
- [ ] 返回值有类型
- [ ] Schema 验证完整

认证和安全
- [ ] 检查 session 权限
- [ ] 数据隔离正确
- [ ] 没有 hardcode 敏感信息
- [ ] 错误信息不暴露内部

性能
- [ ] 没有 N+1 查询
- [ ] 没有不必要的计算
- [ ] 大列表使用分页
- [ ] 没有内存泄漏

格式和风格
- [ ] 代码格式化（pnpm run lint）
- [ ] 遵循项目命名规范
- [ ] 一致的代码风格
- [ ] 清晰的注释（仅复杂逻辑）

文档
- [ ] 复杂函数有注释
- [ ] 新模块有 README
- [ ] 更新了相关文档
- [ ] 提交消息清晰
```

---

## 自动化验证流程

### 提交前验证脚本

```bash
#!/bin/bash
# 可以创建 pre-commit hook

# 1. 格式化检查
echo "Checking code format..."
pnpm run lint || exit 1

# 2. TypeScript 检查
echo "Checking TypeScript..."
pnpm run build || exit 1

# 3. 如果有测试
echo "Running tests..."
pnpm test || exit 1

echo "✓ All checks passed"
```

### 每日验证

```bash
# 完整编译测试
pnpm run build

# 数据库状态检查
pnpm run db:inspect:local

# 代码质量报告
pnpm exec biome lint src/
```

---

## 常见错误和修复

### 1. Linting 错误：未使用的变量

```typescript
// ❌ Biome 警告
const user = await getUser(id);
// 使用 user 之前有其他代码

// ✅ 修复
const user = await getUser(id);
console.log(user.name);  // 使用变量
// 或
const _user = await getUser(id);  // 前缀 _ 表示有意未使用
```

### 2. TypeScript 错误：类型推断失败

```typescript
// ❌ 类型过于宽泛
const result = await db.query.todosTable.findMany();
result.forEach(todo => {
  console.log(todo.invalid);  // TypeScript 不知道 todo 的类型
});

// ✅ 显式类型
import type { Todo } from "@/db/schema";
const todos: Todo[] = await db.query.todosTable.findMany();
todos.forEach(todo => {
  console.log(todo.title);  // ✓ TypeScript 知道类型
});
```

### 3. 格式化不一致

```typescript
// ❌ 不一致的格式
const obj = {a:1,b:2}
const array=[1, 2,3]
const str='single quotes'

// 运行：pnpm run lint

// ✅ 自动修正
const obj = { a: 1, b: 2 };
const array = [1, 2, 3];
const str = "double quotes";
```

---

## 验证数据库正确性

### Schema 验证

```bash
# 本地检查表结构
pnpm run db:inspect:local

# 输出示例
# ✓ Table 'todos' exists
# ✓ Columns: id, user_id, title, completed, created_at, updated_at

# 验证迁移
pnpm run db:studio:local  # 打开 GUI
```

### 查询验证

```typescript
// ✅ 验证查询返回的数据类型
const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, userId));

// 验证 todos 确实是 Todo[]
console.log(Array.isArray(todos));          // true
console.log(todos[0].id !== undefined);    // true
console.log(typeof todos[0].title);        // "string"
```

---

## 验证 Server Actions

### Action 单元检查

```typescript
// 模拟 action 执行
import { createTodo } from "@/modules/todos/actions/create-todo.action";

async function testCreateTodo() {
  // 需要有效的 session（使用 Mock 或测试环境）
  const result = await createTodo({
    title: "Test Todo",
    description: "Test",
    category: "work"
  });

  console.log("✓ Created todo:", result.id);
  console.log("✓ Title matches:", result.title === "Test Todo");
  console.log("✓ Has timestamp:", result.createdAt !== undefined);

  // 验证错误处理
  try {
    await createTodo({
      title: "",  // 无效输入
      category: "invalid"
    });
    console.log("✗ Should have thrown error");
  } catch (error) {
    console.log("✓ Correctly threw error:", error.message);
  }
}
```

---

## API 端点验证

### 手动测试

```bash
# 使用 curl 测试 POST 端点
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"content": "Test content"}'

# 验证响应
# {
#   "data": { "summary": "..." },
#   "success": true
# }

# 测试错误情况
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{}' # 缺少 content

# 应该返回 400 错误
# {
#   "error": "Missing or invalid 'content' field",
#   "success": false
# }
```

### 使用 VS Code REST Client

创建 `test.http` 文件：

```http
### 测试成功情况
POST http://localhost:3000/api/summarize
Content-Type: application/json

{
  "content": "这是一个关于JavaScript的详细介绍。JavaScript是一种广泛用于Web开发的编程语言。"
}

### 测试错误情况
POST http://localhost:3000/api/summarize
Content-Type: application/json

{}

### 测试空内容
POST http://localhost:3000/api/summarize
Content-Type: application/json

{
  "content": ""
}
```

---

## 性能验证

### 查询性能检查

```typescript
// 计算执行时间
console.time("fetch todos");
const todos = await db
  .select()
  .from(todosTable)
  .where(eq(todosTable.userId, userId));
console.timeEnd("fetch todos");

// 输出: fetch todos: 15.234ms

// ✓ < 100ms：优秀
// ⚠️  100-500ms：可接受
// ❌ > 500ms：需要优化
```

### 监测大数据集

```typescript
// 验证分页工作
async function testPagination() {
  const pageSize = 20;
  const page1 = await db
    .select()
    .from(todosTable)
    .limit(pageSize)
    .offset(0);

  const page2 = await db
    .select()
    .from(todosTable)
    .limit(pageSize)
    .offset(pageSize);

  // 验证
  console.log("✓ Page 1 items:", page1.length);
  console.log("✓ Page 2 items:", page2.length);
  console.log("✓ No overlap:", !page1.some(t => page2.some(p => p.id === t.id)));
}
```

---

## 部署前验证清单

```markdown
## 部署前检查清单

代码质量
- [ ] 运行 `pnpm run build` - 编译通过
- [ ] 运行 `pnpm run lint` - 格式正确
- [ ] 没有 console.log 调试代码
- [ ] 没有注释掉的代码

功能验证
- [ ] 所有新功能已测试
- [ ] 边界情况处理
- [ ] 错误处理完善
- [ ] 用户反馈（toast）完整

数据库
- [ ] 迁移文件生成正确
- [ ] 在预发布环境测试通过
- [ ] 数据库查询优化完成
- [ ] 没有 N+1 查询问题

安全性
- [ ] 检查用户权限验证
- [ ] 数据隔离正确
- [ ] 没有硬编码敏感信息
- [ ] API 验证完整

性能
- [ ] 大列表使用分页
- [ ] AI 调用有超时保护
- [ ] 缓存策略合理
- [ ] 没有内存泄漏

文档
- [ ] 更新了相关文档
- [ ] 提交消息清晰
- [ ] 代码注释完整
- [ ] README 更新

最后
- [ ] 预发布环境全功能测试
- [ ] 生产环境部署计划确认
- [ ] 回滚计划准备
```

---

## 快速检查命令

```bash
# 一次性检查所有
pnpm run build && pnpm run lint

# 查看具体错误
pnpm exec tsc --noEmit

# 格式化单个文件
pnpm exec biome format --write src/modules/todos/components/todo-form.tsx

# 检查导入
pnpm exec biome lint src/modules/ --rules=a11y/useAltText

# 统计代码行数
find src -name "*.ts*" | xargs wc -l | tail -1
```

---

## 验证测试建议

虽然项目当前没有自动化测试框架，但建议检查：

1. **单元测试需求**：Server Actions、Schema 验证
2. **集成测试需求**：API 路由、数据库操作
3. **E2E 测试需求**：用户流程（登录→创建待办→总结）

可以在项目后期考虑引入：
- `vitest` - 快速单元测试
- `@testing-library/react` - React 组件测试
- `playwright` - E2E 测试
