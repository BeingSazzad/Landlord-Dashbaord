import type { ReactNode } from 'react'
import { useAppSelector } from '@/store/hooks'

interface PermissionGateProps {
  roles?: Array<'admin' | 'landlord' | 'tenant' | 'contractor'>
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ roles = ['admin'], children, fallback = null }: PermissionGateProps) {
  const user = useAppSelector((s) => s.auth.user)
  if (!user || !roles.includes(user.role)) return <>{fallback}</>
  return <>{children}</>
}
