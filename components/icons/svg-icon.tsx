/**
 * SVG文件图标组件
 * 用于引用public目录下的SVG文件
 */

import { IconProps, sizeMap } from './index'
import { cn } from '@/lib/utils'

interface SvgIconProps extends IconProps {
  src: string
  alt?: string
}

export const SvgIcon = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className,
  ...props 
}: SvgIconProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizeMap[size], className)}
      {...props}
    />
  )
}
