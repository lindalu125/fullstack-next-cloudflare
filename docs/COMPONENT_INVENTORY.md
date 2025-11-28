# Toolsail 前台组件清单
## Component Inventory for Public Frontend

---

## 目录

### 全局组件
1. Header（导航栏）
2. Footer（页脚）
3. ThemeToggle（主题切换）
4. LanguageSwitch（语言切换）

### 工具卡片组件
5. ToolCard（工具卡片）
6. ToolCardGrid（工具卡片网格）
7. FeaturedBadge（精选徽章）
8. PricingBadge（定价徽章）

### 按钮和输入组件
9. Button（按钮）
10. TextInput（文本输入）
11. TextArea（文本域）
12. Select（下拉选择）
13. Checkbox（复选框）
14. Radio（单选框）
15. SearchInput（搜索输入）

### 导航和布局
16. Breadcrumb（面包屑）
17. Pagination（分页）
18. CategoryTabs（分类标签组）
19. Container（容器）

### 模态和通知
20. Modal（模态框）
21. Toast（提示通知）
22. ConfirmDialog（确认对话框）

### 内容展示
23. Card（通用卡片）
24. Badge（徽章）
25. MarkdownRenderer（Markdown 渲染器）
26. HeroSection（Hero 区域）
27. BlogCard（博客卡片）

### 表单和状态
28. FormField（表单字段）
29. LoadingSpinner（加载动画）
30. EmptyState（空状态）

---

## 组件详细说明

### 1. Header（导航栏）

**用途**：页面顶部导航，提供全局导航和用户功能

**Props**：
```typescript
interface HeaderProps {
  currentPath?: string;           // 当前路径，用于高亮导航项
  user?: {
    name: string;
    avatar?: string;
    email: string;
  };
  isAuthenticated?: boolean;     // 是否已登录
  onLogout?: () => void;         // 登出回调
}
```

**状态**：
- 默认状态：正常显示所有导航项
- 登录状态：显示用户菜单代替登录按钮
- 移动端展开：显示汉堡菜单
- 移动端菜单打开：显示侧边栏菜单

**交互**：
- 点击导航链接跳转到相应页面
- 点击 Logo 回到首页
- 点击搜索图标打开搜索框（可选）
- 点击主题切换按钮切换明暗模式
- 点击用户菜单打开下拉菜单
- 移动端点击汉堡菜单打开侧边栏

**布局**：
```jsx
<header className="sticky top-0 z-40">
  <nav className="flex items-center justify-between h-16 px-6 border-b">
    <div className="flex items-center gap-8">
      <Logo />
      <NavLinks />
    </div>
    <div className="flex items-center gap-4">
      <SearchButton />
      <ThemeToggle />
      <UserMenu />
    </div>
  </nav>
</header>
```

**包含子组件**：
- Logo
- NavLinks
- SearchButton（搜索图标按钮）
- UserMenu（用户下拉菜单）
- MobileMenuButton（移动端菜单按钮）

---

### 2. Footer（页脚）

**用途**：页面底部，包含网站链接、社交媒体、联系信息

**Props**：
```typescript
interface FooterProps {
  companyName?: string;
  contactEmail?: string;
  socialLinks?: Array<{
    icon: IconType;
    url: string;
    label: string;
  }>;
  legalLinks?: Array<{
    label: string;
    href: string;
  }>;
}
```

**状态**：
- 标准状态：显示所有信息
- 加载中：骨架屏加载

**交互**：
- 点击链接导航到相应页面
- 点击社交媒体图标打开新标签页
- 点击邮箱链接打开邮件客户端（可选）

**布局**：
```jsx
<footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary">
  <div className="container mx-auto py-12 px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>{/* 链接列 */}</div>
      <div>{/* 社交媒体 */}</div>
      <div>{/* 版权信息 */}</div>
    </div>
  </div>
</footer>
```

---

### 3. ThemeToggle（主题切换）

**用途**：切换浅色/深色主题

**Props**：
```typescript
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';      // 图标大小，默认 md
  showLabel?: boolean;             // 是否显示标签文字
}
```

**状态**：
- Light 模式：显示月亮图标
- Dark 模式：显示太阳图标
- 过渡中：动画效果

**交互**：
- 点击切换主题
- 自动保存偏好到 localStorage
- 自动检测系统主题（首次访问）
- 支持键盘快捷键（可选）

**实现**：
```jsx
'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
      aria-label="切换主题"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
```

---

### 4. LanguageSwitch（语言切换）

**用途**：切换网站语言（中文/英文）

**Props**：
```typescript
interface LanguageSwitchProps {
  currentLanguage?: 'zh' | 'en';
  onLanguageChange?: (lang: 'zh' | 'en') => void;
}
```

**状态**：
- 中文选中：显示"中文"
- 英文选中：显示"English"
- 菜单展开：显示可选语言列表

**交互**：
- 点击打开语言下拉菜单
- 选择语言后导航到对应语言版本
- 自动保存语言偏好到 localStorage

**实现**（使用 next-intl）：
```jsx
'use client';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) => router.push(`/${e.target.value}`)}
      className="bg-transparent border rounded px-2 py-1"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  );
}
```

---

### 5. ToolCard（工具卡片）

**用途**：展示单个工具的关键信息

**Props**：
```typescript
interface ToolCardProps {
  id: string;
  name: string;
  logo: string;                   // Logo URL
  description: string;            // 简短描述
  category: {
    id: string;
    name: string;
  };
  pricing: 'Free' | 'Freemium' | 'Paid';
  isFeatured?: boolean;           // 是否精选
  isPinned?: boolean;             // 是否置顶
  url: string;                    // 工具官网链接
  onClick?: () => void;           // 点击卡片回调
}
```

**状态**：
- 默认状态：普通卡片
- 悬停状态：缩放、阴影提升
- 加载中：骨架屏
- 图片加载中：占位图

**交互**：
- 点击卡片进入工具详情页
- 悬停显示额外交互按钮（可选）
- 支持键盘导航（Tab + Enter）

**布局**：
```jsx
<div className="
  bg-light-bg-secondary dark:bg-dark-bg-secondary
  rounded-lg p-6 shadow-md
  hover:shadow-lg hover:scale-102
  transition-all duration-300
  cursor-pointer
">
  <div className="flex items-start gap-4">
    <Image
      src={logo}
      alt={name}
      width={64}
      height={64}
      className="rounded-md"
    />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-semibold">{name}</h3>
        {isFeatured && <FeaturedBadge />}
      </div>
      <p className="text-body-sm text-light-text-secondary mt-1">
        {description}
      </p>
      <div className="flex items-center gap-2 mt-3">
        <Badge>{category.name}</Badge>
        <PricingBadge pricing={pricing} />
      </div>
    </div>
  </div>
</div>
```

---

### 6. ToolCardGrid（工具卡片网格）

**用途**：展示多个工具卡片的网格布局，支持无限滚动

**Props**：
```typescript
interface ToolCardGridProps {
  tools: ToolCardProps[];
  columns?: 1 | 2 | 3 | 4;        // 列数，默认根据屏幕宽度自适应
  gap?: 'sm' | 'md' | 'lg';       // 卡片间距
  isLoading?: boolean;            // 是否加载中
  hasMore?: boolean;              // 是否有更多数据
  onLoadMore?: () => void;        // 加载更多回调
  onToolClick?: (toolId: string) => void;
}
```

**状态**：
- 加载中：显示骨架屏加载占位符
- 有数据：显示工具卡片
- 没有更多：隐藏加载按钮
- 无数据：显示空状态

**交互**：
- 当用户滚动到底部时自动加载更多
- 支持手动点击"加载更多"按钮
- 支持响应式列数：sm(1列) → md(2列) → lg(3列) → xl(4列)

**实现**：
```jsx
'use client';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function ToolCardGrid({
  tools,
  isLoading,
  hasMore,
  onLoadMore,
}: ToolCardGridProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore?.();
    }
  }, [inView, hasMore, isLoading]);

  return (
    <div className="
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      gap-6
    ">
      {tools.map(tool => (
        <ToolCard key={tool.id} {...tool} />
      ))}
      {isLoading && [...Array(4)].map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
      {hasMore && <div ref={ref} className="col-span-full" />}
    </div>
  );
}
```

---

### 7. FeaturedBadge（精选徽章）

**用途**：标记精选工具

**Props**：
```typescript
interface FeaturedBadgeProps {
  size?: 'sm' | 'md';             // 徽章大小
  showLabel?: boolean;            // 是否显示标签文字
}
```

**状态**：
- 显示：✨ 或 ⭐ 图标

**交互**：
- 无交互，仅显示

**实现**：
```jsx
export function FeaturedBadge({ size = 'md', showLabel = false }: FeaturedBadgeProps) {
  return (
    <span className="
      inline-flex items-center gap-1
      text-light-text-primary dark:text-dark-text-primary
    ">
      <Star size={size === 'sm' ? 16 : 20} fill="currentColor" />
      {showLabel && <span>精选</span>}
    </span>
  );
}
```

---

### 8. PricingBadge（定价徽章）

**用途**：显示工具的定价类型

**Props**：
```typescript
interface PricingBadgeProps {
  pricing: 'Free' | 'Freemium' | 'Paid';
  size?: 'sm' | 'md';
}
```

**状态**：
- Free：显示"免费"
- Freemium：显示"免费+付费"
- Paid：显示"付费"

**交互**：
- 悬停显示说明（可选）

**实现**：
```jsx
export function PricingBadge({ pricing, size = 'sm' }: PricingBadgeProps) {
  const labels = {
    Free: '免费',
    Freemium: '免费+付费',
    Paid: '付费',
  };

  return (
    <Badge size={size} variant="secondary">
      {labels[pricing]}
    </Badge>
  );
}
```

---

### 9. Button（按钮）

**用途**：通用按钮组件

**Props**：
```typescript
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;           // 按钮前置图标
  fullWidth?: boolean;              // 是否全宽
  disabled?: boolean;
  children: React.ReactNode;
}
```

**状态**：
- 默认：正常显示
- 悬停：背景变化、缩放
- 活跃：按下效果
- 禁用：透明度降低、光标不可用
- 加载中：显示 Spinner

**交互**：
- 点击触发 onClick 回调
- 支持键盘激活（Space/Enter）
- 显示加载状态

**变体示例**：

Primary Button（主按钮）：
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  操作
</Button>
```

Secondary Button（深色按钮）：
```jsx
<Button variant="secondary" size="md">
  提交
</Button>
```

Ghost Button（幽灵按钮）：
```jsx
<Button variant="ghost">
  取消
</Button>
```

---

### 10. TextInput（文本输入）

**用途**：单行文本输入框

**Props**：
```typescript
interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;                 // 标签
  error?: string;                 // 错误消息
  success?: boolean;              // 是否成功状态
  icon?: React.ReactNode;         // 前置图标
  clearable?: boolean;            // 是否显示清空按钮
  onClear?: () => void;
  helperText?: string;            // 帮助文本
}
```

**状态**：
- 默认：正常输入
- 焦点：边框高亮、阴影
- 错误：红色边框、错误消息
- 成功：绿色边框（可选）
- 禁用：变浅、不可输入
- 加载中：禁用输入

**交互**：
- 输入内容时更新值
- 焦点时显示焦点状态
- 显示错误消息
- 清空按钮清空内容

**实现**：
```jsx
export function TextInput({
  label,
  error,
  success,
  icon,
  clearable,
  onClear,
  helperText,
  ...props
}: TextInputProps) {
  const [value, setValue] = React.useState('');

  return (
    <div>
      {label && <label className="block mb-2 font-semibold">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-3">{icon}</span>}
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`
            w-full h-11 px-4 py-3 rounded-md
            border transition-all
            ${error ? 'border-error' : 'border-light-border dark:border-dark-border'}
            ${success ? 'border-success' : ''}
            focus:outline-none focus:ring-2
          `}
        />
        {clearable && value && (
          <button
            onClick={() => {
              setValue('');
              onClear?.();
            }}
            className="absolute right-4 top-3"
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-light-text-tertiary text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}
```

---

### 11. TextArea（文本域）

**用途**：多行文本输入框

**Props**：
```typescript
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;             // 最大字符数
  showCharCount?: boolean;        // 显示字符计数
  resizable?: boolean;            // 是否可调整大小
  helperText?: string;
}
```

**状态**：
- 默认：正常输入
- 焦点：边框高亮
- 错误：红色边框
- 禁用：变浅
- 字符计数：显示当前/最大字符数

**实现**：
```jsx
export function TextArea({
  label,
  error,
  maxLength,
  showCharCount,
  resizable = true,
  ...props
}: TextAreaProps) {
  const [value, setValue] = React.useState('');

  return (
    <div>
      {label && <label className="block mb-2 font-semibold">{label}</label>}
      <textarea
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        className={`
          w-full min-h-32 p-4 rounded-md border
          ${resizable ? 'resize-vertical' : 'resize-none'}
          focus:outline-none focus:ring-2
        `}
      />
      {showCharCount && (
        <p className="text-sm text-light-text-tertiary mt-1">
          {value.length}{maxLength ? `/${maxLength}` : ''}
        </p>
      )}
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
```

---

### 12. Select（下拉选择）

**用途**：从列表中选择一个或多个选项

**Props**：
```typescript
interface SelectProps {
  label?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;           // 是否可搜索
  error?: string;
  disabled?: boolean;
}
```

**状态**：
- 关闭：显示选中值
- 打开：显示所有选项
- 搜索中：过滤选项
- 禁用：不可交互

**交互**：
- 点击打开下拉菜单
- 搜索过滤选项（如果启用）
- 点击选项选中并关闭菜单
- 支持键盘导航（上下箭头、Enter、Escape）

**实现**（使用 Radix UI）：
```jsx
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

export function SelectComponent({ label, options, value, onChange, ...props }: SelectProps) {
  return (
    <div>
      {label && <label className="block mb-2">{label}</label>}
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="
          w-full h-11 px-4 py-3 rounded-md
          border flex items-center justify-between
          hover:bg-light-bg-tertiary
        ">
          <Select.Value placeholder="选择选项..." />
          <Select.Icon>
            <ChevronDown size={20} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="
            bg-light-bg-secondary dark:bg-dark-bg-secondary
            rounded-md border shadow-lg
          ">
            <Select.Viewport className="p-2">
              {options.map(option => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="px-3 py-2 rounded cursor-pointer hover:bg-light-bg-tertiary"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
```

---

### 13. Checkbox（复选框）

**用途**：选择一个或多个选项

**Props**：
```typescript
interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  indeterminate?: boolean;        // 不确定状态（部分选中）
}
```

**状态**：
- 未选中：空心框
- 选中：填充框 + 对号
- 不确定：填充框 + 横杠
- 禁用：变浅、不可交互

**交互**：
- 点击切换选中状态
- 支持键盘（Space）
- 支持标签点击

**实现**：
```jsx
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export function CheckboxComponent({ label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="
          w-5 h-5 rounded border-2 border-light-text-primary
          dark:border-dark-text-primary
          flex items-center justify-center
          hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary
        "
      >
        <Checkbox.Indicator className="text-light-text-primary dark:text-dark-text-primary">
          <Check size={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label && (
        <label className="cursor-pointer select-none" onClick={() => onChange(!checked)}>
          {label}
        </label>
      )}
    </div>
  );
}
```

---

### 14. Radio（单选框）

**用途**：从互斥的选项中选择一个

**Props**：
```typescript
interface RadioProps {
  label?: string;
  name: string;                   // 单选组名称
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}
```

**状态**：
- 未选中：空心圆
- 选中：实心圆 + 中心点
- 禁用：变浅

**交互**：
- 点击选中
- 支持键盘导航（上下箭头在同组内）
- 支持标签点击

**实现**：
```jsx
import * as RadioGroup from '@radix-ui/react-radio-group';

export function Radio({ label, name, value, checked, onChange, disabled }: RadioProps) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroup.Item
        value={value}
        checked={checked}
        onCheckedChange={() => onChange(value)}
        disabled={disabled}
        className="
          w-5 h-5 rounded-full border-2 border-light-text-primary
          flex items-center justify-center cursor-pointer
        "
      >
        <RadioGroup.Indicator className="
          w-2 h-2 rounded-full
          bg-light-text-primary dark:bg-dark-text-primary
        " />
      </RadioGroup.Item>
      {label && (
        <label className="cursor-pointer select-none">{label}</label>
      )}
    </div>
  );
}
```

---

### 15. SearchInput（搜索输入）

**用途**：搜索框，支持实时搜索建议

**Props**：
```typescript
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;  // 搜索回调
  suggestions?: Array<{
    id: string;
    label: string;
    category?: string;
  }>;
  isLoading?: boolean;
  onSuggestionSelect?: (suggestion: any) => void;
  debounceMs?: number;            // 防抖延迟
}
```

**状态**：
- 默认：输入框
- 焦点：打开建议列表
- 加载中：显示加载动画
- 有建议：显示建议列表
- 无建议：显示"无结果"

**交互**：
- 输入内容时实时获取建议（防抖）
- 点击建议项选中
- 按 Enter 进行搜索
- 支持键盘导航（上下箭头）
- 按 Escape 关闭建议

**实现**：
```jsx
'use client';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X } from 'lucide-react';

export function SearchInput({
  placeholder = '搜索工具...',
  onSearch,
  suggestions,
  isLoading,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleSearch = useDebouncedCallback(async (query) => {
    if (query.length > 0) {
      onSearch?.(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, debounceMs);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
        <Search size={20} className="text-light-text-tertiary" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => value && setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent"
        />
        {value && (
          <button onClick={() => setValue('')}>
            <X size={20} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg z-10">
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setValue(item.label);
                      setShowSuggestions(false);
                      onSearch?.(item.label);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-light-bg-secondary"
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.category && (
                      <div className="text-sm text-light-text-tertiary">
                        {item.category}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-light-text-tertiary">
              无结果
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 16. Breadcrumb（面包屑导航）

**用途**：显示当前页面的位置路径

**Props**：
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: React.ReactNode;    // 分隔符
}
```

**状态**：
- 默认：显示所有项
- 最后一项：不可点击

**交互**：
- 点击项目导航到相应页面
- 最后一项为当前页面，不可点击

**实现**：
```jsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ items, separator = <ChevronRight size={16} /> }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="text-light-text-primary hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-light-text-secondary">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-light-text-tertiary">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
```

---

### 17. Pagination（分页）

**用途**：分页导航，用于浏览多页内容

**Props**：
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;       // 最多显示的页码数
  showFirstLast?: boolean;        // 是否显示首页/末页按钮
}
```

**状态**：
- 默认：显示所有页码
- 当前页：高亮显示
- 禁用：首页/末页按钮在第一/最后一页禁用

**交互**：
- 点击页码跳转
- 点击上一页/下一页导航
- 支持键盘导航（可选）

**实现**：
```jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
}: PaginationProps) {
  const getPageNumbers = () => {
    // 计算显示的页码
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center gap-2">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 disabled:opacity-50"
        >
          首页
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-3 py-1 rounded
            ${currentPage === page
              ? 'bg-light-text-primary text-white'
              : 'hover:bg-light-bg-secondary'
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 disabled:opacity-50"
        >
          末页
        </button>
      )}
    </div>
  );
}
```

---

### 18. CategoryTabs（分类标签组）

**用途**：显示可选择的分类标签，支持横向滚动

**Props**：
```typescript
interface CategoryTabsProps {
  categories: Array<{
    id: string;
    name: string;
    count?: number;           // 工具数量
  }>;
  activeId?: string;
  onChange?: (categoryId: string) => void;
  scrollable?: boolean;       // 是否可横向滚动
}
```

**状态**：
- 默认：显示所有标签
- 活跃：选中标签高亮
- 悬停：背景变化

**交互**：
- 点击标签切换
- 支持横向滚动（移动端）
- 支持键盘导航（可选）

**实现**：
```jsx
'use client';
import { useRef } from 'react';

export function CategoryTabs({ categories, activeId, onChange, scrollable }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${scrollable ? 'overflow-x-auto' : ''}`} ref={scrollRef}>
      <div className="flex gap-3 pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onChange?.(cat.id)}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap
              transition-all
              ${activeId === cat.id
                ? 'bg-light-text-primary text-white'
                : 'bg-light-bg-secondary hover:bg-light-bg-tertiary'
              }
            `}
          >
            {cat.name}
            {cat.count !== undefined && <span className="ml-1">({cat.count})</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

### 19. Container（容器）

**用途**：统一的内容容器，提供最大宽度和内边距

**Props**：
```typescript
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  centered?: boolean;             // 是否居中
}
```

**实现**：
```jsx
export function Container({
  children,
  maxWidth = 'lg',
  padding = 'md',
  centered = true,
}: ContainerProps) {
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'w-full',
  };

  const paddingMap = {
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
  };

  return (
    <div className={`
      ${maxWidthMap[maxWidth]}
      ${paddingMap[padding]}
      ${centered ? 'mx-auto' : ''}
    `}>
      {children}
    </div>
  );
}
```

---

### 20. Modal（模态框）

**用途**：显示覆盖层上的内容，适用于对话框、表单等

**Props**：
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;          // 是否显示关闭按钮
  footer?: React.ReactNode;       // 页脚内容（通常是按钮）
  backdrop?: boolean;             // 点击背景是否关闭
}
```

**状态**：
- 打开：显示模态框和半透明背景
- 关闭：隐藏

**交互**：
- 点击关闭按钮关闭
- 点击背景关闭（如果启用）
- 按 Escape 关闭
- 焦点陷阱（Tab 在模态框内循环）

**实现**（使用 Radix Dialog）：
```jsx
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
  footer,
  backdrop = true,
}: ModalProps) {
  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 bg-black/10 dark:bg-black/40
            backdrop-blur-sm data-[state=open]:animate-in
            data-[state=closed]:animate-out
          "
          onClick={backdrop ? onClose : undefined}
        />
        <Dialog.Content
          className={`
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            ${sizeMap[size]} w-full
            bg-light-bg-primary dark:bg-dark-bg-secondary
            rounded-lg shadow-xl p-6
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
          `}
          onEscapeKeyDown={onClose}
        >
          {title && (
            <Dialog.Title className="text-h3 font-semibold mb-4">
              {title}
            </Dialog.Title>
          )}

          <div className="mb-6">{children}</div>

          {footer && (
            <div className="flex gap-3 justify-end">
              {footer}
            </div>
          )}

          {closeButton && (
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-2 hover:bg-light-bg-secondary rounded"
                aria-label="关闭"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

### 21. Toast（提示通知）

**用途**：显示临时通知消息

**Props**：
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;              // 显示时长，毫秒
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

// Toast 管理器
interface ToastManager {
  show: (props: ToastProps) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}
```

**状态**：
- 显示：从下方滑入
- 隐藏：向下滑出或淡出

**交互**：
- 自动在指定时间后关闭
- 点击关闭按钮立即关闭
- 点击操作按钮执行回调

**使用示例**：
```jsx
'use client';
import { useToast } from '@/hooks/useToast';

export function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('操作成功！');
  };

  const handleError = () => {
    toast.error('发生错误，请重试');
  };

  return (
    <div>
      <Button onClick={handleSuccess}>成功</Button>
      <Button onClick={handleError}>错误</Button>
    </div>
  );
}
```

---

### 22. ConfirmDialog（确认对话框）

**用途**：确认危险操作（如删除）

**Props**：
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;          // 是否为危险操作（红色按钮）
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
```

**状态**：
- 默认：显示确认和取消按钮
- 加载中：确认按钮显示加载状态

**交互**：
- 点击确认按钮执行操作
- 点击取消按钮关闭
- 按 Escape 取消

**实现**：
```jsx
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-light-text-secondary mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          variant={isDangerous ? 'secondary' : 'primary'}
          isLoading={isLoading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

---

### 23. Card（通用卡片）

**用途**：通用卡片容器，用于各种内容展示

**Props**：
```typescript
interface CardProps {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
  border?: boolean;
}
```

**实现**：
```jsx
export function Card({
  children,
  clickable = false,
  onClick,
  hoverable = true,
  padding = 'md',
  shadow = 'md',
}: CardProps) {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        bg-light-bg-secondary dark:bg-dark-bg-secondary
        rounded-lg ${paddingMap[padding]} ${shadowMap[shadow]}
        ${hoverable && clickable ? 'hover:shadow-lg hover:scale-102 transition-all' : ''}
        ${clickable ? 'cursor-pointer' : ''}
      `}
    >
      {children}
    </div>
  );
}
```

---

### 24. Badge（徽章）

**用途**：标签和徽章

**Props**：
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}
```

**实现**：
```jsx
import { X } from 'lucide-react';

export function Badge({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  closable = false,
  onClose,
}: BadgeProps) {
  const variantMap = {
    primary: 'bg-light-text-primary text-white',
    secondary: 'bg-light-bg-secondary text-light-text-primary',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
  };

  const sizeMap = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center gap-2 rounded-full
      ${variantMap[variant]} ${sizeMap[size]}
    `}>
      {icon && <span>{icon}</span>}
      {children}
      {closable && (
        <button onClick={onClose} className="ml-1">
          <X size={14} />
        </button>
      )}
    </span>
  );
}
```

---

### 25. MarkdownRenderer（Markdown 渲染器）

**用途**：将 Markdown 文本渲染为 HTML

**Props**：
```typescript
interface MarkdownRendererProps {
  content: string;                // Markdown 文本
  className?: string;
  allowHtml?: boolean;            // 是否允许 HTML（默认 true，用 rehype-sanitize）
}
```

**实现**：
```jsx
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export function MarkdownRenderer({
  content,
  className = '',
  allowHtml = true,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={`prose dark:prose-invert ${className}`}
      rehypePlugins={[
        allowHtml && rehypeRaw,
        rehypeSanitize,
      ].filter(Boolean)}
      components={{
        h1: ({ children }) => <h1 className="text-h1 mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-h2 mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-h3 mt-4 mb-2">{children}</h3>,
        p: ({ children }) => <p className="text-body leading-relaxed mb-4">{children}</p>,
        a: ({ href, children }) => (
          <a href={href} className="text-light-text-primary hover:underline">
            {children}
          </a>
        ),
        code: ({ inline, children }) =>
          inline ? (
            <code className="bg-light-bg-secondary dark:bg-dark-bg-secondary px-2 py-1 rounded">
              {children}
            </code>
          ) : (
            <pre className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-lg overflow-x-auto">
              <code>{children}</code>
            </pre>
          ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="max-w-full rounded-lg my-4" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

---

### 26. HeroSection（Hero 区域）

**用途**：页面顶部的大型介绍区域

**Props**：
```typescript
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;      // Hero 中间内容（如搜索框）
  backgroundImage?: string;       // 背景图
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';      // 高度
}
```

**实现**：
```jsx
export function HeroSection({
  title,
  subtitle,
  content,
  backgroundImage,
  centered = true,
  size = 'md',
}: HeroSectionProps) {
  const sizeMap = {
    sm: 'py-12',
    md: 'py-24',
    lg: 'py-32',
  };

  return (
    <section
      className={`
        bg-light-bg-primary dark:bg-dark-bg-primary
        ${backgroundImage ? 'bg-cover bg-center' : ''}
        ${sizeMap[size]}
      `}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className={`container mx-auto px-6 ${centered ? 'text-center' : ''}`}>
        <h1 className="text-h1 font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-body-lg text-light-text-secondary mb-8">{subtitle}</p>}
        {content}
      </div>
    </section>
  );
}
```

---

### 27. BlogCard（博客卡片）

**用途**：博客列表中的卡片，展示文章摘要

**Props**：
```typescript
interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: Date;
  readTime?: number;              // 阅读时长（分钟）
  category?: string;
  slug: string;
  onClick?: () => void;
}
```

**实现**：
```jsx
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export function BlogCard({
  id,
  title,
  excerpt,
  coverImage,
  publishedAt,
  readTime,
  category,
  slug,
  onClick,
}: BlogCardProps) {
  return (
    <Card clickable onClick={onClick} hoverable>
      {coverImage && (
        <Image
          src={coverImage}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-h4 font-semibold mb-2">{title}</h3>
      <p className="text-body-sm text-light-text-secondary mb-3">{excerpt}</p>
      <div className="flex items-center justify-between text-caption text-light-text-tertiary">
        <span>{formatDate(publishedAt)}</span>
        {readTime && <span>{readTime} 分钟阅读</span>}
      </div>
      {category && (
        <Badge size="sm" className="mt-3">
          {category}
        </Badge>
      )}
    </Card>
  );
}
```

---

### 28. FormField（表单字段）

**用途**：表单字段容器，管理标签、输入、错误消息

**Props**：
```typescript
interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}
```

**实现**：
```jsx
export function FormField({
  label,
  error,
  required = false,
  helperText,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-body font-semibold mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-error text-sm mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-light-text-tertiary text-sm mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
```

---

### 29. LoadingSpinner（加载动画）

**用途**：显示加载状态

**Props**：
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;                 // 加载提示文字
}
```

**实现**：
```jsx
export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeMap[size]} border-2 border-light-text-tertiary border-t-light-text-primary dark:border-t-dark-text-primary rounded-full animate-spin`} />
      {label && <p className="text-light-text-secondary">{label}</p>}
    </div>
  );
}
```

---

### 30. EmptyState（空状态）

**用途**：当没有数据时显示的空状态提示

**Props**：
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**实现**：
```jsx
export function EmptyState({
  icon,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="mb-4 text-light-text-tertiary">{icon}</div>}
      <h3 className="text-h4 font-semibold mb-2">{title}</h3>
      {message && <p className="text-light-text-secondary mb-4">{message}</p>}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
```

---

## 组件使用清单

### 快速参考：哪个页面用哪些组件

| 页面 | 核心组件 |
|------|---------|
| 首页 / AI Tools | Header, HeroSection, SearchInput, CategoryTabs, ToolCardGrid, Footer |
| Digital Tools | Header, HeroSection, CategoryTabs, ToolCardGrid, Footer |
| 工具详情 | Header, Breadcrumb, Card, MarkdownRenderer, RelatedTools, Footer |
| 博客列表 | Header, BlogCard, Pagination, CategoryTabs, Footer |
| 博客详情 | Header, MarkdownRenderer, BlogCard, Footer |
| 用户提交 | Header, FormField, TextInput, TextArea, Select, Radio, Button, Toast, Footer |
| 搜索结果 | Header, SearchInput, ToolCardGrid, EmptyState, Footer |
| 登录/注册 | TextInput, Checkbox, Button, Modal |
| 用户中心 | Header, Card, FormField, TextInput, Button, Toast, Footer |
| 关于页面 | Header, Card, FormField, TextInput, TextArea, Button, Footer |

---

**文档版本**：1.0
**最后更新**：2025-11-16
**组件总数**：30 个
**设计系统**：Apple-style 黑白灰极简主义
