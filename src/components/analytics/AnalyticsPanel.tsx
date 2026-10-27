import { MONTHLY_METRICS, MOCK_PLANS, getLandlordSubscriptions, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { RevenueChart, UserGrowthChart } from '@/components/dashboard/components/Charts'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Badge } from '@/components/shared/Badge'

export function AnalyticsPanel() {
  const stats = getPlatformStats()
  const subs = getLandlordSubscriptions()
  const latest = MONTHLY_METRICS[MONTHLY_METRICS.length - 1]
  const prev = MONTHLY_METRICS[MONTHLY_METRICS.length - 2]
  const revenueGrowth = prev ? Math.round(((latest.revenue - prev.revenue) / prev.revenue) * 100) : 0
  const landlordGrowth = prev ? Math.round(((latest.landlords - prev.landlords) / prev.landlords) * 100) : 0

  const planBreakdown = MOCK_PLANS.map((plan) => ({
    name: plan.name,
    count: subs.filter((s) => s.plan === plan.name).length,
    revenue: subs.filter((s) => s.plan === plan.name).reduce((sum, s) => sum + (s.billing === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR" value={formatMoney(stats.mrr)} hint="From landlord plans" tone="green" />
        <StatCard label="ARR" value={formatMoney(stats.arr)} hint="Annual run rate" />
        <StatCard label="Revenue growth" value={`+${revenueGrowth}%`} hint="Month on month" tone="green" />
        <StatCard label="Landlord growth" value={`+${landlordGrowth}%`} hint={`${latest.landlords} landlords in ${latest.month}`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <RevenueChart data={MONTHLY_METRICS} />
        <UserGrowthChart data={MONTHLY_METRICS} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-card p-6">
          <p className="admin-panel-title">Landlord sign-ups by month</p>
          <p className="admin-panel-sub">New paying landlords joining the platform</p>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {MONTHLY_METRICS.map((m) => (
              <div key={m.month} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center">
                <p className="text-lg font-bold text-brand-700">{m.landlords}</p>
                <p className="text-xs text-slate-500">{m.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <p className="admin-panel-title">Revenue by plan</p>
          <p className="admin-panel-sub">Landlord subscription mix</p>
          <div className="mt-5 space-y-3">
            {planBreakdown.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Badge tone="blue">{plan.name}</Badge>
                  <span className="text-sm text-slate-500">{plan.count} landlord{plan.count === 1 ? '' : 's'}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{formatMoney(plan.revenue)}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
