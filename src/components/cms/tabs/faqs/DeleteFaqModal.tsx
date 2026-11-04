import { useDeleteFaqMutation } from '@/services/endpoints/faqsApi'
import { ConfirmDeleteModal } from '@/components/ui'
import type { FaqItem } from '@/types/api.types'

interface DeleteFaqModalProps {
  target: FaqItem | null
  onClose: () => void
  onFlash: (message: string) => void
}

export function DeleteFaqModal({
  target,
  onClose,
  onFlash,
}: DeleteFaqModalProps) {
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation()

  const handleDelete = async () => {
    if (!target) return
    try {
      await deleteFaq(target._id).unwrap()
      onFlash('FAQ deleted successfully.')
      onClose()
    } catch {
      onFlash('Failed to delete FAQ. Please try again.')
    }
  }

  return (
    <ConfirmDeleteModal
      open={Boolean(target)}
      title="Delete FAQ?"
      loading={isDeleting}
      onConfirm={handleDelete}
      onClose={onClose}
    >
      {target && (
        <p>
          Are you sure you want to delete this FAQ: <br />
          <strong className="font-semibold text-slate-900 mt-1 block">
            &ldquo;{target.question}&rdquo;
          </strong>
        </p>
      )}
    </ConfirmDeleteModal>
  )
}
