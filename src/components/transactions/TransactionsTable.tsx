import { useMemo, useState } from 'react'
import {
  CreditCard,
  ExternalLink,
  FileDown,
  Loader2,
  Receipt,
  Users,
} from 'lucide-react'
import {
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
} from '@/services/endpoints/transactionsApi'
import { cn } from '@/lib/utils'
import { DataTable } from '@/components/shared/DataTable'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Avatar } from '@/components/shared/Avatar'
import type { AdminTransactionItem } from '@/types/api.types'

const FILTERS = ['all', 'completed', 'failed', 'refunded'] as const

export function TransactionsTable() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')

  // Fetch summary stats & transactions from backend
  const { data: statsResponse, isLoading: isStatsLoading } = useGetTransactionStatsQuery()
  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isFetching,
  } = useGetTransactionsQuery({
    status: filter !== 'all' ? filter : undefined,
  })

  const stats = statsResponse?.data
  const rawTransactions = transactionsResponse?.data || []

  // Filter client-side as fallback if needed
  const rows = useMemo(() => {
    if (filter === 'all') return rawTransactions
    return rawTransactions.filter(
      (t) => t.status.toLowerCase() === filter.toLowerCase()
    )
  }, [filter, rawTransactions])

  const columns = useMemo(
    () => [
      {
        key: 'landlord',
        header: 'Landlord',
        render: (t: AdminTransactionItem) => (
          <div className="flex items-center gap-3">
            <Avatar
              name={t.landlord?.name || 'Landlord'}
              src={t.landlord?.profileImage}
              size="sm"
            />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">
                {t.landlord?.name || 'Unknown'}
              </p>
              <p className="text-xs text-slate-500 font-mono truncate">
                {t.landlord?.email || '—'}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: 'plan',
        header: 'Plan & Billing',
        render: (t: AdminTransactionItem) => (
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-blue-100">
              {t.plan}
            </span>
            <p className="mt-0.5 text-xs capitalize text-slate-400">
              {t.billing} subscription
            </p>
          </div>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        render: (t: AdminTransactionItem) => (
          <div>
            <p className="font-bold text-slate-900 text-sm">
              {t.formattedAmount || `${t.currencySymbol || '$'}${t.amount}`}
            </p>
            <span className="text-[11px] font-medium text-slate-400 capitalize">
              {t.method}
            </span>
          </div>
        ),
      },
      {
        key: 'reference',
        header: 'Invoice / Ref',
        render: (t: AdminTransactionItem) => (
          <div>
            <p className="font-mono text-xs font-bold text-slate-700">
              {t.invoiceNumber || '—'}
            </p>
            <p className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
              {t.transactionId}
            </p>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (t: AdminTransactionItem) => {
          const s = t.status.toLowerCase()
          if (s === 'completed' || s === 'paid' || s === 'active') {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Completed
              </span>
            )
          }
          if (s === 'failed') {
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
              {t.status}
            </span>
          )
        },
      },
      {
        key: 'date',
        header: 'Date',
        render: (t: AdminTransactionItem) => (
          <span className="text-xs text-slate-600 font-medium">
            {t.formattedDate || new Date(t.date).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Invoice',
        render: (t: AdminTransactionItem) => (
          <div className="flex items-center gap-2">
            {t.invoicePdf && (
              <a
                href={t.invoicePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                title="Download Invoice PDF"
              >
                <FileDown className="h-3.5 w-3.5 text-brand-600" /> PDF
              </a>
            )}
            {t.invoiceUrl && (
              <a
                href={t.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-400 hover:text-brand-600 transition"
                title="View Stripe Receipt"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      {/* 3 Summary Stat Cards matching new design system */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Collected"
          value={
            isStatsLoading
              ? '...'
              : stats?.formattedTotalCollected || `$${stats?.totalCollected ?? 0}`
          }
          icon={CreditCard}
          iconVariant="blue"
        />
        <StatCard
          label="Settled Transactions"
          value={isStatsLoading ? '...' : String(stats?.totalTransactions ?? 0)}
          icon={Receipt}
          iconVariant="indigo"
        />
        <StatCard
          label="Paying Landlords"
          value={isStatsLoading ? '...' : String(stats?.payingLandlords ?? 0)}
          icon={Users}
          iconVariant="emerald"
        />
      </div>

      {/* Control Bar: Filter on Left, Sync Indicator on Right */}
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

        {isFetching && !isTransactionsLoading && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin text-brand-600" /> Syncing transactions...
          </span>
        )}
      </div>

      {/* Table / Loading State */}
      {isTransactionsLoading ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
          <p className="text-sm font-medium">Loading transactions...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          emptyMessage="No transactions found for the selected filter."
        />
      )}
    </div>
  )
}
