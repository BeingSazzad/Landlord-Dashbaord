export function OccupancyChart({ occupied, total }: { occupied: number; total: number }) {
  const pct = total ? Math.round((occupied / total) * 100) : 0
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Portfolio occupancy</h3>
      <p className="mt-1 text-sm text-slate-500">
        {occupied} of {total} units occupied ({pct}%)
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">{occupied}</p>
          <p className="text-xs text-slate-500">Occupied</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">{total - occupied}</p>
          <p className="text-xs text-slate-500">Vacant</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-900">{pct}%</p>
          <p className="text-xs text-slate-500">Rate</p>
        </div>
      </div>
    </div>
  )
}
