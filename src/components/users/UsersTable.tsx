import { useMemo, useState } from 'react'
import { MOCK_USERS } from '@/lib/mockData'
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
        (user.property || '').toLowerCase().includes(q)
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
      key: 'property',
      header: 'Property / Unit',
      render: (user: PlatformUser) => (
        <span className="text-slate-600">
          {user.property ? `${user.property}${user.unit ? ` · ${user.unit}` : ''}` : '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
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
