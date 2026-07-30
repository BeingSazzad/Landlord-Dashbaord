import { NavLink } from 'react-router-dom'
import {
  ChartColumn,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: ChartColumn },
  { to: ROUTES.USERS, label: 'Users', icon: Users },
  { to: ROUTES.SUBSCRIPTIONS, label: 'Subscriptions', icon: CreditCard },
  { to: ROUTES.CMS, label: 'CMS', icon: FileText },
  { to: ROUTES.SUPPORT, label: 'Support', icon: LifeBuoy },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-100 px-5 py-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Landlord HQ</p>
        <h1 className="text-base font-bold text-slate-900">{env.VITE_APP_NAME}</h1>
        <p className="mt-1 text-xs text-slate-500">Platform admin</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4 text-[11px] text-slate-400">Frontend prototype · mock data</div>
    </aside>
  )
}
