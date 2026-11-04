import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  useGetRuleByTypeQuery,
  useSaveRuleMutation,
} from '@/services/endpoints/rulesApi'
import type { RuleType } from '@/types/api.types'
import { RuleEditor } from './RuleEditor'
import { RulePreview } from './RulePreview'

interface RuleDocumentTabProps {
  type: RuleType
  title: string
  onFlash: (message: string) => void
}

export function RuleDocumentTab({ type, title, onFlash }: RuleDocumentTabProps) {
  const {
    data: ruleResponse,
    isLoading: isRuleLoading,
    isFetching: isRuleFetching,
  } = useGetRuleByTypeQuery(type)
  const [saveRule, { isLoading: isSavingRule }] = useSaveRuleMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [editorContent, setEditorContent] = useState('')

  const handleOpenEditor = () => {
    setEditorContent(ruleResponse?.data?.content || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await saveRule({
        type,
        content: editorContent,
      }).unwrap()
      setIsEditing(false)
      onFlash(`${title} updated successfully.`)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to save document. Please try again.'
      onFlash(msg)
    }
  }

  return (
    <div className="admin-card p-6">
      {isRuleLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="text-xs">Loading {title}...</span>
        </div>
      ) : isEditing ? (
        <RuleEditor
          title={title}
          content={editorContent}
          onChange={setEditorContent}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSaving={isSavingRule}
        />
      ) : (
        <RulePreview
          title={title}
          content={ruleResponse?.data?.content}
          updatedAt={ruleResponse?.data?.updatedAt}
          isFetching={isRuleFetching}
          onEdit={handleOpenEditor}
        />
      )}
    </div>
  )
}

