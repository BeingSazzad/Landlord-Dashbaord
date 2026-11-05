import { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useGetAdminsQuery } from '@/services/endpoints/usersApi'
import { SettingsTabNav } from './components/SettingsTabNav'
import { NotificationsTab } from './tabs/notifications/NotificationsTab'
import { ProfileTab } from './tabs/profile/ProfileTab'
import { SecurityTab } from './tabs/security/SecurityTab'
import { AdminTeamTab } from './tabs/team/AdminTeamTab'
import type { SettingsTab } from './types'

export function SettingsPanel() {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const [notice, setNotice] = useState<string | null>(null)

  // Get admin count for tab badge
  const { data: adminsResponse } = useGetAdminsQuery()
  const rawAdmins = adminsResponse?.data as any
  const adminCount = useMemo(() => {
    if (Array.isArray(rawAdmins)) return rawAdmins.length
    if (Array.isArray(rawAdmins?.data)) return rawAdmins.data.length
    return 0
  }, [rawAdmins])

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Toast / Notice banner */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Tab Navigation */}
      <SettingsTabNav
        activeTab={tab}
        onTabChange={setTab}
        adminCount={adminCount}
      />

      {/* Active Tab Content */}
      {tab === 'profile' && <ProfileTab onFlash={flash} />}
      {tab === 'security' && <SecurityTab onFlash={flash} />}
      {tab === 'notifications' && <NotificationsTab onFlash={flash} />}
      {tab === 'team' && <AdminTeamTab onFlash={flash} />}
    </div>
  )
}
