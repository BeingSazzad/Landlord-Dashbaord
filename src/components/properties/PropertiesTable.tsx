import { MOCK_PROPERTIES } from '@/lib/mockData'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import type { Property } from '@/types/api.types'

export function PropertiesTable() {
  const columns = [
    { key: 'name', header: 'Property', render: (p: Property) => <span className="font-semibold text-slate-900">{p.name}</span> },
    { key: 'address', header: 'Address', render: (p: Property) => p.address },
    {
      key: 'units',
      header: 'Units',
      render: (p: Property) => (
        <span>
          {p.occupied}/{p.units} occupied
        </span>
      ),
    },
    { key: 'rent', header: 'Rent from', render: (p: Property) => p.rent },
    {
      key: 'status',
      header: 'Status',
      render: (p: Property) => <Badge tone={statusTone(p.status)}>{p.status}</Badge>,
    },
    {
      key: 'compliance',
      header: 'Compliance',
      render: (p: Property) => (
        <Badge tone={p.compliance ? 'green' : 'red'}>{p.compliance ? 'OK' : 'Alert'}</Badge>
      ),
    },
  ]

  return <DataTable columns={columns} data={MOCK_PROPERTIES} />
}
