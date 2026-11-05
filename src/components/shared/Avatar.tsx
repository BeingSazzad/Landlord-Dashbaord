import { memo } from 'react'
import { cn, getImageUrl, initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-12 w-12 text-xs', md: 'h-16 w-16 text-sm', lg: 'h-24 w-24 text-base' }

export const Avatar = memo(function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const resolvedSrc = getImageUrl(src)
  if (resolvedSrc) {
    return <img src={resolvedSrc} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
  }
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700',
        sizes[size],
      )}
    >
      {initials(name)}
    </span>
  )
})
