import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'

export function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Landlord subscription payments — who paid, which plan, and payment status."
      />
      <TransactionsTable />
    </>
  )
}
