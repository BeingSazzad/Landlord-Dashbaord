import { PageHeader } from '@/components/layout/PageHeader'
import { SupportInbox } from '@/components/support/SupportInbox'

export function SupportPage() {
  return (
    <>
      <PageHeader title="Support" description="Messages from landlords, tenants and contractors." />
      <SupportInbox />
    </>
  )
}
