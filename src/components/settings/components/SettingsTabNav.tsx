import { Bell, KeyRound, User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SettingsTab } from '../types'

interface SettingsTabNavProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
  adminCount?: number
}

export function SettingsTabNav({
  activeTab,
  onTabChange,
  adminCount = 0,
}: SettingsTabNavProps) {
  return (
    <div className="border-b border-slate-200/80">
      <nav className="flex space-x-8">
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          )}
        >
          <User className="h-4 w-4" />
          My Profile
        </button>

        <button
          type="button"
          onClick={() => onTabChange('security')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
            activeTab === 'security'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          )}
        >
          <KeyRound className="h-4 w-4" />
          Password & Security
        </button>

        <button
          type="button"
          onClick={() => onTabChange('notifications')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
            activeTab === 'notifications'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          )}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </button>

        <button
          type="button"
          onClick={() => onTabChange('team')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
            activeTab === 'team'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
          )}
        >
          <Users className="h-4 w-4" />
          Admin Team
          <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
            {adminCount}
          </span>
        </button>
      </nav>
    </div>
  )
}

