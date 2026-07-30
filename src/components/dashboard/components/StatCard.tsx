import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'green' | 'amber' | 'red'
  icon?: LucideIcon
  trend?: string
}

const toneBorder = {
  default: '',
  green: 'border-emerald-200/60',
  amber: 'border-amber-200/60',
  red: 'border-red-200/60',
}

export function StatCard({ label, value, hint, tone = 'default', icon: Icon, trend }: StatCardProps) {
  return (
    <div className={cn('stat-card', toneBorder[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[28px] font-bold leading-none tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
          {trend ? (
            <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              {trend}
            </span>
          ) : null}
        </div>
        {Icon ? (
          <span className="stat-card-icon shrink-0">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
