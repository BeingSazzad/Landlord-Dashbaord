import { useState, useMemo } from 'react'
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Code,
  Copy,
  Edit3,
  FileCheck2,
  FileText,
  HelpCircle,
  Link2,
  List,
  ListOrdered,
  Lock,
  Minus,
  Palette,
  Pencil,
  Plus,
  Quote,
  Redo2,
  Save,
  Search,
  Trash2,
  Undo2,
  Upload,
  Users2,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type CmsTab = 'pages' | 'faqs' | 'branding'
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

const INITIAL_POLICIES: PolicyDocument[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    updated: 'September 2026',
    readTime: '~2 min read',
    content: `# Terms of Service — Landlord HQ UK Platform

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
  {
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
  {
    id: 'agreement',
    title: 'Landlord Service Agreement',
    updated: 'September 2026',
    readTime: '~2 min read',
    content: `# Landlord Service & Subscription Agreement

## 1. Platform Subscription Tiers
Landlords access Landlord HQ via Starter (Free for 1 unit), Pro (£19/mo up to 5 properties), or Portfolio (£49/mo unlimited properties). Subscriptions renew automatically on a monthly or annual billing cycle.

## 2. Automated Rent Collection & Payouts
Rent payments collected via Direct Debit or Open Banking rail are disbursed to the landlord's verified account within 24 hours of clearance. Platform fees are deducted transparently at source.

## 3. Contractor Dispatch Authority
Landlords may define pre-approved emergency maintenance thresholds (default: £250). Certified contractors can accept and dispatch emergency call-outs within this authorized limit.`,
  },
  {
    id: 'about',
    title: 'About Landlord HQ',
    updated: 'September 2026',
    readTime: '~1 min read',
    content: `# About Landlord HQ

Landlord HQ is the dedicated property management platform for modern UK landlords, tenants, and verified tradespeople. We combine automated rent collection, compliance expiration tracking, digital tenancy contracts, and contractor dispatch into one unified system.`,
  },
]

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
    audience: 'landlords',
    question: 'What happens when a tenant reports an emergency maintenance issue?',
    answer:
      'Emergency maintenance requests (e.g. heating breakdown, burst water pipe) trigger high-priority push notifications and SMS alerts. Landlords can auto-assign verified contractors with pre-approved emergency budgets.',
  },
  {
    id: 'f-5',
    audience: 'landlords',
    question: 'How does automated rent collection and payout reconciliation work?',
    answer:
      'Rent is collected via Direct Debit or open banking. Once cleared, payments are reconciled against the tenancy ledger and paid directly to your registered bank account within 24 hours.',
  },
  {
    id: 'f-6',
    audience: 'tenants',
    question: 'How do I submit an urgent repair or maintenance request?',
    answer:
      'Log into the Tenant Portal, navigate to Maintenance, tap "Report Issue", upload photos/video, and select the urgency. Your landlord and assigned contractor will receive immediate notification.',
  },
  {
    id: 'f-7',
    audience: 'tenants',
    question: 'How do I download my Tenancy Agreement and Deposit Protection certificate?',
    answer:
      'All signed agreements, inventory check-in reports, and deposit scheme reference certificates are permanently accessible under the "Documents" tab of your mobile app.',
  },
  {
    id: 'f-8',
    audience: 'contractors',
    question: 'How do tradespeople verify their Gas Safe or NICEIC certifications on the platform?',
    answer:
      'Contractors upload their registration license numbers and public liability insurance documents during onboarding. Our compliance team verifies credentials with statutory bodies within 24 hours.',
  },
]

export function CmsPanel() {
  const [activeTab, setActiveTab] = useState<CmsTab>('pages')
  const [policies, setPolicies] = useState<PolicyDocument[]>(INITIAL_POLICIES)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('terms')
  const [editingPolicy, setEditingPolicy] = useState<PolicyDocument | null>(null)
  const [policyContent, setPolicyContent] = useState<string>('')

  // Identity & Branding State
  const [platformName, setPlatformName] = useState('Landlord HQ')
  const [tagline, setTagline] = useState('UK Property Management & Tenancy Compliance Platform')
  const [supportEmail, setSupportEmail] = useState('compliance@landlordhq.co.uk')
  const [contactNumber, setContactNumber] = useState('+44 20 7946 0912')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  // FAQs state
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS)
  const [faqAudience, setFaqAudience] = useState<FaqAudience>('landlords')
  const [faqSearch, setFaqSearch] = useState<string>('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('f-1')
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [isAddingFaq, setIsAddingFaq] = useState<boolean>(false)
  const [faqQuestion, setFaqQuestion] = useState<string>('')
  const [faqAnswer, setFaqAnswer] = useState<string>('')

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

  const activePolicy = useMemo(() => {
    return policies.find((p) => p.id === selectedPolicyId) || policies[0]
  }, [policies, selectedPolicyId])

  // Count word / character stats for preview
  const policyStats = useMemo(() => {
    const text = activePolicy.content
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    return { words, chars }
  }, [activePolicy])

  // Count word / character stats for live editor
  const editStats = useMemo(() => {
    const text = policyContent || ''
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    return { words, chars }
  }, [policyContent])

  const insertMarkdown = (syntax: string) => {
    switch (syntax) {
      case 'bold':
        setPolicyContent((prev) => prev + '\n**Statutory Requirement**')
        break
      case 'italic':
        setPolicyContent((prev) => prev + '\n*Compliance note*')
        break
      case 'strike':
        setPolicyContent((prev) => prev + '\n~~Superseded clause~~')
        break
      case 'h1':
        setPolicyContent((prev) => prev + '\n\n# New Statutory Section')
        break
      case 'h2':
        setPolicyContent((prev) => prev + '\n\n## 1. Regulatory Procedure')
        break
      case 'h3':
        setPolicyContent((prev) => prev + '\n\n### Required Documentation')
        break
      case 'bullet':
        setPolicyContent((prev) => prev + '\n- Mandatory gas safety certification verification')
        break
      case 'numbered':
        setPolicyContent((prev) => prev + '\n1. First procedural step')
        break
      case 'quote':
        setPolicyContent((prev) => prev + '\n> Statutory notice requirement pursuant to Housing Act 2004.')
        break
      case 'code':
        setPolicyContent((prev) => prev + ' `UK-STAT-2026`')
        break
      case 'link':
        setPolicyContent((prev) => prev + ' [Tenant Deposit Scheme](https://www.tenancydepositscheme.com)')
        break
      case 'hr':
        setPolicyContent((prev) => prev + '\n\n---\n')
        break
      default:
        break
    }
  }

  const openPolicyEditor = (policy: PolicyDocument) => {
    setEditingPolicy(policy)
    setPolicyContent(policy.content)
  }

  const savePolicy = () => {
    if (!editingPolicy) return
    setPolicies((prev) =>
      prev.map((p) => (p.id === editingPolicy.id ? { ...p, content: policyContent } : p))
    )
    setEditingPolicy(null)
    showToast('Policy updated and published successfully.')
  }

  const openAddFaq = () => {
    setFaqQuestion('')
    setFaqAnswer('')
    setIsAddingFaq(true)
  }

  const saveNewFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return
    const newFaq: FaqItem = {
      id: `f-${Date.now()}`,
      audience: faqAudience,
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
    }
    setFaqs((prev) => [newFaq, ...prev])
    setIsAddingFaq(false)
    setExpandedFaqId(newFaq.id)
  }

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Top Tab Navigation matching Image 3 & 4 */}
      <div className="border-b border-slate-200/80">
        <nav className="flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('pages')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition',
              activeTab === 'pages'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <FileText className="h-4 w-4" />
            Pages
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition',
              activeTab === 'faqs'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <HelpCircle className="h-4 w-4" />
            FAQs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition',
              activeTab === 'branding'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <Palette className="h-4 w-4" />
            Branding
          </button>
        </nav>
      </div>

      {/* TAB 1: PAGES VIEW (Matching Image 3) */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Policy List */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Policies</p>
            <div className="space-y-2.5">
              {policies.map((policy) => {
                const isSelected = policy.id === selectedPolicyId
                return (
                  <button
                    key={policy.id}
                    type="button"
                    onClick={() => setSelectedPolicyId(policy.id)}
                    className={cn(
                      'w-full text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'bg-blue-50/90 border border-blue-200/90 shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50'
                    )}
                  >
                    <div>
                      <p className={cn('text-sm font-bold tracking-tight', isSelected ? 'text-brand-900' : 'text-slate-900')}>
                        {policy.title}
                      </p>
                      <p className={cn('text-xs mt-1 font-medium', isSelected ? 'text-brand-600/80' : 'text-slate-500')}>
                        {policy.updated}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="h-4 w-1 rounded-full bg-brand-600 shrink-0 ml-2" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Document Pane: Preview vs In-Place Editor (Matching media_1793081764584.png) */}
          <div className="lg:col-span-8 admin-card p-6 sm:p-7">
            {editingPolicy ? (
              /* IN-PLACE MARKDOWN EDITOR (Matching media_1793081764584.png) */
              <div>
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100/90 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{editingPolicy.title}</h3>
                      <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 tracking-wide">
                        EDITING
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 font-medium">Last updated: {editingPolicy.updated}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditingPolicy(null)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={savePolicy}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save Policy
                    </button>
                  </div>
                </div>

                {/* Markdown Editor Box with Toolbar */}
                <div className="mt-5 rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                  {/* Markdown Toolbar matching media_1793081764584.png */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-3 py-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('undo')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Undo"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('redo')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Redo"
                      >
                        <Redo2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="h-3.5 w-[1px] bg-slate-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown('bold')}
                        className="px-2 py-1 font-bold text-xs hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('italic')}
                        className="px-2 py-1 italic text-xs hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('strike')}
                        className="px-2 py-1 line-through text-xs hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Strikethrough"
                      >
                        S
                      </button>
                      <span className="h-3.5 w-[1px] bg-slate-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown('h1')}
                        className="px-1.5 py-1 font-bold text-[11px] hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('h2')}
                        className="px-1.5 py-1 font-bold text-[11px] hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('h3')}
                        className="px-1.5 py-1 font-bold text-[11px] hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                      >
                        H3
                      </button>
                      <span className="h-3.5 w-[1px] bg-slate-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown('bullet')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Bullet List"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('numbered')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Numbered List"
                      >
                        <ListOrdered className="h-3.5 w-3.5" />
                      </button>
                      <span className="h-3.5 w-[1px] bg-slate-200 mx-1" />
                      <button
                        type="button"
                        onClick={() => insertMarkdown('quote')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Quote"
                      >
                        <Quote className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('code')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Code"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('link')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Link"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('hr')}
                        className="p-1.5 hover:text-slate-900 rounded hover:bg-slate-200/60 transition cursor-pointer"
                        title="Horizontal Rule"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="rounded bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600">
                      MARKDOWN
                    </span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={policyContent}
                    onChange={(e) => setPolicyContent(e.target.value)}
                    className="w-full min-h-[440px] p-5 font-mono text-xs leading-relaxed text-slate-800 bg-white focus:outline-none resize-y"
                    placeholder="Write statutory policy clauses in markdown..."
                  />

                  {/* Document Footer Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-500 font-medium">
                    <span>
                      {editStats.words} words · {editStats.chars} chars · ~{Math.max(1, Math.ceil(editStats.words / 150))} min read
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Syncs automatically to landlord & tenant portal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* READ-ONLY DOCUMENT PREVIEW */
              <div>
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100/90 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activePolicy.title}</h3>
                    <p className="mt-1 text-xs text-slate-400 font-medium">Last updated: {activePolicy.updated}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openPolicyEditor(activePolicy)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Policy
                  </button>
                </div>

                {/* Document Frame */}
                <div className="mt-6 rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                  {/* Document Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      Document Preview · Click &quot;Edit Policy&quot; above to modify
                    </span>
                    <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 tracking-wider">
                      READ-ONLY
                    </span>
                  </div>

                  {/* Document Body */}
                  <div className="p-6 text-sm text-slate-700 leading-relaxed font-sans max-h-[460px] overflow-y-auto whitespace-pre-line space-y-4">
                    {activePolicy.content}
                  </div>

                  {/* Document Footer Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-500 font-medium">
                    <span>
                      {policyStats.words} words · {policyStats.chars} chars · {activePolicy.readTime}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-600">
                      <Lock className="h-3 w-3 text-slate-400" />
                      LOCKED
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAQS VIEW (Matching Image 4) */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Sub-tabs & Search & Add Question */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Audience Pills */}
            <div className="segmented-track">
              <button
                type="button"
                onClick={() => setFaqAudience('landlords')}
                className={cn(
                  'segmented-item cursor-pointer flex items-center gap-1.5',
                  faqAudience === 'landlords' ? 'segmented-item-active' : 'segmented-item-inactive'
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                For Landlords
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                  {faqs.filter((f) => f.audience === 'landlords').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFaqAudience('tenants')}
                className={cn(
                  'segmented-item cursor-pointer flex items-center gap-1.5',
                  faqAudience === 'tenants' ? 'segmented-item-active' : 'segmented-item-inactive'
                )}
              >
                <Users2 className="h-3.5 w-3.5" />
                For Tenants
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                  {faqs.filter((f) => f.audience === 'tenants').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFaqAudience('contractors')}
                className={cn(
                  'segmented-item cursor-pointer flex items-center gap-1.5',
                  faqAudience === 'contractors' ? 'segmented-item-active' : 'segmented-item-inactive'
                )}
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                For Contractors
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-700 font-bold">
                  {faqs.filter((f) => f.audience === 'contractors').length}
                </span>
              </button>
            </div>

            {/* Search & Add */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search FAQs…"
                  className="admin-search-pill !pl-9.5 pr-3 py-1.5 text-xs w-48 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={openAddFaq}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Question
              </button>
            </div>
          </div>

          {/* FAQ Accordion Cards List */}
          <div className="space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isExpanded = expandedFaqId === faq.id
                return (
                  <div
                    key={faq.id}
                    className="admin-card p-4.5 sm:p-5 transition-all hover:border-slate-300/80 shadow-2xs"
                  >
                    <div
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      {/* Left: Clean sequence number + Question title */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 hover:text-brand-600 transition">
                          {faq.question}
                        </h4>
                      </div>

                      {/* Right: Actions + Accordion Chevron */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingFaq(faq)
                            setFaqQuestion(faq.question)
                            setFaqAnswer(faq.answer)
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFaq(faq.id)
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="p-1 text-slate-400">
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200',
                              isExpanded && 'rotate-180 text-brand-600'
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Answer content */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 pl-10.5">
                        <p className="text-sm text-slate-600 leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm font-medium text-slate-400">
                No FAQs found for this section.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING & IDENTITY VIEW (Replaced color palette with Name & Logo per user command) */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Platform Identity & Naming Settings */}
          <div className="admin-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Platform Identity & Naming</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configure public platform display name, official tagline, and legal contact</p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Platform identity settings saved successfully.')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save Platform Identity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-700">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="admin-input w-full mt-1.5 text-xs font-semibold"
                  placeholder="e.g. Landlord HQ"
                />
                <p className="text-[11px] text-slate-400 mt-1">Displayed across topbar navigation, tenancy notices, and email headers</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Official Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="admin-input w-full mt-1.5 text-xs font-medium"
                  placeholder="e.g. UK Property Management & Tenancy Compliance Platform"
                />
                <p className="text-[11px] text-slate-400 mt-1">Appears on platform landing pages and onboarding portals</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Compliance & Legal Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="admin-input w-full mt-1.5 text-xs font-medium"
                  placeholder="e.g. compliance@landlordhq.co.uk"
                />
                <p className="text-[11px] text-slate-400 mt-1">Official contact address referenced in statutory terms and privacy documents</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Official Contact Number</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="admin-input w-full mt-1.5 text-xs font-medium"
                  placeholder="e.g. +44 20 7946 0912"
                />
                <p className="text-[11px] text-slate-400 mt-1">Official support hotline for landlords, tenants, and contractors</p>
              </div>
            </div>
          </div>

          {/* Official Brand Logo (Clean single logo card) */}
          <div className="admin-card p-6">
            <h3 className="text-base font-bold text-slate-900">Official Brand Logo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Platform logo used across the header, navigation, and PDF agreements</p>

            <div className="max-w-md mt-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 border border-blue-100">
                    PRIMARY LOGO
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">SVG · 24 KB</span>
                </div>

                <div className="my-5 flex items-center justify-center h-24 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold shadow-xs">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-base font-bold tracking-tight text-slate-900">Landlord</span>
                      <span className="text-base font-bold tracking-tight text-brand-600 ml-1">HQ</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900">Topbar & Contract Header Logo</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Used on light backgrounds and PDF tenancy agreements</p>

                <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => showToast('Primary logo update prompt opened.')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Logo asset URL copied to clipboard.')}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                    title="Copy Asset URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding / Editing FAQ */}
      <Modal
        open={isAddingFaq || !!editingFaq}
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ Question'}
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
                if (editingFaq) {
                  setFaqs((prev) =>
                    prev.map((f) =>
                      f.id === editingFaq.id
                        ? { ...f, question: faqQuestion, answer: faqAnswer }
                        : f
                    )
                  )
                  setEditingFaq(null)
                } else {
                  saveNewFaq()
                }
              }}
              className="!bg-brand-600 hover:!bg-brand-700"
            >
              Save Question
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Audience</label>
            <p className="text-xs text-slate-500 capitalize">{editingFaq ? editingFaq.audience : faqAudience}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Question</label>
            <input
              type="text"
              className="admin-input w-full mt-1"
              placeholder="e.g. How does automated compliance tracking work?"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Answer</label>
            <textarea
              className="admin-input min-h-[120px] w-full mt-1"
              placeholder="Enter clear, helpful guidance..."
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/10 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
