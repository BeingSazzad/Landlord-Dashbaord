import {
  Link2,
  List,
  ListOrdered,
  Quote,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RuleEditorProps {
  title: string
  content: string
  onChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}

export function RuleEditor({
  title,
  content,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: RuleEditorProps) {
  const insertMarkdown = (syntax: string) => {
    switch (syntax) {
      case 'bold':
        onChange(content + '\n**Statutory Clause**')
        break
      case 'italic':
        onChange(content + '\n*Compliance note*')
        break
      case 'h1':
        onChange(content + '\n\n# New Section')
        break
      case 'h2':
        onChange(content + '\n\n## 1. Regulatory Procedure')
        break
      case 'bullet':
        onChange(content + '\n- Mandatory verification clause')
        break
      case 'numbered':
        onChange(content + '\n1. First procedural step')
        break
      case 'quote':
        onChange(content + '\n> Statutory notice pursuant to Housing Act 2004.')
        break
      case 'link':
        onChange(content + ' [Landlord HQ Portal](https://landlordhq.co.uk)')
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-400 font-medium">
            Editing statutory document in markdown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            loading={isSaving}
            className="!bg-brand-600 hover:!bg-brand-700 font-bold inline-flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200/70 p-1.5 rounded-lg text-xs">
        <button
          type="button"
          onClick={() => insertMarkdown('bold')}
          className="px-2 py-1 font-bold hover:bg-slate-200 rounded cursor-pointer"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('italic')}
          className="px-2 py-1 italic hover:bg-slate-200 rounded cursor-pointer"
        >
          I
        </button>
        <span className="h-3.5 w-[1px] bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('h1')}
          className="px-2 py-1 font-bold hover:bg-slate-200 rounded cursor-pointer"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('h2')}
          className="px-2 py-1 font-bold hover:bg-slate-200 rounded cursor-pointer"
        >
          H2
        </button>
        <span className="h-3.5 w-[1px] bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('bullet')}
          className="p-1 hover:bg-slate-200 rounded cursor-pointer"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('numbered')}
          className="p-1 hover:bg-slate-200 rounded cursor-pointer"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('quote')}
          className="p-1 hover:bg-slate-200 rounded cursor-pointer"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('link')}
          className="p-1 hover:bg-slate-200 rounded cursor-pointer"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[420px] p-4 font-mono text-xs leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100"
        placeholder="Enter statutory text in markdown format..."
      />
    </div>
  )
}

