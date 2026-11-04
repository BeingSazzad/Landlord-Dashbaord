import { cn, getImageUrl, initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' }

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
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
}
