import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Cross-landlord snapshot of users, properties, rent and maintenance."
      />
      <DashboardOverview />
    </>
  )
}
