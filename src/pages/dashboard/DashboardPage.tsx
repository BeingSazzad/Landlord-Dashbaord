import { PageHeader } from '@/components/layout/PageHeader'
import { PlatformOverview } from '@/components/dashboard/PlatformOverview'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Today's snapshot — open tickets, recent billing and quick links. Charts live in Analytics."
      />
      <PlatformOverview />
    </>
  )
}
