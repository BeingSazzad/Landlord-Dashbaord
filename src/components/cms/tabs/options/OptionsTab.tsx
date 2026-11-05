import { useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useGetAppOptionsQuery } from '@/services/endpoints/appOptionsApi'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { AppOptionItem, AppOptionType } from '@/types/api.types'
import { OPTION_TABS } from '../../types'
import { DeleteOptionModal } from './DeleteOptionModal'
import { OptionModal } from './OptionModal'

interface OptionsTabProps {
  onFlash: (message: string) => void
}

export function OptionsTab({ onFlash }: OptionsTabProps) {
  const {
    data: optionsResponse,
    isLoading: isOptionsLoading,
    isFetching: isOptionsFetching,
  } = useGetAppOptionsQuery()

  const [activeOptionType, setActiveOptionType] = useState<AppOptionType>('trade')
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<AppOptionItem | null>(null)
  const [deleteOptionTarget, setDeleteOptionTarget] = useState<AppOptionItem | null>(null)

  // Filter options by current subtab type
  const apiOptions = optionsResponse?.data || []
  const currentOptions = useMemo(() => {
    return apiOptions.filter((opt) => opt.type === activeOptionType)
  }, [apiOptions, activeOptionType])

  const openAddModal = () => {
    setEditingOption(null)
    setIsOptionModalOpen(true)
  }

  const openEditModal = (option: AppOptionItem) => {
    setEditingOption(option)
    setIsOptionModalOpen(true)
  }

  const handleResetDefaults = () => {
    onFlash('Resetting options (feature ready).')
  }

  return (
    <div className="admin-card p-6">
      {/* Top Sub-Bar: Segmented Options on Left, Reset & Add on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Segmented Pill Navigation */}
        <div className="segmented-track !p-1 bg-slate-100/80">
          {OPTION_TABS.map(({ label, type }) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveOptionType(type)}
              className={cn(
                'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                activeOptionType === type
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right controls: Reset Defaults and Add Option */}
        <div className="flex items-center gap-3">
          {isOptionsFetching && (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </span>
          )}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            Reset Defaults
          </button>

          <Button
            onClick={openAddModal}
            className="!bg-brand-600 hover:!bg-brand-700 !px-4 !py-2 !text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Option
          </Button>
        </div>
      </div>

      {/* Table of Options */}
      {isOptionsLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="text-xs">Loading dropdown options...</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3 px-2">Option Name</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {currentOptions.length > 0 ? (
                currentOptions.map((option) => (
                  <tr
                    key={option._id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {option.name}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(option)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="Edit option"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteOptionTarget(option)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete option"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-10 text-center text-xs text-slate-400">
                    No options found for this category. Click &quot;+ Add Option&quot; above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Option Modal */}
      <OptionModal
        open={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        editingOption={editingOption}
        defaultType={activeOptionType}
        onFlash={onFlash}
      />

      {/* Delete Option Modal */}
      <DeleteOptionModal
        target={deleteOptionTarget}
        onClose={() => setDeleteOptionTarget(null)}
        onFlash={onFlash}
      />
    </div>
  )
}

