import type { FormEvent } from 'react'
import { LoginForm } from '@/components/auth/components/LoginForm'
import { useLoginForm } from '@/components/auth/hooks/useLoginForm'
import { ADMIN_CREDENTIALS } from '@/lib/constants'

export function LoginPanel() {
  const { submit, isLoading, error } = useLoginForm()

  return (
    <LoginForm
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget as HTMLFormElement)
        void submit(String(form.get('email')), String(form.get('password')))
      }}
      loading={isLoading}
      error={error}
      demoHint={`Demo: ${ADMIN_CREDENTIALS.email} / ${ADMIN_CREDENTIALS.password}`}
    />
  )
}
