import { useState } from 'react'
import { Plus } from 'lucide-react'
import { MOCK_PLANS, getLandlordSubscriptions } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import type { Subscription, SubscriptionPlan } from '@/types/api.types'

import { cn } from '@/lib/utils'

export function SubscriptionsPanel() {
  const [tab, setTab] = useState<'active' | 'plans'>('active')
  const [showModal, setShowModal] = useState(false)
  const landlordSubs = getLandlordSubscriptions()

  const subColumns = [
    { key: 'user', header: 'Landlord', render: (s: Subscription) => (
      <div><p className="font-semibold text-slate-900">{s.userName}</p><p className="text-xs text-slate-500">{s.email}</p></div>
    )},
    { key: 'plan', header: 'Plan', render: (s: Subscription) => s.plan },
    { key: 'billing', header: 'Billing', render: (s: Subscription) => <span className="capitalize">{s.billing}</span> },
    { key: 'amount', header: 'Amount', render: (s: Subscription) => <span className="font-semibold">{s.amount ? formatMoney(s.amount) : 'Free'}</span> },
    { key: 'status', header: 'Status', render: (s: Subscription) => <Badge tone={statusTone(s.status)}>{s.status}</Badge> },
    { key: 'renews', header: 'Renews', render: (s: Subscription) => s.renews },
  ]

  const planColumns = [
    { key: 'name', header: 'Plan', render: (p: SubscriptionPlan) => <span className="font-semibold text-slate-900">{p.name}</span> },
    { key: 'monthly', header: 'Monthly', render: (p: SubscriptionPlan) => <span className="font-semibold text-slate-900">{formatMoney(p.priceMonthly)}</span> },
    { key: 'yearly', header: 'Yearly', render: (p: SubscriptionPlan) => <span className="font-semibold text-slate-900">{formatMoney(p.priceYearly)}</span> },
    { key: 'subs', header: 'Landlords', render: (p: SubscriptionPlan) => String(p.subscribers) },
    { key: 'status', header: 'Status', render: (p: SubscriptionPlan) => (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {p.active ? 'Active' : 'Hidden'}
      </span>
    )},
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="segmented-track">
          <button
            type="button"
            onClick={() => setTab('active')}
            className={cn('segmented-item', tab === 'active' ? 'segmented-item-active' : 'segmented-item-inactive')}
          >
            Landlord Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setTab('plans')}
            className={cn('segmented-item', tab === 'plans' ? 'segmented-item-active' : 'segmented-item-inactive')}
          >
            Package Plans
          </button>
        </div>
        {tab === 'plans' ? (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Add Plan
          </Button>
        ) : null}
      </div>
      {tab === 'active' ? (
        <DataTable columns={subColumns} data={landlordSubs} />
      ) : (
        <DataTable columns={planColumns} data={MOCK_PLANS} />
      )}
      <Modal open={showModal} title="Add landlord plan" onClose={() => setShowModal(false)}
        footer={<Button fullWidth onClick={() => setShowModal(false)}>Save plan (demo)</Button>}>
        <div className="space-y-3">
          <Input label="Plan name" placeholder="e.g. Business" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Monthly price (£)" type="number" placeholder="29" />
            <Input label="Yearly price (£)" type="number" placeholder="290" />
          </div>
          <p className="text-xs text-slate-500">Demo only — plan is not persisted without a backend.</p>
        </div>
      </Modal>
    </div>
  )
}
