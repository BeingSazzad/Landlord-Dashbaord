import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'green' | 'amber' | 'red'
}

const toneStyles = {
  default: 'border-slate-200',
  green: 'border-emerald-200 bg-emerald-50/40',
  amber: 'border-amber-200 bg-amber-50/40',
  red: 'border-red-200 bg-red-50/40',
}

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border bg-white p-5 shadow-sm', toneStyles[tone])}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
