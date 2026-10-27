import { useMemo, useState } from 'react'
import {
  ArrowRightLeft,
  Ban,
  Building2,
  CheckCircle2,
  Eye,
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

const FILTERS = ['all', 'landlord', 'tenant', 'contractor'] as const

export function UsersTable() {
  const [users, setUsers] = useState<PlatformUser[]>(() => [...MOCK_USERS])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
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
        (user.currentProperty || '').toLowerCase().includes(q) ||
        (user.currentLandlord?.name || '').toLowerCase().includes(q) ||
        (user.trade || '').toLowerCase().includes(q) ||
        (user.plan || '').toLowerCase().includes(q)
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
    flash(`${removeTarget.name} removed from the platform.`)
    setRemoveTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* 10-Year SaaS Architecture KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Directory */}
        <div className="admin-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Directory</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">2,840</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">348 Landlords · 2,180 Tenants · 312 Trades</p>
        </div>

        {/* Metric 2: B2B Landlord Accounts */}
        <div className="admin-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">B2B Landlords (Paying)</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">348 Accounts</p>
          <p className="mt-1 text-xs text-emerald-600 font-bold">£8,450 MRR <span className="font-medium text-slate-400">· Core Paying Customers</span></p>
        </div>

        {/* Metric 3: Active Tenancies */}
        <div className="admin-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Tenancies</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-600 border border-blue-100">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">1,894 Leases</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">DPS & TDS Protected Custodial Deposits</p>
        </div>

        {/* Metric 4: Portable Tenant Accounts */}
        <div className="admin-card p-4.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Portable Tenant Passports</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">286 In-Transit</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Tenants moving between landlords with persistent records</p>
        </div>
      </div>

      {notice ? (
        <div className="rounded-xl border border-brand-100 bg-blue-50/80 px-4 py-3 text-xs font-bold text-brand-800 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
          <span>{notice}</span>
        </div>
      ) : null}

      {/* Controls: Search and Segmented Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user, landlord, property, or trade…"
            className="admin-search-pill !pl-9.5 pr-3 py-1.5 text-xs w-full"
          />
        </div>

        <div className="segmented-track">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'segmented-item capitalize cursor-pointer text-xs font-bold',
                filter === f ? 'segmented-item-active' : 'segmented-item-inactive'
              )}
            >
              {f === 'all'
                ? 'All Users'
                : f === 'landlord'
                  ? 'Landlords (B2B)'
                  : f === 'tenant'
                    ? 'Tenants (Portable)'
                    : 'Contractors'}
            </button>
          ))}
        </div>
      </div>

      {/* Rich Multi-Tenant User Directory Table */}
      <div className="admin-table-wrap">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">USER</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ROLE ARCHITECTURE</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">PROPERTY & LANDLORD LINK</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">COMPLIANCE / PLAN</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ACCOUNT STATUS</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length > 0 ? (
              rows.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-slate-50/70 transition cursor-pointer"
                >
                  {/* User Column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 hover:text-brand-600 transition">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Architecture Badge */}
                  <td className="py-3.5 px-4">
                    {user.role === 'landlord' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                        <Building2 className="h-3 w-3" />
                        Landlord (B2B SaaS)
                      </span>
                    )}
                    {user.role === 'tenant' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <Home className="h-3 w-3" />
                        Tenant Passport
                      </span>
                    )}
                    {user.role === 'contractor' && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                        <Wrench className="h-3 w-3" />
                        Certified Contractor
                      </span>
                    )}
                  </td>

                  {/* Contextual Relationship Link */}
                  <td className="py-3.5 px-4">
                    {user.role === 'tenant' ? (
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user.currentProperty || 'Relocating / Moving'}</p>
                        <p className="text-[11px] text-slate-500">
                          {user.currentLandlord ? (
                            <>Landlord: <span className="font-semibold text-brand-600">{user.currentLandlord.name}</span></>
                          ) : (
                            <span className="text-amber-600 font-medium">In-Transit between Landlords</span>
                          )}
                        </p>
                      </div>
                    ) : user.role === 'landlord' ? (
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {user.propertyCount ?? 0} Properties · {user.unitCount ?? ((user.propertyCount ?? 1) * 2)} Units
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {user.activeTenantsCount ?? 4} Housed Active Tenants
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user.trade || 'General Maintenance'}</p>
                        <p className="text-[11px] text-slate-500">
                          Servicing <span className="font-semibold text-slate-700">{user.assignedLandlordsCount ?? 4} Landlords</span>
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Compliance / Subscription Plan */}
                  <td className="py-3.5 px-4">
                    {user.role === 'landlord' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          {user.plan || 'Starter'} Plan
                        </span>
                        {user.mrr !== undefined && user.mrr > 0 && (
                          <span className="text-xs font-extrabold text-emerald-600">
                            {formatMoney(user.mrr)}/mo
                          </span>
                        )}
                      </div>
                    ) : user.role === 'tenant' ? (
                      <div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                          {user.rightToRent === 'Verified' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <ShieldCheck className="h-3.5 w-3.5" /> Right to Rent OK
                            </span>
                          ) : (
                            <span className="text-amber-600 text-[11px]">Right to Rent Pending</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {user.depositScheme || 'DPS Custodial Verified'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          <FileCheck2 className="h-3 w-3 text-emerald-600" />
                          {user.accreditationId || 'Gas Safe #559102'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {user.jobsCompleted ?? 24} jobs · {user.rating ?? 4.9} ★
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Lifecycle Status */}
                  <td className="py-3.5 px-4">
                    {user.tenancyStatus === 'In-Transit' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                        <ArrowRightLeft className="h-3 w-3 text-brand-600 animate-pulse" />
                        IN-TRANSIT
                      </span>
                    ) : user.tenancyStatus === 'Notice Served' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        NOTICE SERVED
                      </span>
                    ) : (
                      <Badge tone={statusTone(user.status)}>{user.status}</Badge>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedUser(user)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        title="View Full Relationship Profile"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBan(user)
                        }}
                        disabled={user.status === 'pending'}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title={user.status === 'banned' ? 'Unban user' : 'Ban user'}
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
                        title="Remove user"
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
                  No platform users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Universal Account Relationship Profile Modal */}
      <Modal
        open={!!selectedUser}
        title={
          selectedUser
            ? selectedUser.role === 'tenant'
              ? 'Tenant Universal Passport & History'
              : selectedUser.role === 'landlord'
                ? 'Landlord Portfolio & SaaS Subscription'
                : 'Contractor Trade & Landlord Network'
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
                  flash(`Updated compliance record for ${selectedUser.name}.`)
                  setSelectedUser(null)
                }}
              >
                Save Audit Note
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
                    ID: {selectedUser.role.toUpperCase()}-UK-00{selectedUser.id}
                  </span>
                  <span className="text-[10px] text-slate-400">· Joined {selectedUser.joined}</span>
                </div>
              </div>
            </div>

            {/* TENANT UNIVERSAL ACCOUNT MODEL */}
            {selectedUser.role === 'tenant' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                  <p className="font-bold text-brand-900">Universal Tenant Passport</p>
                  <p className="text-[11px] text-brand-700 mt-0.5 leading-relaxed">
                    Tenant accounts persist independently of landlords. Right-to-Rent checks, credit history, and deposit references stay attached to the tenant when moving between properties.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Current Active Lease</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Property:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.currentProperty || 'In-Transit'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Current Landlord:</span>
                    <span className="font-semibold text-brand-600">{selectedUser.currentLandlord?.name || 'Searching'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Deposit Scheme:</span>
                    <span className="font-mono text-slate-700">{selectedUser.depositScheme || 'DPS Custodial'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Right to Rent:</span>
                    <span className="font-bold text-emerald-600">UK Statutory Verified</span>
                  </div>
                </div>

                {/* Persistent Tenancy Mobility History */}
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Tenancy History (Persistent)</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {(selectedUser.pastTenanciesCount ?? 1) + 1} Total Leases
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1">
                    <p className="font-bold text-slate-700">Previous: 22 Kensington Gardens, London W8</p>
                    <p className="text-slate-500">Landlord: Aura Residential UK · Lease ended 2024</p>
                    <p className="text-emerald-700 font-medium">✓ Full deposit returned · Zero dispute records</p>
                  </div>
                </div>
              </div>
            )}

            {/* LANDLORD B2B MODEL */}
            {selectedUser.role === 'landlord' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">SaaS Subscription Tier</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Subscribed Tier:</span>
                    <span className="font-bold text-brand-600">{selectedUser.plan || 'Pro'} Plan</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Monthly Contribution:</span>
                    <span className="font-bold text-emerald-600">{formatMoney(selectedUser.mrr || 19)}/mo</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Portfolio Size:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.propertyCount ?? 2} Properties ({selectedUser.unitCount ?? 4} Units)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Housed Tenants:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.activeTenantsCount ?? 3} Active ASTs</span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTRACTOR TRADE MODEL */}
            {selectedUser.role === 'contractor' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200/80 p-3.5 space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Accreditation & Landlord Network</p>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Trade:</span>
                    <span className="font-semibold text-slate-800">{selectedUser.trade || 'Heating Engineer'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Licence ID:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedUser.accreditationId || 'Gas Safe #559102'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Serviced Landlords:</span>
                    <span className="font-semibold text-brand-600">{selectedUser.assignedLandlordsCount ?? 4} Landlord Portfolios</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Completed Call-outs:</span>
                    <span className="font-semibold text-emerald-600">{selectedUser.jobsCompleted ?? 30} Jobs ({selectedUser.rating ?? 4.9} ★ rating)</span>
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
            Are you sure you want to remove <span className="font-bold text-slate-900">{removeTarget.name}</span> ({removeTarget.email})? In production, this archives tenancy records in compliance with UK GDPR Article 17.
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
