import { PageHeader } from '@/components/layout/PageHeader'
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel'

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Deep dive — revenue charts, user growth, plan mix and monthly trends." />
      <AnalyticsPanel />
    </>
  )
}
