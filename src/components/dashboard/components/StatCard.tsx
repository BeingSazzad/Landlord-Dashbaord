import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'green' | 'amber' | 'red'
  icon?: LucideIcon
}

const toneStyles = {
  default: 'border-slate-200',
  green: 'border-emerald-200 bg-emerald-50/30',
  amber: 'border-amber-200 bg-amber-50/30',
  red: 'border-red-200 bg-red-50/30',
}

export function StatCard({ label, value, hint, tone = 'default', icon: Icon }: StatCardProps) {
  return (
    <div className={cn('admin-card p-5', toneStyles[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
