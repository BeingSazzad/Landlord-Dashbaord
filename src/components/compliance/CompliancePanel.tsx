import { MOCK_PROPERTIES } from '@/lib/mockData'
import { Badge } from '@/components/shared/Badge'

export function CompliancePanel() {
  const alerts = MOCK_PROPERTIES.map((p) => ({
    id: p.id,
    property: p.name,
    status: p.compliance ? 'Compliant' : 'Action required',
    detail: p.compliance ? 'All certificates valid' : 'Gas safety certificate missing or expired',
    tone: p.compliance ? ('green' as const) : ('red' as const),
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {alerts.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{item.property}</p>
              <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
            </div>
            <Badge tone={item.tone}>{item.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
