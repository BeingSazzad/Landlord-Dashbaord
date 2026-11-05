import { useCallback, useMemo, useState } from 'react'
import {
  Ban,
  CheckCircle,
  Eye,
  Loader2,
  Trash2,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react'
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from '@/services/endpoints/usersApi'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { DataTable } from '@/components/shared/DataTable'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { UserDetailsModal } from './UserDetailsModal'
import type { BackendUser } from '@/types/api.types'
import { useDebounce } from '@/hooks/useDebounce'

const FILTERS = ['all', 'landlord', 'tenant', 'contractor'] as const

interface UserTableRow extends BackendUser {
  id: string
}

export function UsersTable() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [removeTarget, setRemoveTarget] = useState<BackendUser | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const debouncedQuery = useDebounce(query, 250)

  // Fetch users from backend with search and role params
  const {
    data: usersResponse,
    isLoading,
    isFetching,
  } = useGetUsersQuery({
    search: debouncedQuery || undefined,
    role: filter !== 'all' ? filter : undefined,
  })

  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()

  const rawUsers = usersResponse?.data || []

  // Ensure each row has `id` for DataTable compatibility
  const rows: UserTableRow[] = useMemo(() => {
    return rawUsers.map((u) => ({
      ...u,
      id: u._id,
    }))
  }, [rawUsers])

  const flash = useCallback((msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }, [])

  // Toggle user status: active <-> inactive
  const handleToggleStatus = useCallback(
    async (user: BackendUser) => {
      const nextStatus = user.status === 'active' ? 'inactive' : 'active'
      try {
        await updateUserStatus({ id: user._id, status: nextStatus }).unwrap()
        flash(`User ${user.name} is now ${nextStatus}.`)
      } catch {
        flash('Failed to update user status. Please check your connection.')
      }
    },
    [updateUserStatus, flash],
  )

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'User',
        render: (user: UserTableRow) => (
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.profileImage} size="sm" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
              <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Role',
        render: (user: UserTableRow) => {
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
        key: 'portfolio',
        header: 'Portfolio',
        render: (user: UserTableRow) =>
          user.role === 'landlord' ? (
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {user.portfolio?.formattedPortfolio || `${user.portfolio?.propertiesCount ?? 0} Properties`}
              </p>
              {user.portfolio?.formattedUnits && (
                <p className="text-[11px] text-slate-400 font-medium">{user.portfolio.formattedUnits}</p>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (user: UserTableRow) => {
          if (user.status === 'active') {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            )
          }
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {user.status || 'Inactive'}
            </span>
          )
        },
      },
      {
        key: 'plan',
        header: 'Subscription',
        render: (user: UserTableRow) => {
          if (user.role !== 'landlord') {
            return <span className="text-xs text-slate-400">Not applicable</span>
          }
          if (!user.plan) {
            return <span className="text-xs text-slate-400">Free / No plan</span>
          }
          return (
            <div>
              <p className="text-slate-800 font-semibold text-xs">{user.plan.packageName}</p>
              <p className="text-[11px] text-slate-400 font-medium">{user.plan.formattedPrice}</p>
            </div>
          )
        },
      },
      {
        key: 'joined',
        header: 'Joined',
        render: (user: UserTableRow) => (
          <span className="text-xs text-slate-500">
            {new Date(user.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (user: UserTableRow) => (
          <div className="flex flex-wrap items-center gap-1.5">
            {/* View Details */}
            <Button
              variant="secondary"
              className="!px-2.5 !py-1.5 !text-xs font-semibold inline-flex items-center gap-1"
              onClick={() => setSelectedUserId(user._id)}
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              Details
            </Button>

            {/* Toggle Status (Active / Inactive) */}
            <Button
              variant="secondary"
              className={cn(
                '!px-2.5 !py-1.5 !text-xs font-semibold inline-flex items-center gap-1',
                user.status === 'active'
                  ? '!text-amber-700 hover:!bg-amber-50'
                  : '!text-emerald-700 hover:!bg-emerald-50',
              )}
              onClick={() => handleToggleStatus(user)}
              disabled={isUpdatingStatus}
            >
              {user.status === 'active' ? (
                <>
                  <Ban className="h-3.5 w-3.5" /> Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> Activate
                </>
              )}
            </Button>

            {/* Remove */}
            <Button
              variant="ghost"
              className="!px-2 !py-1.5 !text-xs !text-red-600 hover:!bg-red-50 font-semibold"
              onClick={() => setRemoveTarget(user)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [handleToggleStatus, isUpdatingStatus],
  )

  // Dynamic stat counts
  const totalCount = usersResponse?.meta?.total ?? rawUsers.length
  const landlordCount = rawUsers.filter((u) => u.role === 'landlord').length
  const tenantCount = rawUsers.filter((u) => u.role === 'tenant').length
  const contractorCount = rawUsers.filter((u) => u.role === 'contractor').length

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800 animate-fade-in">
          {notice}
        </div>
      )}

      {/* Top 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Directory"
          value={isLoading ? '...' : String(totalCount)}
          icon={Users}
          iconVariant="blue"
        />
        <StatCard
          label="Landlords"
          value={isLoading ? '...' : String(landlordCount)}
          icon={UserCheck}
          iconVariant="indigo"
        />
        <StatCard
          label="Tenants"
          value={isLoading ? '...' : String(tenantCount)}
          icon={Users}
          iconVariant="emerald"
        />
        <StatCard
          label="Contractors"
          value={isLoading ? '...' : String(contractorCount)}
          icon={Wrench}
          iconVariant="amber"
        />
      </div>

      {/* Control Bar: Search on Left, Segmented Track on Right */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          {/* <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or plan…"
            className="admin-input w-full pl-9.5 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin text-brand-600" /> Syncing
            </span>
          )}

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
      </div>

      {isLoading ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
          <p className="text-sm font-medium">Loading user directory from server...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={rows} emptyMessage="No users match your filters." />
      )}

      {/* Landlord Full Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />

      {/* Remove Confirmation Modal */}
      <ConfirmDeleteModal
        open={Boolean(removeTarget)}
        title="Remove user?"
        confirmText="Remove"
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) {
            flash(`${removeTarget.name} removed from view.`)
            setRemoveTarget(null)
          }
        }}
      >
        {removeTarget && (
          <p>
            Are you sure you want to remove{' '}
            <strong className="font-semibold text-slate-900">{removeTarget.name}</strong> ({removeTarget.email})?
          </p>
        )}
      </ConfirmDeleteModal>
    </div>
  )
}
