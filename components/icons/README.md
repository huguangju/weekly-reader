# 图标系统使用指南

## 概述

本项目使用统一的图标管理系统，基于 `lucide-react` 图标库，提供一致的API和样式。

## 使用方法

### 基础用法

```tsx
import { SearchIcon, MenuIcon, CloseIcon } from '@/components/icons'

// 使用默认尺寸 (md)
<SearchIcon />

// 指定尺寸
<SearchIcon size="lg" />

// 添加自定义样式
<SearchIcon size="sm" className="text-blue-500" />
```

### 可用尺寸

- `xs`: 12px (w-3 h-3)
- `sm`: 16px (w-4 h-4)
- `md`: 20px (w-5 h-5) - 默认
- `lg`: 24px (w-6 h-6)
- `xl`: 32px (w-8 h-8)

### 品牌图标

```tsx
import { BrandIcon } from '@/components/icons'

// Next.js logo
<BrandIcon variant="next" size="lg" />

// Vercel logo  
<BrandIcon variant="vercel" size="md" />
```

### SVG文件图标

```tsx
import { SvgIcon, DamageMapSvgIcon } from '@/components/icons'

// 使用预定义的SVG图标
<DamageMapSvgIcon size="lg" />

// 使用自定义SVG文件
<SvgIcon src="/your-custom-icon.svg" alt="自定义图标" size="md" />
```

## 迁移指南

### 从行内SVG迁移

**之前：**

```tsx
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z"/>
</svg>
```

**之后：**

```tsx
import { ImageIcon } from '@/components/icons'
<ImageIcon size="lg" />
```

### 从SVG文件迁移

**之前：**

```tsx
<img src="/file.svg" alt="文件" className="w-5 h-5" />
```

**之后：**

```tsx
import { FileIcon } from '@/components/icons'
<FileIcon size="md" aria-label="文件" />
```

### 从lucide-react直接导入迁移

**之前：**

```tsx
import { Search, Menu } from 'lucide-react'
<Search className="w-5 h-5" />
<Menu className="w-5 h-5" />
```

**之后：**

```tsx
import { SearchIcon, MenuIcon } from '@/components/icons'
<SearchIcon size="md" />
<MenuIcon size="md" />
```

## 添加新图标

1. 在 `components/icons/index.tsx` 中添加新的图标组件：

```tsx
// 导入需要的图标
import { NewIcon as NewIconLucide } from 'lucide-react'

// 创建组件
export const NewIcon = (props: IconProps) => (
  <BaseIcon icon={NewIconLucide} {...props} />
)
```

2. 如果图标不在lucide-react中，可以：
   - 使用 `BrandIcon` 组件添加品牌logo
   - 创建自定义SVG组件

## 最佳实践

1. **统一使用图标组件**：避免直接使用lucide-react或行内SVG
2. **指定合适的尺寸**：使用预定义的尺寸常量
3. **添加无障碍属性**：为装饰性图标添加 `aria-label`
4. **保持一致性**：在整个项目中使用相同的图标风格

## 图标列表

### 文件相关

- `FileIcon` - 文件图标
- `ImageIcon` - 图片图标

### 导航相关  

- `MenuIcon` - 菜单图标
- `CloseIcon` - 关闭图标
- `GithubIcon` - GitHub图标
- `ExternalLinkIcon` - 外部链接图标

### 搜索相关

- `SearchIcon` - 搜索图标
- `CommandIcon` - 命令图标

### 主题相关

- `MoonIcon` - 月亮图标
- `SunIcon` - 太阳图标

### UI相关

- `CheckIcon` - 勾选图标
- `ChevronRightIcon` - 右箭头图标
- `CircleIcon` - 圆形图标

### 内容相关

- `TagIcon` - 标签图标
- `CalendarIcon` - 日历图标

### 方向相关

- `ArrowUpIcon` - 上箭头图标
- `ArrowDownIcon` - 下箭头图标
- `CornerDownLeftIcon` - 左下角图标

### 品牌相关

- `BrandIcon` - 品牌图标（支持 next, vercel）

### SVG文件相关

- `SvgIcon` - 通用SVG文件图标组件
- `DamageMapSvgIcon` - 损害地图图标
