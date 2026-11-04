import { useState, useMemo } from 'react'
import {
  Building2,
  CheckCircle2,
  Edit3,
  FileCheck2,
  FileText,
  HelpCircle,
  Info,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Pencil,
  Plus,
  Quote,
  RotateCcw,
  Save,
  Search,
  Shield,
  SlidersHorizontal,
  Trash2,
  Users2,
} from 'lucide-react'
import {
  useCreateAppOptionMutation,
  useDeleteAppOptionMutation,
  useGetAppOptionsQuery,
  useUpdateAppOptionMutation,
} from '@/services/endpoints/appOptionsApi'
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from '@/services/endpoints/faqsApi'
import {
  useGetRuleByTypeQuery,
  useSaveRuleMutation,
} from '@/services/endpoints/rulesApi'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { AppOptionItem, AppOptionType, FaqItem, FaqRole, RuleType } from '@/types/api.types'

type CmsSection = 'options' | 'faqs' | 'privacy' | 'terms' | 'about'

const OPTION_TABS: { label: string; type: AppOptionType }[] = [
  { label: 'Issue type', type: 'issue_type' },
  { label: 'Primary Trade', type: 'trade' },
  { label: 'Property type', type: 'property_type' },
  { label: 'Communal area', type: 'communal_area' },
]

export function CmsPanel() {
  // Left menu navigation state
  const [activeSection, setActiveSection] = useState<CmsSection>('options')

  // ─── App Options API Hooks ────────────────────────────────────────────────
  const {
    data: optionsResponse,
    isLoading: isOptionsLoading,
    isFetching: isOptionsFetching,
  } = useGetAppOptionsQuery()
  const [createAppOption, { isLoading: isCreatingOption }] = useCreateAppOptionMutation()
  const [updateAppOption, { isLoading: isUpdatingOption }] = useUpdateAppOptionMutation()
  const [deleteAppOption, { isLoading: isDeletingOption }] = useDeleteAppOptionMutation()

  // App Options Sub-tab (Issue type, Primary Trade, Property type, Communal area)
  const [activeOptionType, setActiveOptionType] = useState<AppOptionType>('trade')

  // Modals for App Options
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<AppOptionItem | null>(null)
  const [optionNameInput, setOptionNameInput] = useState('')
  const [optionTypeInput, setOptionTypeInput] = useState<AppOptionType>('trade')
  const [deleteOptionTarget, setDeleteOptionTarget] = useState<AppOptionItem | null>(null)

  // ─── FAQs API Hooks ───────────────────────────────────────────────────────
  const [faqRole, setFaqRole] = useState<FaqRole>('landlord')
  const [faqSearch, setFaqSearch] = useState<string>('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)

  const {
    data: faqsResponse,
    isLoading: isFaqsLoading,
    isFetching: isFaqsFetching,
  } = useGetFaqsQuery({ role: faqRole })

  const [createFaq, { isLoading: isCreatingFaq }] = useCreateFaqMutation()
  const [updateFaq, { isLoading: isUpdatingFaq }] = useUpdateFaqMutation()
  const [deleteFaq, { isLoading: isDeletingFaq }] = useDeleteFaqMutation()

  // Modals for FAQs
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [faqQuestionInput, setFaqQuestionInput] = useState('')
  const [faqAnswerInput, setFaqAnswerInput] = useState('')
  const [faqRoleInput, setFaqRoleInput] = useState<FaqRole>('landlord')
  const [deleteFaqTarget, setDeleteFaqTarget] = useState<FaqItem | null>(null)

  // ─── Rules API Hooks (About Us, Terms & Conditions, Privacy Policy) ───────
  const isRuleSection =
    activeSection === 'privacy' || activeSection === 'terms' || activeSection === 'about'

  const currentRuleType: RuleType | null =
    activeSection === 'privacy'
      ? 'policy'
      : activeSection === 'terms'
        ? 'terms'
        : activeSection === 'about'
          ? 'about'
          : null

  const ruleTitleMap: Record<RuleType, string> = {
    policy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    about: 'About Us',
  }

  const activeRuleTitle = currentRuleType ? ruleTitleMap[currentRuleType] : ''

  const {
    data: ruleResponse,
    isLoading: isRuleLoading,
    isFetching: isRuleFetching,
  } = useGetRuleByTypeQuery(currentRuleType as RuleType, {
    skip: !currentRuleType,
  })

  const [saveRule, { isLoading: isSavingRule }] = useSaveRuleMutation()

  const [isEditingRule, setIsEditingRule] = useState(false)
  const [ruleContentInput, setRuleContentInput] = useState('')

  // ─── Toast Notice ─────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtered App Options for the active sub-tab
  const apiOptions = optionsResponse?.data || []
  const currentOptions = useMemo(() => {
    return apiOptions.filter((opt) => opt.type === activeOptionType)
  }, [apiOptions, activeOptionType])

  // Filtered FAQs for the active role & search
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

  // ─── Handlers for App Options ─────────────────────────────────────────────
  const openAddOptionModal = () => {
    setEditingOption(null)
    setOptionNameInput('')
    setOptionTypeInput(activeOptionType)
    setIsOptionModalOpen(true)
  }

  const openEditOptionModal = (option: AppOptionItem) => {
    setEditingOption(option)
    setOptionNameInput(option.name)
    setOptionTypeInput(option.type)
    setIsOptionModalOpen(true)
  }

  const handleSaveOption = async () => {
    if (!optionNameInput.trim()) {
      showToast('Option name cannot be empty.')
      return
    }

    try {
      if (editingOption) {
        await updateAppOption({
          id: editingOption._id,
          body: {
            name: optionNameInput.trim(),
            type: optionTypeInput,
          },
        }).unwrap()
        showToast(`Option "${optionNameInput}" updated successfully.`)
      } else {
        await createAppOption({
          name: optionNameInput.trim(),
          type: optionTypeInput,
        }).unwrap()
        showToast(`Option "${optionNameInput}" added successfully.`)
      }
      setIsOptionModalOpen(false)
    } catch {
      showToast('Failed to save option. Please check your network connection.')
    }
  }

  const handleDeleteOption = async () => {
    if (!deleteOptionTarget) return
    try {
      await deleteAppOption(deleteOptionTarget._id).unwrap()
      showToast(`Option "${deleteOptionTarget.name}" deleted.`)
      setDeleteOptionTarget(null)
    } catch {
      showToast('Failed to delete option. Please try again.')
    }
  }

  const handleResetDefaults = async () => {
    showToast('Resetting options (feature ready).')
  }

  // ─── Handlers for FAQs ────────────────────────────────────────────────────
  const openAddFaqModal = () => {
    setEditingFaq(null)
    setFaqQuestionInput('')
    setFaqAnswerInput('')
    setFaqRoleInput(faqRole)
    setIsFaqModalOpen(true)
  }

  const openEditFaqModal = (faq: FaqItem) => {
    setEditingFaq(faq)
    setFaqQuestionInput(faq.question)
    setFaqAnswerInput(faq.answer)
    setFaqRoleInput(faq.role)
    setIsFaqModalOpen(true)
  }

  const handleSaveFaq = async () => {
    if (!faqQuestionInput.trim() || !faqAnswerInput.trim()) {
      showToast('Question and Answer cannot be empty.')
      return
    }

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          body: {
            question: faqQuestionInput.trim(),
            answer: faqAnswerInput.trim(),
            role: faqRoleInput,
          },
        }).unwrap()
        showToast('FAQ updated successfully.')
      } else {
        await createFaq({
          question: faqQuestionInput.trim(),
          answer: faqAnswerInput.trim(),
          role: faqRoleInput,
        }).unwrap()
        showToast('FAQ added successfully.')
      }
      setIsFaqModalOpen(false)
      setEditingFaq(null)
    } catch {
      showToast('Failed to save FAQ. Please try again.')
    }
  }

  const handleDeleteFaq = async () => {
    if (!deleteFaqTarget) return
    try {
      await deleteFaq(deleteFaqTarget._id).unwrap()
      showToast('FAQ deleted successfully.')
      setDeleteFaqTarget(null)
    } catch {
      showToast('Failed to delete FAQ. Please try again.')
    }
  }

  // ─── Handlers for Rules (About, Terms, Policy) ────────────────────────────
  const openRuleEditor = () => {
    setRuleContentInput(ruleResponse?.data?.content || '')
    setIsEditingRule(true)
  }

  const handleSaveRule = async () => {
    if (!currentRuleType) return
    try {
      await saveRule({
        type: currentRuleType,
        content: ruleContentInput,
      }).unwrap()
      setIsEditingRule(false)
      showToast(`${activeRuleTitle} updated successfully.`)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to save document. Please try again.'
      showToast(msg)
    }
  }

  const insertMarkdown = (syntax: string) => {
    switch (syntax) {
      case 'bold':
        setRuleContentInput((p) => p + '\n**Statutory Clause**')
        break
      case 'italic':
        setRuleContentInput((p) => p + '\n*Compliance note*')
        break
      case 'h1':
        setRuleContentInput((p) => p + '\n\n# New Section')
        break
      case 'h2':
        setRuleContentInput((p) => p + '\n\n## 1. Regulatory Procedure')
        break
      case 'bullet':
        setRuleContentInput((p) => p + '\n- Mandatory verification clause')
        break
      case 'numbered':
        setRuleContentInput((p) => p + '\n1. First procedural step')
        break
      case 'quote':
        setRuleContentInput((p) => p + '\n> Statutory notice pursuant to Housing Act 2004.')
        break
      case 'link':
        setRuleContentInput((p) => p + ' [Landlord HQ Portal](https://landlordhq.co.uk)')
        break
      default:
        break
    }
  }

  // ─── Navigation Items matching the screenshot ─────────────────────────────
  const navItems: { id: CmsSection; label: string; icon: any }[] = [
    { id: 'options', label: 'App Dropdown Options', icon: SlidersHorizontal },
    { id: 'faqs', label: 'Help & FAQ', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'about', label: 'About Us', icon: Info },
  ]

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Split Grid: Left Sidebar Tabs vs Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Menu */}
        <div className="lg:col-span-3 space-y-2.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveSection(id)
                  setIsEditingRule(false)
                }}
                className={cn(
                  'w-full text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between',
                  isActive
                    ? 'bg-white border-2 border-brand-500 shadow-sm text-brand-700 font-bold'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-medium'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-brand-600' : 'text-slate-400')}
                  />
                  <span className="text-sm truncate">{label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          {/* TAB 1: APP DROPDOWN OPTIONS (Matching Screenshot) */}
          {activeSection === 'options' && (
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
                    onClick={openAddOptionModal}
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
                                  onClick={() => openEditOptionModal(option)}
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
            </div>
          )}

          {/* TAB 2: HELP & FAQ */}
          {activeSection === 'faqs' && (
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
                    onClick={openAddFaqModal}
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
                  {filteredFaqs.map((faq, index) => {
                    const isExpanded = expandedFaqId === faq._id
                    return (
                      <div
                        key={faq._id}
                        className="rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200"
                      >
                        <div
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq._id)}
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
                                openEditFaqModal(faq)
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
                                setDeleteFaqTarget(faq)
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
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No FAQs found for this role. Click &quot;+ Add FAQ&quot; above to create one.
                </div>
              )}
            </div>
          )}

          {/* TAB 3, 4, 5: STATUTORY RULES (Privacy Policy, Terms & Conditions, About Us) */}
          {isRuleSection && currentRuleType && (
            <div className="admin-card p-6">
              {isRuleLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                  <span className="text-xs">Loading {activeRuleTitle}...</span>
                </div>
              ) : isEditingRule ? (
                /* IN-PLACE LIVE MARKDOWN EDITOR */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{activeRuleTitle}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Editing statutory document in markdown
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditingRule(false)}
                        disabled={isSavingRule}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveRule}
                        loading={isSavingRule}
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
                    value={ruleContentInput}
                    onChange={(e) => setRuleContentInput(e.target.value)}
                    className="w-full min-h-[420px] p-4 font-mono text-xs leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="Enter statutory text in markdown format..."
                  />
                </div>
              ) : (
                /* READ-ONLY DOCUMENT PREVIEW */
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{activeRuleTitle}</h3>
                        {isRuleFetching && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Syncing...
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Last updated:{' '}
                        {ruleResponse?.data?.updatedAt
                          ? new Date(ruleResponse.data.updatedAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Not updated yet'}
                      </p>
                    </div>
                    <Button
                      onClick={openRuleEditor}
                      className="!bg-brand-600 hover:!bg-brand-700 font-bold inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit Document
                    </Button>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-6 text-sm text-slate-700 leading-relaxed font-sans max-h-[500px] overflow-y-auto whitespace-pre-line">
                    {ruleResponse?.data?.content ? (
                      ruleResponse.data.content
                    ) : (
                      <span className="text-slate-400 italic">
                        No content published yet. Click &quot;Edit Document&quot; above to add content.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add / Edit App Option */}
      <Modal
        open={isOptionModalOpen}
        title={editingOption ? 'Edit Dropdown Option' : 'Add Dropdown Option'}
        onClose={() => setIsOptionModalOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setIsOptionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSaveOption}
              loading={isCreatingOption || isUpdatingOption}
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
            value={optionNameInput}
            onChange={(e) => setOptionNameInput(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Option Type
            </label>
            <select
              value={optionTypeInput}
              onChange={(e) => setOptionTypeInput(e.target.value as AppOptionType)}
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

      {/* Modal: Delete Option Confirmation */}
      <Modal
        open={Boolean(deleteOptionTarget)}
        title="Delete Dropdown Option?"
        onClose={() => setDeleteOptionTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setDeleteOptionTarget(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-red-600 hover:!bg-red-700 font-bold"
              loading={isDeletingOption}
              onClick={handleDeleteOption}
            >
              Delete
            </Button>
          </div>
        }
      >
        {deleteOptionTarget && (
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteOptionTarget.name}</span>? Mobile app dropdowns will no longer include this option.
          </p>
        )}
      </Modal>

      {/* Modal: Add / Edit FAQ */}
      <Modal
        open={isFaqModalOpen}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        onClose={() => {
          setIsFaqModalOpen(false)
          setEditingFaq(null)
        }}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsFaqModalOpen(false)
                setEditingFaq(null)
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSaveFaq}
              loading={isCreatingFaq || isUpdatingFaq}
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
              value={faqRoleInput}
              onChange={(e) => setFaqRoleInput(e.target.value as FaqRole)}
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
            value={faqQuestionInput}
            onChange={(e) => setFaqQuestionInput(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Answer</label>
            <textarea
              value={faqAnswerInput}
              onChange={(e) => setFaqAnswerInput(e.target.value)}
              className="w-full min-h-[120px] p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Provide a clear, detailed answer..."
              required
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Delete FAQ Confirmation */}
      <Modal
        open={Boolean(deleteFaqTarget)}
        title="Delete FAQ?"
        onClose={() => setDeleteFaqTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setDeleteFaqTarget(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-red-600 hover:!bg-red-700 font-bold"
              loading={isDeletingFaq}
              onClick={handleDeleteFaq}
            >
              Delete
            </Button>
          </div>
        }
      >
        {deleteFaqTarget && (
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this FAQ: <br />
            <span className="font-semibold text-slate-900 mt-1 block">
              &ldquo;{deleteFaqTarget.question}&rdquo;
            </span>
          </p>
        )}
      </Modal>
    </div>
  )
}
