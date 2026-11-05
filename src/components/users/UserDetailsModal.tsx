import { Building2, Calendar, CheckCircle2, Home, Loader2, Users, Wrench } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/shared/Avatar'
import { useGetUserFullDetailsQuery } from '@/services/endpoints/usersApi'

interface UserDetailsModalProps {
  userId: string | null
  onClose: () => void
}

export function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
  const { data: response, isLoading, isError } = useGetUserFullDetailsQuery(userId!, {
    skip: !userId,
  })

  const details = response?.data
  const landlord = details?.landlord

  return (
    <Modal
      open={Boolean(userId)}
      title="Landlord Profile & Portfolio"
      onClose={onClose}
      footer={
        <Button variant="secondary" fullWidth onClick={onClose}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
          <p className="text-xs font-medium">Loading landlord details...</p>
        </div>
      ) : isError || !landlord ? (
        <div className="p-6 text-center text-xs text-red-500">
          Failed to load landlord full details.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header Card */}
          <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <Avatar name={landlord.name} src={landlord.profileImage} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 truncate">{landlord.name}</h4>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 border border-blue-100">
                  {landlord.displayId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{landlord.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {landlord.statusBadge || 'Active Landlord'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Joined {landlord.joinedDate || new Date(landlord.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Portfolio Statistics</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-2xs">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-brand-600 mb-1.5">
                  <Building2 className="h-4 w-4" />
                </div>
                <p className="text-base font-extrabold text-slate-900">{landlord.stats?.managedProperties ?? 0}</p>
                <p className="text-[10px] font-medium text-slate-400">Properties</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-2xs">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-1.5">
                  <Home className="h-4 w-4" />
                </div>
                <p className="text-base font-extrabold text-slate-900">{landlord.stats?.rentalUnits ?? 0}</p>
                <p className="text-[10px] font-medium text-slate-400">Rental Units</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-2xs">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-1.5">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-base font-extrabold text-slate-900">{landlord.stats?.activeTenants ?? 0}</p>
                <p className="text-[10px] font-medium text-slate-400">Active Tenants</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-2xs">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-1.5">
                  <Wrench className="h-4 w-4" />
                </div>
                <p className="text-base font-extrabold text-slate-900">{landlord.stats?.assignedContractors ?? 0}</p>
                <p className="text-[10px] font-medium text-slate-400">Contractors</p>
              </div>
            </div>
          </div>

          {/* Subscription Tier */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Subscription Tier</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {landlord.plan ? landlord.plan.packageName : 'Free / Starter Tier'}
              </p>
            </div>
            {landlord.plan && (
              <span className="text-xs font-bold text-brand-600">
                {landlord.plan.formattedPrice} ({landlord.plan.billingCadence})
              </span>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

