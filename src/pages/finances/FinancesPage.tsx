import { PageHeader } from '@/components/layout/PageHeader'
import { FinancesTable } from '@/components/finances/FinancesTable'

export function FinancesPage() {
  return (
    <>
      <PageHeader title="Finances" description="Invoices, rent due and payment status platform-wide." />
      <FinancesTable />
    </>
  )
}
