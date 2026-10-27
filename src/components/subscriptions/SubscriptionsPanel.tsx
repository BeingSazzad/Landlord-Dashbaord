import { useState } from 'react'
import {
  Check,
  Edit2,
  Plus,
  Sparkles,
  ShieldCheck,
  Layers,
  TrendingUp,
} from 'lucide-react'
import { MOCK_PLANS } from '@/lib/mockData'
import { formatMoney } from '@/lib/utils'
import { StatCard } from '@/components/dashboard/components/StatCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { SubscriptionPlan } from '@/types/api.types'

export function SubscriptionsPanel() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(MOCK_PLANS)
  const [showAddPlanModal, setShowAddPlanModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

  // Form states for Add / Edit
  const [formName, setFormName] = useState('')
  const [formPriceMonthly, setFormPriceMonthly] = useState<number>(0)
  const [formPriceYearly, setFormPriceYearly] = useState<number>(0)
  const [formFeatures, setFormFeatures] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const flash = (msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3000)
  }

  const openAddModal = () => {
    setFormName('')
    setFormPriceMonthly(29)
    setFormPriceYearly(290)
    setFormFeatures('Up to 10 properties, Priority landlord support, Automated CP12 reminders')
    setShowAddPlanModal(true)
  }

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormName(plan.name)
    setFormPriceMonthly(plan.priceMonthly)
    setFormPriceYearly(plan.priceYearly)
    setFormFeatures(plan.features.join(', '))
  }

  const handleSaveNewPlan = () => {
    if (!formName.trim()) return
    const newPlan: SubscriptionPlan = {
      id: Date.now(),
      name: formName.trim(),
      priceMonthly: Number(formPriceMonthly) || 0,
      priceYearly: Number(formPriceYearly) || 0,
      features: formFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      active: true,
      subscribers: 0,
    }
    setPlans((prev) => [...prev, newPlan])
    setShowAddPlanModal(false)
    flash(`Package "${newPlan.name}" has been created successfully.`)
  }

  const handleUpdatePlan = () => {
    if (!editingPlan || !formName.trim()) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: formName.trim(),
              priceMonthly: Number(formPriceMonthly) || 0,
              priceYearly: Number(formPriceYearly) || 0,
              features: formFeatures
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean),
            }
          : p
      )
    )
    setEditingPlan(null)
    flash(`Package "${formName.trim()}" has been updated.`)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs animate-fade-in flex items-center justify-between">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 3 Package Architectural Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Active Packages"
          value={`${plans.length} Tiers`}
          icon={Layers}
          iconVariant="blue"
        />

        <StatCard
          label="Most Popular Tier"
          value="Pro (£19/mo)"
          icon={Sparkles}
          iconVariant="emerald"
        />

        <StatCard
          label="Annual Billing Saving"
          value="Up to 20% Off"
          icon={TrendingUp}
          iconVariant="amber"
        />
      </div>

      {/* Packages Header & Action Bar */}
      <div className="admin-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100/80 pb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Subscription Packages & Pricing Architecture
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Configure landlord subscription tiers, property quotas, and feature entitlements.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-brand-700 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add New Package
          </button>
        </div>

        {/* Pricing Tiers Cards Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPro = plan.name.toLowerCase() === 'pro'
            const isPortfolio = plan.name.toLowerCase().includes('portfolio')

            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-2xl border bg-white p-6 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-xs hover:border-slate-300',
                  isPro
                    ? 'border-brand-300 ring-2 ring-brand-500/20 bg-gradient-to-b from-blue-50/20 to-white'
                    : 'border-slate-200/90'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                    {isPro ? (
                      <span className="rounded-full bg-blue-50 text-brand-700 border border-blue-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                        Most Popular
                      </span>
                    ) : isPortfolio ? (
                      <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                        High Scale
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                        Free Starter
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {plan.priceMonthly === 0 ? 'Free' : formatMoney(plan.priceMonthly)}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {plan.priceYearly === 0
                      ? 'No credit card required'
                      : `or ${formatMoney(plan.priceYearly)} billed annually`}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                      Included Entitlements
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs font-medium text-slate-700">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {plan.subscribers} registered landlord{plan.subscribers === 1 ? '' : 's'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditModal(plan)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                    Edit Package
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal: Add New Package */}
      <Modal
        open={showAddPlanModal}
        title="Add New Subscription Package"
        onClose={() => setShowAddPlanModal(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowAddPlanModal(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-brand-600 hover:!bg-brand-700"
              onClick={handleSaveNewPlan}
            >
              Create Package
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Package Name"
            placeholder="e.g. Enterprise Landlord Tier"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Monthly Price (£)"
              type="number"
              placeholder="29"
              value={String(formPriceMonthly)}
              onChange={(e) => setFormPriceMonthly(Number(e.target.value))}
            />
            <Input
              label="Yearly Price (£)"
              type="number"
              placeholder="290"
              value={String(formPriceYearly)}
              onChange={(e) => setFormPriceYearly(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Included Features (comma separated)
            </label>
            <textarea
              className="admin-input min-h-[90px] w-full text-xs font-medium"
              placeholder="Up to 10 properties, Unlimited tenant accounts, CP12 compliance tracker"
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Edit Existing Package */}
      <Modal
        open={!!editingPlan}
        title={editingPlan ? `Edit Package: ${editingPlan.name}` : 'Edit Package'}
        onClose={() => setEditingPlan(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button
              fullWidth
              className="!bg-brand-600 hover:!bg-brand-700"
              onClick={handleUpdatePlan}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Package Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Monthly Price (£)"
              type="number"
              value={String(formPriceMonthly)}
              onChange={(e) => setFormPriceMonthly(Number(e.target.value))}
            />
            <Input
              label="Yearly Price (£)"
              type="number"
              value={String(formPriceYearly)}
              onChange={(e) => setFormPriceYearly(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Included Features (comma separated)
            </label>
            <textarea
              className="admin-input min-h-[90px] w-full text-xs font-medium"
              value={formFeatures}
              onChange={(e) => setFormFeatures(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
