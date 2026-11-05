import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

export interface ConfirmDeleteModalProps {
  open: boolean
  title?: string
  description?: ReactNode
  itemName?: string
  itemType?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  showWarningIcon?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
  children?: ReactNode
}

export function ConfirmDeleteModal({
  open,
  title = 'Confirm Deletion',
  description,
  itemName,
  itemType = 'item',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  showWarningIcon = true,
  onConfirm,
  onClose,
  children,
}: ConfirmDeleteModalProps) {
  const content = children || description

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            fullWidth
            className="!bg-red-600 hover:!bg-red-700 font-bold"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5">
        {showWarningIcon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <div className="text-sm text-slate-600 leading-relaxed pt-0.5 min-w-0 flex-1">
          {content ? (
            content
          ) : itemName ? (
            <p>
              Are you sure you want to delete{' '}
              <strong className="font-semibold text-slate-900">{itemName}</strong>? This action
              cannot be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to delete this {itemType}? This action cannot be undone.
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}

