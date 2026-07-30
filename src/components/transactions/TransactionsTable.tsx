import { useMemo, useState } from 'react'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import type { PaymentTransaction } from '@/types/api.types'

const FILTERS = ['all', 'completed', 'failed', 'refunded'] as const

export function TransactionsTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

  const rows = useMemo(() => {
    if (filter === 'all') return MOCK_TRANSACTIONS
    return MOCK_TRANSACTIONS.filter((t) => t.status === filter)
  }, [filter])

  const totalCompleted = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  const columns = [
    {
      key: 'landlord',
      header: 'Landlord',
      render: (t: PaymentTransaction) => (
        <div>
          <p className="font-semibold text-slate-900">{t.userName}</p>
          <p className="text-xs text-slate-500">{t.email}</p>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (t: PaymentTransaction) => (
        <div>
          <Badge tone="blue">{t.plan}</Badge>
          <p className="mt-0.5 text-xs capitalize text-slate-500">{t.billing} subscription</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (t: PaymentTransaction) => <span className="font-bold text-slate-900">{formatMoney(t.amount)}</span>,
    },
    {
      key: 'method',
      header: 'Method',
      render: (t: PaymentTransaction) => <span className="capitalize text-slate-600">{t.method}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: PaymentTransaction) => <Badge tone={statusTone(t.status)}>{t.status}</Badge>,
    },
    { key: 'date', header: 'Date', render: (t: PaymentTransaction) => t.date },
    {
      key: 'ref',
      header: 'Reference',
      render: (t: PaymentTransaction) => <span className="font-mono text-xs text-slate-500">{t.reference}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-slate-500">Total collected</p>
          <p className="mt-1 text-xl font-bold text-brand-700">{formatMoney(totalCompleted)}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-slate-500">Transactions</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{MOCK_TRANSACTIONS.length}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs font-medium text-slate-500">Landlords paid</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{new Set(MOCK_TRANSACTIONS.map((t) => t.userId)).size}</p>
        </div>
      </div>

      <p className="text-sm text-slate-500">Subscription payments from landlords only.</p>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`admin-chip capitalize ${filter === f ? 'admin-chip-active' : 'admin-chip-inactive'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={rows} emptyMessage="No transactions in this filter." />
    </div>
  )
}
