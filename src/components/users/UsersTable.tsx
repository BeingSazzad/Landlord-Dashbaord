import { useMemo, useState } from 'react'
import { MOCK_USERS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { Badge, statusTone } from '@/components/shared/Badge'
import { DataTable } from '@/components/shared/DataTable'
import type { PlatformUser } from '@/types/api.types'
import { useDebounce } from '@/hooks/useDebounce'

const FILTERS = ['all', 'landlord', 'tenant', 'contractor'] as const

export function UsersTable() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const debouncedQuery = useDebounce(query, 200)

  const rows = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesFilter = filter === 'all' || user.role === filter
      const q = debouncedQuery.toLowerCase()
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.plan || '').toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [debouncedQuery, filter])

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
      key: 'status',
      header: 'Status',
      render: (user: PlatformUser) => <Badge tone={statusTone(user.status)}>{user.status}</Badge>,
    },
    {
      key: 'plan',
      header: 'Subscription',
      render: (user: PlatformUser) => (
        <span className="text-slate-600">{user.plan ? `${user.plan}${user.mrr ? ` · ${formatMoney(user.mrr)}/mo` : ''}` : '—'}</span>
      ),
    },
    { key: 'joined', header: 'Joined', render: (user: PlatformUser) => user.joined },
  ]

  return (
    <div className="space-y-4">
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
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  )
}
