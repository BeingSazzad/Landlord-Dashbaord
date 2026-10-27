import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/store/hooks'

interface TopbarProps {
  pageTitle: string
}

export function Topbar({ pageTitle }: TopbarProps) {
  const user = useAppSelector((s) => s.auth.user)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur-md md:px-8">
      <div>
        <h1 className="text-base font-bold text-slate-900 md:hidden">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
        </button>

        <Link
          to={ROUTES.SETTINGS}
          className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-blue-500 font-bold text-white shadow-xs text-xs overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>SC</span>
            )}
          </div>
          <div className="hidden min-w-0 text-left sm:block">
            <p className="truncate text-xs font-bold text-slate-900">{user?.name || 'Sazzad Chowdhury'}</p>
            <p className="truncate text-[11px] font-medium text-slate-400">Super Admin</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
