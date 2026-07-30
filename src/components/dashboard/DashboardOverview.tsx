import { formatMoney } from '@/lib/utils'
import { getDashboardStats } from '@/lib/mockData'
import { StatCard } from './components/StatCard'
import { RecentActivity } from './components/RecentActivity'
import { OccupancyChart } from './components/OccupancyChart'

export function DashboardOverview() {
  const stats = getDashboardStats()
  const collectionPct = Math.round((stats.collectedThisMonth / stats.expectedThisMonth) * 100)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active tenants" value={String(stats.tenants)} hint={`${stats.landlords} landlords`} />
        <StatCard label="Properties" value={String(stats.properties)} hint={`${stats.units} total units`} />
        <StatCard label="Open maintenance" value={String(stats.openMaintenance)} hint={`${stats.contractors} contractors`} tone="amber" />
        <StatCard label="Rent collected" value={formatMoney(stats.collectedThisMonth)} hint={`${collectionPct}% of expected`} tone="green" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OccupancyChart occupied={stats.occupiedUnits} total={stats.units} />
        </div>
        <RecentActivity />
      </div>
    </div>
  )
}
