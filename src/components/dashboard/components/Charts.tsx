import type { ReactNode } from 'react'
import { cn, formatMoney } from '@/lib/utils'

interface BarChartProps {
  data: { label: string; value: number }[]
  barClass?: string
  formatValue?: (v: number) => string
  accentClass?: string
}

function roundUpNice(max: number): number {
  if (max <= 0) return 10
  const exp = Math.pow(10, Math.floor(Math.log10(max)))
  const n = max / exp
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return nice * exp
}

function buildTicks(max: number, count = 4): number[] {
  const top = roundUpNice(max)
  return Array.from({ length: count + 1 }, (_, i) => Math.round((top / count) * (count - i)))
}

export function BarChart({
  data,
  barClass = 'chart-bar-blue',
  formatValue = (v) => String(v),
  accentClass = 'text-brand-600',
}: BarChartProps) {
  const rawMax = Math.max(...data.map((d) => d.value), 1)
  const chartMax = roundUpNice(rawMax)
  const ticks = buildTicks(rawMax)

  return (
    <div className="chart-body">
      <div className="chart-grid-wrap">
        <div className="chart-y-axis">
          {ticks.map((tick) => (
            <span key={tick} className="chart-y-label">
              {formatValue(tick)}
            </span>
          ))}
        </div>

        <div className="chart-plot">
          <div className="chart-grid-lines" aria-hidden="true">
            {ticks.map((tick) => (
              <div key={tick} className="chart-grid-line" />
            ))}
          </div>

          <div className="chart-bars">
            {data.map((item, index) => {
              const heightPct = Math.max(8, (item.value / chartMax) * 100)
              const isLatest = index === data.length - 1
              return (
                <div key={item.label} className="chart-bar-col group">
                  <span
                    className={cn(
                      'chart-bar-value',
                      isLatest ? accentClass : 'text-slate-400 group-hover:text-slate-600',
                    )}
                  >
                    {formatValue(item.value)}
                  </span>
                  <div className="chart-bar-track">
                    <div
                      className={cn('chart-bar-fill', barClass, isLatest && 'chart-bar-fill-active')}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="chart-x-axis">
        {data.map((item, index) => {
          const isLatest = index === data.length - 1
          return (
            <span key={item.label} className={cn('chart-bar-label', isLatest && 'font-semibold text-brand-700')}>
              {item.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  subtitle: string
  value: string
  badge?: string
  children: ReactNode
}

function ChartCard({ title, subtitle, value, badge, children }: ChartCardProps) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div className="min-w-0">
          <p className="chart-card-title">{title}</p>
          <p className="chart-card-sub">{subtitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="chart-card-value">{value}</p>
          {badge ? <span className="chart-card-badge">{badge}</span> : null}
        </div>
      </div>
      {children}
    </div>
  )
}

export function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const latest = data[data.length - 1]?.revenue || 0
  const prev = data[data.length - 2]?.revenue || 0
  const growth = prev ? Math.round(((latest - prev) / prev) * 100) : 0

  return (
    <ChartCard
      title="Monthly revenue"
      subtitle="Landlord subscription income"
      value={formatMoney(latest)}
      badge={`+${growth}%`}
    >
      <BarChart
        data={data.map((d) => ({ label: d.month, value: d.revenue }))}
        barClass="chart-bar-blue"
        formatValue={(v) => formatMoney(v)}
        accentClass="text-brand-700"
      />
    </ChartCard>
  )
}

export function UserGrowthChart({ data }: { data: { month: string; users: number }[] }) {
  const latest = data[data.length - 1]?.users || 0
  const prev = data[data.length - 2]?.users || 0
  const growth = prev ? Math.round(((latest - prev) / prev) * 100) : 0

  return (
    <ChartCard
      title="User growth"
      subtitle="Registered users by month"
      value={String(latest)}
      badge={`+${growth}%`}
    >
      <BarChart
        data={data.map((d) => ({ label: d.month, value: d.users }))}
        barClass="chart-bar-blue-light"
        formatValue={(v) => String(v)}
        accentClass="text-brand-600"
      />
    </ChartCard>
  )
}
