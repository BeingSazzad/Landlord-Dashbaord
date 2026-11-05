import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/services/endpoints/usersApi'
import { useAppSelector } from '@/store/hooks'
import { Button } from '@/components/ui/Button'
import { AvatarPicker } from './AvatarPicker'

interface ProfileTabProps {
  onFlash: (message: string) => void
}

export function ProfileTab({ onFlash }: ProfileTabProps) {
  const user = useAppSelector((s) => s.auth.user)

  // ─── RTK Query Hooks ──────────────────────────────────────────────────────
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetUserProfileQuery()
  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation()

  const currentProfile = profileResponse?.data || user

  // Form states
  const [name, setName] = useState(currentProfile?.name || 'Super Admin')
  const [email, setEmail] = useState(currentProfile?.email || 'admin@gmail.com')
  const [phone, setPhone] = useState(currentProfile?.phone || '')
  const [gender, setGender] = useState(currentProfile?.gender || 'male')
  const [timezone, setTimezone] = useState(currentProfile?.timezone || 'Asia/Dhaka')

  // Avatar upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Sync profile data when server responds
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    onFlash('New avatar image selected. Click "Save Profile Changes" to upload.')
  }

  const handleCancelPick = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      onFlash('Full name cannot be empty.')
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
      onFlash('Profile updated successfully!')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update profile. Please check your network connection.'
      onFlash(msg)
    }
  }

  return (
    <div className="admin-card max-w-2xl p-6 sm:p-7">
      {/* Header & Avatar Pick */}
      <div className="flex items-center justify-between border-b border-slate-100/90 pb-6">
        <div className="flex items-center gap-4">
          <AvatarPicker
            name={name}
            imageUrl={currentProfile?.profileImage || currentProfile?.avatarUrl}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onCancelPick={handleCancelPick}
          />

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
  )
}

