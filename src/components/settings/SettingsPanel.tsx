import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'
import { useChangePasswordMutation } from '@/services/endpoints/authApi'
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useGetUserProfileQuery,
  useUpdateAdminStatusMutation,
  useUpdateUserProfileMutation,
} from '@/services/endpoints/usersApi'
import { useAppSelector } from '@/store/hooks'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import type { AdminItem } from '@/types/api.types'

type SettingsTab = 'profile' | 'security' | 'notifications' | 'team'

export function SettingsPanel() {
  const user = useAppSelector((s) => s.auth.user)
  const fileRef = useRef<HTMLInputElement>(null)

  // ─── RTK Query Profile & Auth Hooks ───────────────────────────────────────
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetUserProfileQuery()
  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

  // ─── RTK Query Admin Team Hooks ───────────────────────────────────────────
  const {
    data: adminsResponse,
    isLoading: isAdminsLoading,
    isFetching: isAdminsFetching,
  } = useGetAdminsQuery()
  const [createAdmin, { isLoading: isCreatingAdmin }] = useCreateAdminMutation()
  const [updateAdminStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminStatusMutation()
  const [deleteAdmin, { isLoading: isDeletingAdmin }] = useDeleteAdminMutation()

  const currentProfile = profileResponse?.data || user

  // Navigation tab
  const [tab, setTab] = useState<SettingsTab>('profile')

  // Profile Form States
  const [name, setName] = useState(currentProfile?.name || 'Super Admin')
  const [email, setEmail] = useState(currentProfile?.email || 'admin@gmail.com')
  const [phone, setPhone] = useState(currentProfile?.phone || '')
  const [gender, setGender] = useState(currentProfile?.gender || 'male')
  const [timezone, setTimezone] = useState(currentProfile?.timezone || 'Asia/Dhaka')

  // Avatar Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Sync profile data when GET /users/profile responds
  useEffect(() => {
    if (profileResponse?.data) {
      const data = profileResponse.data
      if (data.name) setName(data.name)
      if (data.email) setEmail(data.email)
      if (data.phone) setPhone(data.phone)
      if (data.gender) setGender(data.gender)
      if (data.timezone) setTimezone(data.timezone)
    }
  }, [profileResponse?.data])

  // Security Form States
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)

  // Team Admin States
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin')
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminItem | null>(null)
  const [adminSearch, setAdminSearch] = useState('')

  // Notifications State for Landlord HQ
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityAlerts: true,
    weeklyDigest: false,
  })

  // Toast / Flash Notification
  const [notice, setNotice] = useState<string | null>(null)
  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  // ─── Extract Admins List ──────────────────────────────────────────────────
  const rawAdmins = adminsResponse?.data as any
  const adminsList: AdminItem[] = useMemo(() => {
    if (Array.isArray(rawAdmins)) return rawAdmins
    if (Array.isArray(rawAdmins?.data)) return rawAdmins.data
    return []
  }, [rawAdmins])

  const filteredAdmins = useMemo(() => {
    if (!adminSearch.trim()) return adminsList
    const q = adminSearch.toLowerCase()
    return adminsList.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    )
  }, [adminsList, adminSearch])

  // ─── Profile Handlers ─────────────────────────────────────────────────────
  const onAvatarPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    flash('New avatar image selected. Click "Save Profile Changes" to upload.')
  }

  const cancelAvatarPick = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      flash('Full name cannot be empty.')
      return
    }

    try {
      const formData = new FormData()

      const dataPayload: Record<string, any> = {
        name: name.trim(),
      }
      if (phone.trim()) {
        dataPayload.phone = phone.trim()
      }
      if (gender) {
        dataPayload.gender = gender
      }
      if (timezone) {
        dataPayload.timezone = timezone
      }

      formData.append('data', JSON.stringify(dataPayload))

      if (selectedFile) {
        formData.append('profileImage', selectedFile)
      }

      await updateUserProfile(formData).unwrap()

      setSelectedFile(null)
      setPreviewUrl(null)
      flash('Profile updated successfully!')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update profile. Please check your network connection.'
      flash(msg)
    }
  }

  // ─── Security Handlers ────────────────────────────────────────────────────
  const savePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      flash('Please ensure all password fields are filled.')
      return
    }
    if (newPw !== confirmPw) {
      flash('New password and confirm password do not match.')
      return
    }
    if (newPw.length < 6) {
      flash('New password must be at least 6 characters.')
      return
    }

    try {
      await changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
        confirmPassword: confirmPw,
      }).unwrap()

      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      flash('Admin password updated successfully.')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update password. Please check your current password.'
      flash(msg)
    }
  }

  // ─── Team Admin Handlers ──────────────────────────────────────────────────
  const handleAddAdmin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      flash('Please fill in name, email, and password.')
      return
    }

    try {
      await createAdmin({
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        password: newAdminPassword.trim(),
        role: newAdminRole,
      }).unwrap()

      setNewAdminName('')
      setNewAdminEmail('')
      setNewAdminPassword('')
      setNewAdminRole('admin')
      setShowAddAdmin(false)
      flash('Admin account created successfully.')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to create admin. Please try again.'
      flash(msg)
    }
  }

  const handleToggleStatus = async (admin: AdminItem) => {
    const nextStatus = admin.status === 'active' ? 'inactive' : 'active'
    try {
      await updateAdminStatus({ id: admin._id, status: nextStatus }).unwrap()
      flash(`Admin status updated to "${nextStatus}".`)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update admin status.'
      flash(msg)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteAdminTarget) return
    try {
      await deleteAdmin(deleteAdminTarget._id).unwrap()
      flash(`Admin "${deleteAdminTarget.name}" deleted successfully.`)
      setDeleteAdminTarget(null)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to delete admin.'
      flash(msg)
    }
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Standard Tab Navigation Header */}
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
              {adminsList.length}
            </span>
          </button>
        </nav>
      </div>

      {/* TAB 1: PROFILE */}
      {tab === 'profile' && (
        <div className="admin-card max-w-2xl p-6 sm:p-7">
          {/* Header & Avatar Pick */}
          <div className="flex items-center justify-between border-b border-slate-100/90 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  name={name || 'Super Admin'}
                  src={previewUrl || currentProfile?.profileImage || currentProfile?.avatarUrl}
                  size="lg"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition cursor-pointer"
                  aria-label="Change photo"
                  title="Upload profile photo"
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
                <h3 className="text-base font-bold text-slate-900">{name || 'Super Admin'}</h3>
                <p className="text-xs text-slate-400 font-medium">{email || 'admin@gmail.com'}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700 border border-blue-100 capitalize">
                  <ShieldCheck className="h-3 w-3" />
                  {currentProfile?.role ? currentProfile.role.replace('_', ' ') : 'Super Admin'}
                </span>
              </div>
            </div>

            {isProfileFetching && (
              <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                Syncing...
              </span>
            )}
          </div>

          {/* Pending Photo Upload Badge */}
          {selectedFile && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-50 border border-brand-100 px-3.5 py-2 text-xs text-brand-800">
              <span className="truncate">
                Staged photo: <strong>{selectedFile.name}</strong> (click Save to update)
              </span>
              <button
                type="button"
                onClick={cancelAvatarPick}
                className="ml-2 p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                title="Discard photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Profile Form */}
          {isProfileLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              <span className="text-xs">Loading profile data...</span>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  className="admin-input w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Moshfiqur Rahman"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-slate-400 font-normal">(Read-only)</span>
                </label>
                <input
                  type="email"
                  className="admin-input w-full bg-slate-50 text-slate-500 cursor-not-allowed"
                  value={email}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="admin-input w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1234567890"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="admin-input w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Timezone</label>
                <input
                  type="text"
                  className="admin-input w-full"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. Asia/Dhaka"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSaveProfile}
                  loading={isUpdatingProfile}
                  className="!bg-brand-600 hover:!bg-brand-700 font-bold"
                >
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}
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
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  className="admin-input w-full pr-10"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  className="admin-input w-full pr-10"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showNewPw ? 'Hide password' : 'Show password'}
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  className="admin-input w-full pr-10"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={savePassword}
                loading={isChangingPassword}
                className="!bg-brand-600 hover:!bg-brand-700 font-bold"
              >
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
              <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your notification settings</p>
            </div>

            <div className="space-y-5 divide-y divide-slate-100">
              {/* Alert 1: Email Notifications */}
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold text-slate-900">Email Notifications</p>
                  <p className="text-xs text-slate-500">Receive important updates and platform activity alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications((p) => ({ ...p, emailAlerts: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 2: Security & Login Alerts */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold text-slate-900">Security & Login Alerts</p>
                  <p className="text-xs text-slate-500">Get notified of new sign-ins and security-related changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.securityAlerts}
                    onChange={(e) => setNotifications((p) => ({ ...p, securityAlerts: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {/* Alert 3: Weekly Digest */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold text-slate-900">Weekly Activity Digest</p>
                  <p className="text-xs text-slate-500">A weekly summary of key platform metrics and activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) => setNotifications((p) => ({ ...p, weeklyDigest: e.target.checked }))}
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

      {/* TAB 4: ADMIN TEAM */}
      {tab === 'team' && (
        <div className="space-y-5">
          {/* Top Search bar and Add Admin Button */}
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

            <div className="flex items-center gap-3">
              {isAdminsFetching && (
                <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing...
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setNewAdminName('')
                  setNewAdminEmail('')
                  setNewAdminPassword('')
                  setNewAdminRole('admin')
                  setShowAddAdmin(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Admin
              </button>
            </div>
          </div>

          {/* Admins Table */}
          {isAdminsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              <span className="text-xs">Loading administrators...</span>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ADMIN</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">EMAIL</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ROLE</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">STATUS</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">JOINED</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => {
                      const isCurrentUser =
                        admin._id === user?._id ||
                        admin.email.toLowerCase() === user?.email.toLowerCase()

                      const isActive = admin.status === 'active'

                      return (
                        <tr key={admin._id} className="hover:bg-slate-50/60 transition">
                          {/* ADMIN */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={admin.name} src={admin.profileImage} size="sm" />
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
                            {admin.role === 'super_admin' ? (
                              <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white shadow-xs">
                                SUPER ADMIN
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-brand-700">
                                ADMIN
                              </span>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="py-3.5 px-4">
                            {isActive ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                                INACTIVE
                              </span>
                            )}
                          </td>

                          {/* JOINED */}
                          <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                            {admin.createdAt
                              ? new Date(admin.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </td>

                          {/* ACTION */}
                          <td className="py-3.5 px-4 text-right">
                            {!isCurrentUser ? (
                              <div className="inline-flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(admin)}
                                  disabled={isUpdatingStatus}
                                  className={cn(
                                    'text-xs font-bold transition hover:underline cursor-pointer',
                                    isActive
                                      ? 'text-amber-600 hover:text-amber-700'
                                      : 'text-brand-600 hover:text-brand-700'
                                  )}
                                >
                                  {isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteAdminTarget(admin)}
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
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-xs text-slate-400">
                        No administrators found. Click &quot;+ Add Admin&quot; to create an admin account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Admin */}
      <Modal
        open={showAddAdmin}
        title="Add Platform Administrator"
        onClose={() => setShowAddAdmin(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowAddAdmin(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isCreatingAdmin}
              onClick={handleAddAdmin}
              className="!bg-brand-600 hover:!bg-brand-700 font-bold"
            >
              Create Admin
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="Full Name"
            placeholder="e.g. Emam Bokhari"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="emam1@gmail.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="admin123"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            required
          />
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Role Permissions</label>
            <select
              value={newAdminRole}
              onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'super_admin')}
              className="admin-input w-full text-xs font-semibold"
            >
              <option value="admin">Admin (Standard Operations)</option>
              <option value="super_admin">Super Admin (Full Console Access)</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal: Delete Admin Confirmation */}
      <Modal
        open={Boolean(deleteAdminTarget)}
        title="Delete Administrator?"
        onClose={() => setDeleteAdminTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setDeleteAdminTarget(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-red-600 hover:!bg-red-700 font-bold"
              loading={isDeletingAdmin}
              onClick={handleDeleteAdmin}
            >
              Delete Admin
            </Button>
          </div>
        }
      >
        {deleteAdminTarget && (
          <p className="text-sm text-slate-600">
            Are you sure you want to delete administrator{' '}
            <strong className="text-slate-900">{deleteAdminTarget.name}</strong> ({deleteAdminTarget.email})?
            This will permanently remove their admin account.
          </p>
        )}
      </Modal>
    </div>
  )
}
