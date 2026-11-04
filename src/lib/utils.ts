import { env } from '@/config/env'

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function parseMoney(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0
}

export function formatMoney(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path
  }
  const origin = env.VITE_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}
