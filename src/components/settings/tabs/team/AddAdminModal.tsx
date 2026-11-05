import { useState } from 'react'
import { useCreateAdminMutation } from '@/services/endpoints/usersApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface AddAdminModalProps {
  open: boolean
  onClose: () => void
  onFlash: (message: string) => void
}

export function AddAdminModal({ open, onClose, onFlash }: AddAdminModalProps) {
  const [createAdmin, { isLoading: isCreatingAdmin }] = useCreateAdminMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    onClose()
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      onFlash('Please fill in name, email, and password.')
      return
    }

    try {
      await createAdmin({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: 'admin',
      }).unwrap()

      handleClose()
      onFlash('Admin account created successfully.')
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to create admin. Please try again.'
      onFlash(msg)
    }
  }

  return (
    <Modal
      open={open}
      title="Add Platform Administrator"
      onClose={handleClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            loading={isCreatingAdmin}
            onClick={handleSubmit}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="emam1@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="admin123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
          <input
            type="text"
            value="Admin"
            readOnly
            className="admin-input w-full text-xs font-semibold bg-slate-50 text-slate-600 cursor-not-allowed"
          />
        </div>
      </div>
    </Modal>
  )
}

