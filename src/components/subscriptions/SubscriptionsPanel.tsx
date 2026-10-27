import { useState, useMemo } from 'react'
import {
  Building2,
  Check,
  CreditCard,
  Edit2,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { MOCK_PLANS, getLandlordSubscriptions } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { Subscription, SubscriptionPlan } from '@/types/api.types'

export function SubscriptionsPanel() {
  const [tab, setTab] = useState<'subs' | 'plans'>('subs')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [plans] = useState<SubscriptionPlan[]>(MOCK_PLANS)
  const [subscriptions] = useState<Subscription[]>(() => getLandlordSubscriptions())

  const filteredSubs = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchSearch =
        !search ||
        s.userName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.plan.toLowerCase().includes(search.toLowerCase())
      const matchPlan = planFilter === 'all' || s.plan.toLowerCase() === planFilter.toLowerCase()
      const matchStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase()
      return matchSearch && matchPlan && matchStatus
    })
  }, [subscriptions, search, planFilter, statusFilter])

  const totalMRR = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + (s.billing === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0)
  }, [subscriptions])

  return (
    <div className="space-y-6">
      {/* 3 Top Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Active Subscriptions"
          value={String(subscriptions.filter((s) => s.status === 'active').length + 344)}
          hint="Across 142 registered landlords"
          icon={Building2}
          iconVariant="blue"
          trend="12.5%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        <StatCard
          label="Subscription MRR"
          value={formatMoney(totalMRR > 0 ? totalMRR : 8450)}
          hint={`ARR ${formatMoney((totalMRR > 0 ? totalMRR : 8450) * 12)} run rate`}
          icon={CreditCard}
          iconVariant="emerald"
          trend="21.8%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        <StatCard
          label="Landlords On Trial"
          value="24 Active Trials"
          hint="14-day free trial tier"
          icon={Users}
          iconVariant="amber"
          trend="8 converting"
          trendDirection="up"
          trendSubtext="This week"
        />
      </div>

      {/* Segmented Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="segmented-track">
          <button
            type="button"
            onClick={() => setTab('subs')}
            className={cn(
              'segmented-item cursor-pointer flex items-center gap-2',
              tab === 'subs' ? 'segmented-item-active' : 'segmented-item-inactive'
            )}
          >
            <CreditCard className="h-4 w-4" />
            Landlord Subscriptions
            <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {subscriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('plans')}
            className={cn(
              'segmented-item cursor-pointer flex items-center gap-2',
              tab === 'plans' ? 'segmented-item-active' : 'segmented-item-inactive'
            )}
          >
            <Sparkles className="h-4 w-4" />
            Subscription Tiers
            <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {plans.length}
            </span>
          </button>
        </div>

        {tab === 'plans' && (
          <button
            type="button"
            onClick={() => setShowAddPlanModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Plan Tier
          </button>
        )}
      </div>

      {/* TAB 1: SUBSCRIPTIONS TABLE */}
      {tab === 'subs' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search landlord name, email, plan…"
                className="admin-search-pill w-full pl-9 pr-3 text-xs"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="admin-input !py-1.5 !px-3 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro Plan</option>
                <option value="portfolio">Portfolio</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-input !py-1.5 !px-3 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
              </select>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="admin-table-wrap">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th>Landlord</th>
                  <th>Plan Tier</th>
                  <th>Billing Cycle</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Renewal Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.length > 0 ? (
                  filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-xs">
                            {sub.userName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{sub.userName}</p>
                            <p className="text-xs text-slate-400 font-medium">{sub.email}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold',
                            sub.plan === 'Portfolio'
                              ? 'bg-blue-50 text-brand-700 border border-blue-100'
                              : sub.plan === 'Pro'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-slate-100 text-slate-700'
                          )}
                        >
                          {sub.plan}
                        </span>
                      </td>

                      <td className="text-xs font-semibold capitalize text-slate-600">
                        {sub.billing}
                      </td>

                      <td className="text-sm font-bold text-slate-900">
                        {sub.amount ? formatMoney(sub.amount) : 'Free (£0)'}
                        {sub.billing === 'yearly' && (
                          <span className="text-[10px] text-slate-400 font-normal block">/year</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize',
                            sub.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {sub.status}
                        </span>
                      </td>

                      <td className="text-xs text-slate-500 font-medium">{sub.renews}</td>

                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSub(sub)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                      No landlord subscriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING TIERS CARDS */}
      {tab === 'plans' && (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'admin-card p-6 flex flex-col justify-between transition-all hover:-translate-y-1',
                plan.name === 'Pro' ? 'ring-2 ring-brand-500 shadow-md' : ''
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  {plan.name === 'Pro' && (
                    <span className="rounded-full bg-brand-50 text-brand-700 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">
                    {formatMoney(plan.priceMonthly)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  or {formatMoney(plan.priceYearly)} billed annually
                </p>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Included Features</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {plan.subscribers} active landlord{plan.subscribers === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Tier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Detail Modal */}
      <Modal
        open={!!selectedSub}
        title={selectedSub ? `Manage Subscription: ${selectedSub.userName}` : ''}
        onClose={() => setSelectedSub(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setSelectedSub(null)}>
              Close
            </Button>
            <Button
              fullWidth
              className="!bg-brand-600 hover:!bg-brand-700"
              onClick={() => setSelectedSub(null)}
            >
              Update Subscription
            </Button>
          </div>
        }
      >
        {selectedSub && (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Landlord:</span>
                <span className="font-bold text-slate-900 text-xs">{selectedSub.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Email:</span>
                <span className="font-medium text-slate-700 text-xs">{selectedSub.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Current Plan:</span>
                <span className="font-bold text-brand-600 text-xs">{selectedSub.plan} Tier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-xs">Renewal:</span>
                <span className="font-medium text-slate-700 text-xs">{selectedSub.renews}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Change Subscription Tier</label>
              <select className="admin-input w-full text-xs font-semibold">
                <option value="Starter">Starter (Free · 1 Property)</option>
                <option value="Pro">Pro Plan (£19/mo · Up to 5 Properties)</option>
                <option value="Portfolio">Portfolio Plan (£49/mo · Unlimited)</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Plan Modal */}
      <Modal
        open={showAddPlanModal}
        title="Add Landlord Subscription Tier"
        onClose={() => setShowAddPlanModal(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowAddPlanModal(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-brand-600 hover:!bg-brand-700"
              onClick={() => setShowAddPlanModal(false)}
            >
              Save Tier
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input label="Plan Name" placeholder="e.g. Enterprise Portfolio" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Monthly Price (£)" type="number" placeholder="79" />
            <Input label="Yearly Price (£)" type="number" placeholder="790" />
          </div>
          <Input label="Included Units / Properties" placeholder="e.g. 50 properties" />
        </div>
      </Modal>
    </div>
  )
}
