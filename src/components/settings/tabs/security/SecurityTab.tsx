import { useState } from 'react'
import { useChangePasswordMutation } from '@/services/endpoints/authApi'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from './PasswordInput'

interface SecurityTabProps {
  onFlash: (message: string) => void
}

export function SecurityTab({ onFlash }: SecurityTabProps) {
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const handleSavePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      onFlash('Please ensure all password fields are filled.')
      return
    }
    if (newPw !== confirmPw) {
      onFlash('New password and confirm password do not match.')
      return
    }
    if (newPw.length < 6) {
      onFlash('New password must be at least 6 characters.')
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
      onFlash('Admin password updated successfully.')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update password. Please check your current password.'
      onFlash(msg)
    }
  }

  return (
    <div className="admin-card max-w-xl p-6 sm:p-7">
      <h3 className="text-base font-bold text-slate-900 border-b border-slate-100/90 pb-4">
        Change Master Password
      </h3>

      <div className="mt-5 space-y-4">
        <PasswordInput
          label="Current Password"
          value={currentPw}
          onChange={setCurrentPw}
          placeholder="••••••••"
        />

        <PasswordInput
          label="New Password"
          value={newPw}
          onChange={setNewPw}
          placeholder="At least 6 characters"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPw}
          onChange={setConfirmPw}
          placeholder="Confirm password"
        />

        <div className="pt-2">
          <Button
            onClick={handleSavePassword}
            loading={isChangingPassword}
            className="!bg-brand-600 hover:!bg-brand-700 font-bold"
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}

