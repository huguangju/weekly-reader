/**
 * 统一图标管理组件
 * 集中管理项目中的所有图标，提供一致的API和样式
 */

import { 
  FileText, 
  Globe, 
  Monitor, 
  Image,
  Search,
  Command,
  Menu,
  X,
  Github,
  ExternalLink,
  Moon,
  Sun,
  Check,
  ChevronRight,
  Circle,
  Tag,
  Calendar,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 图标尺寸类型
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 图标组件属性
export interface IconProps {
  size?: IconSize
  className?: string
  'aria-label'?: string
}

// 尺寸映射
export const sizeMap: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4', 
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

// 基础图标组件
function BaseIcon({ 
  icon: Icon, 
  size = 'md', 
  className,
  'aria-label': ariaLabel,
  ...props 
}: IconProps & { icon: LucideIcon }) {
  return (
    <Icon 
      className={cn(sizeMap[size], className)}
      aria-label={ariaLabel}
      {...props}
    />
  )
}

// 文件相关图标
export const FileIcon = (props: IconProps) => (
  <BaseIcon icon={FileText} {...props} />
)

export const GlobeIcon = (props: IconProps) => (
  <BaseIcon icon={Globe} {...props} />
)

export const WindowIcon = (props: IconProps) => (
  <BaseIcon icon={Monitor} {...props} />
)

export const ImageIcon = (props: IconProps) => (
  <BaseIcon icon={Image} {...props} />
)

// 搜索相关图标
export const SearchIcon = (props: IconProps) => (
  <BaseIcon icon={Search} {...props} />
)

export const CommandIcon = (props: IconProps) => (
  <BaseIcon icon={Command} {...props} />
)

// 导航相关图标
export const MenuIcon = (props: IconProps) => (
  <BaseIcon icon={Menu} {...props} />
)

export const CloseIcon = (props: IconProps) => (
  <BaseIcon icon={X} {...props} />
)

export const GithubIcon = (props: IconProps) => (
  <BaseIcon icon={Github} {...props} />
)

export const ExternalLinkIcon = (props: IconProps) => (
  <BaseIcon icon={ExternalLink} {...props} />
)

// 主题相关图标
export const MoonIcon = (props: IconProps) => (
  <BaseIcon icon={Moon} {...props} />
)

export const SunIcon = (props: IconProps) => (
  <BaseIcon icon={Sun} {...props} />
)

// UI相关图标
export const CheckIcon = (props: IconProps) => (
  <BaseIcon icon={Check} {...props} />
)

export const ChevronRightIcon = (props: IconProps) => (
  <BaseIcon icon={ChevronRight} {...props} />
)

export const CircleIcon = (props: IconProps) => (
  <BaseIcon icon={Circle} {...props} />
)

// 内容相关图标
export const TagIcon = (props: IconProps) => (
  <BaseIcon icon={Tag} {...props} />
)

export const CalendarIcon = (props: IconProps) => (
  <BaseIcon icon={Calendar} {...props} />
)

// 方向相关图标
export const ArrowUpIcon = (props: IconProps) => (
  <BaseIcon icon={ArrowUp} {...props} />
)

export const ArrowDownIcon = (props: IconProps) => (
  <BaseIcon icon={ArrowDown} {...props} />
)

export const CornerDownLeftIcon = (props: IconProps) => (
  <BaseIcon icon={CornerDownLeft} {...props} />
)

export const DamageMapIcon = ({ size = 'md', className, ...props }: IconProps) => {
  return (
    <svg 
      className={cn(sizeMap[size], className)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
        <path d="M5 10v28a2 2 0 0 0 2 2h11l-3-11l7-2l-1-7l8-4l-2-3l3-5H7a2 2 0 0 0-2 2m38 28V10a2 2 0 0 0-2-2h-3l-4 6l3 5l-9 4l1 8l-7 2l2 7h17a2 2 0 0 0 2-2"/>
        <path d="M14.5 18a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clipRule="evenodd"/>
      </g>
    </svg>
  )
}

// 品牌图标组件（用于特殊品牌logo）
export interface BrandIconProps extends IconProps {
  variant?: 'next' | 'vercel'
}

export const BrandIcon = ({ variant, size = 'md', className, ...props }: BrandIconProps) => {
  if (variant === 'next') {
    return (
      <svg 
        className={cn(sizeMap[size], className)}
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <mask id="mask0_408_134" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="black"/>
        </mask>
        <g mask="url(#mask0_408_134)">
          <circle cx="90" cy="90" r="90" fill="black"/>
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"/>
          <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"/>
        </g>
        <defs>
          <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"/>
            <stop offset="1" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    )
  }

  if (variant === 'vercel') {
    return (
      <svg 
        className={cn(sizeMap[size], className)}
        viewBox="0 0 283 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" fill="currentColor"/>
      </svg>
    )
  }

  return null
}

// 导出 SVG 图标组件
export { SvgIcon } from './svg-icon'
