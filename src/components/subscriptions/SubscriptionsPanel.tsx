import { useState } from 'react'
import { Plus } from 'lucide-react'
import { MOCK_PLANS, MOCK_SUBSCRIPTIONS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import type { Subscription, SubscriptionPlan } from '@/types/api.types'

export function SubscriptionsPanel() {
  const [tab, setTab] = useState<'active' | 'plans'>('active')
  const [showModal, setShowModal] = useState(false)

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
    { key: 'name', header: 'Plan', render: (p: SubscriptionPlan) => <span className="font-semibold">{p.name}</span> },
    { key: 'monthly', header: 'Monthly', render: (p: SubscriptionPlan) => formatMoney(p.priceMonthly) },
    { key: 'yearly', header: 'Yearly', render: (p: SubscriptionPlan) => formatMoney(p.priceYearly) },
    { key: 'subs', header: 'Subscribers', render: (p: SubscriptionPlan) => String(p.subscribers) },
    { key: 'status', header: 'Status', render: (p: SubscriptionPlan) => <Badge tone={p.active ? 'green' : 'slate'}>{p.active ? 'Active' : 'Hidden'}</Badge> },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(['active', 'plans'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
                tab === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {t === 'active' ? 'Active subscriptions' : 'Plans'}
            </button>
          ))}
        </div>
        {tab === 'plans' ? (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Add plan
          </Button>
        ) : null}
      </div>
      {tab === 'active' ? (
        <DataTable columns={subColumns} data={MOCK_SUBSCRIPTIONS} />
      ) : (
        <DataTable columns={planColumns} data={MOCK_PLANS} />
      )}
      <Modal open={showModal} title="Add subscription plan" onClose={() => setShowModal(false)}
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
