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
