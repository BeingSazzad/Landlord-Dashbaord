import { memo, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  trend?: string
  trendDirection?: 'up' | 'down'
  trendSubtext?: string
  icon?: LucideIcon
  iconElement?: ReactNode
  iconVariant?: 'primary' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'slate' | 'black'
  tone?: 'default' | 'green' | 'amber' | 'red'
  className?: string
}

const variantStyles = {
  primary: 'bg-blue-50 text-brand-600 border border-blue-100',
  blue: 'bg-blue-50 text-brand-600 border border-blue-100',
  indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border border-amber-100',
  slate: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  black: 'bg-blue-50 text-brand-600 border border-blue-100',
}

export const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  trend,
  trendDirection = 'up',
  trendSubtext = 'vs last month',
  icon: Icon,
  iconElement,
  iconVariant,
  tone,
  className,
}: StatCardProps) {
  const resolvedVariant = iconVariant || (tone === 'green' ? 'emerald' : tone === 'amber' ? 'amber' : 'blue')
  const isPercentage = trend?.includes('%')

  return (
    <div className={cn('admin-card flex flex-col justify-between p-4 sm:p-4.5 transition-all hover:-translate-y-0.5', className)}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          {(Icon || iconElement) && (
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs transition',
                variantStyles[resolvedVariant]
              )}
            >
              {iconElement ? iconElement : Icon ? <Icon className="h-4 w-4" /> : null}
            </div>
          )}
        </div>

        <div className="mt-1.5">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            {value}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-0.5">
        {trend ? (
          <>
            {isPercentage ? (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                  trendDirection === 'up'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                )}
              >
                {trendDirection === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
                )}
                {trend}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {trend}
              </span>
            )}
            {trendSubtext && (
              <span className="text-[11px] font-medium text-slate-400">{trendSubtext}</span>
            )}
          </>
        ) : hint ? (
          <span className="text-[11px] font-medium text-slate-400">{hint}</span>
        ) : null}
      </div>
    </div>
  )
})
