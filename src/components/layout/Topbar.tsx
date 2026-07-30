import { Link } from 'react-router-dom'
import { Bell, LogOut, Search } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/components/auth/store/authSlice'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'

interface TopbarProps {
  pageTitle: string
}

export function Topbar({ pageTitle }: TopbarProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md md:px-8">
      <h1 className="text-base font-bold text-slate-900 md:hidden">{pageTitle}</h1>
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search users, plans, tickets…"
          className="admin-input w-full py-2 pl-10 pr-3"
        />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" className="!rounded-xl !p-2.5" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
        </Button>
        <Link
          to={ROUTES.SETTINGS}
          className="hidden items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 py-1 pl-1 pr-3 transition hover:border-brand-200 sm:flex"
        >
          <Avatar name={user?.name || 'Admin'} src={user?.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
          </div>
        </Link>
        <Button variant="ghost" className="!rounded-xl !p-2.5" onClick={() => dispatch(logout())} aria-label="Logout">
          <LogOut className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </header>
  )
}
