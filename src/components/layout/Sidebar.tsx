import { NavLink } from 'react-router-dom'
import {
  Building2,
  ChartColumn,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
  Settings,
  Users,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { env } from '@/config/env'

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: ChartColumn },
  { to: ROUTES.USERS, label: 'Users', icon: Users },
  { to: ROUTES.SUBSCRIPTIONS, label: 'Landlord subs', icon: CreditCard },
  { to: ROUTES.TRANSACTIONS, label: 'Transactions', icon: Receipt },
  { to: ROUTES.CMS, label: 'CMS', icon: FileText },
  { to: ROUTES.SUPPORT, label: 'Support', icon: LifeBuoy },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">Landlord HQ</p>
          <p className="truncate text-[11px] font-medium text-slate-500">{env.VITE_APP_NAME}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu</p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'nav-active'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <p className="text-[11px] text-slate-400">Platform admin · mock data</p>
      </div>
    </aside>
  )
}
