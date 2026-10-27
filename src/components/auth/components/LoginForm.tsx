import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { env } from '@/config/env'

interface LoginFormProps {
  onSubmit: (e: FormEvent) => void
  loading?: boolean
  error?: string
  demoHint?: string
}

export function LoginForm({ onSubmit, loading, error, demoHint }: LoginFormProps) {
  return (
    <div className="login-split">
      {/* Left Branding Side with Image & Gradient Overlay */}
      <aside className="relative hidden w-[48%] flex-col justify-between overflow-hidden p-10 xl:p-14 text-white lg:flex">
        {/* Background Property Image */}
        <img
          src="/login-bg.jpg"
          alt="UK Modern Residential Architecture"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105"
        />

        {/* Deep Sapphire Gradient Overlay for optimal legibility & depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-brand-900/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1.5px]" />
        <div className="absolute inset-0 bg-black/25" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-extrabold tracking-tight">Landlord HQ</p>
              <p className="text-[11px] font-bold tracking-widest text-blue-200 uppercase">
                ADMIN PORTAL
              </p>
            </div>
          </div>
        </div>

        {/* Center / Middle Content (Clean, elegant, clutter-free typography) */}
        <div className="relative z-10 my-auto max-w-lg py-12">
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] text-white tracking-tight">
            Manage Tenancy, Compliance &amp; Portfolios
          </h1>

          <p className="mt-5 text-base xl:text-lg leading-relaxed text-blue-100/90 font-medium">
            Manage users, subscriptions, app content and support — all in one unified platform dashboard.
          </p>
        </div>

        {/* Footer Security Badges */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-white/15 text-xs text-blue-200/80">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Restricted to authorized administrators only</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300/70">
            <Lock className="h-3 w-3" />
            <span>256-bit TLS Encrypted</span>
          </div>
        </div>
      </aside>

      {/* Right Login Form Side */}
      <div className="login-form-side">
        <div className="login-form-card">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Landlord HQ</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">{env.VITE_APP_NAME}</h1>
          </div>
          <h2 className="hidden text-xl font-bold text-slate-900 lg:block">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your admin credentials</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input name="email" type="email" label="Email" placeholder="admin@landlordhq.co.uk" required />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            ) : null}
            {demoHint ? (
              <p className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-xs text-brand-800">{demoHint}</p>
            ) : null}
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Need platform access? Contact your Super Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
