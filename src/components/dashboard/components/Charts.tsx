import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { cn, formatMoney } from '@/lib/utils'

function YearDropdown({ selectedYear, onSelect }: { selectedYear: string; onSelect: (y: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50/60 px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
      >
        {selectedYear}
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-30 w-24 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5">
          {['2026', '2025', '2024'].map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                onSelect(year)
                setOpen(false)
              }}
              className={cn(
                'w-full px-3 py-1.5 text-left text-xs font-medium transition cursor-pointer',
                selectedYear === year
                  ? 'bg-blue-50 text-brand-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export interface MonthlyGrowthPoint {
  month: string
  landlords: number
  tenants: number
}

export interface MonthlyRevenuePoint {
  month: string
  gmv?: number
  revenue: number
}

export const MOCK_12_MONTH_GROWTH: MonthlyGrowthPoint[] = [
  { month: 'Jan', landlords: 18, tenants: 8 },
  { month: 'Feb', landlords: 24, tenants: 12 },
  { month: 'Mar', landlords: 28, tenants: 15 },
  { month: 'Apr', landlords: 34, tenants: 18 },
  { month: 'May', landlords: 42, tenants: 22 },
  { month: 'Jun', landlords: 48, tenants: 26 },
  { month: 'Jul', landlords: 55, tenants: 29 },
  { month: 'Aug', landlords: 64, tenants: 34 },
  { month: 'Sep', landlords: 72, tenants: 38 },
  { month: 'Oct', landlords: 85, tenants: 42 },
  { month: 'Nov', landlords: 98, tenants: 48 },
  { month: 'Dec', landlords: 115, tenants: 56 },
]

export const MOCK_12_MONTH_REVENUE: MonthlyRevenuePoint[] = [
  { month: 'Jan', gmv: 42000, revenue: 6200 },
  { month: 'Feb', gmv: 51000, revenue: 7400 },
  { month: 'Mar', gmv: 59000, revenue: 8600 },
  { month: 'Apr', gmv: 68000, revenue: 10200 },
  { month: 'May', gmv: 82000, revenue: 12500 },
  { month: 'Jun', gmv: 96000, revenue: 14800 },
  { month: 'Jul', gmv: 110000, revenue: 17200 },
  { month: 'Aug', gmv: 125000, revenue: 19800 },
  { month: 'Sep', gmv: 138000, revenue: 22400 },
  { month: 'Oct', gmv: 155000, revenue: 25100 },
  { month: 'Nov', gmv: 172000, revenue: 28400 },
  { month: 'Dec', gmv: 194000, revenue: 32500 },
]

export function UserGrowthDualBarChart({
  data = MOCK_12_MONTH_GROWTH,
  selectedYear: controlledYear,
  onYearChange,
  isLoading = false,
}: {
  data?: MonthlyGrowthPoint[]
  selectedYear?: string
  onYearChange?: (year: string) => void
  isLoading?: boolean
}) {
  const [internalYear, setInternalYear] = useState('2026')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const currentYear = controlledYear ?? internalYear

  const handleYearSelect = (y: string) => {
    setInternalYear(y)
    onYearChange?.(y)
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.landlords || 0, d.tenants || 0)), 1) * 1.15

  return (
    <div className="admin-card flex flex-col justify-between p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">User Growth</h3>
          <p className="mt-0.5 text-xs text-slate-400 font-medium">Landlord and tenant registrations</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-brand-600" />
              Landlords
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-blue-300" />
              Tenants
            </span>
          </div>

          <YearDropdown selectedYear={currentYear} onSelect={handleYearSelect} />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative mt-4 min-h-[190px]">
        {isLoading ? (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            <span className="text-xs">Loading growth data...</span>
          </div>
        ) : (
          <>
            {/* Floating tooltip only on hover */}
            <div className="h-4 text-right text-xs">
              {hoveredIdx !== null && data[hoveredIdx] && (
                <span className="font-semibold text-slate-700 animate-fade-in">
                  {data[hoveredIdx].month}: <span className="text-brand-600 font-bold">{data[hoveredIdx].landlords} landlords</span>,{' '}
                  <span className="text-blue-500 font-bold">{data[hoveredIdx].tenants} tenants</span>
                </span>
              )}
            </div>

            <div className="flex h-44 items-end justify-between gap-1 sm:gap-2.5 pt-2">
              {data.map((item, idx) => {
                const h1 = ((item.landlords || 0) / maxVal) * 100
                const h2 = ((item.tenants || 0) / maxVal) * 100
                const isHovered = hoveredIdx === idx

                return (
                  <div
                    key={item.month}
                    className="group flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <div className="flex items-end justify-center gap-1 w-full max-w-[28px] h-full">
                      {/* Primary Brand Blue bar (Landlords) */}
                      <div
                        className={cn(
                          'w-1/2 rounded-t-[3px] bg-brand-600 transition-all duration-200',
                          isHovered ? 'bg-brand-700 brightness-110 shadow-sm' : 'hover:opacity-90'
                        )}
                        style={{ height: `${Math.max(6, h1)}%` }}
                      />
                      {/* Harmonizing Soft Blue bar (Tenants) */}
                      <div
                        className={cn(
                          'w-1/2 rounded-t-[3px] bg-blue-300 transition-all duration-200',
                          isHovered ? 'bg-blue-400 brightness-110 shadow-sm' : 'hover:opacity-90'
                        )}
                        style={{ height: `${Math.max(6, h2)}%` }}
                      />
                    </div>

                    <span
                      className={cn(
                        'mt-2.5 text-[11px] font-medium transition-colors',
                        isHovered ? 'text-brand-700 font-bold' : 'text-slate-400'
                      )}
                    >
                      {item.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function RevenueSplineChart({
  data = MOCK_12_MONTH_REVENUE,
  selectedYear: controlledYear,
  onYearChange,
  isLoading = false,
}: {
  data?: MonthlyRevenuePoint[]
  selectedYear?: string
  onYearChange?: (year: string) => void
  isLoading?: boolean
}) {
  const [internalYear, setInternalYear] = useState('2026')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const currentYear = controlledYear ?? internalYear

  const handleYearSelect = (y: string) => {
    setInternalYear(y)
    onYearChange?.(y)
  }

  const width = 640
  const height = 220
  const paddingX = 20
  const paddingTop = 25
  const paddingBottom = 30

  const safeData = data.length > 0 ? data : [{ month: 'Jan', revenue: 0 }]
  const maxRevenue = Math.max(...safeData.map((d) => d.revenue || 0), 1) * 1.15
  const minRevenue = 0

  const points = safeData.map((d, index) => {
    const denom = safeData.length > 1 ? safeData.length - 1 : 1
    const x = paddingX + (index / denom) * (width - paddingX * 2)
    const y = paddingTop + (1 - ((d.revenue || 0) - minRevenue) / (maxRevenue - minRevenue)) * (height - paddingTop - paddingBottom)
    return { x, y, data: d }
  })

  // Create smooth bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midX = (prev.x + curr.x) / 2
    pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`
  }

  // Area fill under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`

  return (
    <div className="admin-card flex flex-col justify-between p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Subscription Revenue</h3>
          <p className="mt-0.5 text-xs text-slate-400 font-medium">Platform MRR and subscription overview</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-0.5 w-3 border-t-2 border-dashed border-slate-400" />
              Target MRR
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="h-0.5 w-3 bg-emerald-500 rounded-full" />
              Actual MRR
            </span>
          </div>

          <YearDropdown selectedYear={currentYear} onSelect={handleYearSelect} />
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative mt-4 min-h-[190px]">
        {isLoading ? (
          <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-xs">Loading revenue data...</span>
          </div>
        ) : (
          <>
            {/* Dynamic hover indicator badge (only shows on hover) */}
            <div className="h-4 text-right text-xs">
              {hoveredIdx !== null && safeData[hoveredIdx] && (
                <span className="font-semibold text-slate-700 animate-fade-in">
                  {safeData[hoveredIdx].month}:{' '}
                  <span className="text-emerald-600 font-bold">{formatMoney(safeData[hoveredIdx].revenue)}</span>
                  {safeData[hoveredIdx].gmv ? (
                    <span className="text-slate-500"> · Target: {formatMoney(safeData[hoveredIdx].gmv!)}</span>
                  ) : null}
                </span>
              )}
            </div>

            <div className="relative w-full pt-1">
              <div className="relative h-36 w-full">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="95%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Subtle horizontal grid lines */}
                  {[0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = paddingTop + (1 - ratio) * (height - paddingTop - paddingBottom)
                    return (
                      <line
                        key={ratio}
                        x1={paddingX}
                        y1={y}
                        x2={width - paddingX}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )
                  })}

                  {/* Gradient area under line */}
                  <path d={areaD} fill="url(#revenueGradient)" />

                  {/* Smooth curve line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Point nodes */}
                {points.map((pt, idx) => {
                  const leftPercent = (pt.x / width) * 100
                  const topPercent = (pt.y / height) * 100
                  const isHovered = hoveredIdx === idx
                  return (
                    <div
                      key={idx}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 p-2 flex items-center justify-center group"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <div
                        className={cn(
                          'rounded-full bg-white border-2 border-emerald-500 transition-all duration-150',
                          isHovered
                            ? 'h-3.5 w-3.5 ring-4 ring-emerald-500/25 scale-110 shadow-sm'
                            : 'h-2 w-2 shadow-xs group-hover:scale-125'
                        )}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Month labels at bottom */}
              <div className="flex justify-between px-2 pt-3 pb-1 text-[11px] font-medium text-slate-400">
                {safeData.map((item, idx) => (
                  <span
                    key={item.month}
                    className={cn(
                      'cursor-pointer transition-colors',
                      hoveredIdx === idx ? 'text-emerald-700 font-bold' : 'hover:text-slate-600'
                    )}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {item.month}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Retain legacy helpers for AnalyticsPage compatibility
export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const points = data.map((d) => ({
    month: d.month,
    gmv: d.revenue * 7,
    revenue: d.revenue,
  }))
  return <RevenueSplineChart data={points} />
}

export function UserGrowthChart({ data }: { data: { month: string; users: number }[] }) {
  const points = data.map((d) => ({
    month: d.month,
    landlords: Math.round(d.users * 0.6),
    tenants: Math.round(d.users * 0.4),
  }))
  return <UserGrowthDualBarChart data={points} />
}
