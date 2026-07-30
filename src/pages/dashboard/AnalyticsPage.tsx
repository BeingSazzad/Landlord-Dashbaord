import { PageHeader } from '@/components/layout/PageHeader'
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel'

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Rent collection, occupancy and operational health." />
      <AnalyticsPanel />
    </>
  )
}
