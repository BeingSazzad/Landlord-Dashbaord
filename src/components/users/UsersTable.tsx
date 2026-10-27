import { useMemo, useState } from 'react'
import { Ban, RotateCcw, Trash2 } from 'lucide-react'
import { MOCK_USERS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { PlatformUser } from '@/types/api.types'
import { useDebounce } from '@/hooks/useDebounce'

const FILTERS = ['all', 'landlord', 'tenant', 'contractor'] as const

export function UsersTable() {
  const [users, setUsers] = useState<PlatformUser[]>(() => [...MOCK_USERS])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [removeTarget, setRemoveTarget] = useState<PlatformUser | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 200)

  const rows = useMemo(() => {
    return users.filter((user) => {
      const matchesFilter = filter === 'all' || user.role === filter
      const q = debouncedQuery.toLowerCase()
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.role === 'landlord' && (user.plan || '').toLowerCase().includes(q))
      return matchesFilter && matchesQuery
    })
  }, [debouncedQuery, filter, users])

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3000)
  }

  const toggleBan = (user: PlatformUser) => {
    const next = user.status === 'banned' ? 'active' : 'banned'
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)))
    flash(next === 'banned' ? `${user.name} has been banned.` : `${user.name} has been unbanned.`)
  }

  const confirmRemove = () => {
    if (!removeTarget) return
    setUsers((prev) => prev.filter((u) => u.id !== removeTarget.id))
    flash(`${removeTarget.name} removed from the platform (demo).`)
    setRemoveTarget(null)
  }

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: PlatformUser) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: PlatformUser) => <Badge tone="blue">{user.role}</Badge>,
    },
    {
      key: 'properties',
      header: 'Properties',
      render: (user: PlatformUser) =>
        user.role === 'landlord' ? (
          <span className="font-semibold text-slate-900">{user.propertyCount ?? 0}</span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: PlatformUser) => <Badge tone={statusTone(user.status)}>{user.status}</Badge>,
    },
    {
      key: 'plan',
      header: 'Subscription',
      render: (user: PlatformUser) => {
        if (user.role !== 'landlord') {
          return <span className="text-xs text-slate-400">Not applicable</span>
        }
        return (
          <span className="text-slate-600">
            {user.plan ? `${user.plan}${user.mrr ? ` · ${formatMoney(user.mrr)}/mo` : ''}` : '—'}
          </span>
        )
      },
    },
    { key: 'joined', header: 'Joined', render: (user: PlatformUser) => user.joined },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: PlatformUser) => (
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant="secondary"
            className="!px-2.5 !py-1.5 !text-xs"
            onClick={() => toggleBan(user)}
            disabled={user.status === 'pending'}
          >
            {user.status === 'banned' ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Unban
              </>
            ) : (
              <>
                <Ban className="h-3.5 w-3.5" /> Ban
              </>
            )}
          </Button>
          <Button variant="ghost" className="!px-2.5 !py-1.5 !text-xs !text-red-600" onClick={() => setRemoveTarget(user)}>
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {notice ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">{notice}</div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          className="admin-input w-full max-w-sm"
        />
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
      </div>

      <DataTable columns={columns} data={rows} emptyMessage="No users match your filters." />

      <Modal
        open={!!removeTarget}
        title="Remove user?"
        onClose={() => setRemoveTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button fullWidth className="!bg-red-600 hover:!bg-red-700" onClick={confirmRemove}>
              Remove permanently
            </Button>
          </div>
        }
      >
        {removeTarget ? (
          <p className="text-sm text-slate-600">
            Remove <span className="font-semibold text-slate-900">{removeTarget.name}</span> ({removeTarget.email})? This
            cannot be undone in production — demo only removes from this list.
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
