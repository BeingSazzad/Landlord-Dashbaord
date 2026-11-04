import { useState } from 'react'
import {
  Check,
  Edit2,
  Layers,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from '@/services/endpoints/packagesApi'
import { cn, formatMoney } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { PackageItem } from '@/types/api.types'

export function SubscriptionsPanel() {
  const { data: response, isLoading, isFetching } = useGetPackagesQuery()
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation()
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation()
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PackageItem | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [monthlyPrice, setMonthlyPrice] = useState<number | string>(29)
  const [yearlyPrice, setYearlyPrice] = useState<number | string>(290)
  const [maxProperties, setMaxProperties] = useState<number | string>(3)
  const [maxFlats, setMaxFlats] = useState<number | string>(15)
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')

  const rawPackages = response?.data || []

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3500)
  }

  const openCreateModal = () => {
    setEditingPackage(null)
    setName('')
    setDescription('')
    setMonthlyPrice(29)
    setYearlyPrice(290)
    setMaxProperties(3)
    setMaxFlats(15)
    setFeatures([
      '10-day free trial',
      'Up to 3 properties',
      'Up to 15 flats',
      'Core features included',
    ])
    setFeatureInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (pkg: PackageItem) => {
    setEditingPackage(pkg)
    setName(pkg.name)
    setDescription(pkg.description || '')
    setMonthlyPrice(pkg.monthlyPrice)
    setYearlyPrice(pkg.yearlyPrice)
    setMaxProperties(pkg.maxProperties)
    setMaxFlats(pkg.maxFlats)
    setFeatures(pkg.features || [])
    setFeatureInput('')
    setIsModalOpen(true)
  }

  const handleAddFeature = () => {
    const trimmed = featureInput.trim()
    if (!trimmed) return
    if (!features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed])
    }
    setFeatureInput('')
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSavePackage = async () => {
    if (!name.trim()) {
      flash('Package name is required.')
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      monthlyPrice: Number(monthlyPrice) || 0,
      yearlyPrice: Number(yearlyPrice) || 0,
      maxProperties: Number(maxProperties) || 0,
      maxFlats: Number(maxFlats) || 0,
      features,
    }

    try {
      if (editingPackage) {
        await updatePackage({ id: editingPackage._id, body: payload }).unwrap()
        flash(`Package "${name}" updated successfully.`)
      } else {
        await createPackage(payload).unwrap()
        flash(`Package "${name}" created successfully.`)
      }
      setIsModalOpen(false)
    } catch {
      flash('Failed to save package. Please check your network connection.')
    }
  }

  const handleDeletePackage = async () => {
    if (!deleteTarget) return
    try {
      await deletePackage(deleteTarget._id).unwrap()
      flash(`Package "${deleteTarget.name}" deleted successfully.`)
      setDeleteTarget(null)
    } catch {
      flash('Failed to delete package. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800 animate-fade-in">
          {notice}
        </div>
      )}

      {/* Control / Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-brand-600">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Subscription Tiers</h3>
            <p className="text-xs text-slate-400 font-medium">
              {rawPackages.length} {rawPackages.length === 1 ? 'package available' : 'packages available'}
            </p>
          </div>
          {isFetching && !isLoading && (
            <span className="ml-3 flex items-center gap-1 text-xs text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin text-brand-600" /> Syncing
            </span>
          )}
        </div>

        <Button onClick={openCreateModal} className="inline-flex items-center gap-1.5 font-bold">
          <Plus className="h-4 w-4" /> Add Package
        </Button>
      </div>

      {/* Package Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="admin-card p-6 animate-pulse space-y-4">
              <div className="h-6 w-1/3 bg-slate-200 rounded-md" />
              <div className="h-4 w-2/3 bg-slate-100 rounded-md" />
              <div className="h-10 w-1/2 bg-slate-200 rounded-md" />
              <div className="h-16 bg-slate-100 rounded-xl" />
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : rawPackages.length === 0 ? (
        <div className="admin-card border-dashed p-12 text-center text-sm text-slate-500">
          No packages configured. Click &quot;Add Package&quot; above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rawPackages.map((pkg) => (
            <div
              key={pkg._id}
              className={cn(
                'admin-card relative flex flex-col justify-between p-6 transition-all duration-200 hover:shadow-md hover:border-slate-300/90',
                pkg.isPopular && 'border-brand-500 ring-2 ring-brand-500/10 shadow-sm'
              )}
            >
              <div>
                {/* Top Header: Name, Badges & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                        {pkg.name}
                      </h4>
                      {pkg.isPopular && (
                        <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
                          Popular
                        </span>
                      )}
                      {pkg.hasTrial && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-blue-100">
                          {pkg.trialDays ? `${pkg.trialDays}-Day Trial` : 'Trial'}
                        </span>
                      )}
                    </div>
                    {pkg.description && (
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border shrink-0',
                      pkg.isActive !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        pkg.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'
                      )}
                    />
                    {pkg.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {formatMoney(pkg.monthlyPrice)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/ month</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Billed annually at{' '}
                    <span className="font-bold text-slate-800">{formatMoney(pkg.yearlyPrice)}</span> / year
                  </p>
                </div>

                {/* Limitations Box */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 p-3 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Properties
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Up to {pkg.maxProperties}
                    </p>
                  </div>
                  <div className="border-l border-slate-200/70">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Flats / Units
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      Up to {pkg.maxFlats}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4.5 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-2">
                    {pkg.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Button
                  variant="secondary"
                  fullWidth
                  className="!py-2 !text-xs font-bold inline-flex items-center justify-center gap-1.5"
                  onClick={() => openEditModal(pkg)}
                >
                  <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  Edit Package
                </Button>
                <Button
                  variant="ghost"
                  className="!py-2 !px-3 !text-red-600 hover:!bg-red-50 font-bold"
                  onClick={() => setDeleteTarget(pkg)}
                  aria-label="Delete package"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Package Modal */}
      <Modal
        open={isModalOpen}
        title={editingPackage ? `Edit ${editingPackage.name}` : 'Create Subscription Package'}
        onClose={() => setIsModalOpen(false)}
        className="max-w-xl"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleSavePackage}
              loading={isCreating || isUpdating}
              className="!bg-brand-600 hover:!bg-brand-700 font-bold"
            >
              {editingPackage ? 'Save Changes' : 'Create Package'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1">
          <Input
            label="Package Name"
            placeholder="e.g. Starter Plus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-y min-h-[75px]"
              placeholder="A special package for 3 properties and 15 flats"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Monthly Price (£)"
              type="number"
              placeholder="29"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              required
            />
            <Input
              label="Yearly Price (£)"
              type="number"
              placeholder="290"
              value={yearlyPrice}
              onChange={(e) => setYearlyPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Properties"
              type="number"
              placeholder="3"
              value={maxProperties}
              onChange={(e) => setMaxProperties(e.target.value)}
              required
            />
            <Input
              label="Max Flats / Units"
              type="number"
              placeholder="15"
              value={maxFlats}
              onChange={(e) => setMaxFlats(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Features List */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Features Included
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="e.g. 10-day free trial"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddFeature()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddFeature}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg border border-slate-100 bg-slate-50/70">
              {features.length === 0 ? (
                <p className="text-xs text-slate-400 py-1">No features added yet.</p>
              ) : (
                features.map((feat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-1 text-xs text-slate-700 shadow-2xs"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title="Delete Package Plan?"
        confirmText="Delete Permanently"
        loading={isDeleting}
        onConfirm={handleDeletePackage}
        onClose={() => setDeleteTarget(null)}
      >
        {deleteTarget && (
          <p>
            Are you sure you want to delete{' '}
            <strong className="font-semibold text-slate-900">{deleteTarget.name}</strong>? Landlords
            on this tier will need to be reassigned.
          </p>
        )}
      </ConfirmDeleteModal>
    </div>
  )
}
