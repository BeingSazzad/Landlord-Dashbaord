import { PageHeader } from '@/components/layout/PageHeader'
import { PlatformOverview } from '@/components/dashboard/PlatformOverview'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Users, subscriptions, revenue and support across the Landlord HQ app."
      />
      <PlatformOverview />
    </>
  )
}
