import { PageHeader } from '@/components/layout/PageHeader'
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel'

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Monthly revenue, user growth and landlord sign-ups." />
      <AnalyticsPanel />
    </>
  )
}
