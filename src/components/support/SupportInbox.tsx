import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, MessageSquare, MessageSquareText, Search } from 'lucide-react'
import { MOCK_SUPPORT } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { SupportMessage } from '@/types/api.types'

const FILTERS = ['all', 'open', 'replied', 'closed'] as const

export function SupportInbox() {
  const [tickets, setTickets] = useState<SupportMessage[]>(() => [...MOCK_SUPPORT])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [replying, setReplying] = useState<SupportMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sentNotice, setSentNotice] = useState<string | null>(null)

  const openCount = tickets.filter((t) => t.status === 'open').length
  const repliedCount = tickets.filter((t) => t.status === 'replied').length
  const closedCount = tickets.filter((t) => t.status === 'closed').length

  const rows = useMemo(() => {
    return tickets.filter((t) => {
      const matchesFilter = filter === 'all' || t.status === filter
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        t.from.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [filter, tickets, searchQuery])

  const openReply = (ticket: SupportMessage) => {
    setReplying(ticket)
    setReplyText('')
  }

  const closeTicket = (id: number) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'closed' } : t)))
    setSentNotice('Ticket marked as closed.')
    window.setTimeout(() => setSentNotice(null), 2500)
  }

  const sendReply = () => {
    if (!replying || !replyText.trim()) return
    setTickets((prev) =>
      prev.map((t) =>
        t.id === replying.id
          ? {
              ...t,
              status: 'replied',
              reply: replyText.trim(),
              repliedAt: 'Just now',
            }
          : t,
      ),
    )
    setSentNotice(`Reply sent to ${replying.email} (demo).`)
    setReplying(null)
    setReplyText('')
    window.setTimeout(() => setSentNotice(null), 3500)
  }

  return (
    <div className="space-y-6">
      {sentNotice ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 animate-fade-in">
          {sentNotice}
        </div>
      ) : null}

      {/* Top Summary StatCards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Open Inquiries"
          value={String(openCount)}
          hint="Awaiting admin response"
          icon={Clock}
          iconVariant="amber"
        />
        <StatCard
          label="Replied Tickets"
          value={String(repliedCount)}
          hint="Response sent to user"
          icon={MessageSquareText}
          iconVariant="blue"
        />
        <StatCard
          label="Resolved / Closed"
          value={String(closedCount)}
          hint="Successfully completed"
          icon={CheckCircle2}
          iconVariant="emerald"
        />
      </div>

      {/* Control Bar: Search on Left, Segmented Track on Right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by subject, name, or text…"
            className="admin-input w-full pl-9.5 text-xs sm:text-sm"
          />
        </div>

        <div className="segmented-track shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'segmented-item capitalize',
                filter === f ? 'segmented-item-active' : 'segmented-item-inactive'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3.5">
        {rows.length ? (
          rows.map((msg) => (
            <div key={msg.id} className="admin-card p-5 transition hover:border-slate-300/80">
              <div className="flex items-start gap-4">
                <Avatar name={msg.from} size="sm" />

                <div className="min-w-0 flex-1">
                  {/* Subject and Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{msg.subject}</h3>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 border border-blue-100 capitalize">
                        {msg.role}
                      </span>
                    </div>

                    {msg.status === 'open' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Open
                      </span>
                    ) : msg.status === 'replied' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 border border-blue-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        Replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{msg.from}</span> ·{' '}
                    <span className="font-mono text-slate-400">{msg.email}</span> ·{' '}
                    <span>{msg.time}</span>
                  </p>

                  {/* User Inquiry Message */}
                  <div className="mt-3 rounded-xl bg-slate-50/80 border border-slate-100 p-3.5 text-sm text-slate-700 leading-relaxed">
                    {msg.message}
                  </div>

                  {/* Admin Reply Block if exists */}
                  {msg.reply ? (
                    <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Administrator Reply</p>
                        {msg.repliedAt ? <span className="text-[11px] text-slate-400 font-medium">{msg.repliedAt}</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-800">{msg.reply}</p>
                    </div>
                  ) : null}

                  {/* Action Buttons */}
                  {msg.status === 'open' ? (
                    <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <Button className="!px-3 !py-1.5 !text-xs font-bold inline-flex items-center gap-1.5" onClick={() => openReply(msg)}>
                        <MessageSquare className="h-3.5 w-3.5" />
                        Reply
                      </Button>
                      <Button variant="secondary" className="!px-3 !py-1.5 !text-xs font-semibold" onClick={() => closeTicket(msg.id)}>
                        Close Ticket
                      </Button>
                    </div>
                  ) : null}

                  {msg.status === 'replied' ? (
                    <div className="mt-4 pt-2 border-t border-slate-100">
                      <Button variant="secondary" className="!px-3 !py-1.5 !text-xs font-semibold" onClick={() => closeTicket(msg.id)}>
                        Close Ticket
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-card p-10 text-center text-sm text-slate-400">
            No support tickets match your filter.
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <Modal
        open={!!replying}
        title={replying ? `Reply to ${replying.from}` : ''}
        onClose={() => setReplying(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setReplying(null)}>
              Cancel
            </Button>
            <Button fullWidth onClick={sendReply} disabled={!replyText.trim()} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
              Send Reply
            </Button>
          </div>
        }
      >
        {replying ? (
          <div className="space-y-3.5">
            <div className="rounded-xl bg-slate-50 border border-slate-200/60 p-3.5 text-xs text-slate-600">
              <p className="font-bold text-slate-900 mb-1">{replying.subject}</p>
              <p className="leading-relaxed">{replying.message}</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="support-reply" className="text-xs font-bold text-slate-700">
                Your Response Message
              </label>
              <textarea
                id="support-reply"
                className="admin-input min-h-[120px] w-full resize-y text-sm"
                placeholder={`Type your reply to ${replying.email}…`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
