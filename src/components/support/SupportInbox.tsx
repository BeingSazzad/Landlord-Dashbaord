import { MOCK_SUPPORT } from '@/lib/mockData'
import { Avatar } from '@/components/shared/Avatar'
import { Badge, statusTone } from '@/components/shared/Badge'

export function SupportInbox() {
  return (
    <div className="space-y-3">
      {MOCK_SUPPORT.map((msg) => (
        <div key={msg.id} className="admin-card p-4">
          <div className="flex items-start gap-3">
            <Avatar name={msg.from} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{msg.subject}</p>
                <Badge tone={statusTone(msg.status)}>{msg.status}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{msg.from} · {msg.email} · {msg.role} · {msg.time}</p>
              <p className="mt-2 text-sm text-slate-700">{msg.message}</p>
              {msg.status === 'open' ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Reply</button>
                  <button type="button" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">Close</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
