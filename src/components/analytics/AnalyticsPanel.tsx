import { getDashboardStats, MOCK_INVOICES } from '@/lib/mockData'
import { formatMoney, parseMoney } from '@/lib/utils'
import { AnalyticsChart } from './components/AnalyticsChart'

export function AnalyticsPanel() {
  const stats = getDashboardStats()
  const paid = MOCK_INVOICES.filter((i) => i.status === 'Paid').reduce((s, i) => s + parseMoney(i.amount), 0)
  const pending = MOCK_INVOICES.filter((i) => i.status === 'Pending').reduce((s, i) => s + parseMoney(i.amount), 0)
  const overdue = MOCK_INVOICES.filter((i) => i.status === 'Overdue').reduce((s, i) => s + parseMoney(i.amount), 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <p className="text-sm text-emerald-700">Collected</p>
          <p className="text-2xl font-bold text-emerald-900">{formatMoney(paid)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-2xl font-bold text-amber-900">{formatMoney(pending)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
          <p className="text-sm text-red-700">Overdue</p>
          <p className="text-2xl font-bold text-red-900">{formatMoney(overdue)}</p>
        </div>
      </div>
      <AnalyticsChart
        occupancyRate={Math.round((stats.occupiedUnits / stats.units) * 100)}
        openJobs={stats.openMaintenance}
        complianceAlerts={stats.complianceAlerts}
      />
    </div>
  )
}
