import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Send,
} from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'urgent' | 'high' | 'normal'

export interface SupportTicket {
  id: string
  ticketCode: string
  isReport: boolean
  subject: string
  category: string
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
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  messages: Array<{
    id: string
    sender: string
    senderRole: string
    time: string
    content: string
  }>
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tck-1',
    ticketCode: 'TCK-501',
    isReport: true,
    subject: 'Gas Safety CP12 Inspection Overdue',
    category: 'Statutory Compliance / Safety',
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
    priority: 'urgent',
    status: 'open',
    createdAt: '2026-09-28',
    messages: [
      {
        id: 'msg-1',
        sender: 'Nordica Properties',
        senderRole: 'Landlord',
        time: 'Today at 08:30 AM',
        content:
          'We commissioned the annual CP12 Gas Safety Certificate from this contractor last week before tenant move-in, but have received no signed documentation. Please review contractor accreditation before rent escrow funds are released.',
      },
    ],
  },
  {
    id: 'tck-2',
    ticketCode: 'TCK-502',
    isReport: false,
    subject: 'Tenancy Deposit Confirmation Delay',
    category: 'Billing & Custodial Escrow',
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
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-09-27',
    messages: [
      {
        id: 'msg-2',
        sender: 'Aura Residential',
        senderRole: 'Landlord',
        time: 'Yesterday at 02:15 PM',
        content:
          'Tenant transferred the 5-week deposit (£1,450) via open banking rail. The DPS custodial reference has not synced back to our Landlord HQ tenancy agreement record.',
      },
    ],
  },
  {
    id: 'tck-3',
    ticketCode: 'TCK-503',
    isReport: true,
    subject: 'Unpaid Rent Arrears Dispute',
    category: 'Tenancy Agreement & Payouts',
    user: {
      name: 'Elena Rostova',
      email: 'elena.rostova@properties.co.uk',
      role: 'Landlord',
    },
    targetEntity: {
      name: 'Flat 4B Tenancy Contract',
      handle: '@tenancy_lon_882',
      note: 'Direct Debit collection failed on 1st of the month with insufficient funds.',
      badge: 'MEDIATION',
    },
    priority: 'high',
    status: 'open',
    createdAt: '2026-09-26',
    messages: [
      {
        id: 'msg-3',
        sender: 'Elena Rostova',
        senderRole: 'Landlord',
        time: 'Sep 26 at 11:20 AM',
        content:
          'Rent arrears of £950 are now 14 days overdue. Tenant requested a payment plan but stopped responding. We need Section 8 automated notice assistance from legal dispatch.',
      },
    ],
  },
  {
    id: 'tck-4',
    ticketCode: 'TCK-504',
    isReport: false,
    subject: 'Update Corporate Landlord VAT ID',
    category: 'Account & Invoicing',
    user: {
      name: 'Kura Property Holdings',
      email: 'finance@kuraproperties.co.uk',
      role: 'Landlord',
    },
    priority: 'normal',
    status: 'resolved',
    createdAt: '2026-09-25',
    messages: [
      {
        id: 'msg-4',
        sender: 'Kura Property Holdings',
        senderRole: 'Landlord',
        time: 'Sep 25 at 09:40 AM',
        content:
          'Please update our registered VAT number on all monthly platform invoices to GB 982 4410 19.',
      },
    ],
  },
  {
    id: 'tck-5',
    ticketCode: 'TCK-505',
    isReport: true,
    subject: 'Emergency Electrical EICR Remedial Notice',
    category: 'Statutory Safety & Licensing',
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
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2026-09-24',
    messages: [
      {
        id: 'msg-5',
        sender: 'Marcus Vance',
        senderRole: 'Landlord',
        time: 'Sep 24 at 04:10 PM',
        content:
          'During the 5-year EICR inspection, a Code C2 remedial notice was recorded. We need immediate contractor dispatch approved under emergency tenancy repairs.',
      },
    ],
  },
]

export function SupportInbox() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS)
  const [activeTab, setActiveTab] = useState<'all' | 'reports' | 'open' | 'in_progress' | 'resolved'>('all')
  const [search, setSearch] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3000)
  }

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Tab filter
      if (activeTab === 'reports' && !ticket.isReport) return false
      if (activeTab === 'open' && ticket.status !== 'open') return false
      if (activeTab === 'in_progress' && ticket.status !== 'in_progress') return false
      if (activeTab === 'resolved' && ticket.status !== 'resolved') return false

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchCode = ticket.ticketCode.toLowerCase().includes(q)
        const matchSubject = ticket.subject.toLowerCase().includes(q)
        const matchUser = ticket.user.name.toLowerCase().includes(q) || ticket.user.email.toLowerCase().includes(q)
        const matchCat = ticket.category.toLowerCase().includes(q)
        if (!matchCode && !matchSubject && !matchUser && !matchCat) return false
      }

      return true
    })
  }, [tickets, activeTab, search])

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: tickets.length,
      reports: tickets.filter((t) => t.isReport).length,
      open: tickets.filter((t) => t.status === 'open').length,
      in_progress: tickets.filter((t) => t.status === 'in_progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    }
  }, [tickets])

  // Send reply inside modal
  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Sazzad Chowdhury',
      senderRole: 'Super Admin',
      time: 'Just now',
      content: replyText.trim(),
    }

    const updated = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
    }

    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)))
    setSelectedTicket(updated)
    setReplyText('')
    showToast(`Reply sent to ${selectedTicket.user.name}.`)
  }

  // Update status or priority
  const updateTicketMeta = (status?: TicketStatus, priority?: TicketPriority) => {
    if (!selectedTicket) return

    const updated: SupportTicket = {
      ...selectedTicket,
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
    }

    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)))
    setSelectedTicket(updated)
    showToast(`Ticket ${selectedTicket.ticketCode} updated.`)
  }

  const markResolved = () => {
    updateTicketMeta('resolved')
  }

  return (
    <div className="space-y-5">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Toolbar matching media_1793079576247.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Segmented Control Tabs */}
        <div className="segmented-track">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn('segmented-item', activeTab === 'all' ? 'segmented-item-active' : 'segmented-item-inactive')}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={cn('segmented-item', activeTab === 'reports' ? 'segmented-item-active' : 'segmented-item-inactive')}
          >
            Reports
            <span className="rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px] font-medium ml-1.5">
              {counts.reports}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('open')}
            className={cn('segmented-item', activeTab === 'open' ? 'segmented-item-active' : 'segmented-item-inactive')}
          >
            Open
            <span className="rounded-full bg-slate-100 text-slate-600 px-1.5 py-0.2 text-[10px] font-medium ml-1.5">
              {counts.open}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={cn(
              'segmented-item',
              activeTab === 'in_progress' ? 'segmented-item-active' : 'segmented-item-inactive'
            )}
          >
            In Progress
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={cn(
              'segmented-item',
              activeTab === 'resolved' ? 'segmented-item-active' : 'segmented-item-inactive'
            )}
          >
            Resolved
          </button>
        </div>

        {/* Right Search Input */}
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, users, issues…"
            className="admin-search-pill w-full pl-9 pr-3 text-xs"
          />
        </div>
      </div>

      {/* Main Tickets Table */}
      <div className="admin-table-wrap">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">TICKET</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">SUBJECT</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">USER</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">CATEGORY</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">PRIORITY</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">STATUS</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/support/${t.ticketCode}`)}
                  className="hover:bg-slate-50/70 transition cursor-pointer"
                >
                  {/* TICKET CODE */}
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900">
                    {t.ticketCode}
                  </td>

                  {/* SUBJECT */}
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition">
                      {t.subject}
                    </span>
                  </td>

                  {/* USER */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.user.name} size="sm" />
                      <span className="text-xs font-bold text-slate-800">{t.user.name}</span>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                    {t.category}
                  </td>

                  {/* PRIORITY - Clean, subtle typography without loud pill boxes */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-600 capitalize">
                    {t.priority}
                  </td>

                  {/* STATUS - Clean, subtle live dot and typography */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 capitalize">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          t.status === 'resolved'
                            ? 'bg-emerald-500'
                            : t.status === 'in_progress'
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                        )}
                      />
                      {t.status.replace('_', ' ')}
                    </div>
                  </td>

                  {/* ACTION VIEW BUTTON */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/support/${t.ticketCode}`)
                      }}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm font-medium text-slate-400">
                  No support tickets found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer Pagination matching media_1793079576247.png */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-800">1</span> to{' '}
            <span className="font-bold text-slate-800">{filteredTickets.length}</span> of{' '}
            <span className="font-bold text-slate-800">{filteredTickets.length}</span> tickets
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Rows:</span>
              <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                <option>8 / page</option>
                <option>16 / page</option>
                <option>32 / page</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1 text-xs text-slate-400">
              <button type="button" className="p-1 hover:text-slate-700 rounded transition disabled:opacity-40" disabled>
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 hover:text-slate-700 rounded transition disabled:opacity-40" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-xs">
                1
              </span>
              <button type="button" className="p-1 hover:text-slate-700 rounded transition disabled:opacity-40" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button type="button" className="p-1 hover:text-slate-700 rounded transition disabled:opacity-40" disabled>
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal matching media_1793079574398.png */}
      <Modal
        open={!!selectedTicket}
        title=""
        onClose={() => setSelectedTicket(null)}
        footer={
          selectedTicket ? (
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              {/* Dropdowns for Status & Priority */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span>Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketMeta(e.target.value as TicketStatus)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span>Priority:</span>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => updateTicketMeta(undefined, e.target.value as TicketPriority)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Mark Resolved in Brand Blue! */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={markResolved}
                  className="!bg-brand-600 hover:!bg-brand-700 font-bold !text-xs !py-2 !px-4"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Mark Resolved
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedTicket(null)}
                  className="!text-xs !py-2 !px-4 font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {selectedTicket && (
          <div className="space-y-5 -mt-2">
            {/* Modal Header */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Ticket {selectedTicket.ticketCode}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct customer conversation, dispute reason, and resolution.
              </p>
            </div>

            {/* Subject Banner */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {selectedTicket.category} · Created {selectedTicket.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                      selectedTicket.priority === 'urgent'
                        ? 'border border-red-200 bg-red-50 text-red-600'
                        : selectedTicket.priority === 'high'
                        ? 'border border-amber-200 bg-amber-50 text-amber-700'
                        : 'border border-slate-200 bg-slate-100 text-slate-600'
                    )}
                  >
                    {selectedTicket.priority}
                  </span>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase',
                      selectedTicket.status === 'open'
                        ? 'border border-amber-200 bg-amber-50 text-amber-700'
                        : selectedTicket.status === 'in_progress'
                        ? 'border border-blue-200 bg-blue-50 text-brand-700'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        selectedTicket.status === 'open'
                          ? 'bg-amber-500'
                          : selectedTicket.status === 'in_progress'
                          ? 'bg-brand-600'
                          : 'bg-emerald-500'
                      )}
                    />
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Entity Cards: User / Landlord + Subject / Contractor */}
            <div className="space-y-3">
              {/* Card 1: Complainant / Landlord */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedTicket.user.name} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedTicket.user.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{selectedTicket.user.email}</p>
                  </div>
                </div>
                <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600">
                  {selectedTicket.user.role}
                </span>
              </div>

              {/* Card 2: Subject of Dispute (if applicable) */}
              {selectedTicket.targetEntity && (
                <div className="rounded-xl border border-red-100/80 bg-red-50/30 p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {selectedTicket.targetEntity.name}
                        </span>
                        <span className="text-[11px] font-mono text-red-600">
                          {selectedTicket.targetEntity.handle}
                        </span>
                      </div>
                      <p className="mt-1 text-xs italic text-red-700 font-normal">
                        "{selectedTicket.targetEntity.note}"
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-red-600 shrink-0">
                    {selectedTicket.targetEntity.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Conversation Messages */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                MESSAGES ({selectedTicket.messages.length})
              </p>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {selectedTicket.messages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{m.sender}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({m.senderRole})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{m.time}</span>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-700 font-normal">
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input Box */}
            <div className="space-y-2.5 pt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official administrative reply..."
                rows={3}
                className="admin-input w-full resize-none text-xs leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
