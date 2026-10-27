import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionsTable } from '@/components/transactions/TransactionsTable'

export function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Real-time log of subscription revenue, settlements, and payment statuses."
      />
      <TransactionsTable />
    </>
  )
}
