import { PageHeader } from '@/components/layout/PageHeader'
import { SupportInbox } from '@/components/support/SupportInbox'

export function SupportPage() {
  return (
    <>
      <PageHeader title="Support" description="Reply to tickets — demo sends update in-app only (no real email)." />
      <SupportInbox />
    </>
  )
}
