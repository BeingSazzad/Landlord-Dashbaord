import { useMemo, useState } from 'react'
import { Ban, RotateCcw, Search, Trash2, UserCheck, Users, Wrench } from 'lucide-react'
import { MOCK_USERS } from '@/lib/mockData'
import { cn, formatMoney } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { DataTable } from '@/components/shared/DataTable'
import { StatCard } from '@/components/dashboard/components/StatCard'
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
            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
            <p className="text-xs text-slate-500 font-mono">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: PlatformUser) => {
        if (user.role === 'landlord') {
          return (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-blue-100 capitalize">
              {user.role}
            </span>
          )
        }
        if (user.role === 'tenant') {
          return (
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 border border-purple-100 capitalize">
              {user.role}
            </span>
          )
        }
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-100 capitalize">
            {user.role}
          </span>
        )
      },
    },
    {
      key: 'properties',
      header: 'Properties',
      render: (user: PlatformUser) =>
        user.role === 'landlord' ? (
          <span className="font-bold text-slate-900 text-sm">{user.propertyCount ?? 0}</span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: PlatformUser) => {
        if (user.status === 'active') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          )
        }
        if (user.status === 'pending') {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Pending
            </span>
          )
        }
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {user.status}
          </span>
        )
      },
    },
    {
      key: 'plan',
      header: 'Subscription',
      render: (user: PlatformUser) => {
        if (user.role !== 'landlord') {
          return <span className="text-xs text-slate-400">Not applicable</span>
        }
        return (
          <span className="text-slate-700 font-medium text-xs">
            {user.plan ? `${user.plan}${user.mrr ? ` · ${formatMoney(user.mrr)}/mo` : ''}` : '—'}
          </span>
        )
      },
    },
    { key: 'joined', header: 'Joined', render: (user: PlatformUser) => <span className="text-xs text-slate-500">{user.joined}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: PlatformUser) => (
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant="secondary"
            className="!px-2.5 !py-1.5 !text-xs font-semibold"
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
          <Button variant="ghost" className="!px-2.5 !py-1.5 !text-xs !text-red-600 hover:!bg-red-50 font-semibold" onClick={() => setRemoveTarget(user)}>
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">{notice}</div>
      ) : null}

      {/* Top 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Directory"
          value={String(users.length)}
          icon={Users}
          iconVariant="blue"
        />
        <StatCard
          label="Landlords"
          value={String(users.filter((u) => u.role === 'landlord').length)}
          icon={UserCheck}
          iconVariant="indigo"
        />
        <StatCard
          label="Tenants"
          value={String(users.filter((u) => u.role === 'tenant').length)}
          icon={Users}
          iconVariant="emerald"
        />
        <StatCard
          label="Contractors"
          value={String(users.filter((u) => u.role === 'contractor').length)}
          icon={Wrench}
          iconVariant="amber"
        />
      </div>

      {/* Control Bar: Search on Left, Segmented Track on Right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or plan…"
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
            <Button fullWidth className="!bg-red-600 hover:!bg-red-700 font-bold" onClick={confirmRemove}>
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
