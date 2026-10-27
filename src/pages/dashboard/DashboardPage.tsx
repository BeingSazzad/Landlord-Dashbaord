import { PageHeader } from '@/components/layout/PageHeader'
import { PlatformOverview } from '@/components/dashboard/PlatformOverview'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Platform metrics, landlord subscriptions, and support activity."
      />
      <PlatformOverview />
    </>
  )
}
