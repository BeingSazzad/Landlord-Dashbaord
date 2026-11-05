import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { FaqItem } from '@/types/api.types'

interface FaqItemAccordionProps {
  faq: FaqItem
  index: number
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export const FaqItemAccordion = memo(function FaqItemAccordion({
  faq,
  index,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: FaqItemAccordionProps) {
  return (
    <div className="rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200">
      <div
        onClick={onToggle}
        className="flex items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 font-mono">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Edit FAQ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
            title="Delete FAQ"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </button>
        </div>
      </div>
      {isExpanded && (
        <p className="mt-3 pl-9 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 whitespace-pre-line">
          {faq.answer}
        </p>
      )}
    </div>
  )
})


