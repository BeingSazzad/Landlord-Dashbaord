import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield } from 'lucide-react'
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
      <aside className="login-brand">
        <div className="login-brand-glow" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold">Landlord HQ</p>
              <p className="text-xs font-medium text-white/70">ADMIN PORTAL</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold leading-tight">Welcome back</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
            Manage users, subscriptions, app content and support — all in one platform dashboard.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
          <Shield className="h-4 w-4" />
          Restricted to authorized administrators only
        </div>
      </aside>

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
            <Input name="password" type="password" label="Password" placeholder="••••••••" required />
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
          <p className="mt-5 text-center text-sm text-slate-500">
            No account?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
