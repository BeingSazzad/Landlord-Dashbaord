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
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { AppOptionItem, AppOptionType } from '@/types/api.types'

type CmsSection = 'options' | 'faqs' | 'privacy' | 'terms' | 'about'
type FaqAudience = 'landlords' | 'tenants' | 'contractors'

interface PolicyDocument {
  id: string
  title: string
  updated: string
  readTime: string
  content: string
}

interface FaqItem {
  id: string
  audience: FaqAudience
  question: string
  answer: string
}

const INITIAL_POLICIES: Record<string, PolicyDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms & Conditions',
    updated: 'September 2026',
    readTime: '~2 min read',
    content: `# Terms & Conditions — Landlord HQ UK Platform

## 1. Introduction and Platform Scope
By registering as a Landlord, Tenant, or Certified Contractor on Landlord HQ, you accept full adherence to these terms, statutory UK tenancy guidelines, and automated platform escrow rules.

## 2. Tenancy Deposit Protection & Escrow Compliance
All tenant security deposits collected through Landlord HQ must be protected within 30 days under an approved UK government tenancy deposit scheme (DPS, MyDeposits, or TDS) in compliance with the Housing Act 2004. Platform escrow holds release automatically upon joint sign-off.

## 3. Landlord Statutory Obligations & Safety Certifications
Landlords warrant that every managed property maintains current statutory compliance records:
- Annual Gas Safety Records (CP12)
- Electrical Installation Condition Reports (EICR, 5-year cycle)
- Minimum Energy Performance Certificate (EPC) Rating E or higher
- Statutory HMO Licensing for applicable multi-occupancy properties

## 4. Tenant Verification & Fair Referencing Standards
Tenant onboarding and identity referencing strictly adhere to UK Right to Rent statutory checks and UK GDPR data regulations. Reference checks include credit risk profiling, employment confirmation, and previous landlord references.

## 5. Maintenance Dispatch & Dispute Resolution
Landlord HQ operates a digital mediation ledger for repair obligations under Section 11 of the Landlord and Tenant Act 1985. In case of contested repairs, independent inspection reports are archived on the ledger.`,
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'September 2026',
    readTime: '~3 min read',
    content: `# Privacy Policy — Landlord HQ

## 1. Information We Collect
We process personal data necessary to provide property management services, including full name, address, verified ID documents, bank account details for rental disbursement, and tenancy agreement metadata.

## 2. Statutory Basis for Processing
Data processing is conducted strictly pursuant to UK GDPR Article 6:
- Performance of contractual tenancy agreements
- Compliance with statutory legal obligations (Right to Rent, Anti-Money Laundering)
- Legitimate interests in securing tenancy transactions

## 3. Data Storage & Encryption
All user records and identity documents are stored in UK-sovereign data centers encrypted at rest with AES-256 and transmitted using TLS 1.3 encryption.`,
  },
  about: {
    id: 'about',
    title: 'About Landlord HQ',
    updated: 'September 2026',
    readTime: '~1 min read',
    content: `# About Landlord HQ

Landlord HQ is the dedicated property management platform for modern UK landlords, tenants, and verified tradespeople. We combine automated rent collection, compliance expiration tracking, digital tenancy contracts, and contractor dispatch into one unified system.`,
  },
}

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'f-1',
    audience: 'landlords',
    question: 'How does Landlord HQ automate Gas Safety (CP12) and EICR compliance tracking?',
    answer:
      'Landlord HQ tracks statutory certification dates across your entire property portfolio. You receive automated alerts 60, 30, and 7 days prior to expiry, with one-click dispatch to certified Gas Safe and NICEIC contractors.',
  },
  {
    id: 'f-2',
    audience: 'landlords',
    question: 'How are tenant security deposits registered with the DPS or TDS?',
    answer:
      'When a tenant completes their deposit transfer through Landlord HQ, the funds are registered automatically with your linked Tenancy Deposit Scheme (TDP) within 30 days, generating statutory Prescribed Information documentation.',
  },
  {
    id: 'f-3',
    audience: 'landlords',
    question: 'Can I assign granular permissions to property managers or letting agents?',
    answer:
      'Yes. Landlords on the Portfolio Plan can invite team members with specific permission roles: Viewing Coordinator, Maintenance Manager, or Financial Accountant.',
  },
  {
    id: 'f-4',
    audience: 'tenants',
    question: 'How do I submit an urgent repair or maintenance request?',
    answer:
      'Log into the Tenant Portal, navigate to Maintenance, tap "Report Issue", upload photos/video, and select the urgency. Your landlord and assigned contractor will receive immediate notification.',
  },
  {
    id: 'f-5',
    audience: 'contractors',
    question: 'How do tradespeople verify their Gas Safe or NICEIC certifications on the platform?',
    answer:
      'Contractors upload their registration license numbers and public liability insurance documents during onboarding. Our compliance team verifies credentials with statutory bodies within 24 hours.',
  },
]

const OPTION_TABS: { label: string; type: AppOptionType }[] = [
  { label: 'Issue type', type: 'issue_type' },
  { label: 'Primary Trade', type: 'trade' },
  { label: 'Property type', type: 'property_type' },
  { label: 'Communal area', type: 'communal_area' },
]

export function CmsPanel() {
  // Left menu navigation state
  const [activeSection, setActiveSection] = useState<CmsSection>('options')

  // App Options API Hooks
  const { data: optionsResponse, isLoading: isOptionsLoading, isFetching: isOptionsFetching } =
    useGetAppOptionsQuery()
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

  // Policy Documents State
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [editingPolicyKey, setEditingPolicyKey] = useState<string | null>(null)
  const [policyContent, setPolicyContent] = useState<string>('')

  // FAQs state
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS)
  const [faqAudience, setFaqAudience] = useState<FaqAudience>('landlords')
  const [faqSearch, setFaqSearch] = useState<string>('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('f-1')
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [isAddingFaq, setIsAddingFaq] = useState<boolean>(false)
  const [faqQuestion, setFaqQuestion] = useState<string>('')
  const [faqAnswer, setFaqAnswer] = useState<string>('')

  // Toast Notice
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

  // Handlers for App Options
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

  // Navigation Items matching the screenshot
  const navItems: { id: CmsSection; label: string; icon: any }[] = [
    { id: 'options', label: 'App Dropdown Options', icon: SlidersHorizontal },
    { id: 'faqs', label: 'Help & FAQ', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'about', label: 'About Us', icon: Info },
  ]

  // Policy Markdown Editor helpers
  const activePolicy = policies[activeSection === 'privacy' ? 'privacy' : activeSection === 'about' ? 'about' : 'terms']

  const openPolicyEditor = (key: string) => {
    setEditingPolicyKey(key)
    setPolicyContent(policies[key].content)
  }

  const savePolicy = () => {
    if (!editingPolicyKey) return
    setPolicies((prev) => ({
      ...prev,
      [editingPolicyKey]: {
        ...prev[editingPolicyKey],
        content: policyContent,
        updated: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      },
    }))
    setEditingPolicyKey(null)
    showToast('Policy updated successfully.')
  }

  const insertMarkdown = (syntax: string) => {
    switch (syntax) {
      case 'bold':
        setPolicyContent((p) => p + '\n**Statutory Clause**')
        break
      case 'italic':
        setPolicyContent((p) => p + '\n*Compliance note*')
        break
      case 'h1':
        setPolicyContent((p) => p + '\n\n# New Section')
        break
      case 'h2':
        setPolicyContent((p) => p + '\n\n## 1. Regulatory Procedure')
        break
      case 'bullet':
        setPolicyContent((p) => p + '\n- Mandatory verification clause')
        break
      case 'numbered':
        setPolicyContent((p) => p + '\n1. First procedural step')
        break
      case 'quote':
        setPolicyContent((p) => p + '\n> Statutory notice pursuant to Housing Act 2004.')
        break
      case 'link':
        setPolicyContent((p) => p + ' [Landlord HQ Portal](https://landlordhq.co.uk)')
        break
      default:
        break
    }
  }

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchAudience = faq.audience === faqAudience
      const matchQuery =
        !faqSearch ||
        faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
      return matchAudience && matchQuery
    })
  }, [faqs, faqAudience, faqSearch])

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
                  setEditingPolicyKey(null)
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

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                  {isOptionsFetching && !isOptionsLoading && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin text-brand-600" /> Syncing
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
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

              {/* Table / List */}
              {isOptionsLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
                  <p className="text-sm font-medium">Loading dropdown options...</p>
                </div>
              ) : (
                <div className="mt-5 border border-slate-100/90 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                          OPTION NAME
                        </th>
                        <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentOptions.length > 0 ? (
                        currentOptions.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-5 text-sm font-semibold text-slate-800">
                              {item.name}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditOptionModal(item)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                  title="Edit Option"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteOptionTarget(item)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                  title="Delete Option"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
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
                    onClick={() => setFaqAudience('landlords')}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                      faqAudience === 'landlords'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    For Landlords
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaqAudience('tenants')}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                      faqAudience === 'tenants'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <Users2 className="h-3.5 w-3.5" />
                    For Tenants
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaqAudience('contractors')}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5',
                      faqAudience === 'contractors'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    For Contractors
                  </button>
                </div>

                <div className="flex items-center gap-3">
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
                    onClick={() => {
                      setFaqQuestion('')
                      setFaqAnswer('')
                      setIsAddingFaq(true)
                    }}
                    className="!bg-brand-600 hover:!bg-brand-700 !px-4 !py-2 !text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add FAQ
                  </Button>
                </div>
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqId === faq.id
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200"
                    >
                      <div
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
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
                              setEditingFaq(faq)
                              setFaqQuestion(faq.question)
                              setFaqAnswer(faq.answer)
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFaqs((p) => p.filter((f) => f.id !== faq.id))
                              showToast('FAQ deleted.')
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <p className="mt-3 pl-9 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3, 4, 5: POLICY EDITORS (Privacy Policy, Terms & Conditions, About Us) */}
          {(activeSection === 'privacy' || activeSection === 'terms' || activeSection === 'about') && (
            <div className="admin-card p-6">
              {editingPolicyKey ? (
                /* IN-PLACE LIVE MARKDOWN EDITOR */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{activePolicy.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">Editing statutory document in markdown</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" onClick={() => setEditingPolicyKey(null)}>
                        Cancel
                      </Button>
                      <Button onClick={savePolicy} className="!bg-brand-600 hover:!bg-brand-700 font-bold inline-flex items-center gap-1.5">
                        <Save className="h-3.5 w-3.5" /> Save Changes
                      </Button>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200/70 p-1.5 rounded-lg text-xs">
                    <button type="button" onClick={() => insertMarkdown('bold')} className="px-2 py-1 font-bold hover:bg-slate-200 rounded">
                      B
                    </button>
                    <button type="button" onClick={() => insertMarkdown('italic')} className="px-2 py-1 italic hover:bg-slate-200 rounded">
                      I
                    </button>
                    <span className="h-3.5 w-[1px] bg-slate-300 mx-1" />
                    <button type="button" onClick={() => insertMarkdown('h1')} className="px-2 py-1 font-bold hover:bg-slate-200 rounded">
                      H1
                    </button>
                    <button type="button" onClick={() => insertMarkdown('h2')} className="px-2 py-1 font-bold hover:bg-slate-200 rounded">
                      H2
                    </button>
                    <span className="h-3.5 w-[1px] bg-slate-300 mx-1" />
                    <button type="button" onClick={() => insertMarkdown('bullet')} className="p-1 hover:bg-slate-200 rounded">
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => insertMarkdown('numbered')} className="p-1 hover:bg-slate-200 rounded">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => insertMarkdown('quote')} className="p-1 hover:bg-slate-200 rounded">
                      <Quote className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => insertMarkdown('link')} className="p-1 hover:bg-slate-200 rounded">
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <textarea
                    value={policyContent}
                    onChange={(e) => setPolicyContent(e.target.value)}
                    className="w-full min-h-[420px] p-4 font-mono text-xs leading-relaxed text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              ) : (
                /* READ-ONLY DOCUMENT PREVIEW */
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{activePolicy.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">Last updated: {activePolicy.updated}</p>
                    </div>
                    <Button
                      onClick={() => openPolicyEditor(activeSection === 'privacy' ? 'privacy' : activeSection === 'about' ? 'about' : 'terms')}
                      className="!bg-brand-600 hover:!bg-brand-700 font-bold inline-flex items-center gap-1.5"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit Document
                    </Button>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-6 text-sm text-slate-700 leading-relaxed font-sans max-h-[500px] overflow-y-auto whitespace-pre-line">
                    {activePolicy.content}
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
        open={isAddingFaq || Boolean(editingFaq)}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        onClose={() => {
          setIsAddingFaq(false)
          setEditingFaq(null)
        }}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddingFaq(false)
                setEditingFaq(null)
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={() => {
                if (!faqQuestion.trim() || !faqAnswer.trim()) return
                if (editingFaq) {
                  setFaqs((p) =>
                    p.map((f) =>
                      f.id === editingFaq.id
                        ? { ...f, question: faqQuestion.trim(), answer: faqAnswer.trim() }
                        : f
                    )
                  )
                  showToast('FAQ updated.')
                } else {
                  const newFaq: FaqItem = {
                    id: `f-${Date.now()}`,
                    audience: faqAudience,
                    question: faqQuestion.trim(),
                    answer: faqAnswer.trim(),
                  }
                  setFaqs((p) => [newFaq, ...p])
                  showToast('FAQ added.')
                }
                setIsAddingFaq(false)
                setEditingFaq(null)
              }}
              className="!bg-brand-600 hover:!bg-brand-700 font-bold"
            >
              Save FAQ
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Question"
            placeholder="e.g. How do I verify certifications?"
            value={faqQuestion}
            onChange={(e) => setFaqQuestion(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Answer</label>
            <textarea
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              className="w-full min-h-[100px] p-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Provide a clear, detailed answer..."
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
