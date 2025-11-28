# Toolsail 前台设计系统参考
## Design System Reference for Public Frontend

---

## 1. 设计理念

**Apple-style 黑白灰极简主义**

- 使用黑、白、灰三种颜色，无彩色
- 大量留白，信息层级清晰
- 精细的细节和阴影营造质感
- 流畅的过渡动画和交互反馈
- 专注于内容本身，不被装饰分散注意力

---

## 2. 色彩系统

### 2.1 Light Mode（浅色模式）

```css
/* 背景色 */
--bg-primary: #FFFFFF;         /* 主背景，纯白 */
--bg-secondary: #F5F5F5;       /* 次级背景，卡片等 */
--bg-tertiary: #EEEEEE;        /* 三级背景，边框等 */

/* 文字色 */
--text-primary: #0A0A0A;       /* 主文本，近黑色 */
--text-secondary: #424242;     /* 次级文本，描述等 */
--text-tertiary: #757575;      /* 三级文本，时间戳等 */
--text-disabled: #BDBDBD;      /* 禁用文本 */
--text-inverse: #FFFFFF;       /* 反色文本（用在深色背景上） */

/* 特殊色 */
--border: #E0E0E0;             /* 边框色 */
--divider: #F0F0F0;            /* 分割线 */
--overlay: rgba(0, 0, 0, 0.05); /* 覆盖层，柔和黑色 */
```

### 2.2 Dark Mode（深色模式）

```css
/* 背景色 */
--bg-primary: #0A0A0A;         /* 主背景，深黑色 */
--bg-secondary: #1A1A1A;       /* 次级背景，卡片等 */
--bg-tertiary: #2A2A2A;        /* 三级背景，边框等 */

/* 文字色 */
--text-primary: #FAFAFA;       /* 主文本，白色 */
--text-secondary: #BDBDBD;     /* 次级文本，描述等 */
--text-tertiary: #8A8A8A;      /* 三级文本，时间戳等 */
--text-disabled: #424242;      /* 禁用文本 */
--text-inverse: #0A0A0A;       /* 反色文本（用在亮色背景上） */

/* 特殊色 */
--border: #2A2A2A;             /* 边框色 */
--divider: #1F1F1F;            /* 分割线 */
--overlay: rgba(255, 255, 255, 0.05); /* 覆盖层，柔和白色 */
```

### 2.3 Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    colors: {
      // Light mode colors
      light: {
        bg: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          tertiary: '#EEEEEE',
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#424242',
          tertiary: '#757575',
          disabled: '#BDBDBD',
        },
        border: '#E0E0E0',
        divider: '#F0F0F0',
      },
      // Dark mode colors
      dark: {
        bg: {
          primary: '#0A0A0A',
          secondary: '#1A1A1A',
          tertiary: '#2A2A2A',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#BDBDBD',
          tertiary: '#8A8A8A',
          disabled: '#424242',
        },
        border: '#2A2A2A',
        divider: '#1F1F1F',
      },
    },
  },
  darkMode: 'class',
};
```

### 2.4 语义化用法

```css
/* 成功（可选，用于确认操作） */
--success: #4CAF50;            /* 浅绿色 */
--success-light: #E8F5E9;      /* 浅色背景 */

/* 警告（可选，用于警告信息） */
--warning: #FF9800;            /* 橙色 */
--warning-light: #FFF3E0;      /* 浅色背景 */

/* 错误（可选，用于错误提示） */
--error: #F44336;              /* 红色 */
--error-light: #FFEBEE;        /* 浅色背景 */

/* 信息（可选，用于提示信息） */
--info: #2196F3;               /* 蓝色 */
--info-light: #E3F2FD;         /* 浅色背景 */
```

**注意**：仅在必要时使用这些颜色（表单验证、错误提示），不要用于常规 UI。

---

## 3. 字体系统

### 3.1 字体堆栈

```css
--font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI",
                    Roboto, "Helvetica Neue", Arial, sans-serif;
--font-family-mono: "SF Mono", Monaco, "Cascadia Code",
                    "Roboto Mono", Consolas, monospace;
```

### 3.2 字号和行高

| 用途 | 字号 | 行高 | 字重 | 示例 |
|------|------|------|------|------|
| **H1** | 48px | 1.2 (58px) | 700 | 页面标题 |
| **H2** | 36px | 1.25 (45px) | 700 | 区域标题 |
| **H3** | 28px | 1.3 (36px) | 600 | 子标题 |
| **H4** | 24px | 1.35 (32px) | 600 | 卡片标题 |
| **Body Large** | 18px | 1.5 (27px) | 400 | 重要正文 |
| **Body Regular** | 16px | 1.5 (24px) | 400 | 标准正文 |
| **Body Small** | 14px | 1.5 (21px) | 400 | 次级正文 |
| **Caption** | 12px | 1.4 (17px) | 400 | 时间戳、标签 |
| **Button** | 16px | 1.5 (24px) | 600 | 按钮文字 |

### 3.3 Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    fontSize: {
      'h1': ['48px', { lineHeight: '58px', letterSpacing: '-0.02em' }],
      'h2': ['36px', { lineHeight: '45px', letterSpacing: '-0.01em' }],
      'h3': ['28px', { lineHeight: '36px', letterSpacing: '0' }],
      'h4': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
      'body-lg': ['18px', { lineHeight: '27px' }],
      'body': ['16px', { lineHeight: '24px' }],
      'body-sm': ['14px', { lineHeight: '21px' }],
      'caption': ['12px', { lineHeight: '17px' }],
    },
    fontWeight: {
      'light': 300,
      'normal': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700,
    },
  },
};
```

---

## 4. 间距系统

### 4.1 间距基数

```css
--spacing-unit: 4px;  /* 基础单位 */
```

### 4.2 间距比例

| 大小 | 值 | 用途 |
|------|-----|------|
| **xs** | 4px | 图标间距、紧凑组件 |
| **sm** | 8px | 小组件间距 |
| **md** | 16px | 标准间距 |
| **lg** | 24px | 区域内间距、组件间距 |
| **xl** | 32px | 大型间距、section 间距 |
| **2xl** | 48px | 特大间距、页面顶部边距 |
| **3xl** | 64px | 最大间距 |

### 4.3 常用间距组合

```css
/* 组件内部 */
--padding-button: 12px 24px;      /* 按钮内边距 */
--padding-card: 24px;             /* 卡片内边距 */
--padding-input: 12px 16px;       /* 输入框内边距 */

/* 组件间距 */
--gap-tight: 8px;                 /* 紧凑间距 */
--gap-normal: 16px;               /* 标准间距 */
--gap-loose: 24px;                /* 宽松间距 */
--gap-section: 48px;              /* Section 间距 */

/* 边距 */
--margin-xs: 4px;
--margin-sm: 8px;
--margin-md: 16px;
--margin-lg: 24px;
--margin-xl: 32px;
--margin-2xl: 48px;
```

### 4.4 Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    spacing: {
      '0': '0',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
    },
  },
};
```

---

## 5. 圆角（Border Radius）

### 5.1 圆角规范

```css
--radius-none: 0px;        /* 无圆角 */
--radius-sm: 8px;          /* 小圆角，按钮、小组件 */
--radius-md: 12px;         /* 中等圆角，输入框 */
--radius-lg: 16px;         /* 大圆角，卡片（默认） */
--radius-xl: 20px;         /* 特大圆角，大卡片 */
--radius-full: 9999px;     /* 全圆，胶囊形按钮 */
```

### 5.2 使用场景

| 元素 | 圆角 | 示例 |
|------|------|------|
| **卡片** | 16px | 工具卡片、博客卡片 |
| **按钮** | 16px | 普通按钮、分类按钮 |
| **输入框** | 12px | 搜索框、文本输入 |
| **标签** | 12px | 分类标签、徽章 |
| **对话框** | 16px | Modal、Popover |
| **胶囊按钮** | 9999px | 数字输入增减按钮、特殊按钮 |

### 5.3 Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    borderRadius: {
      'none': '0px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '20px',
      'full': '9999px',
    },
  },
};
```

---

## 6. 阴影系统

### 6.1 阴影定义

```css
/* Light Mode 阴影 */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Dark Mode 阴影（淡化处理） */
--shadow-sm-dark: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md-dark: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
--shadow-lg-dark: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
```

### 6.2 使用场景

| 元素 | 阴影 | 用途 |
|------|------|------|
| **卡片默认** | sm | 工具卡片基础阴影 |
| **卡片悬停** | md | 鼠标悬停时提升 |
| **搜索框** | sm | 轻微阴影 |
| **Modal 背景** | lg | 叠加层阴影 |
| **Dropdown** | md | 下拉菜单阴影 |

---

## 7. 按钮风格

### 7.1 按钮类型

#### **7.1.1 Primary Button（主按钮）**

```jsx
// 外观
背景色: --bg-primary (白色) / --bg-secondary (深黑)
边框: 1px solid --border
文字色: --text-primary
圆角: 16px
内边距: 12px 24px
字号: 16px, 字重: 600

// Light Mode
背景: #FFFFFF
文字: #0A0A0A
边框: #E0E0E0

// Dark Mode
背景: #1A1A1A
文字: #FAFAFA
边框: #2A2A2A

// 悬停状态
背景: --bg-secondary (Light) / --bg-tertiary (Dark)
缩放: 0.98

// 禁用状态
背景: --bg-tertiary (Light) / --bg-tertiary (Dark)
文字: --text-disabled
指针: not-allowed
```

#### **7.1.2 Secondary Button（次按钮，深色）**

```jsx
// 外观
背景色: --text-primary (深黑) / 不适用
文字色: 白色 / --text-primary
圆角: 16px
内边距: 12px 24px
字号: 16px, 字重: 600
无边框

// Light Mode
背景: #0A0A0A
文字: #FFFFFF

// Dark Mode
背景: #FAFAFA
文字: #0A0A0A

// 悬停状态
背景: 透明度降低 5%
缩放: 0.98

// 禁用状态
背景: --text-disabled
指针: not-allowed
```

#### **7.1.3 Ghost Button（幽灵按钮，边框）**

```jsx
// 外观
背景: transparent
边框: 1px solid --text-primary
文字色: --text-primary
圆角: 16px
内边距: 12px 24px
字号: 16px, 字重: 600

// 悬停状态
背景: --bg-secondary (Light) / --bg-secondary (Dark)

// 禁用状态
边框: --text-disabled
文字: --text-disabled
```

#### **7.1.4 Text Button（文本按钮）**

```jsx
// 外观
背景: transparent
边框: none
文字色: --text-primary
字号: 16px, 字重: 600
无内边距（仅文字）

// 悬停状态
文字: --text-secondary
下划线: optional

// 禁用状态
文字: --text-disabled
```

#### **7.1.5 Tag Button（标签/分类按钮）**

```jsx
// 外观
背景: --bg-secondary
文字: --text-secondary
圆角: 16px (全圆形)
内边距: 8px 16px
字号: 14px, 字重: 500
边框: 1px solid --border

// 激活状态（选中）
背景: --text-primary
文字: --text-inverse
边框: --text-primary

// 悬停状态（未激活）
背景: --bg-tertiary
光标: pointer

// 悬停状态（已激活）
背景: --text-secondary
```

### 7.2 按钮尺寸

| 尺寸 | 高度 | 内边距 | 字号 | 用途 |
|------|------|--------|------|------|
| **sm** | 32px | 8px 16px | 14px | 小按钮、副操作 |
| **md** (默认) | 44px | 12px 24px | 16px | 标准按钮 |
| **lg** | 48px | 16px 32px | 16px | 强调按钮、表单提交 |

### 7.3 按钮加载/禁用状态

```jsx
// 加载中
- 显示加载图标（spinner）
- 文本可选隐藏
- 禁用点击
- opacity: 0.7

// 禁用
- 背景变浅
- 文字变浅
- cursor: not-allowed
- opacity: 0.5
```

### 7.4 Tailwind 组件实现

```jsx
// Primary Button
<button className="
  px-6 py-3 rounded-lg
  bg-white dark:bg-dark-bg-secondary
  text-black dark:text-white
  border border-light-border dark:border-dark-border
  font-semibold text-base
  hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
  hover:scale-98 transition-transform
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button
</button>

// Secondary Button
<button className="
  px-6 py-3 rounded-lg
  bg-black dark:bg-white
  text-white dark:text-black
  font-semibold text-base
  hover:opacity-90 transition-opacity
  hover:scale-98 transition-transform
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Button
</button>

// Tag Button (Active)
<button className="
  px-4 py-2 rounded-full
  bg-black dark:bg-white
  text-white dark:text-black
  font-medium text-sm
  border border-black dark:border-white
">
  Active Tag
</button>

// Tag Button (Inactive)
<button className="
  px-4 py-2 rounded-full
  bg-light-bg-secondary dark:bg-dark-bg-secondary
  text-light-text-secondary dark:text-dark-text-secondary
  font-medium text-sm
  border border-light-border dark:border-dark-border
  hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
">
  Inactive Tag
</button>
```

---

## 8. 表单元素

### 8.1 输入框

```css
/* 基础样式 */
高度: 44px
内边距: 12px 16px
字号: 16px
圆角: 12px
边框: 1px solid --border
背景: --bg-primary

/* Light Mode */
边框: #E0E0E0
背景: #FFFFFF
文字: #0A0A0A
占位符: #BDBDBD

/* Dark Mode */
边框: #2A2A2A
背景: #1A1A1A
文字: #FAFAFA
占位符: #8A8A8A

/* 焦点状态 */
边框: --text-primary (加深)
阴影: 0 0 0 3px rgba(0, 0, 0, 0.1)

/* 错误状态 */
边框: #F44336 (红色)
背景: #FFEBEE (浅红)

/* 成功状态 */
边框: #4CAF50 (绿色)
背景: #E8F5E9 (浅绿)
```

### 8.2 Textarea

```css
/* 基础样式 */
最小高度: 120px
内边距: 12px 16px
字号: 16px
行高: 1.5
圆角: 12px
边框: 1px solid --border
背景: --bg-primary
可调整大小: vertical only
```

### 8.3 Select / Dropdown

```css
/* 基础样式 */
高度: 44px
内边距: 12px 16px
字号: 16px
圆角: 12px
边框: 1px solid --border
背景: --bg-primary
光标: pointer

/* 展开箭头 */
位置: 右侧 16px
颜色: --text-secondary
旋转角度: 180° (展开时)
```

### 8.4 Checkbox & Radio

```css
/* 尺寸 */
宽度: 20px
高度: 20px
圆角: 4px (checkbox) / 10px (radio)
边框: 2px solid --text-primary
背景: --bg-primary

/* 选中状态 */
背景: --text-primary
内部对号: 白色

/* 禁用状态 */
边框: --text-disabled
背景: --text-disabled
*/
```

---

## 9. 响应式断点（Breakpoints）

### 9.1 断点定义

```javascript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',    // 手机竖屏
      'md': '768px',    // 平板
      'lg': '1024px',   // 桌面
      'xl': '1280px',   // 大屏桌面
      '2xl': '1536px',  // 超大屏
    },
  },
};
```

### 9.2 断点用途

| 断点 | 宽度 | 设备类型 | 布局特点 |
|------|------|---------|---------|
| **sm** | 640px | 手机竖屏 | 单列、全宽组件 |
| **md** | 768px | 平板竖屏 | 双列、开始有侧边栏 |
| **lg** | 1024px | 桌面、平板横屏 | 三列、完整布局（默认） |
| **xl** | 1280px | 大屏桌面 | 宽容器、内容增加 |
| **2xl** | 1536px | 超大屏 | 最大宽度限制 |

### 9.3 常用媒体查询

```jsx
// 移动端优先方法

// 手机专用
className="block md:hidden" // 仅在 md 以下显示

// 桌面专用
className="hidden md:block" // 仅在 md 及以上显示

// 响应式宽度
className="
  w-full              // 手机: 100%
  md:w-1/2            // md: 50%
  lg:w-1/3            // lg: 33.333%
"

// 响应式排列
className="
  flex flex-col       // 手机: 垂直排列
  md:flex-row         // md: 水平排列
  gap-4 md:gap-6      // 响应式间距
"

// 响应式字号
className="
  text-body-sm        // 手机: 14px
  md:text-body        // md: 16px
  lg:text-body-lg     // lg: 18px
"
```

### 9.4 容器宽度（Container）

```javascript
// tailwind.config.ts
export default {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',    // 手机: 16px 两侧
        md: '24px',         // md: 24px 两侧
        lg: '32px',         // lg: 32px 两侧
      },
      maxWidth: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
};
```

---

## 10. 图标系统

### 10.1 图标库

**使用 Lucide React**

- 24px 为默认尺寸
- 所有图标均为 SVG，支持自定义颜色和大小
- 平衡的风格，与 Apple-style 设计相符

```jsx
import { Search, ChevronDown, Menu, X, Star } from 'lucide-react';

// 基础使用
<Search size={24} className="text-light-text-primary dark:text-dark-text-primary" />

// 自定义颜色
<Star size={24} fill="currentColor" className="text-yellow-500" />
```

### 10.2 常用图标及用途

| 图标 | 名称 | 用途 |
|------|------|------|
| `Search` | 搜索 | 搜索框、搜索按钮 |
| `ChevronDown` | 下箭头 | Dropdown 展开 |
| `ChevronUp` | 上箭头 | Dropdown 收起 |
| `Menu` | 菜单 | 移动端汉堡菜单 |
| `X` | 关闭 | 关闭对话框、清空输入 |
| `Star` | 星星 | 精选徽章、收藏 |
| `Heart` | 心形 | 收藏、喜欢 |
| `Share2` | 分享 | 社交分享 |
| `ExternalLink` | 外链 | 访问官网链接 |
| `Clock` | 时钟 | 时间戳 |
| `Tag` | 标签 | 分类 |
| `ArrowRight` | 右箭头 | 导航、下一步 |
| `Sun` | 太阳 | 亮色主题 |
| `Moon` | 月亮 | 深色主题 |
| `Globe` | 地球 | 语言选择 |

### 10.3 图标尺寸规范

| 尺寸 | 大小 | 用途 |
|------|------|------|
| **sm** | 16px | 行内图标、小组件 |
| **md** | 20px | 表单图标、次级位置 |
| **lg** | 24px | 标准图标（默认） |
| **xl** | 32px | 大型图标、主要位置 |
| **2xl** | 40px | 特大图标、展示用途 |

---

## 11. 动画和过渡

### 11.1 过渡时间

```css
--duration-fast: 150ms;      /* 快速过渡 */
--duration-normal: 300ms;    /* 标准过渡 */
--duration-slow: 500ms;      /* 缓慢过渡 */
```

### 11.2 缓动函数

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### 11.3 常用动画

#### **11.3.1 悬停缩放**

```css
/* 卡片、按钮悬停效果 */
transform: scale(1.02);
transition: transform 150ms ease-out;
```

#### **11.3.2 淡入淡出**

```css
/* 页面过渡、模态框 */
opacity: 0 → 1;
transition: opacity 300ms ease-in-out;
```

#### **11.3.3 滑动**

```css
/* 侧边栏、菜单 */
transform: translateX(-100%) → translateX(0);
transition: transform 300ms ease-in-out;
```

#### **11.3.4 加载动画**

```jsx
// Spinner
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;

// Pulse（脉搏）
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### 11.4 Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    transitionDuration: {
      '150': '150ms',
      '300': '300ms',
      '500': '500ms',
    },
    transitionTimingFunction: {
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'out': 'cubic-bezier(0.0, 0, 0.2, 1)',
      'in': 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
};

// 使用
<div className="transition-transform duration-150 ease-out hover:scale-102" />
```

---

## 12. 人机交互准则

### 12.1 反馈原则

**每个用户操作都需要立即反馈**

- 按钮点击：颜色变化、缩放、阴影
- 输入框焦点：边框高亮、阴影
- 加载状态：Spinner 或进度指示
- 成功/错误：Toast 提示、颜色变化
- 页面加载：骨架屏或淡入效果

### 12.2 可访问性（Accessibility）

#### **12.2.1 键盘导航**

- 所有交互元素都可通过 Tab 键访问
- Tab 顺序合理（从上到下，从左到右）
- 焦点指示清晰可见（focus ring）
- 支持 Enter / Space 激活按钮

#### **12.2.2 屏幕阅读器**

```jsx
// 使用正确的语义标签
<button aria-label="关闭菜单">
  <X size={24} />
</button>

// 使用 aria-hidden 隐藏装饰元素
<span aria-hidden="true">•</span>

// 使用 aria-live 通知动态内容
<div aria-live="polite" aria-label="加载状态">
  正在加载...
</div>

// 使用 role 定义组件角色
<div role="navigation" aria-label="主导航">
  ...
</div>
```

#### **12.2.3 色彩对比**

- Light Mode 文字 (#0A0A0A) vs 背景 (#FFFFFF)：对比度 21:1 ✅
- Dark Mode 文字 (#FAFAFA) vs 背景 (#0A0A0A)：对比度 19:1 ✅
- 次级文字：对比度 ≥ 7:1（AAA 标准）

#### **12.2.4 焦点指示**

```css
/* 清晰的焦点环 */
outline: 2px solid var(--text-primary);
outline-offset: 2px;
border-radius: 4px;

/* 或使用阴影 */
box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
```

### 12.3 交互设计原则

#### **12.3.1 可见性**

- 重要操作明显可见（主按钮）
- 次级操作去强调（次按钮）
- 危险操作明确标注（删除按钮）

#### **12.3.2 一致性**

- 相同的操作使用相同的设计
- 相同的视觉样式表示相同的功能
- 布局在所有页面保持一致

#### **12.3.3 反馈清晰**

```jsx
// 好的反馈
- 按钮点击 → 视觉反馈（颜色/缩放） + 动作完成
- 表单提交 → Loading 状态 + 成功/失败 Toast

// 不好的反馈
- 按钮没有点击反馈
- 操作完成但没有提示
- 加载中没有指示器
```

#### **12.3.4 防止误操作**

```jsx
// 关键操作需要确认
- 删除工具 → 确认对话框
- 批量删除 → 二次确认

// 提前预览
- 提交前显示摘要
- 修改前对比展示

// 支持撤销
- 删除后保持可恢复状态（至少 1 小时）
```

### 12.4 移动端友好性

#### **12.4.1 触摸目标**

```css
/* 最小触摸目标：44x44px */
--touch-target: 44px;

/* 按钮最小尺寸 */
height: 44px;
padding: 12px 16px; /* 至少 44px 高度 */

/* 间距 */
margin: 8px; /* 按钮间间距至少 8px */
```

#### **12.4.2 手指友好**

- 按钮和链接间距 ≥ 44px
- 避免悬停交互（移动端无悬停）
- 使用 `touch-action` 优化滚动性能
- 避免双击放大（使用 `viewport-fit` 或 `user-scalable=no`）

#### **12.4.3 手机特定设计**

- 单列布局（宽度 < 768px）
- 大字号（最小 16px 避免自动放大）
- 大按钮、宽间距
- 隐藏非必要信息，使用折叠/展开

---

## 13. 深色模式实现

### 13.1 启用深色模式

```jsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <html suppressHydrationWarning>
        <body>{children}</body>
      </html>
    </ThemeProvider>
  );
}
```

### 13.2 深色模式类名

```jsx
// 自动处理 light/dark class
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

### 13.3 主题切换按钮

```jsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="切换主题"
      className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
```

---

## 14. 设计代码片段库

### 14.1 卡片组件

```jsx
<div className="
  bg-light-bg-secondary dark:bg-dark-bg-secondary
  rounded-lg
  p-6
  shadow-md hover:shadow-lg
  transition-shadow duration-300
  hover:scale-102
">
  {/* 内容 */}
</div>
```

### 14.2 输入框

```jsx
<input
  type="text"
  className="
    w-full
    h-11
    px-4 py-3
    rounded-md
    border border-light-border dark:border-dark-border
    bg-light-bg-primary dark:bg-dark-bg-secondary
    text-light-text-primary dark:text-dark-text-primary
    placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary
    focus:outline-none focus:ring-2 focus:ring-offset-0
    focus:ring-light-text-primary dark:focus:ring-dark-text-primary
    transition-shadow duration-300
  "
  placeholder="搜索..."
/>
```

### 14.3 模态框背景

```jsx
<div className="
  fixed inset-0
  bg-black/10 dark:bg-black/40
  backdrop-blur-sm
  flex items-center justify-center
  z-50
">
  {/* 模态框内容 */}
</div>
```

---

**文档版本**：1.0
**最后更新**：2025-11-16
**设计理念**：Apple-style 黑白灰极简主义
