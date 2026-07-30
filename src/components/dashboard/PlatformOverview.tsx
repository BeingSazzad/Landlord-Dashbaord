import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CreditCard, MessageSquare, Users, UserPlus, Wrench } from 'lucide-react'
import { MOCK_SUPPORT, getLandlordSubscriptions, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { StatCard } from './components/StatCard'

export function PlatformOverview() {
  const stats = getPlatformStats()
  const recentSubs = getLandlordSubscriptions().slice(0, 3)
  const openSupport = MOCK_SUPPORT.filter((m) => m.status === 'open')
  const totalRoles = stats.landlords + stats.tenants + stats.contractors

  const roleMix = [
    { label: 'Landlords', count: stats.landlords, pct: Math.round((stats.landlords / totalRoles) * 100), color: 'bg-brand-600' },
    { label: 'Tenants', count: stats.tenants, pct: Math.round((stats.tenants / totalRoles) * 100), color: 'bg-brand-400' },
    { label: 'Contractors', count: stats.contractors, pct: Math.round((stats.contractors / totalRoles) * 100), color: 'bg-brand-200' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={String(stats.totalUsers)}
          hint={`${stats.landlords} landlords · ${stats.tenants} tenants`}
          icon={Users}
        />
        <StatCard label="MRR" value={formatMoney(stats.mrr)} hint={`ARR ${formatMoney(stats.arr)}`} tone="green" icon={CreditCard} />
        <StatCard
          label="Landlord subscriptions"
          value={String(stats.activeSubscriptions)}
          hint={`${stats.trialLandlords} landlords on trial`}
        />
        <StatCard
          label="Open support"
          value={String(stats.openSupport)}
          hint="Needs reply"
          tone={stats.openSupport ? 'amber' : 'default'}
          icon={MessageSquare}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="admin-card p-6 lg:col-span-2">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-title">Needs your attention</p>
              <p className="admin-panel-sub">Open support tickets and recent billing activity</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Support inbox</p>
                <Link to={ROUTES.SUPPORT} className="admin-link">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {openSupport.length ? (
                  openSupport.map((msg) => (
                    <div key={msg.id} className="rounded-xl border border-amber-100 bg-amber-50/40 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{msg.subject}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {msg.from} · {msg.role} · {msg.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No open tickets</p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent landlord subs</p>
                <Link to={ROUTES.SUBSCRIPTIONS} className="admin-link">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-2">
                {recentSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{sub.userName}</p>
                      <p className="text-xs text-slate-500">
                        {sub.plan} · {sub.billing}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{sub.amount ? formatMoney(sub.amount) : 'Free'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <p className="admin-panel-title">User mix</p>
          <p className="admin-panel-sub">Who is on the platform today</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {roleMix.map((r) => (
              <div key={r.label} className={r.color} style={{ width: `${r.pct}%` }} title={`${r.label}: ${r.count}`} />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {roleMix.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className={`h-2.5 w-2.5 rounded-full ${r.color}`} />
                  {r.label}
                </span>
                <span className="font-semibold text-slate-900">
                  {r.count} <span className="text-xs font-normal text-slate-400">({r.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: ROUTES.ANALYTICS, label: 'View analytics', desc: 'Charts & growth trends', icon: BarChart3 },
          { to: ROUTES.USERS, label: 'Manage users', desc: `${stats.totalUsers} accounts`, icon: UserPlus },
          { to: ROUTES.SUBSCRIPTIONS, label: 'Landlord billing', desc: `${stats.activeSubscriptions} active plans`, icon: CreditCard },
          { to: ROUTES.SUPPORT, label: 'Support inbox', desc: `${stats.openSupport} open tickets`, icon: Wrench },
        ].map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="admin-card flex items-center gap-3 p-4 transition hover:border-brand-200 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
