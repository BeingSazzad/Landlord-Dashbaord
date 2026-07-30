import { MONTHLY_METRICS, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { RevenueChart, UserGrowthChart } from '@/components/dashboard/components/Charts'
import { StatCard } from '@/components/dashboard/components/StatCard'

export function AnalyticsPanel() {
  const stats = getPlatformStats()
  const latest = MONTHLY_METRICS[MONTHLY_METRICS.length - 1]
  const prev = MONTHLY_METRICS[MONTHLY_METRICS.length - 2]
  const revenueGrowth = prev ? Math.round(((latest.revenue - prev.revenue) / prev.revenue) * 100) : 0
  const userGrowth = prev ? Math.round(((latest.users - prev.users) / prev.users) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="MRR" value={formatMoney(stats.mrr)} hint="Monthly recurring" tone="green" />
        <StatCard label="ARR" value={formatMoney(stats.arr)} hint="Annual run rate" />
        <StatCard label="Revenue growth" value={`${revenueGrowth}%`} hint="Month on month" tone="green" />
        <StatCard label="User growth" value={`${userGrowth}%`} hint="Month on month" />
      </div>
      <RevenueChart data={MONTHLY_METRICS} />
      <UserGrowthChart data={MONTHLY_METRICS} />
      <div className="admin-card p-5">
        <h3 className="text-sm font-semibold text-slate-900">Landlord sign-ups by month</h3>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {MONTHLY_METRICS.map((m) => (
            <div key={m.month} className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-lg font-bold text-slate-900">{m.landlords}</p>
              <p className="text-xs text-slate-500">{m.month}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
