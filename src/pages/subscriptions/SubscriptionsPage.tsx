import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsPanel } from '@/components/subscriptions/SubscriptionsPanel'

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Landlord subscriptions"
        description="Billing and plans for landlords only — tenants and contractors are never charged."
      />
      <SubscriptionsPanel />
    </>
  )
}
