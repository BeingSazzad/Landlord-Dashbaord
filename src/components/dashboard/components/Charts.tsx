import { cn, formatMoney } from '@/lib/utils'

interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
  formatValue?: (v: number) => string
}

export function BarChart({ data, color = 'bg-slate-900', formatValue = (v) => String(v) }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-500">{formatValue(item.value)}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className={cn('w-full rounded-t-md transition-all', color)}
              style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Monthly revenue</h3>
          <p className="text-xs text-slate-500">Platform subscription income</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          +18% vs last month
        </span>
      </div>
      <BarChart
        data={data.map((d) => ({ label: d.month, value: d.revenue }))}
        color="bg-slate-900"
        formatValue={(v) => formatMoney(v)}
      />
    </div>
  )
}

export function UserGrowthChart({ data }: { data: { month: string; users: number }[] }) {
  return (
    <div className="admin-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">User growth</h3>
        <p className="text-xs text-slate-500">Total registered users by month</p>
      </div>
      <BarChart data={data.map((d) => ({ label: d.month, value: d.users }))} color="bg-blue-600" />
    </div>
  )
}
