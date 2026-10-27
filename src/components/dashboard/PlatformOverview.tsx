import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  FileCheck,
  FileText,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { MOCK_PLANS, MOCK_SUPPORT, MONTHLY_METRICS, getLandlordSubscriptions, getPlatformStats } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { StatCard } from './components/StatCard'
import { RevenueSplineChart, UserGrowthDualBarChart } from './components/Charts'

interface AttentionItem {
  id: string
  title: string
  subtitle: string
  badgeText: string
  badgeTone: 'blue' | 'amber' | 'emerald'
  actionLabel: string
}

const INITIAL_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'att-1',
    title: 'Portfolio Subscription Upgrade Request',
    subtitle: 'John Smith (john@landlordhq.co.uk) · Upgrading to Unlimited Units',
    badgeText: 'BILLING',
    badgeTone: 'blue',
    actionLabel: 'Review Plan',
  },
  {
    id: 'att-2',
    title: 'Tenant Verification & Portal Invite Expiry',
    subtitle: 'Sarah Johnson (sarah.j@email.com) · Flat 4B Westminster Court',
    badgeText: 'SUPPORT',
    badgeTone: 'amber',
    actionLabel: 'Reply Ticket',
  },
  {
    id: 'att-3',
    title: 'Gas Safety & Electrical Certificate Review',
    subtitle: 'Heating Co. (jobs@heatingco.co.uk) · Gas Safe #44921 submitted',
    badgeText: 'COMPLIANCE',
    badgeTone: 'emerald',
    actionLabel: 'Verify Cert',
  },
]

export function PlatformOverview() {
  const stats = getPlatformStats()
  const subs = getLandlordSubscriptions()
  const [items, setItems] = useState<AttentionItem[]>(INITIAL_ATTENTION_ITEMS)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const planBreakdown = MOCK_PLANS.map((plan) => ({
    name: plan.name,
    count: subs.filter((s) => s.plan === plan.name).length,
    revenue: subs.filter((s) => s.plan === plan.name).reduce((sum, s) => sum + (s.billing === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0),
  }))

  const handleAction = (id: string) => {
    setResolvingId(id)
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      setResolvingId(null)
    }, 500)
  }

  return (
    <div className="space-y-7">
      {/* 4 Landlord HQ Domain Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Users */}
        <StatCard
          label="Total Users"
          value={String(stats.totalUsers > 2000 ? stats.totalUsers : 2840)}
          hint={`${stats.landlords * 105} landlords · ${stats.tenants * 360} tenants`}
          icon={Users}
          iconVariant="blue"
          trend="14.7%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        {/* Monthly Recurring Revenue */}
        <StatCard
          label="Monthly Revenue (MRR)"
          value="£8,450"
          hint="£101.4k ARR run rate"
          icon={CreditCard}
          iconVariant="emerald"
          trend="21.8%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        {/* Active Subscriptions */}
        <StatCard
          label="Landlord Subscriptions"
          value="348"
          hint="24 landlords on trial"
          icon={Building2}
          iconVariant="blue"
          trend="12.5%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        {/* Open Support Tickets */}
        <StatCard
          label="Support Inbox"
          value={`${MOCK_SUPPORT.filter((m) => m.status === 'open').length + 8} Open`}
          hint="3 urgent inquiries"
          icon={MessageSquare}
          iconVariant="amber"
          trend="Needs Reply"
          trendDirection="up"
          trendSubtext="Support queue"
        />
      </div>

      {/* Dual Visual Charts: User Growth & Subscription Revenue */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthDualBarChart />
        <RevenueSplineChart />
      </div>

      {/* SaaS Portfolio Unit Economics & Plan Mix (Consolidated from Analytics) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Subscription Tier */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Revenue by Subscription Plan</h3>
              <p className="mt-0.5 text-xs text-slate-400 font-medium">B2B Landlord subscription distribution and MRR yield</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
              ARR: {formatMoney(stats.arr || 101400)}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {planBreakdown.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 px-4 py-3 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                    {plan.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{plan.count} paying landlords</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{formatMoney(plan.revenue || 49)}/mo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Landlord Acquisition Cadence */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Landlord Acquisition Cadence</h3>
              <p className="mt-0.5 text-xs text-slate-400 font-medium">New verified landlords joining platform portfolio</p>
            </div>
            <span className="text-xs font-bold text-brand-600">
              +12.5% MoM Growth
            </span>
          </div>

          <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2">
            {MONTHLY_METRICS.map((m) => (
              <div key={m.month} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center hover:border-slate-200 transition">
                <p className="text-base font-bold text-brand-700">{m.landlords}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{m.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Needs Attention & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Needs Attention (2 columns) */}
        <div className="admin-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100/80 pb-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Needs Attention</h3>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                  {items.length} Pending Actions
                </span>
              </div>

              <Link
                to={ROUTES.SUPPORT}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
              >
                View all tickets <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4 transition hover:bg-slate-50/80"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          item.badgeTone === 'blue'
                            ? 'bg-blue-50 text-brand-600 border border-blue-100'
                            : item.badgeTone === 'amber'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}
                      >
                        {item.badgeTone === 'blue' ? (
                          <CreditCard className="h-5 w-5" />
                        ) : item.badgeTone === 'amber' ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : (
                          <ShieldCheck className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold text-slate-900">{item.title}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide ${
                              item.badgeTone === 'blue'
                                ? 'bg-blue-50 text-brand-700 border border-blue-100'
                                : item.badgeTone === 'amber'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {item.badgeText}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 font-medium">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleAction(item.id)}
                        disabled={resolvingId === item.id}
                        className="rounded-lg border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition"
                      >
                        {resolvingId === item.id ? 'Processing…' : item.actionLabel}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm font-medium text-slate-400">
                  All urgent items have been resolved.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions (1 column) */}
        <div className="admin-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100/80 pb-4">
              Quick Actions
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to={ROUTES.USERS}
                className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100 group-hover:bg-brand-600 group-hover:text-white transition">
                  <Users className="h-4 w-4" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-900">Manage Users</p>
                  <p className="text-[11px] text-slate-400">Landlords & Tenants</p>
                </div>
              </Link>

              <Link
                to={ROUTES.SUBSCRIPTIONS}
                className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100 group-hover:bg-brand-600 group-hover:text-white transition">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-900">Subscriptions</p>
                  <p className="text-[11px] text-slate-400">Pricing & Tiers</p>
                </div>
              </Link>

              <Link
                to={ROUTES.SUPPORT}
                className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-amber-200 hover:bg-amber-50/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-900">Support Desk</p>
                  <p className="text-[11px] text-slate-400">Inbound Tickets</p>
                </div>
              </Link>

              <Link
                to={ROUTES.CMS}
                className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100 group-hover:bg-brand-600 group-hover:text-white transition">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-900">CMS Policies</p>
                  <p className="text-[11px] text-slate-400">Terms & FAQs</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <FileCheck className="h-4 w-4 text-brand-600" />
              <span>Platform Status</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-600">Operational · 99.9%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
