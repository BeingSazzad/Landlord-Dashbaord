import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, Plus, Shield } from 'lucide-react'
import { MOCK_ADMINS } from '@/lib/mockData'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfile } from '@/components/auth/store/authSlice'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { AdminAccount } from '@/types/api.types'

const TABS = ['profile', 'security', 'team'] as const

export function SettingsPanel() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const fileRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<(typeof TABS)[number]>('profile')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [admins, setAdmins] = useState<AdminAccount[]>(() => [...MOCK_ADMINS])
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3000)
  }

  const saveProfile = () => {
    dispatch(updateProfile({ name: name.trim(), email: email.trim() }))
    flash('Profile updated (demo).')
  }

  const onAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    dispatch(updateProfile({ avatarUrl: URL.createObjectURL(file) }))
    flash('Profile photo updated (demo).')
  }

  const savePassword = () => {
    if (!currentPw || !newPw || newPw !== confirmPw) {
      flash('Check all password fields match.')
      return
    }
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    flash('Password changed (demo).')
  }

  const addAdmin = () => {
    if (!newAdminName.trim() || !newAdminEmail.trim()) return
    setAdmins((prev) => [
      ...prev,
      { id: `admin-${Date.now()}`, name: newAdminName.trim(), email: newAdminEmail.trim(), role: 'admin', addedAt: 'Just now' },
    ])
    setNewAdminName('')
    setNewAdminEmail('')
    setShowAddAdmin(false)
    flash(`Admin invite sent to ${newAdminEmail} (demo).`)
  }

  return (
    <div className="space-y-6">
      {notice ? <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">{notice}</div> : null}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`admin-chip capitalize ${tab === t ? 'admin-chip-active' : 'admin-chip-inactive'}`}
          >
            {t === 'profile' ? 'My profile' : t === 'security' ? 'Password' : 'Admin team'}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="admin-card max-w-xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name={user?.name || 'Admin'} src={user?.avatarUrl} size="lg" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md"
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarPick} />
            </div>
            <div>
              <p className="font-bold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <Badge tone="purple">Platform admin</Badge>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={saveProfile}>Save profile</Button>
          </div>
        </div>
      ) : null}

      {tab === 'security' ? (
        <div className="admin-card max-w-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900">Change password</h3>
          <div className="mt-5 space-y-4">
            <Input label="Current password" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
            <Input label="New password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            <Input label="Confirm new password" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            <Button onClick={savePassword}>Update password</Button>
          </div>
        </div>
      ) : null}

      {tab === 'team' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Platform administrators</p>
            <Button onClick={() => setShowAddAdmin(true)}><Plus className="h-4 w-4" /> Add admin</Button>
          </div>
          <div className="space-y-2">
            {admins.map((admin) => (
              <div key={admin.id} className="admin-card flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={admin.name} src={admin.avatarUrl} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-900">{admin.name}</p>
                    <p className="text-xs text-slate-500">{admin.email}</p>
                  </div>
                </div>
                <Badge tone={admin.role === 'super' ? 'purple' : 'blue'}>{admin.role === 'super' ? 'Super admin' : 'Admin'}</Badge>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            New admins receive an invite email in production.
          </div>
        </div>
      ) : null}

      <Modal
        open={showAddAdmin}
        title="Add platform admin"
        onClose={() => setShowAddAdmin(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowAddAdmin(false)}>Cancel</Button>
            <Button fullWidth onClick={addAdmin} disabled={!newAdminName.trim() || !newAdminEmail.trim()}>Send invite</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input label="Full name" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} />
          <Input label="Email" type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
