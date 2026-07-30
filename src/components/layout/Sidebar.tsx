import { NavLink } from 'react-router-dom'
import {
  Building2,
  ChartColumn,
  LayoutDashboard,
  PoundSterling,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: ChartColumn },
  { to: ROUTES.USERS, label: 'Users', icon: Users },
  { to: ROUTES.PROPERTIES, label: 'Properties', icon: Building2 },
  { to: ROUTES.FINANCES, label: 'Finances', icon: PoundSterling },
  { to: ROUTES.MAINTENANCE, label: 'Maintenance', icon: Wrench },
  { to: ROUTES.COMPLIANCE, label: 'Compliance', icon: ShieldCheck },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-100 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Landlord HQ</p>
        <h1 className="text-lg font-bold text-slate-900">{env.VITE_APP_NAME}</h1>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4 text-xs text-slate-400">Platform admin · MVP</div>
    </aside>
  )
}
