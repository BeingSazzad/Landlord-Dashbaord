import { useState, useMemo } from 'react'
import {
  ArrowUpDown,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  Receipt,
  Search,
  Users,
} from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { PaymentTransaction } from '@/types/api.types'

type SortField = 'date' | 'amount' | 'userName' | 'status'
type SortOrder = 'asc' | 'desc'
type StatusFilter = 'all' | 'completed' | 'failed' | 'refunded'

export function TransactionsTable() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((t) => {
      const matchFilter = filter === 'all' || t.status === filter
      const matchSearch =
        !search ||
        t.userName.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase()) ||
        t.plan.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    }).sort((a, b) => {
      let result = 0
      if (sortField === 'amount') {
        result = a.amount - b.amount
      } else if (sortField === 'userName') {
        result = a.userName.localeCompare(b.userName)
      } else if (sortField === 'status') {
        result = a.status.localeCompare(b.status)
      } else {
        result = new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return sortOrder === 'asc' ? result : -result
    })
  }, [filter, search, sortField, sortOrder])

  const totalCompleted = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  // Real CSV export
  const exportCSV = () => {
    const headers = ['Reference', 'Landlord', 'Email', 'Plan', 'Billing', 'Amount', 'Method', 'Status', 'Date']
    const rows = processedTransactions.map((t) => [
      t.reference,
      `"${t.userName}"`,
      t.email,
      t.plan,
      t.billing,
      t.amount,
      t.method,
      t.status,
      `"${t.date}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `landlordhq_transactions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported CSV file successfully.')
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3 Top Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Total Collected"
          value={formatMoney(totalCompleted)}
          hint="From landlord subscription billings"
          icon={Receipt}
          iconVariant="emerald"
          trend="21.8%"
          trendDirection="up"
          trendSubtext="vs last month"
        />

        <StatCard
          label="Settled Transactions"
          value={`${MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').length} Cleared`}
          hint="1 failed · 1 refunded"
          icon={CreditCard}
          iconVariant="blue"
          trend="98.4%"
          trendDirection="up"
          trendSubtext="Success rate"
        />

        <StatCard
          label="Paying Landlords"
          value={String(new Set(MOCK_TRANSACTIONS.map((t) => t.userId)).size)}
          hint="Distinct active subscribers"
          icon={Users}
          iconVariant="slate"
        />
      </div>

      {/* Toolbar: Segmented status filter + Search + Export CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="segmented-track">
          {(['all', 'completed', 'failed', 'refunded'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                'segmented-item cursor-pointer capitalize flex items-center gap-1.5',
                filter === s ? 'segmented-item-active' : 'segmented-item-inactive'
              )}
            >
              {s}
              <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                {s === 'all'
                  ? MOCK_TRANSACTIONS.length
                  : MOCK_TRANSACTIONS.filter((t) => t.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Export Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, landlord…"
              className="admin-search-pill !pl-9.5 pr-3 py-1.5 text-xs w-48 sm:w-60"
            />
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition cursor-pointer shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Interactive Transactions Table */}
      <div className="admin-table-wrap">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th
                onClick={() => toggleSort('userName')}
                className="cursor-pointer hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-1.5">
                  Landlord
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th>Plan Tier</th>

              <th
                onClick={() => toggleSort('amount')}
                className="cursor-pointer hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-1.5">
                  Amount
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th>Payment Method</th>

              <th
                onClick={() => toggleSort('status')}
                className="cursor-pointer hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-1.5">
                  Status
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => toggleSort('date')}
                className="cursor-pointer hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-1.5">
                  Date
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>

              <th>Reference</th>
              <th className="text-right">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {processedTransactions.length > 0 ? (
              processedTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  {/* Clean Landlord Name with avatar - no raw email clutter */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold text-xs group-hover:bg-brand-50 group-hover:text-brand-700 transition">
                        {txn.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition">
                        {txn.userName}
                      </span>
                    </div>
                  </td>

                  {/* Clean Plan Name */}
                  <td>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-bold',
                        txn.plan === 'Portfolio'
                          ? 'bg-blue-50 text-brand-700 border border-blue-100'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      )}
                    >
                      {txn.plan} Plan
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize block mt-0.5">
                      {txn.billing}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="text-sm font-bold text-slate-900">
                    {formatMoney(txn.amount)}
                  </td>

                  {/* Method */}
                  <td className="text-xs font-medium text-slate-600 capitalize">
                    {txn.method === 'card' ? '💳 Card (Stripe)' : '🏦 Bank Transfer'}
                  </td>

                  {/* Status with dot */}
                  <td>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize',
                        txn.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : txn.status === 'failed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {txn.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="text-xs text-slate-500 font-medium">{txn.date}</td>

                  {/* Reference */}
                  <td>
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {txn.reference}
                    </span>
                  </td>

                  {/* View Details Action */}
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTxn(txn)
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                  No transactions match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        open={!!selectedTxn}
        title="Transaction Breakdown"
        onClose={() => setSelectedTxn(null)}
        footer={
          <div className="flex gap-2.5">
            <Button variant="secondary" fullWidth onClick={() => setSelectedTxn(null)}>
              Close
            </Button>
            <Button
              fullWidth
              className="!bg-brand-600 hover:!bg-brand-700 flex items-center justify-center gap-1.5"
              onClick={() => {
                showToast(`Receipt for ${selectedTxn?.reference} downloaded.`)
                setSelectedTxn(null)
              }}
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        }
      >
        {selectedTxn && (
          <div className="space-y-4 text-sm">
            {/* Amount Banner */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5 text-center">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Paid</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{formatMoney(selectedTxn.amount)}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize mt-2',
                  selectedTxn.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedTxn.status === 'failed'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-slate-100 text-slate-600'
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {selectedTxn.status}
              </span>
            </div>

            {/* Breakdown fields */}
            <div className="space-y-2 text-xs border border-slate-100 rounded-xl p-4 bg-white">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Transaction Reference:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTxn.reference}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Payer Landlord:</span>
                <span className="font-bold text-slate-800">{selectedTxn.userName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Billing Email:</span>
                <span className="text-slate-600">{selectedTxn.email}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Subscription Tier:</span>
                <span className="font-semibold text-brand-700">{selectedTxn.plan} Plan</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Billing Period:</span>
                <span className="capitalize text-slate-700">{selectedTxn.billing}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Payment Gateway:</span>
                <span className="capitalize text-slate-700">{selectedTxn.method} (Stripe UK)</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Settlement Date:</span>
                <span className="text-slate-700">{selectedTxn.date}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
