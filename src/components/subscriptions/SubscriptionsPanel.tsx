import { useMemo, useState } from 'react'
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
import { formatMoney } from '@/lib/utils'
import { DataTable } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import type { PackageItem } from '@/types/api.types'

interface PackageRow extends PackageItem {
  id: string
}

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

  // Ensure each item has `id` for DataTable compatibility
  const rows: PackageRow[] = useMemo(() => {
    return rawPackages.map((p) => ({
      ...p,
      id: p._id,
    }))
  }, [rawPackages])

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

  const columns = [
    {
      key: 'name',
      header: 'Package Plan',
      render: (p: PackageRow) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">{p.name}</span>
            {p.hasTrial && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-blue-100">
                {p.trialDays ? `${p.trialDays}-day Trial` : 'Trial'}
              </span>
            )}
            {p.isPopular && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                Popular
              </span>
            )}
          </div>
          {p.description && (
            <p className="mt-0.5 text-xs text-slate-500 max-w-sm line-clamp-1">{p.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Pricing',
      render: (p: PackageRow) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">{formatMoney(p.monthlyPrice)} /mo</p>
          <p className="text-[11px] text-slate-400 font-medium">{formatMoney(p.yearlyPrice)} /yr</p>
        </div>
      ),
    },
    {
      key: 'limits',
      header: 'Portfolio Limits',
      render: (p: PackageRow) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">
            {p.maxProperties} {p.maxProperties === 1 ? 'Property' : 'Properties'}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">
            Up to {p.maxFlats} {p.maxFlats === 1 ? 'Flat' : 'Flats'}
          </p>
        </div>
      ),
    },
    {
      key: 'features',
      header: 'Features',
      render: (p: PackageRow) => (
        <div className="max-w-xs space-y-1">
          {p.features?.slice(0, 2).map((feat, idx) => (
            <p key={idx} className="text-xs text-slate-600 truncate flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>{feat}</span>
            </p>
          ))}
          {p.features?.length > 2 && (
            <span className="text-[10px] font-semibold text-brand-600">
              +{p.features.length - 2} more features
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: PackageRow) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
            p.isActive !== false
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              p.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          {p.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p: PackageRow) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            className="!px-2.5 !py-1.5 !text-xs font-semibold inline-flex items-center gap-1"
            onClick={() => openEditModal(p)}
          >
            <Edit2 className="h-3 w-3 text-slate-500" />
            Edit
          </Button>

          <Button
            variant="ghost"
            className="!px-2 !py-1.5 !text-xs !text-red-600 hover:!bg-red-50 font-semibold"
            onClick={() => setDeleteTarget(p)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

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
              {rows.length} {rows.length === 1 ? 'package configured' : 'packages configured'}
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

      {isLoading ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
          <p className="text-sm font-medium">Loading subscription packages...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          emptyMessage="No packages configured. Click 'Add Package' to create one."
        />
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
      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Package Plan?"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-red-600 hover:!bg-red-700 font-bold"
              loading={isDeleting}
              onClick={handleDeletePackage}
            >
              Delete Permanently
            </Button>
          </div>
        }
      >
        {deleteTarget && (
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteTarget.name}</span>? Landlords on this tier will need to be reassigned.
          </p>
        )}
      </Modal>
    </div>
  )
}
