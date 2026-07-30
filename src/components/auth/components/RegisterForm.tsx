import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RegisterForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create admin account</h1>
        <p className="mt-1 text-sm text-slate-500">Registration is disabled in MVP — use demo login.</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Full name" placeholder="Platform Admin" disabled />
          <Input label="Email" type="email" placeholder="admin@landlordhq.co.uk" disabled />
          <Input label="Password" type="password" disabled />
          <Button fullWidth disabled>
            Register (coming soon)
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
