import { useDeleteAppOptionMutation } from '@/services/endpoints/appOptionsApi'
import { ConfirmDeleteModal } from '@/components/ui'
import type { AppOptionItem } from '@/types/api.types'

interface DeleteOptionModalProps {
  target: AppOptionItem | null
  onClose: () => void
  onFlash: (message: string) => void
}

export function DeleteOptionModal({
  target,
  onClose,
  onFlash,
}: DeleteOptionModalProps) {
  const [deleteAppOption, { isLoading: isDeleting }] = useDeleteAppOptionMutation()

  const handleDelete = async () => {
    if (!target) return
    try {
      await deleteAppOption(target._id).unwrap()
      onFlash(`Option "${target.name}" deleted.`)
      onClose()
    } catch {
      onFlash('Failed to delete option. Please try again.')
    }
  }

  return (
    <ConfirmDeleteModal
      open={Boolean(target)}
      title="Delete Dropdown Option?"
      itemName={target?.name}
      loading={isDeleting}
      onConfirm={handleDelete}
      onClose={onClose}
    >
      {target && (
        <p>
          Are you sure you want to delete{' '}
          <strong className="font-semibold text-slate-900">{target.name}</strong>? Mobile
          app dropdowns will no longer include this option.
        </p>
      )}
    </ConfirmDeleteModal>
  )
}
