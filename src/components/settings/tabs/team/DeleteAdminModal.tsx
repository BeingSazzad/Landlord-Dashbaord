import { useDeleteAdminMutation } from '@/services/endpoints/usersApi'
import { ConfirmDeleteModal } from '@/components/ui'
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
    <ConfirmDeleteModal
      open={Boolean(target)}
      title="Delete Administrator?"
      confirmText="Delete Admin"
      loading={isDeletingAdmin}
      onConfirm={handleDelete}
      onClose={onClose}
    >
      {target && (
        <p>
          Are you sure you want to delete administrator{' '}
          <strong className="text-slate-900">{target.name}</strong> ({target.email})?
          This will permanently remove their admin account.
        </p>
      )}
    </ConfirmDeleteModal>
  )
}
