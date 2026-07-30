import { MOCK_INVOICES } from '@/lib/mockData'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import type { Invoice } from '@/types/api.types'

export function FinancesTable() {
  const columns = [
    { key: 'num', header: 'Invoice', render: (i: Invoice) => <span className="font-medium">{i.num}</span> },
    { key: 'tenant', header: 'Tenant', render: (i: Invoice) => i.tenant },
    {
      key: 'property',
      header: 'Property',
      render: (i: Invoice) => (
        <span>
          {i.prop}
          {i.unit ? ` · ${i.unit}` : ''}
        </span>
      ),
    },
    { key: 'amount', header: 'Amount', render: (i: Invoice) => <span className="font-semibold">{i.amount}</span> },
    { key: 'due', header: 'Due', render: (i: Invoice) => i.due },
    {
      key: 'status',
      header: 'Status',
      render: (i: Invoice) => <Badge tone={statusTone(i.status)}>{i.status}</Badge>,
    },
  ]

  return <DataTable columns={columns} data={MOCK_INVOICES} />
}
