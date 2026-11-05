import { useMemo, useState } from 'react'
import { Loader2, Plus,  } from 'lucide-react'
import {
  useGetAdminsQuery,
  useUpdateAdminStatusMutation,
} from '@/services/endpoints/usersApi'
import { useAppSelector } from '@/store/hooks'
import type { AdminItem } from '@/types/api.types'
import { AddAdminModal } from './AddAdminModal'
import { AdminTable } from './AdminTable'
import { DeleteAdminModal } from './DeleteAdminModal'

interface AdminTeamTabProps {
  onFlash: (message: string) => void
}

export function AdminTeamTab({ onFlash }: AdminTeamTabProps) {
  const user = useAppSelector((s) => s.auth.user)

  // ─── RTK Query Hooks ──────────────────────────────────────────────────────
  const {
    data: adminsResponse,
    isLoading: isAdminsLoading,
    isFetching: isAdminsFetching,
  } = useGetAdminsQuery()
  const [updateAdminStatus, { isLoading: isUpdatingStatus }] = useUpdateAdminStatusMutation()

  // ─── Local States ─────────────────────────────────────────────────────────
  const [adminSearch, setAdminSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminItem | null>(null)

  // ─── Extract and Filter Admins ────────────────────────────────────────────
  const rawAdmins = adminsResponse?.data as any
  const adminsList: AdminItem[] = useMemo(() => {
    if (Array.isArray(rawAdmins)) return rawAdmins
    if (Array.isArray(rawAdmins?.data)) return rawAdmins.data
    return []
  }, [rawAdmins])

  const filteredAdmins = useMemo(() => {
    if (!adminSearch.trim()) return adminsList
    const q = adminSearch.toLowerCase()
    return adminsList.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    )
  }, [adminsList, adminSearch])

  // ─── Status Toggle ────────────────────────────────────────────────────────
  const handleToggleStatus = async (admin: AdminItem) => {
    const nextStatus = admin.status === 'active' ? 'inactive' : 'active'
    try {
      await updateAdminStatus({ id: admin._id, status: nextStatus }).unwrap()
      onFlash(`Admin status updated to "${nextStatus}".`)
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to update admin status.'
      onFlash(msg)
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Search bar and Add Admin Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          {/* <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            className="admin-input w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          {isAdminsFetching && (
            <span className="inline-flex items-center gap-1 text-[11px] text-brand-600 font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Table Content */}
      {isAdminsLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <span className="text-xs">Loading administrators...</span>
        </div>
      ) : (
        <AdminTable
          admins={filteredAdmins}
          currentUserId={user?._id}
          currentUserEmail={user?.email}
          isUpdatingStatus={isUpdatingStatus}
          onToggleStatus={handleToggleStatus}
          onDeleteClick={setDeleteTarget}
        />
      )}

      {/* Add Admin Modal */}
      <AddAdminModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFlash={onFlash}
      />

      {/* Delete Admin Modal */}
      <DeleteAdminModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onFlash={onFlash}
      />
    </div>
  )
}

