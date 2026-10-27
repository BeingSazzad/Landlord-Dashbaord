import { useRef, useState, type ChangeEvent } from 'react'
import {
  Bell,
  Camera,
  CheckCircle2,
  KeyRound,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { MOCK_ADMINS } from '@/lib/mockData'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfile } from '@/components/auth/store/authSlice'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import type { AdminAccount } from '@/types/api.types'

type SettingsTab = 'profile' | 'security' | 'notifications' | 'team'

export function SettingsPanel() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const fileRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<SettingsTab>('profile')
  const [name, setName] = useState(user?.name || 'Sazzad Chowdhury')
  const [email, setEmail] = useState(user?.email || 'admin@landlordhq.co.uk')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [admins, setAdmins] = useState<AdminAccount[]>(() => [...MOCK_ADMINS])
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [adminSearch, setAdminSearch] = useState('')

  // Notifications State for Landlord HQ
  const [notifications, setNotifications] = useState({
    rentAlerts: true,
    complianceExpiries: true,
    supportEscalations: true,
    depositNotices: true,
    monthlyDigest: false,
  })

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3000)
  }

  const saveProfile = () => {
    dispatch(updateProfile({ name: name.trim(), email: email.trim() }))
    flash('Admin profile updated successfully.')
  }

  const onAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    dispatch(updateProfile({ avatarUrl: URL.createObjectURL(file) }))
    flash('Profile avatar updated.')
  }

  const savePassword = () => {
    if (!currentPw || !newPw || newPw !== confirmPw) {
      flash('Please ensure all password fields match and are filled.')
      return
    }
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    flash('Admin password updated successfully.')
  }

  const addAdmin = () => {
    if (!newAdminName.trim() || !newAdminEmail.trim()) return
    setAdmins((prev) => [
      ...prev,
      {
        id: `admin-${Date.now()}`,
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        role: 'admin',
        addedAt: 'Just now',
      },
    ])
    setNewAdminName('')
    setNewAdminEmail('')
    setShowAddAdmin(false)
    flash(`Admin invite dispatched to ${newAdminEmail}.`)
  }

  const revokeAdmin = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, role: a.role === 'admin' ? ('revoked' as any) : 'admin' } : a))
    )
    flash('Admin access revoked.')
  }

  const deleteAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id))
    flash('Admin removed from console.')
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Standard Tab Navigation Header matching CMS */}
      <div className="border-b border-slate-200/80">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
              tab === 'profile'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <User className="h-4 w-4" />
            My Profile
          </button>

          <button
            type="button"
            onClick={() => setTab('security')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
              tab === 'security'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <KeyRound className="h-4 w-4" />
            Password & Security
          </button>

          <button
            type="button"
            onClick={() => setTab('notifications')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
              tab === 'notifications'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>

          <button
            type="button"
            onClick={() => setTab('team')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition cursor-pointer',
              tab === 'team'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <Users className="h-4 w-4" />
            Admin Team
            <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
              {admins.length}
            </span>
          </button>
        </nav>
      </div>

      {/* TAB 1: PROFILE */}
      {tab === 'profile' && (
        <div className="admin-card max-w-2xl p-6 sm:p-7">
          <div className="flex items-center gap-4 border-b border-slate-100/90 pb-6">
            <div className="relative">
              <Avatar name={user?.name || 'Sazzad Chowdhury'} src={user?.avatarUrl} size="lg" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition cursor-pointer"
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarPick}
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.name || 'Sazzad Chowdhury'}</h3>
              <p className="text-xs text-slate-400 font-medium">{user?.email || 'admin@landlordhq.co.uk'}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700 border border-blue-100">
                <ShieldCheck className="h-3 w-3" />
                Super Admin
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                className="admin-input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                className="admin-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button onClick={saveProfile} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
                Save Profile Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY */}
      {tab === 'security' && (
        <div className="admin-card max-w-xl p-6 sm:p-7">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100/90 pb-4">
            Change Master Password
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                className="admin-input w-full"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                className="admin-input w-full"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <input
                type="password"
                className="admin-input w-full"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm password"
              />
            </div>

            <div className="pt-2">
              <Button onClick={savePassword} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS SETTINGS */}
      {tab === 'notifications' && (
        <div className="space-y-6 max-w-2xl">
          <div className="admin-card p-6 sm:p-7 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Notification Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configure automated email and administrative alert dispatches</p>
            </div>

            <div className="space-y-5 divide-y divide-slate-100">
              {/* Alert 1: Rent Collection */}
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900">Rent Collection & Payout Alerts</p>
                  <p className="text-xs text-slate-500">Instant notification when tenant rent clears escrow into landlord account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.rentAlerts}
                    onChange={(e) => setNotifications((p) => ({ ...p, rentAlerts: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 2: Compliance Expiries */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900">Statutory Compliance Expiries (CP12 & EICR)</p>
                  <p className="text-xs text-slate-500">30-day and 7-day advance warnings for landlord property safety certificates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.complianceExpiries}
                    onChange={(e) => setNotifications((p) => ({ ...p, complianceExpiries: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 3: Dispute & Support */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900">Tenant Dispute & Urgent Escalations</p>
                  <p className="text-xs text-slate-500">High-priority push alert when maintenance dispute or urgent inquiry is filed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.supportEscalations}
                    onChange={(e) => setNotifications((p) => ({ ...p, supportEscalations: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 4: Deposit Notices */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900">Custodial Tenancy Deposit Notices</p>
                  <p className="text-xs text-slate-500">API integration status confirmation from DPS and TDS custodial registries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.depositNotices}
                    onChange={(e) => setNotifications((p) => ({ ...p, depositNotices: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 5: Monthly MRR Digest */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-bold text-slate-900">Monthly Executive MRR Digest</p>
                  <p className="text-xs text-slate-500">Automated financial overview and subscriber retention ledger on the 1st of each month</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.monthlyDigest}
                    onChange={(e) => setNotifications((p) => ({ ...p, monthlyDigest: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Button onClick={() => flash('Notification preferences updated successfully.')} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN TEAM (Matching Image media_1793079535673.png) */}
      {tab === 'team' && (
        <div className="space-y-5">
          {/* Top Search bar and Invite Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="admin-input w-full pl-9 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddAdmin(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              Invite Admin
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ADMIN</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">EMAIL</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ROLE</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">JOINED</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins
                  .filter(
                    (a) =>
                      !adminSearch ||
                      a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      a.email.toLowerCase().includes(adminSearch.toLowerCase())
                  )
                  .map((admin) => {
                    const isCurrentUser =
                      admin.name.toLowerCase().includes('sazzad') ||
                      admin.email.toLowerCase().includes('sazzad') ||
                      admin.id === 'admin-0'

                    return (
                      <tr key={admin.id} className="hover:bg-slate-50/60 transition">
                        {/* ADMIN */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={admin.name} size="sm" />
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{admin.name}</span>
                              {isCurrentUser && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200/60">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600 font-mono">
                          {admin.email}
                        </td>

                        {/* ROLE */}
                        <td className="py-3.5 px-4">
                          {admin.role === 'super' ? (
                            <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white shadow-xs">
                              SUPER ADMIN
                            </span>
                          ) : admin.role === ('revoked' as any) ? (
                            <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-slate-500">
                              REVOKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-brand-700">
                              ADMIN
                            </span>
                          )}
                        </td>

                        {/* JOINED */}
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                          {admin.addedAt}
                        </td>

                        {/* ACTION */}
                        <td className="py-3.5 px-4 text-right">
                          {!isCurrentUser ? (
                            <div className="inline-flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => revokeAdmin(admin.id)}
                                className={cn(
                                  'text-xs font-bold transition hover:underline cursor-pointer',
                                  admin.role === ('revoked' as any)
                                    ? 'text-brand-600 hover:text-brand-700'
                                    : 'text-amber-600 hover:text-amber-700'
                                )}
                              >
                                {admin.role === ('revoked' as any) ? 'Restore' : 'Revoke'}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteAdmin(admin.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title="Delete Admin"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-medium">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Admin Modal */}
      <Modal
        open={showAddAdmin}
        title="Invite Platform Administrator"
        onClose={() => setShowAddAdmin(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowAddAdmin(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={addAdmin} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
              Send Invite
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Adams"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
          />
          <Input
            label="Work Email"
            type="email"
            placeholder="name@landlordhq.co.uk"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Role Permissions</label>
            <select className="admin-input w-full text-xs font-semibold">
              <option value="admin">Operations Admin (Support & Billing)</option>
              <option value="super">Super Admin (Full Console Access)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
