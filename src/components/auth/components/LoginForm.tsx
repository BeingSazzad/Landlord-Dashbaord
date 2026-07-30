import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Landlord HQ</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{env.VITE_APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage the platform</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input name="email" type="email" label="Email" placeholder="admin@landlordhq.co.uk" required />
          <Input name="password" type="password" label="Password" placeholder="••••••••" required />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {demoHint ? <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{demoHint}</p> : null}
          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
