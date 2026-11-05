import { useEffect, useState } from 'react'
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from '@/services/endpoints/faqsApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { FaqItem, FaqRole } from '@/types/api.types'

interface FaqModalProps {
  open: boolean
  onClose: () => void
  editingFaq: FaqItem | null
  defaultRole: FaqRole
  onFlash: (message: string) => void
}

export function FaqModal({
  open,
  onClose,
  editingFaq,
  defaultRole,
  onFlash,
}: FaqModalProps) {
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation()
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [role, setRole] = useState<FaqRole>(defaultRole)

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question)
      setAnswer(editingFaq.answer)
      setRole(editingFaq.role)
    } else {
      setQuestion('')
      setAnswer('')
      setRole(defaultRole)
    }
  }, [editingFaq, defaultRole, open])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!question.trim() || !answer.trim()) {
      onFlash('Question and Answer cannot be empty.')
      return
    }

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          body: {
            question: question.trim(),
            answer: answer.trim(),
            role,
          },
        }).unwrap()
        onFlash('FAQ updated successfully.')
      } else {
        await createFaq({
          question: question.trim(),
          answer: answer.trim(),
          role,
        }).unwrap()
        onFlash('FAQ added successfully.')
      }
      onClose()
    } catch {
      onFlash('Failed to save FAQ. Please try again.')
    }
  }

  return (
    <Modal
      open={open}
      title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleSave}
            loading={isCreating || isUpdating}
            className="!bg-brand-600 hover:!bg-brand-700 font-bold"
          >
            {editingFaq ? 'Save Changes' : 'Add FAQ'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Audience Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as FaqRole)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="landlord">Landlord (landlord)</option>
            <option value="tenant">Tenant (tenant)</option>
            <option value="contractor">Contractor (contractor)</option>
          </select>
        </div>

        <Input
          label="Question"
          placeholder="e.g. How does Landlord HQ track Gas Safety (CP12)?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full min-h-[120px] p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Provide a clear, detailed answer..."
            required
          />
        </div>
      </div>
    </Modal>
  )
}

