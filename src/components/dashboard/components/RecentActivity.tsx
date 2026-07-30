const ACTIVITY = [
  { title: 'Rent overdue', meta: 'David Wilson · £1,850', time: '2h ago' },
  { title: 'Maintenance opened', meta: 'Hallway light · 12 Park Lane', time: '6h ago' },
  { title: 'Tenant invite pending', meta: 'James Chen · Flat 2B', time: '1d ago' },
  { title: 'Compliance alert', meta: '88 King Street · Gas cert', time: '2d ago' },
]

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
      <ul className="mt-4 space-y-3">
        {ACTIVITY.map((item) => (
          <li key={item.title} className="rounded-lg border border-slate-100 px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="text-xs text-slate-500">{item.meta}</p>
            <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
