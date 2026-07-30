import { PageHeader } from '@/components/layout/PageHeader'
import { CompliancePanel } from '@/components/compliance/CompliancePanel'

export function CompliancePage() {
  return (
    <>
      <PageHeader title="Compliance" description="Certificate and regulatory status by property." />
      <CompliancePanel />
    </>
  )
}
