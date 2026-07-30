import { MOCK_MAINTENANCE } from '@/lib/mockData'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import type { MaintenanceJob } from '@/types/api.types'

export function MaintenanceTable() {
  const columns = [
    { key: 'issue', header: 'Issue', render: (m: MaintenanceJob) => <span className="font-semibold">{m.issue}</span> },
    {
      key: 'location',
      header: 'Location',
      render: (m: MaintenanceJob) => (
        <span>
          {m.prop} · {m.unit}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (m: MaintenanceJob) => <Badge tone={statusTone(m.priority)}>{m.priority}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (m: MaintenanceJob) => <Badge tone={statusTone(m.status)}>{m.status}</Badge>,
    },
    { key: 'contractor', header: 'Contractor', render: (m: MaintenanceJob) => m.contractor },
    { key: 'tenant', header: 'Reported by', render: (m: MaintenanceJob) => m.tenantName || 'Landlord' },
  ]

  return <DataTable columns={columns} data={MOCK_MAINTENANCE} />
}
