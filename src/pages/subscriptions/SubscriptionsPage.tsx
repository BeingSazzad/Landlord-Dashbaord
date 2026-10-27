import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsPanel } from '@/components/subscriptions/SubscriptionsPanel'

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Subscriptions & Plans"
        description="Manage landlord subscription packages, pricing tiers, and active memberships."
      />
      <SubscriptionsPanel />
    </>
  )
}
