# Toolsail 后台组件清单
## Admin Component Inventory

---

## 目录

### 后台布局组件
1. AdminLayout（后台主布局）
2. AdminSidebar（侧边栏）
3. AdminHeader（后台导航栏）

### 数据表格组件
4. DataTable（数据表格）
5. TableHeader（表格头部）
6. TableRow（表格行）
7. TablePagination（表格分页）
8. TableActions（表格行操作）

### 筛选和搜索
9. FilterBar（筛选栏）
10. SearchInput（搜索框）
11. FilterDropdown（筛选下拉）
12. DateRangeFilter（日期范围筛选）

### 表单组件
13. AdminFormField（表单字段）
14. RichTextEditor（富文本编辑器）
15. ImageUploader（图像上传器）
16. FileUploader（文件上传器）
17. TagInput（标签输入）

### 数据展示
18. StatCard（统计卡片）
19. ListingCard（列表项卡片）
20. DetailPanel（详情面板）

### 对话框和弹窗
21. ConfirmModal（确认弹窗）
22. FormModal（表单弹窗）
23. PreviewModal（预览弹窗）

### 提示和反馈
24. Toast（提示通知）
25. Alert（警告信息）
26. ProgressBar（进度条）

### 导航
27. Breadcrumb（面包屑）
28. TabNavigation（选项卡导航）
29. StepIndicator（步骤指示器）

---

## 组件详细说明

### 1. AdminLayout（后台主布局）

**用途**：后台页面的主布局容器

**Props**：
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;                 // 页面标题
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;      // 右上角操作按钮
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}
```

**结构**：
- 顶部导航栏（粘性）
- 左侧折叠侧边栏
- 主内容区域（可滚动）

**实现**：
```jsx
export function AdminLayout({
  children,
  title,
  breadcrumbs,
  actions,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* 侧边栏 */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col">
        {/* 导航栏 */}
        <AdminHeader
          title={title}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          actions={actions}
        />

        {/* 主内容 */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {title && <h1 className="text-h2 font-bold mt-4 mb-6">{title}</h1>}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

### 2. AdminSidebar（侧边栏）

**用途**：后台导航菜单

**Props**：
```typescript
interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  activeRoute?: string;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;             // 待处理数量
  children?: NavItem[];       // 子菜单
}
```

**菜单项**：
- 仪表盘（/admin/dashboard）
- 工具管理（/admin/tools） - 包含待审核数量徽章
- 提交审核（/admin/submissions）
- 分类管理（/admin/categories）
- 博客管理（/admin/blog）
- 网站设置（/admin/settings）
- 置顶推广（/admin/promotions）

**状态**：
- 打开：全宽显示
- 关闭：仅显示图标（移动端）
- 活跃项：高亮显示
- 有待处理：显示红色徽章

**实现**：
```jsx
export function AdminSidebar({ isOpen, onToggle, activeRoute }: AdminSidebarProps) {
  const navItems = [
    {
      icon: <BarChart3 size={20} />,
      label: '仪表盘',
      href: '/admin/dashboard',
    },
    {
      icon: <Package size={20} />,
      label: '工具管理',
      href: '/admin/tools',
      badge: 5,  // 待审核 5 个
    },
    // ... 更多菜单项
  ];

  return (
    <aside className={`
      fixed md:static h-screen w-64 md:w-60
      bg-light-bg-secondary dark:bg-dark-bg-secondary
      border-r border-light-border dark:border-dark-border
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      transition-transform z-40
    `}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-h4 font-bold">Toolsail</h2>
          <button
            onClick={onToggle}
            className="md:hidden"
            aria-label="切换侧边栏"
          >
            <X size={20} />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeRoute === item.href}
              badge={item.badge}
            />
          ))}
        </nav>
      </div>

      {/* 底部用户信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <UserProfile />
      </div>
    </aside>
  );
}
```

---

### 3. AdminHeader（后台导航栏）

**用途**：后台页面顶部导航和操作栏

**Props**：
```typescript
interface AdminHeaderProps {
  title?: string;
  onSidebarToggle?: () => void;
  actions?: React.ReactNode;      // 右侧操作按钮
  searchEnabled?: boolean;
  onSearch?: (query: string) => void;
  notifications?: number;        // 待审核数量
  onNotificationClick?: () => void;
}
```

**功能**：
- 侧边栏切换按钮（移动端）
- 全局搜索框
- 待审核通知（红色徽章）
- 用户菜单
- 登出按钮

**实现**：
```jsx
export function AdminHeader({
  title,
  onSidebarToggle,
  actions,
  searchEnabled = true,
  notifications = 0,
}: AdminHeaderProps) {
  return (
    <header className="
      sticky top-0 z-30
      bg-light-bg-secondary dark:bg-dark-bg-secondary
      border-b border-light-border dark:border-dark-border
      h-16
    ">
      <div className="flex items-center justify-between px-6 h-full">
        {/* 左侧 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="md:hidden p-2 hover:bg-light-bg-tertiary rounded"
            aria-label="切换菜单"
          >
            <Menu size={20} />
          </button>
          {title && <span className="hidden md:block text-body font-semibold">{title}</span>}
        </div>

        {/* 中间搜索 */}
        {searchEnabled && (
          <div className="flex-1 max-w-md mx-4">
            <AdminSearchInput placeholder="搜索工具、用户、文章..." />
          </div>
        )}

        {/* 右侧 */}
        <div className="flex items-center gap-4">
          {/* 通知 */}
          <button className="relative p-2 hover:bg-light-bg-tertiary rounded">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* 主题切换 */}
          <ThemeToggle />

          {/* 用户菜单 */}
          <UserMenu />

          {/* 自定义操作 */}
          {actions}
        </div>
      </div>
    </header>
  );
}
```

---

### 4. DataTable（数据表格）

**用途**：显示和管理数据列表

**Props**：
```typescript
interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  isLoading?: boolean;
  selectable?: boolean;           // 是否可选中
  selectedRows?: string[];
  onSelectedRowsChange?: (ids: string[]) => void;
  onRowClick?: (row: any) => void;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  actions?: {
    label: string;
    onClick: (row: any) => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'danger' | 'text';
  }[];
}

interface ColumnDef {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}
```

**功能**：
- 列可排序
- 行可选中
- 行级操作（编辑、删除）
- 分页导航
- 加载状态
- 响应式滚动

**状态**：
- 默认：显示所有数据
- 选中：行高亮、批量操作按钮显示
- 加载中：显示骨架屏
- 无数据：显示空状态

**实现**：
```jsx
export function DataTable({
  columns,
  data,
  isLoading,
  selectable = true,
  selectedRows = [],
  onSelectedRowsChange,
  actions,
  pagination,
}: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        {/* 表头 */}
        <thead className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-b">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedRows.length === data.length}
                  onChange={(checked) =>
                    onSelectedRowsChange?.(
                      checked ? data.map((r) => r.id) : []
                    )
                  }
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold ${col.width}`}
              >
                {col.sortable ? (
                  <button className="flex items-center gap-2 hover:text-light-text-primary">
                    {col.label}
                    <ChevronsUpDown size={14} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {actions && <th className="px-4 py-3">操作</th>}
          </tr>
        </thead>

        {/* 表体 */}
        <tbody>
          {isLoading ? (
            // 骨架屏加载
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b">
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-3">
                  <div className="h-8 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded animate-pulse" />
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center">
                <EmptyState
                  title="没有数据"
                  message="暂时没有符合条件的数据"
                />
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={row.id}
                className={`
                  border-b hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary
                  transition-colors cursor-pointer
                  ${selectedRows.includes(row.id) ? 'bg-light-bg-secondary' : ''}
                `}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={(checked) => {
                        if (checked) {
                          onSelectedRowsChange?.([...selectedRows, row.id]);
                        } else {
                          onSelectedRowsChange?.(selectedRows.filter(id => id !== row.id));
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 ${col.align === 'center' ? 'text-center' : ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <TableActions row={row} actions={actions} />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 分页 */}
      {pagination && (
        <div className="px-4 py-3 border-t bg-light-bg-primary dark:bg-dark-bg-primary">
          <TablePagination {...pagination} />
        </div>
      )}
    </div>
  );
}
```

---

### 5. FilterBar（筛选栏）

**用途**：数据表格的筛选和搜索栏

**Props**：
```typescript
interface FilterBarProps {
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filters?: FilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
  onReset?: () => void;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date-range' | 'text' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}
```

**功能**：
- 搜索框（防抖搜索）
- 多个筛选器（下拉、日期范围等）
- 清除筛选按钮
- 响应式排列

**实现**：
```jsx
export function FilterBar({
  searchPlaceholder = '搜索...',
  onSearch,
  filters = [],
  onFilterChange,
  onReset,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleSearchChange = useDebouncedCallback((query) => {
    onSearch?.(query);
  }, 300);

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...filterValues, [key]: value };
    setFilterValues(newValues);
    onFilterChange?.(newValues);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* 搜索框 */}
      <div className="flex-1">
        <SearchInput
          placeholder={searchPlaceholder}
          onChange={(value) => {
            setSearchQuery(value);
            handleSearchChange(value);
          }}
        />
      </div>

      {/* 筛选器 */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map(filter => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              type={filter.type}
              options={filter.options}
              value={filterValues[filter.key]}
              onChange={(value) => handleFilterChange(filter.key, value)}
            />
          ))}

          {/* 清除筛选按钮 */}
          {Object.keys(filterValues).length > 0 && (
            <button
              onClick={() => {
                setFilterValues({});
                setSearchQuery('');
                onReset?.();
              }}
              className="px-3 py-2 text-light-text-secondary hover:bg-light-bg-tertiary rounded"
            >
              清除筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 6. SearchInput（搜索框）

**用途**：全局或本地搜索框

**Props**：
```typescript
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  clearable?: boolean;
}
```

**功能**：
- 实时搜索（防抖）
- 清空按钮
- 加载状态
- 搜索图标

**实现**：
```jsx
export function SearchInput({
  placeholder = '搜索...',
  value = '',
  onChange,
  debounceMs = 300,
  isLoading = false,
  clearable = true,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = useDebouncedCallback((newValue) => {
    onChange?.(newValue);
  }, debounceMs);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-light-text-tertiary" size={20} />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border rounded-lg outline-none focus:ring-2"
      />
      {clearable && inputValue && (
        <button
          onClick={() => {
            setInputValue('');
            onChange?.('');
          }}
          className="absolute right-3 top-2"
        >
          <X size={20} />
        </button>
      )}
      {isLoading && <Spinner className="absolute right-3 top-2" />}
    </div>
  );
}
```

---

### 7. FilterDropdown（筛选下拉）

**用途**：单个筛选器下拉框

**Props**：
```typescript
interface FilterDropdownProps {
  label: string;
  type: 'select' | 'date-range' | 'text' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
}
```

**实现**：
```jsx
export function FilterDropdown({
  label,
  type,
  options = [],
  value,
  onChange,
  placeholder,
}: FilterDropdownProps) {
  if (type === 'select') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value || null)}
        className="px-3 py-2 border rounded-lg outline-none focus:ring-2"
      >
        <option value="">{placeholder || `选择 ${label}...`}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'date-range') {
    return (
      <div className="flex gap-2">
        <input
          type="date"
          value={value?.from || ''}
          onChange={(e) => onChange?.({ ...value, from: e.target.value })}
          className="px-3 py-2 border rounded-lg outline-none focus:ring-2"
        />
        <span className="text-light-text-tertiary">-</span>
        <input
          type="date"
          value={value?.to || ''}
          onChange={(e) => onChange?.({ ...value, to: e.target.value })}
          className="px-3 py-2 border rounded-lg outline-none focus:ring-2"
        />
      </div>
    );
  }

  return null;
}
```

---

### 8. RichTextEditor（富文本编辑器）

**用途**：编辑 Markdown 内容（用于博客、工具描述）

**Props**：
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  preview?: boolean;              // 是否显示预览
}
```

**使用 @uiw/react-md-editor**：

```jsx
import MDEditor from '@uiw/react-md-editor';

export function RichTextEditor({
  value,
  onChange,
  preview = true,
}: RichTextEditorProps) {
  return (
    <div data-color-mode="auto" className="border rounded-lg overflow-hidden">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview={preview ? 'live' : 'edit'}
        hideToolbar={false}
        height={300}
      />
    </div>
  );
}
```

---

### 9. ImageUploader（图像上传器）

**用途**：上传工具 Logo、博客封面等

**Props**：
```typescript
interface ImageUploaderProps {
  onUpload: (url: string) => void;
  preview?: string;
  maxSize?: number;               // 最大文件大小（MB）
  accept?: string;
  isLoading?: boolean;
}
```

**功能**：
- 拖拽上传
- 点击选择文件
- 图片预览
- 上传进度

**实现**：
```jsx
export function ImageUploader({
  onUpload,
  preview,
  maxSize = 5,
  isLoading = false,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // 调用上传 API
    const url = await uploadFile(formData);
    onUpload(url);
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-6 text-center
        transition-colors cursor-pointer
        ${dragActive ? 'border-light-text-primary bg-light-bg-secondary' : 'border-light-border'}
      `}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) {
          handleUpload(e.dataTransfer.files[0]);
        }
      }}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt="预览" className="max-h-48 mx-auto rounded" />
          <button
            onClick={() => document.getElementById('imageInput')?.click()}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded"
          >
            <Upload size={20} />
          </button>
        </div>
      ) : (
        <>
          <Upload size={32} className="mx-auto mb-2 text-light-text-tertiary" />
          <p className="text-body font-semibold mb-1">拖拽或点击上传图片</p>
          <p className="text-body-sm text-light-text-tertiary">最大 {maxSize}MB</p>
        </>
      )}

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
```

---

### 10. FileUploader（文件上传器）

**用途**：上传 CSV/JSON 批量导入文件

**Props**：
```typescript
interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: string;               // '.csv,.json'
  isLoading?: boolean;
}
```

**实现**：类似 ImageUploader，但接受 CSV/JSON 文件

---

### 11. StatCard（统计卡片）

**用途**：仪表盘中显示关键指标

**Props**：
```typescript
interface StatCardProps {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;                // 百分比
    direction: 'up' | 'down';
    label?: string;
  };
  onClick?: () => void;
}
```

**实现**：
```jsx
export function StatCard({
  icon,
  title,
  value,
  trend,
  onClick,
}: StatCardProps) {
  return (
    <Card
      clickable={!!onClick}
      onClick={onClick}
      className="p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-light-text-secondary text-sm mb-2">{title}</p>
          <p className="text-h2 font-bold mb-2">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.direction === 'up' ? 'text-success' : 'text-error'}`}>
              {trend.direction === 'up' ? '▲' : '▼'} {trend.value}%
              {trend.label && ` ${trend.label}`}
            </p>
          )}
        </div>
        {icon && <div className="text-light-text-tertiary ml-4">{icon}</div>}
      </div>
    </Card>
  );
}
```

---

### 12. DetailPanel（详情面板）

**用途**：显示条目的完整详情（提交审核、工具详情等）

**Props**：
```typescript
interface DetailPanelProps {
  title: string;
  sections: DetailSection[];
  actions?: React.ReactNode;
}

interface DetailSection {
  title?: string;
  items: Array<{
    label: string;
    value: React.ReactNode;
  }>;
}
```

**实现**：
```jsx
export function DetailPanel({ title, sections, actions }: DetailPanelProps) {
  return (
    <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-h3 font-semibold">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="mb-6 last:mb-0">
          {section.title && (
            <h4 className="text-body font-semibold mb-3 pb-2 border-b">
              {section.title}
            </h4>
          )}
          <div className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="flex justify-between">
                <span className="text-light-text-secondary">{item.label}</span>
                <span className="text-light-text-primary font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 13. ConfirmModal（确认弹窗）

**用途**：删除、批量操作前确认

**Props**：
```typescript
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**实现**：与前台的 ConfirmDialog 类似，可复用

---

### 14. FormModal（表单弹窗）

**用途**：在模态框中显示表单（创建、编辑分类等）

**Props**：
```typescript
interface FormModalProps {
  isOpen: boolean;
  title: string;
  fields: FormFieldConfig[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
}
```

**实现**：
```jsx
export function FormModal({
  isOpen,
  title,
  fields,
  onSubmit,
  onCancel,
  isLoading,
}: FormModalProps) {
  const [formData, setFormData] = useState({});

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="space-y-4"
      >
        {fields.map(field => (
          <AdminFormField key={field.name} {...field} />
        ))}
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="ghost" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" isLoading={isLoading}>
            保存
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

---

### 15. PreviewModal（预览弹窗）

**用途**：预览博客文章、工具详情等

**Props**：
```typescript
interface PreviewModalProps {
  isOpen: boolean;
  content: string;               // Markdown 内容
  onClose: () => void;
}
```

**实现**：
```jsx
export function PreviewModal({ isOpen, content, onClose }: PreviewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="预览" size="lg">
      <div className="max-h-96 overflow-auto">
        <MarkdownRenderer content={content} />
      </div>
    </Modal>
  );
}
```

---

### 16. Toast（提示通知）

**用途**：操作反馈（保存成功、删除成功等）

**使用示例**：
```jsx
import { useToast } from '@/hooks/useAdminToast';

export function MyAdminComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('保存成功！');
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  };

  return <Button onClick={handleSave}>保存</Button>;
}
```

---

### 17. Alert（警告信息）

**用途**：页面级别的警告或提示

**Props**：
```typescript
interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
}
```

---

### 18. ProgressBar（进度条）

**用途**：文件上传进度、数据导入进度

**Props**：
```typescript
interface ProgressBarProps {
  value: number;                 // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### 19. TabNavigation（选项卡导航）

**用途**：网站设置中的多个设置面板

**Props**：
```typescript
interface TabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}
```

**实现**：
```jsx
export function TabNavigation({ tabs, activeTabId, onTabChange }: TabNavigationProps) {
  const [active, setActive] = useState(activeTabId || tabs[0]?.id);

  return (
    <div>
      {/* 标签按钮 */}
      <div className="flex gap-1 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              onTabChange?.(tab.id);
            }}
            className={`
              px-4 py-3 border-b-2 font-medium
              ${active === tab.id
                ? 'border-light-text-primary text-light-text-primary'
                : 'border-transparent text-light-text-secondary hover:text-light-text-primary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="mt-6">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
}
```

---

### 20. StepIndicator（步骤指示器）

**用途**：批量上传文件的多步骤流程

**Props**：
```typescript
interface StepIndicatorProps {
  steps: Array<{ label: string; completed?: boolean; error?: boolean }>;
  currentStep: number;
}
```

**实现**：
```jsx
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold
                ${step.completed
                  ? 'bg-success'
                  : step.error
                  ? 'bg-error'
                  : idx === currentStep
                  ? 'bg-light-text-primary'
                  : 'bg-light-text-tertiary'
                }
              `}
            >
              {step.completed ? <Check size={16} /> : idx + 1}
            </div>
            <p className="text-xs text-light-text-secondary mt-1">{step.label}</p>
          </div>

          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${step.completed ? 'bg-success' : 'bg-light-border'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
```

---

## 后台组件使用速查表

| 页面 | 核心组件 |
|------|---------|
| 仪表盘 | AdminLayout, StatCard, DataTable, Alert |
| 工具管理 | AdminLayout, DataTable, FilterBar, Button, AdminFormField |
| 工具编辑 | AdminLayout, AdminFormField, RichTextEditor, ImageUploader, Button |
| 批量上传 | AdminLayout, FileUploader, StepIndicator, DataTable, ProgressBar |
| 提交审核 | AdminLayout, DataTable, FilterBar, DetailPanel, ConfirmModal |
| 分类管理 | AdminLayout, DataTable, FormModal, ConfirmModal |
| 博客管理 | AdminLayout, DataTable, FilterBar, Button |
| 博客编辑 | AdminLayout, AdminFormField, RichTextEditor, ImageUploader, PreviewModal |
| 网站设置 | AdminLayout, TabNavigation, AdminFormField, Button |
| 置顶推广 | AdminLayout, DataTable, FormModal, ConfirmModal |

---

**文档版本**：1.0
**最后更新**：2025-11-16
**后台组件总数**：20 个
**特点**：数据驱动、高效、易于扩展
