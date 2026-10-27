import { useMemo, useState } from 'react'
import {
  Ban,
  Building2,
  CheckCircle2,
  FileCheck2,
  Home,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Users2,
  Wrench,
} from 'lucide-react'
import { MOCK_USERS } from '@/lib/mockData'
import { formatMoney, cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { Badge, statusTone } from '@/components/shared/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { PlatformUser } from '@/types/api.types'
import { useDebounce } from '@/hooks/useDebounce'

type UserCategory = 'landlord' | 'tenant' | 'contractor'

const CATEGORIES: { id: UserCategory; label: string }[] = [
  { id: 'landlord', label: 'Landlords' },
  { id: 'tenant', label: 'Tenants' },
  { id: 'contractor', label: 'Contractors' },
]

export function UsersTable() {
  const [users, setUsers] = useState<PlatformUser[]>(() => [...MOCK_USERS])
  const [activeCategory, setActiveCategory] = useState<UserCategory>('landlord')
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [removeTarget, setRemoveTarget] = useState<PlatformUser | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 200)

  // Filter rows strictly by active category and search query
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.role !== activeCategory) return false
      const q = debouncedQuery.toLowerCase()
      if (!q) return true

      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.currentProperty || '').toLowerCase().includes(q) ||
        (user.currentLandlord?.name || '').toLowerCase().includes(q) ||
        (user.trade || '').toLowerCase().includes(q) ||
        (user.accreditationId || '').toLowerCase().includes(q) ||
        (user.plan || '').toLowerCase().includes(q)
      )
    })
  }, [activeCategory, debouncedQuery, users])

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
    flash(`${removeTarget.name} removed from the platform.`)
    setRemoveTarget(null)
  }

  const searchPlaceholder =
    activeCategory === 'landlord'
      ? 'Search landlords by name, company, email…'
      : activeCategory === 'tenant'
        ? 'Search tenants by name, property, landlord…'
        : 'Search contractors by trade, company, accreditation…'

  return (
    <div className="space-y-6">
      {/* Dynamic Role-Specific Stat Boxes (3 clean cards per role) */}
      {activeCategory === 'landlord' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Landlords</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">348</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Registered Landlord Accounts</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Managed Properties</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Home className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">1,420</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">3,850 Residential Units</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Subscriptions</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">324</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Portfolio & Pro Tier Landlords</p>
          </div>
        </div>
      )}

      {activeCategory === 'tenant' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tenants</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Users2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">2,180</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Registered Tenant Profiles</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Leases</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Home className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">1,894</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Currently Housed on Leases</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Protected Deposits</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">1,894</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Registered in DPS & TDS</p>
          </div>
        </div>
      )}

      {activeCategory === 'contractor' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Contractors</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">312</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Approved Trade Professionals</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Trades</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">18</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Gas, Electric, Plumbing & More</p>
          </div>

          <div className="admin-card p-4.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Jobs</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">4,820</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Dispatched Call-outs</p>
          </div>
        </div>
      )}

      {notice ? (
        <div className="rounded-xl border border-brand-100 bg-blue-50/80 px-4 py-3 text-xs font-bold text-brand-800 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
          <span>{notice}</span>
        </div>
      ) : null}

      {/* Clean Controls: Search and Role Tabs (No 'All Users', No jargon) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="admin-search-pill !pl-9.5 pr-3 py-1.5 text-xs w-full"
          />
        </div>

        <div className="segmented-track">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id)
                setQuery('')
              }}
              className={cn(
                'segmented-item cursor-pointer text-xs font-bold',
                activeCategory === cat.id ? 'segmented-item-active' : 'segmented-item-inactive'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clutter-Free Tailored Directory Tables */}
      <div className="admin-table-wrap">
        <table className="min-w-full text-left">
          {/* LANDLORDS TABLE */}
          {activeCategory === 'landlord' && (
            <>
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Landlord</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Active Tenants</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Subscription</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs font-semibold text-slate-800">
                          {user.propertyCount ?? 0} Properties
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {user.unitCount ?? ((user.propertyCount ?? 1) * 2)} Total Units
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {user.activeTenantsCount ?? 4} Housed
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {user.plan || 'Starter'}
                          </span>
                          {user.mrr !== undefined && user.mrr > 0 && (
                            <span className="text-xs font-semibold text-slate-500">
                              {formatMoney(user.mrr)}/mo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge tone={statusTone(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBan(user)
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title={user.status === 'banned' ? 'Unban' : 'Ban'}
                          >
                            {user.status === 'banned' ? (
                              <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRemoveTarget(user)
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-400">
                      No landlords match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}

          {/* TENANTS TABLE */}
          {activeCategory === 'tenant' && (
            <>
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tenant</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Current Property</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Landlord</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Deposit Protection</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Right to Rent</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs font-medium text-slate-800">
                          {user.currentProperty || 'Relocating'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {user.currentLandlord?.name || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                        {user.depositScheme || 'DPS Custodial'}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.rightToRent === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-amber-600">Pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge tone={statusTone(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBan(user)
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title={user.status === 'banned' ? 'Unban' : 'Ban'}
                          >
                            {user.status === 'banned' ? (
                              <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRemoveTarget(user)
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm font-medium text-slate-400">
                      No tenants match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}

          {/* CONTRACTORS TABLE */}
          {activeCategory === 'contractor' && (
            <>
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contractor</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Trade</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Accreditation</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Landlords</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Rating</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                        {user.trade || 'General Maintenance'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                        {user.accreditationId || 'Verified #UK-4412'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {user.assignedLandlordsCount ?? 4} Landlords
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        ★ {user.rating ?? 4.9} <span className="text-slate-400">({user.jobsCompleted ?? 24} jobs)</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge tone={statusTone(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBan(user)
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title={user.status === 'banned' ? 'Unban' : 'Ban'}
                          >
                            {user.status === 'banned' ? (
                              <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRemoveTarget(user)
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm font-medium text-slate-400">
                      No contractors match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
      </div>

      {/* User Details Modal (Clean, professional, zero jargon) */}
      <Modal
        open={!!selectedUser}
        title={
          selectedUser
            ? selectedUser.role === 'tenant'
              ? 'Tenant Profile & History'
              : selectedUser.role === 'landlord'
                ? 'Landlord Account Details'
                : 'Contractor Profile'
            : ''
        }
        onClose={() => setSelectedUser(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setSelectedUser(null)}>
              Close
            </Button>
            {selectedUser && (
              <Button
                fullWidth
                className="!bg-brand-600 hover:!bg-brand-700"
                onClick={() => {
                  flash(`Updated details for ${selectedUser.name}.`)
                  setSelectedUser(null)
                }}
              >
                Save
              </Button>
            )}
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <Avatar name={selectedUser.name} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{selectedUser.name}</p>
                <p className="text-slate-500">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: #{selectedUser.id}
                  </span>
                  <span className="text-[10px] text-slate-400">· Joined {selectedUser.joined}</span>
                </div>
              </div>
            </div>

            {/* TENANT DETAILS */}
            {selectedUser.role === 'tenant' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Current Tenancy</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Property:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.currentProperty || 'Relocating'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Landlord:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.currentLandlord?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Deposit Scheme:</span>
                    <span className="font-mono text-slate-700">{selectedUser.depositScheme || 'DPS Custodial'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Right to Rent:</span>
                    <span className="font-semibold text-emerald-600">Verified</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Rental History</p>
                  <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1">
                    <p className="font-semibold text-slate-700">Previous: 22 Kensington Gardens, London W8</p>
                    <p className="text-slate-500">Landlord: Aura Residential UK · Tenancy ended 2024</p>
                    <p className="text-emerald-700 font-medium">✓ Full deposit returned · Clear ledger</p>
                  </div>
                </div>
              </div>
            )}

            {/* LANDLORD DETAILS */}
            {selectedUser.role === 'landlord' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Portfolio & Subscription</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Subscription Plan:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.plan || 'Pro'} Plan</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Properties:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.propertyCount ?? 2}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Total Units:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.unitCount ?? 4}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Active Tenants:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.activeTenantsCount ?? 3}</span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTRACTOR DETAILS */}
            {selectedUser.role === 'contractor' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Trade & Certification</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Trade:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.trade || 'Heating Engineer'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Accreditation:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedUser.accreditationId || 'Gas Safe #559102'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Serviced Landlords:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.assignedLandlordsCount ?? 4} Landlords</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Completed Jobs:</span>
                    <span className="font-semibold text-emerald-600">{selectedUser.jobsCompleted ?? 30} Jobs ({selectedUser.rating ?? 4.9} ★)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        open={!!removeTarget}
        title="Remove user account?"
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
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-slate-900">{removeTarget.name}</span> ({removeTarget.email})?
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
