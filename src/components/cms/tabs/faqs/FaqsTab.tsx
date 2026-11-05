import { useMemo, useState } from 'react'
import {
  Building2,
  FileCheck2,
  Loader2,
  Plus,
  Search,
  Users2,
} from 'lucide-react'
import { useGetFaqsQuery } from '@/services/endpoints/faqsApi'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { FaqItem, FaqRole } from '@/types/api.types'
import { DeleteFaqModal } from './DeleteFaqModal'
import { FaqItemAccordion } from './FaqItemAccordion'
import { FaqModal } from './FaqModal'

interface FaqsTabProps {
  onFlash: (message: string) => void
}

export function FaqsTab({ onFlash }: FaqsTabProps) {
  const [faqRole, setFaqRole] = useState<FaqRole>('landlord')
  const [faqSearch, setFaqSearch] = useState('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)

  const {
    data: faqsResponse,
    isLoading: isFaqsLoading,
    isFetching: isFaqsFetching,
  } = useGetFaqsQuery({ role: faqRole })

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [deleteFaqTarget, setDeleteFaqTarget] = useState<FaqItem | null>(null)

  // Filter FAQs by search query
  const apiFaqs = faqsResponse?.data || []
  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return apiFaqs
    const q = faqSearch.toLowerCase()
    return apiFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    )
  }, [apiFaqs, faqSearch])

  const openAddModal = () => {
    setEditingFaq(null)
    setIsFaqModalOpen(true)
  }

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq)
    setIsFaqModalOpen(true)
  }

  return (
    <div className="admin-card p-6 space-y-6">
      {/* Sub-tabs & Search & Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="segmented-track !p-1 bg-slate-100/80">
          <button
            type="button"
            onClick={() => setFaqRole('landlord')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              faqRole === 'landlord'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            For Landlords
          </button>
          <button
            type="button"
            onClick={() => setFaqRole('tenant')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              faqRole === 'tenant'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Users2 className="h-3.5 w-3.5" />
            For Tenants
          </button>
          <button
            type="button"
            onClick={() => setFaqRole('contractor')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
              faqRole === 'contractor'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            For Contractors
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isFaqsFetching && (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </span>
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQs…"
              className="admin-input !pl-9 pr-3 py-1.5 text-xs w-48 sm:w-56"
            />
          </div>

          <Button
            onClick={openAddModal}
            className="!bg-brand-600 hover:!bg-brand-700 !px-4 !py-2 !text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      {isFaqsLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="text-xs">Loading FAQs...</span>
        </div>
      ) : filteredFaqs.length > 0 ? (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <FaqItemAccordion
              key={faq._id}
              faq={faq}
              index={index}
              isExpanded={expandedFaqId === faq._id}
              onToggle={() =>
                setExpandedFaqId(expandedFaqId === faq._id ? null : faq._id)
              }
              onEdit={() => openEditModal(faq)}
              onDelete={() => setDeleteFaqTarget(faq)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
          No FAQs found for this role. Click &quot;+ Add FAQ&quot; above to create one.
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      <FaqModal
        open={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        editingFaq={editingFaq}
        defaultRole={faqRole}
        onFlash={onFlash}
      />

      {/* Delete FAQ Modal */}
      <DeleteFaqModal
        target={deleteFaqTarget}
        onClose={() => setDeleteFaqTarget(null)}
        onFlash={onFlash}
      />
    </div>
  )
}

