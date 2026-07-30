import { PageHeader } from '@/components/layout/PageHeader'
import { SubscriptionsPanel } from '@/components/subscriptions/SubscriptionsPanel'

export function SubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscriptions" description="Who is paying, which plan, and manage pricing tiers." />
      <SubscriptionsPanel />
    </>
  )
}
