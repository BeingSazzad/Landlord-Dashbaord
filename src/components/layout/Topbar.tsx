import { Bell, LogOut, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/components/auth/store/authSlice'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'

export function Topbar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search users, properties, invoices…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" className="!p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-2 rounded-lg border border-slate-100 px-2 py-1 sm:flex">
          <Avatar name={user?.name || 'Admin'} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="!p-2" onClick={() => dispatch(logout())} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
