import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { MOCK_CMS } from '@/lib/mockData'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { CmsPage } from '@/types/api.types'

export function CmsPanel() {
  const [editing, setEditing] = useState<CmsPage | null>(null)
  const [content, setContent] = useState('')

  const openEdit = (page: CmsPage) => {
    setEditing(page)
    setContent(page.preview)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_CMS.map((page) => (
          <div key={page.id} className="admin-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{page.title}</h3>
                <p className="mt-1 text-xs text-slate-500">/{page.slug} · Updated {page.updated}</p>
              </div>
              <Badge tone={page.published ? 'green' : 'amber'}>{page.published ? 'Published' : 'Draft'}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{page.preview}</p>
            <Button variant="secondary" className="mt-4" onClick={() => openEdit(page)}>
              <Pencil className="h-4 w-4" /> Edit content
            </Button>
          </div>
        ))}
      </div>
      <Modal
        open={!!editing}
        title={editing ? `Edit ${editing.title}` : ''}
        onClose={() => setEditing(null)}
        footer={<Button fullWidth onClick={() => setEditing(null)}>Save (demo)</Button>}
      >
        {editing ? (
          <div className="space-y-3">
            <textarea
              className="admin-input min-h-[160px] w-full resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-slate-500">Changes appear in the mobile app once connected to a CMS API.</p>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
