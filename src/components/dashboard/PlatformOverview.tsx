import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CreditCard,
  Layers,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { getLandlordSubscriptions, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { StatCard } from './components/StatCard'
import { RevenueSplineChart, UserGrowthDualBarChart } from './components/Charts'

export function PlatformOverview() {
  const stats = getPlatformStats()
  const recentSubs = getLandlordSubscriptions().slice(0, 4)

  return (
    <div className="space-y-7">
      {/* 3 Overview Stat Cards (Matching media_1793094647905.png) */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Total Landlords */}
        <StatCard
          label="Total Landlords"
          value={String(stats.landlords)}
          icon={Users}
          iconVariant="blue"
        />

        {/* Monthly Revenue */}
        <StatCard
          label="Monthly Revenue"
          value={formatMoney(stats.mrr)}
          icon={CreditCard}
          iconVariant="blue"
        />

        {/* Active Subscriptions */}
        <StatCard
          label="Active Subscriptions"
          value={String(stats.activeSubscriptions)}
          icon={Layers}
          iconVariant="blue"
        />
      </div>

      {/* Dual Visual Charts: User Growth & Subscription Revenue */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthDualBarChart />
        <RevenueSplineChart />
      </div>

      {/* Recent Subscriptions (Matching media_1793094701088.png) */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Subscriptions</h3>
            <p className="mt-0.5 text-xs text-slate-400 font-medium">Latest landlord tier activations & renewals</p>
          </div>
          <Link
            to={ROUTES.USERS}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentSubs.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5 flex flex-col justify-between transition hover:border-slate-200 hover:bg-slate-50/90 shadow-2xs"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{sub.userName}</p>
                <p className="mt-1 text-xs text-slate-400 font-medium">
                  {sub.plan} Plan · {sub.billing}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">
                  {sub.amount ? formatMoney(sub.amount) : 'Free'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
