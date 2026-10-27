import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsPanel } from '@/components/subscriptions/SubscriptionsPanel'

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader
        title="Subscription Packages"
        description="Manage platform subscription tiers, property quotas, and monthly/annual pricing for landlords."
      />
      <SubscriptionsPanel />
    </>
  )
}
