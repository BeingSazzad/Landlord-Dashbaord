import { useDeleteAdminMutation } from '@/services/endpoints/usersApi'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { AdminItem } from '@/types/api.types'

interface DeleteAdminModalProps {
  target: AdminItem | null
  onClose: () => void
  onFlash: (message: string) => void
}

export function DeleteAdminModal({ target, onClose, onFlash }: DeleteAdminModalProps) {
  const [deleteAdmin, { isLoading: isDeletingAdmin }] = useDeleteAdminMutation()

  const handleDelete = async () => {
    if (!target) return
    try {
      await deleteAdmin(target._id).unwrap()
      onFlash(`Admin "${target.name}" deleted successfully.`)
      onClose()
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to delete admin.'
      onFlash(msg)
    }
  }

  return (
    <Modal
      open={Boolean(target)}
      title="Delete Administrator?"
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            className="!bg-red-600 hover:!bg-red-700 font-bold"
            loading={isDeletingAdmin}
            onClick={handleDelete}
          >
            Delete Admin
          </Button>
        </div>
      }
    >
      {target && (
        <p className="text-sm text-slate-600">
          Are you sure you want to delete administrator{' '}
          <strong className="text-slate-900">{target.name}</strong> ({target.email})?
          This will permanently remove their admin account.
        </p>
      )}
    </Modal>
  )
}

