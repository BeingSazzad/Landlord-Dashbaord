import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Check,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'

interface TopbarProps {
  pageTitle: string
}

interface TopNotification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  route: string
  type: 'billing' | 'support' | 'compliance' | 'system'
}

const INITIAL_NOTIFICATIONS: TopNotification[] = [
  {
    id: 'notif-1',
    title: 'New Subscription Upgrade',
    description: 'John Smith (Smith Holdings) upgraded to Portfolio Tier (£49/mo)',
    time: '12m ago',
    read: false,
    route: ROUTES.SUBSCRIPTIONS,
    type: 'billing',
  },
  {
    id: 'notif-2',
    title: 'Urgent Support Ticket',
    description: 'Sarah Johnson requested assistance with portal invite access',
    time: '34m ago',
    read: false,
    route: ROUTES.SUPPORT,
    type: 'support',
  },
  {
    id: 'notif-3',
    title: 'Compliance Certificate Submitted',
    description: 'Apex Heating submitted Gas Safe CP12 for Westminster Court',
    time: '2h ago',
    read: false,
    route: ROUTES.CMS,
    type: 'compliance',
  },
  {
    id: 'notif-4',
    title: 'Stripe Settlement Cleared',
    description: 'Monthly payout batch of £8,450 successfully processed',
    time: '5h ago',
    read: true,
    route: ROUTES.TRANSACTIONS,
    type: 'system',
  },
]

export function Topbar({ pageTitle }: TopbarProps) {
  const user = useAppSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<TopNotification[]>(INITIAL_NOTIFICATIONS)
  const popoverRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (item: TopNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    )
    setIsOpen(false)
    navigate(item.route)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur-md md:px-8">
      <div>
        <h1 className="text-base font-bold text-slate-900 md:hidden">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer',
              isOpen && 'bg-slate-100 text-slate-900'
            )}
            aria-label="Notifications"
            aria-expanded={isOpen}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600 ring-2 ring-white" />
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100/90 px-4 py-3.5 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-blue-200/60">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 transition cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        'flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-slate-50/80',
                        !item.read && 'bg-blue-50/20'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs',
                          item.type === 'billing' && 'bg-blue-50 text-brand-600 border-blue-100',
                          item.type === 'support' && 'bg-amber-50 text-amber-600 border-amber-100',
                          item.type === 'compliance' && 'bg-emerald-50 text-emerald-600 border-emerald-100',
                          item.type === 'system' && 'bg-slate-50 text-slate-600 border-slate-200'
                        )}
                      >
                        {item.type === 'billing' && <CreditCard className="h-3.5 w-3.5" />}
                        {item.type === 'support' && <MessageSquare className="h-3.5 w-3.5" />}
                        {item.type === 'compliance' && <ShieldCheck className="h-3.5 w-3.5" />}
                        {item.type === 'system' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={cn('text-xs font-bold truncate', !item.read ? 'text-slate-900' : 'text-slate-700')}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.time}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-snug line-clamp-2 font-medium">
                          {item.description}
                        </p>
                      </div>

                      {!item.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600 self-center" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 flex items-center justify-between">
                <Link
                  to={ROUTES.SUPPORT}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-slate-600 hover:text-brand-600 transition"
                >
                  View Support Desk →
                </Link>
                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-700 transition"
                >
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link
          to={ROUTES.SETTINGS}
          className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50 cursor-pointer"
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
