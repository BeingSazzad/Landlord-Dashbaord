import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsPanel } from '@/components/subscriptions/SubscriptionsPanel'

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Package Plans"
        description="Create, configure, and manage landlord subscription pricing tiers and platform limits."
      />
      <SubscriptionsPanel />
    </>
  )
}
