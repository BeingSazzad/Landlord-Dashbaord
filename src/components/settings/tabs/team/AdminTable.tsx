import { Trash2 } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import { cn } from '@/lib/utils'
import type { AdminItem } from '@/types/api.types'

interface AdminTableProps {
  admins: AdminItem[]
  currentUserId?: string
  currentUserEmail?: string
  isUpdatingStatus: boolean
  onToggleStatus: (admin: AdminItem) => void
  onDeleteClick: (admin: AdminItem) => void
}

export function AdminTable({
  admins,
  currentUserId,
  currentUserEmail,
  isUpdatingStatus,
  onToggleStatus,
  onDeleteClick,
}: AdminTableProps) {
  if (admins.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-100">
        No administrators found. Click &quot;+ Add Admin&quot; to create an admin account.
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="min-w-full text-left">
        <thead>
          <tr>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ADMIN</th>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">EMAIL</th>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ROLE</th>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">STATUS</th>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">JOINED</th>
            <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {admins.map((admin) => {
            const isCurrentUser =
              admin._id === currentUserId ||
              (Boolean(currentUserEmail) &&
                admin.email.toLowerCase() === currentUserEmail?.toLowerCase())

            const isActive = admin.status === 'active'

            return (
              <tr key={admin._id} className="hover:bg-slate-50/60 transition">
                {/* ADMIN */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={admin.name} src={admin.profileImage} size="sm" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{admin.name}</span>
                      {isCurrentUser && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200/60">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="py-3.5 px-4 text-xs font-medium text-slate-600 font-mono">
                  {admin.email}
                </td>

                {/* ROLE */}
                <td className="py-3.5 px-4">
                  {admin.role === 'super_admin' ? (
                    <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white shadow-xs">
                      SUPER ADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-brand-700">
                      ADMIN
                    </span>
                  )}
                </td>

                {/* STATUS */}
                <td className="py-3.5 px-4">
                  {isActive ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                      INACTIVE
                    </span>
                  )}
                </td>

                {/* JOINED */}
                <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>

                {/* ACTION */}
                <td className="py-3.5 px-4 text-right">
                  {!isCurrentUser ? (
                    <div className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(admin)}
                        disabled={isUpdatingStatus}
                        className={cn(
                          'text-xs font-bold transition hover:underline cursor-pointer',
                          isActive
                            ? 'text-amber-600 hover:text-amber-700'
                            : 'text-brand-600 hover:text-brand-700'
                        )}
                      >
                        {isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(admin)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        title="Delete Admin"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 font-medium">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

