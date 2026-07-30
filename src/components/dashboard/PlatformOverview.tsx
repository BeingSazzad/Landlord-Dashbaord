import { Link } from 'react-router-dom'
import { ArrowRight, CreditCard, MessageSquare, Users } from 'lucide-react'
import { MONTHLY_METRICS, MOCK_SUBSCRIPTIONS, MOCK_SUPPORT, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { StatCard } from './components/StatCard'
import { RevenueChart, UserGrowthChart } from './components/Charts'

export function PlatformOverview() {
  const stats = getPlatformStats()
  const recentSubs = MOCK_SUBSCRIPTIONS.slice(0, 3)
  const openSupport = MOCK_SUPPORT.filter((m) => m.status === 'open')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={String(stats.totalUsers)} hint={`${stats.landlords} landlords · ${stats.tenants} tenants`} icon={Users} />
        <StatCard label="MRR" value={formatMoney(stats.mrr)} hint={`ARR ${formatMoney(stats.arr)}`} tone="green" icon={CreditCard} />
        <StatCard label="Active subscriptions" value={String(stats.activeSubscriptions)} hint={`${stats.trialUsers} on trial`} />
        <StatCard label="Open support" value={String(stats.openSupport)} hint="Needs reply" tone={stats.openSupport ? 'amber' : 'default'} icon={MessageSquare} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueChart data={MONTHLY_METRICS} />
        <UserGrowthChart data={MONTHLY_METRICS} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent subscriptions</h3>
            <Link to={ROUTES.SUBSCRIPTIONS} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentSubs.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{sub.userName}</p>
                  <p className="text-xs text-slate-500">{sub.plan} · {sub.billing}</p>
                </div>
                <span className="text-sm font-bold text-slate-900">{sub.amount ? formatMoney(sub.amount) : 'Free'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Support inbox</h3>
            <Link to={ROUTES.SUPPORT} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {openSupport.length ? openSupport.map((msg) => (
              <div key={msg.id} className="rounded-lg border border-slate-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-slate-900">{msg.subject}</p>
                <p className="text-xs text-slate-500">{msg.from} · {msg.role} · {msg.time}</p>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No open tickets</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
