import { PageHeader } from '@/components/layout/PageHeader'
import { PlatformOverview } from '@/components/dashboard/PlatformOverview'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="High-level platform metrics, tenant activity, and revenue breakdown."
      />
      <PlatformOverview />
    </>
  )
}
