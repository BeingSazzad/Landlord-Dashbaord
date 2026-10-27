import { useMemo, useState } from 'react'
import { MOCK_SUPPORT } from '@/lib/mockData'
import { Avatar } from '@/components/shared/Avatar'
import { Badge, statusTone } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { SupportMessage } from '@/types/api.types'

const FILTERS = ['all', 'open', 'replied', 'closed'] as const

export function SupportInbox() {
  const [tickets, setTickets] = useState<SupportMessage[]>(() => [...MOCK_SUPPORT])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [replying, setReplying] = useState<SupportMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sentNotice, setSentNotice] = useState<string | null>(null)

  const rows = useMemo(() => {
    if (filter === 'all') return tickets
    return tickets.filter((t) => t.status === filter)
  }, [filter, tickets])

  const openReply = (ticket: SupportMessage) => {
    setReplying(ticket)
    setReplyText('')
  }

  const closeTicket = (id: number) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'closed' } : t)))
    setSentNotice('Ticket closed.')
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
    setSentNotice(`Reply sent to ${replying.email} (demo — no email actually sent).`)
    setReplying(null)
    setReplyText('')
    window.setTimeout(() => setSentNotice(null), 3500)
  }

  return (
    <div className="space-y-4">
      {sentNotice ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">{sentNotice}</div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`admin-chip capitalize ${filter === f ? 'admin-chip-active' : 'admin-chip-inactive'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.length ? (
          rows.map((msg) => (
            <div key={msg.id} className="admin-card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Avatar name={msg.from} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{msg.subject}</p>
                    <Badge tone={statusTone(msg.status)}>{msg.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {msg.from} · {msg.email} · {msg.role} · {msg.time}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{msg.message}</p>

                  {msg.reply ? (
                    <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-brand-700">Your reply</p>
                      <p className="mt-1 text-sm text-slate-700">{msg.reply}</p>
                      {msg.repliedAt ? <p className="mt-1 text-xs text-slate-500">{msg.repliedAt}</p> : null}
                    </div>
                  ) : null}

                  {msg.status === 'open' ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button className="!px-3 !py-1.5 !text-xs" onClick={() => openReply(msg)}>
                        Reply
                      </Button>
                      <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => closeTicket(msg.id)}>
                        Close
                      </Button>
                    </div>
                  ) : null}

                  {msg.status === 'replied' ? (
                    <div className="mt-3">
                      <Button variant="secondary" className="!px-3 !py-1.5 !text-xs" onClick={() => closeTicket(msg.id)}>
                        Close ticket
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="admin-card p-10 text-center text-sm text-slate-500">No tickets in this filter.</div>
        )}
      </div>

      <Modal
        open={!!replying}
        title={replying ? `Reply to ${replying.from}` : ''}
        onClose={() => setReplying(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setReplying(null)}>
              Cancel
            </Button>
            <Button fullWidth onClick={sendReply} disabled={!replyText.trim()}>
              Send reply
            </Button>
          </div>
        }
      >
        {replying ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{replying.subject}</p>
              <p className="mt-1">{replying.message}</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="support-reply" className="text-sm font-medium text-slate-700">
                Your message
              </label>
              <textarea
                id="support-reply"
                className="admin-input min-h-[120px] w-full resize-y"
                placeholder={`Write a reply to ${replying.email}…`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500">
              Demo only — in production this would email the user and log the ticket in your helpdesk.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
