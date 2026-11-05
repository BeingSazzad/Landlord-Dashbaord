import { useEffect, useState } from 'react'
import {
  useCreateAppOptionMutation,
  useUpdateAppOptionMutation,
} from '@/services/endpoints/appOptionsApi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { AppOptionItem, AppOptionType } from '@/types/api.types'

interface OptionModalProps {
  open: boolean
  onClose: () => void
  editingOption: AppOptionItem | null
  defaultType: AppOptionType
  onFlash: (message: string) => void
}

export function OptionModal({
  open,
  onClose,
  editingOption,
  defaultType,
  onFlash,
}: OptionModalProps) {
  const [createAppOption, { isLoading: isCreating }] = useCreateAppOptionMutation()
  const [updateAppOption, { isLoading: isUpdating }] = useUpdateAppOptionMutation()

  const [name, setName] = useState('')
  const [type, setType] = useState<AppOptionType>(defaultType)

  useEffect(() => {
    if (editingOption) {
      setName(editingOption.name)
      setType(editingOption.type)
    } else {
      setName('')
      setType(defaultType)
    }
  }, [editingOption, defaultType, open])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim()) {
      onFlash('Option name cannot be empty.')
      return
    }

    try {
      if (editingOption) {
        await updateAppOption({
          id: editingOption._id,
          body: {
            name: name.trim(),
            type,
          },
        }).unwrap()
        onFlash(`Option "${name.trim()}" updated successfully.`)
      } else {
        await createAppOption({
          name: name.trim(),
          type,
        }).unwrap()
        onFlash(`Option "${name.trim()}" added successfully.`)
      }
      onClose()
    } catch {
      onFlash('Failed to save option. Please check your network connection.')
    }
  }

  return (
    <Modal
      open={open}
      title={editingOption ? 'Edit Dropdown Option' : 'Add Dropdown Option'}
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
            {editingOption ? 'Save Changes' : 'Add Option'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Option Name"
          placeholder="e.g. Semi Detached, Plumbing & Heating"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Option Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AppOptionType)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="trade">Primary Trade (trade)</option>
            <option value="property_type">Property Type (property_type)</option>
            <option value="issue_type">Issue Type (issue_type)</option>
            <option value="communal_area">Communal Area (communal_area)</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}

