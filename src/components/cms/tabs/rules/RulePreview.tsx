import { Edit3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RulePreviewProps {
  title: string
  content?: string
  updatedAt?: string
  isFetching: boolean
  onEdit: () => void
}

export function RulePreview({
  title,
  content,
  updatedAt,
  isFetching,
  onEdit,
}: RulePreviewProps) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Not updated yet'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {isFetching && (
              <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                Syncing...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Last updated: {formattedDate}
          </p>
        </div>
        <Button
          onClick={onEdit}
          className="!bg-brand-600 hover:!bg-brand-700 font-bold inline-flex items-center gap-1.5"
        >
          <Edit3 className="h-3.5 w-3.5" /> Edit Document
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-6 text-sm text-slate-700 leading-relaxed font-sans max-h-[500px] overflow-y-auto whitespace-pre-line">
        {content ? (
          content
        ) : (
          <span className="text-slate-400 italic">
            No content published yet. Click &quot;Edit Document&quot; above to add content.
          </span>
        )}
      </div>
    </div>
  )
}

