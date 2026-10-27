import { useMemo, useState } from 'react'
import { CreditCard, Receipt, Users } from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { cn, formatMoney } from '@/lib/utils'
import { DataTable } from '@/components/shared/DataTable'
import { StatCard } from '@/components/dashboard/components/StatCard'
import type { PaymentTransaction } from '@/types/api.types'

const FILTERS = ['all', 'completed', 'failed', 'refunded'] as const

export function TransactionsTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

  const rows = useMemo(() => {
    if (filter === 'all') return MOCK_TRANSACTIONS
    return MOCK_TRANSACTIONS.filter((t) => t.status === filter)
  }, [filter])

  const totalCompleted = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const uniqueLandlords = new Set(MOCK_TRANSACTIONS.map((t) => t.userId)).size

  const columns = [
    {
      key: 'landlord',
      header: 'Landlord',
      render: (t: PaymentTransaction) => (
        <div>
          <p className="font-semibold text-slate-900">{t.userName}</p>
          <p className="text-xs text-slate-500 font-mono">{t.email}</p>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (t: PaymentTransaction) => (
        <div>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-blue-100">
            {t.plan}
          </span>
          <p className="mt-0.5 text-xs capitalize text-slate-400">{t.billing} subscription</p>
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
      render: (t: PaymentTransaction) => <span className="capitalize text-slate-600 text-xs font-medium">{t.method}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t: PaymentTransaction) => {
        if (t.status === 'completed') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Completed
            </span>
          )
        }
        if (t.status === 'failed') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-100">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Failed
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Refunded
          </span>
        )
      },
    },
    { key: 'date', header: 'Date', render: (t: PaymentTransaction) => <span className="text-xs text-slate-600">{t.date}</span> },
    {
      key: 'ref',
      header: 'Reference',
      render: (t: PaymentTransaction) => <span className="font-mono text-xs text-slate-400">{t.reference}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 3 Summary Stat Cards matching new design system */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Collected"
          value={formatMoney(totalCompleted)}
          icon={CreditCard}
          iconVariant="blue"
        />
        <StatCard
          label="Settled Transactions"
          value={String(MOCK_TRANSACTIONS.length)}
          icon={Receipt}
          iconVariant="indigo"
        />
        <StatCard
          label="Paying Landlords"
          value={String(uniqueLandlords)}
          icon={Users}
          iconVariant="emerald"
        />
      </div>

      {/* Segmented Track Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="segmented-track">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'segmented-item capitalize',
                filter === f ? 'segmented-item-active' : 'segmented-item-inactive'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={rows} emptyMessage="No transactions in this filter." />
    </div>
  )
}
