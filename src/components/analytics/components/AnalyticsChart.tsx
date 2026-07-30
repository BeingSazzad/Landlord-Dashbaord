interface AnalyticsChartProps {
  occupancyRate: number
  openJobs: number
  complianceAlerts: number
}

export function AnalyticsChart({ occupancyRate, openJobs, complianceAlerts }: AnalyticsChartProps) {
  const bars = [
    { label: 'Occupancy %', value: occupancyRate, max: 100 },
    { label: 'Open jobs', value: openJobs, max: 10 },
    { label: 'Compliance alerts', value: complianceAlerts, max: 5 },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Platform health</h3>
      <div className="mt-5 space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{bar.label}</span>
              <span className="font-semibold text-slate-700">{bar.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${Math.min(100, (bar.value / bar.max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
