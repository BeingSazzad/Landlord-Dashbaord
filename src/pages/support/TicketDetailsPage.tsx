import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Home,
  Send,
  Shield,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface MessageItem {
  id: string
  sender: string
  senderRole: string
  time: string
  content: string
  isStaff?: boolean
}

interface TicketRecord {
  id: string
  ticketCode: string
  isReport: boolean
  subject: string
  category: string
  createdAt: string
  priority: 'urgent' | 'high' | 'normal'
  status: 'open' | 'in_progress' | 'resolved'
  propertyAddress: string
  tenancyId: string
  escrowDeposit: string
  user: {
    name: string
    email: string
    role: 'Landlord' | 'Tenant' | 'Contractor'
  }
  targetEntity?: {
    name: string
    handle: string
    note: string
    badge: string
  }
  messages: MessageItem[]
}

const TICKETS_DB: Record<string, TicketRecord> = {
  'TCK-501': {
    id: 'tck-1',
    ticketCode: 'TCK-501',
    isReport: true,
    subject: 'Gas Safety CP12 Inspection Overdue',
    category: 'Statutory Compliance / Safety',
    createdAt: '2026-09-28',
    priority: 'urgent',
    status: 'open',
    propertyAddress: 'Flat 4B, 18 Kensington Gardens, London W8 4PE',
    tenancyId: 'AST-2026-992 (Active Tenancy)',
    escrowDeposit: '£1,450.00 Held in DPS Custodial',
    user: {
      name: 'Nordica Properties',
      email: 'partnerships@nordicaproperties.co.uk',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'Apex Heating & Gas Ltd',
      handle: '@gas_safe_7749',
      note: 'Annual boiler flues inspection certificate overdue by 14 days before tenant move-in.',
      badge: 'UNDER REVIEW',
    },
    messages: [
      {
        id: 'm-1',
        sender: 'Nordica Properties',
        senderRole: 'Landlord',
        time: 'Today at 08:30 AM',
        content:
          'We commissioned the annual CP12 Gas Safety Certificate from this contractor last week before tenant move-in, but have received no signed documentation. Please review contractor accreditation before rent escrow funds are released.',
      },
    ],
  },
  'TCK-502': {
    id: 'tck-2',
    ticketCode: 'TCK-502',
    isReport: false,
    subject: 'Tenancy Deposit Confirmation Delay',
    category: 'Billing & Custodial Escrow',
    createdAt: '2026-09-27',
    priority: 'high',
    status: 'in_progress',
    propertyAddress: '12 Gloucester Road, Flat 2, London SW7 4RB',
    tenancyId: 'AST-2026-810 (Pending Deposit)',
    escrowDeposit: '£1,750.00 In Transit',
    user: {
      name: 'Aura Residential',
      email: 'lettings@auraresidential.com',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'Deposit Protection Service (DPS)',
      handle: '@dps_custodial',
      note: 'Direct custodial certificate API confirmation pending for 48 hours.',
      badge: 'IN VERIFICATION',
    },
    messages: [
      {
        id: 'm-2',
        sender: 'Aura Residential',
        senderRole: 'Landlord',
        time: 'Yesterday at 02:15 PM',
        content:
          'Tenant transferred the 5-week deposit (£1,750) via open banking rail. The DPS custodial reference has not synced back to our Landlord HQ tenancy agreement record.',
      },
    ],
  },
  'TCK-503': {
    id: 'tck-3',
    ticketCode: 'TCK-503',
    isReport: false,
    subject: 'Direct Debit Rent Mandate Failure',
    category: 'Rent Collections & Payouts',
    createdAt: '2026-09-26',
    priority: 'high',
    status: 'open',
    propertyAddress: '9 The Crescent, Bath BA1 2LR',
    tenancyId: 'AST-2026-441 (Direct Debit)',
    escrowDeposit: '£2,100.00 Held in TDS Insured',
    user: {
      name: 'St. James Lettings',
      email: 'accounts@stjameslettings.co.uk',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'BACS GoCardless Gateway',
      handle: '@bacs_uk_gateway',
      note: 'Returned mandate error code refer-to-payer on monthly rent sweep.',
      badge: 'INVESTIGATING',
    },
    messages: [
      {
        id: 'm-3',
        sender: 'St. James Lettings',
        senderRole: 'Landlord',
        time: 'Sep 26 at 11:05 AM',
        content:
          'September rent collection of £2,100 failed on tenant BACS mandate with status code refer-to-payer. Please initiate automatic retry before late fee notice is triggered.',
      },
    ],
  },
  'TCK-504': {
    id: 'tck-4',
    ticketCode: 'TCK-504',
    isReport: false,
    subject: 'Update Corporate Landlord VAT ID',
    category: 'Account & Invoicing',
    createdAt: '2026-09-25',
    priority: 'normal',
    status: 'resolved',
    propertyAddress: 'Unit 8, High Street Wharf, Manchester M1 1AD',
    tenancyId: 'COMM-2026-019 (Commercial Lease)',
    escrowDeposit: '£3,800.00 Held in DPS Custodial',
    user: {
      name: 'Kura Property Holdings',
      email: 'finance@kuraproperties.co.uk',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'HMRC Corporate Gateway',
      handle: '@hmrc_vat_sync',
      note: 'Corporate entity VAT registration verified.',
      badge: 'VERIFIED',
    },
    messages: [
      {
        id: 'm-4',
        sender: 'Kura Property Holdings',
        senderRole: 'Landlord',
        time: 'Sep 25 at 09:40 AM',
        content:
          'Please update our registered VAT number on all monthly platform invoices to GB 982 4410 19.',
      },
    ],
  },
  'TCK-505': {
    id: 'tck-5',
    ticketCode: 'TCK-505',
    isReport: true,
    subject: 'Emergency Electrical EICR Remedial Notice',
    category: 'Statutory Safety & Licensing',
    createdAt: '2026-09-24',
    priority: 'urgent',
    status: 'in_progress',
    propertyAddress: '44 Park Lane, Mayfair, London W1K 1PN',
    tenancyId: 'AST-2026-114 (Emergency Repair)',
    escrowDeposit: '£2,650.00 Held in DPS Custodial',
    user: {
      name: 'Marcus Vance',
      email: 'marcus.vance@vanceestates.co.uk',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'NICEIC Certified Electricians Ltd',
      handle: '@electric_repair_uk',
      note: 'Code C2 urgent potential danger remedial work identified in fuse board.',
      badge: 'IN PROGRESS',
    },
    messages: [
      {
        id: 'm-5',
        sender: 'Marcus Vance',
        senderRole: 'Landlord',
        time: 'Sep 24 at 04:10 PM',
        content:
          'During the 5-year EICR inspection, a Code C2 remedial notice was recorded. We need immediate contractor dispatch approved under emergency tenancy repairs.',
      },
    ],
  },
}

export function TicketDetailsPage() {
  const { ticketId } = useParams<{ ticketId: string }>()

  // Find ticket or fallback to TCK-501
  const code = ticketId?.toUpperCase() || 'TCK-501'
  const initialTicket = TICKETS_DB[code] || {
    ...TICKETS_DB['TCK-501'],
    ticketCode: code,
  }

  const [ticket, setTicket] = useState<TicketRecord>(initialTicket)
  const [replyText, setReplyText] = useState('')
  const [escrowHold, setEscrowHold] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'Sazzad Chowdhury',
      senderRole: 'Super Admin',
      time: 'Just now',
      content: replyText.trim(),
      isStaff: true,
    }

    setTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }))
    setReplyText('')
    showToast('Official administrative reply posted.')
  }

  const handleStatusChange = (status: TicketRecord['status']) => {
    setTicket((prev) => ({ ...prev, status }))
    showToast(`Ticket status updated to ${status.replace('_', ' ')}.`)
  }

  const handlePriorityChange = (priority: TicketRecord['priority']) => {
    setTicket((prev) => ({ ...prev, priority }))
    showToast(`Ticket priority updated to ${priority}.`)
  }

  const insertMacro = (text: string) => {
    setReplyText(text)
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Back Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <Link
          to={ROUTES.SUPPORT}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support Inbox
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Case summary PDF downloaded.')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            Export Audit Case
          </button>

          <Button
            onClick={() => handleStatusChange('resolved')}
            className="!bg-brand-600 hover:!bg-brand-700 !text-xs !py-1.5 font-bold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Mark Resolved
          </Button>
        </div>
      </div>

      {/* Main Ticket Banner matching media_1793082242391.png */}
      <div className="admin-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-extrabold text-brand-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {ticket.ticketCode}
              </span>
              {ticket.isReport && (
                <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                  Statutory Report
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {ticket.subject}
            </h1>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {ticket.category} · Created {ticket.createdAt}
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase',
                ticket.priority === 'urgent'
                  ? 'border border-red-200 bg-red-50 text-red-600'
                  : ticket.priority === 'high'
                  ? 'border border-amber-200 bg-amber-50 text-amber-700'
                  : 'border border-slate-200 bg-slate-100 text-slate-600'
              )}
            >
              {ticket.priority}
            </span>

            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase',
                ticket.status === 'open'
                  ? 'border border-amber-200 bg-amber-50 text-amber-700'
                  : ticket.status === 'in_progress'
                  ? 'border border-blue-200 bg-blue-50 text-brand-700'
                  : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  ticket.status === 'open'
                    ? 'bg-amber-500'
                    : ticket.status === 'in_progress'
                    ? 'bg-brand-600'
                    : 'bg-emerald-500'
                )}
              />
              {ticket.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cards, Conversation & Reply (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dispute Entity Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Complainant / Landlord Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Complainant
                </span>
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                  {ticket.user.role}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={ticket.user.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{ticket.user.name}</p>
                  <p className="text-xs text-slate-400 font-mono truncate">{ticket.user.email}</p>
                </div>
              </div>
            </div>

            {/* Target Contractor / Entity Card */}
            {ticket.targetEntity ? (
              <div className="rounded-xl border border-red-100 bg-red-50/20 p-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                    Subject of Inquiry
                  </span>
                  <span className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[10px] font-bold text-red-600">
                    {ticket.targetEntity.badge}
                  </span>
                </div>
                <div className="mt-3 flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 font-bold text-xs">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">{ticket.targetEntity.name}</p>
                      <span className="text-[10px] font-mono text-red-600">
                        {ticket.targetEntity.handle}
                      </span>
                    </div>
                    <p className="mt-1 text-xs italic text-red-700 font-normal">
                      "{ticket.targetEntity.note}"
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Associated Property & Agreement Details */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Linked UK Property & Escrow Record
            </p>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Home className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Property</p>
                  <p className="font-bold text-slate-800 mt-0.5">{ticket.propertyAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileText className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Agreement</p>
                  <p className="font-bold text-slate-800 mt-0.5">{ticket.tenancyId}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 font-medium">Deposit Escrow</p>
                  <p className="font-bold text-emerald-700 mt-0.5">{ticket.escrowDeposit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Conversation Stream ({ticket.messages.length})
              </h3>
              <span className="text-xs text-slate-400 font-medium">Encrypted internal ledger</span>
            </div>

            <div className="space-y-4">
              {ticket.messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-2xl p-4.5 transition',
                    m.isStaff
                      ? 'border border-blue-100 bg-blue-50/50 ml-4 sm:ml-8'
                      : 'border border-slate-100 bg-slate-50/70 mr-4 sm:mr-8'
                  )}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{m.sender}</span>
                      <span className="text-[10px] rounded bg-white px-1.5 py-0.2 border border-slate-200/80 font-bold text-slate-600">
                        {m.senderRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-700 font-normal">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Official Reply Box */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Send Official Administrative Reply
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      insertMacro(
                        'We have paused the contractor escrow payout and requested an updated Gas Safe CP12 compliance document within 48 hours.'
                      )
                    }
                    className="text-[11px] font-semibold text-brand-600 hover:underline cursor-pointer"
                  >
                    + Macro: Pause Escrow
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() =>
                      insertMacro(
                        'Inspection report has been validated and uploaded to your tenancy agreement file. Ticket resolved.'
                      )
                    }
                    className="text-[11px] font-semibold text-brand-600 hover:underline cursor-pointer"
                  >
                    + Macro: Approved
                  </button>
                </div>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official administrative reply to the landlord/tenant..."
                rows={4}
                className="admin-input w-full resize-none text-xs leading-relaxed"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="!bg-brand-600 hover:!bg-brand-700 font-bold !text-xs !py-2.5 !px-5"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Controls & Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Status & Priority Control Card */}
          <div className="admin-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ticket Control
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="admin-input w-full text-xs font-bold cursor-pointer"
                >
                  <option value="open">Open (Awaiting Review)</option>
                  <option value="in_progress">In Progress (Under Mediation)</option>
                  <option value="resolved">Resolved (Completed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as any)}
                  className="admin-input w-full text-xs font-bold cursor-pointer"
                >
                  <option value="urgent">Urgent Priority</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assigned Console Admin
                </label>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center">
                    SC
                  </div>
                  <span className="text-xs font-bold text-slate-800">Sazzad Chowdhury</span>
                  <span className="text-[10px] text-slate-400 font-medium ml-auto">Super Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Escrow Toggles Card */}
          <div className="admin-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Escrow Protection Actions
            </h3>

            <div className="space-y-3.5 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-slate-900">Hold Escrow Rent Release</p>
                  <p className="text-[11px] text-slate-400">Freeze payout until CP12 verified</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escrowHold}
                    onChange={(e) => {
                      setEscrowHold(e.target.checked)
                      showToast(
                        e.target.checked
                          ? 'Escrow payout frozen for safety review.'
                          : 'Escrow hold released.'
                      )
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
