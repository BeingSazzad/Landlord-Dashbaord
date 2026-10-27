import { PageHeader } from '@/components/layout/PageHeader'
import { SupportInbox } from '@/components/support/SupportInbox'

export function SupportPage() {
  return (
    <>
      <PageHeader
        title="Support Helpdesk"
        description="Manage incoming platform inquiries, tenant issues, and landlord assistance requests."
      />
      <SupportInbox />
    </>
  )
}
