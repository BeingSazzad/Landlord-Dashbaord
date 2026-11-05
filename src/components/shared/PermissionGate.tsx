import type { ReactNode } from 'react'
import { useAppSelector } from '@/store/hooks'
import type { UserRole } from '@/types'

interface PermissionGateProps {
  roles?: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({ roles = ['admin', 'super_admin'], children, fallback = null }: PermissionGateProps) {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return <>{fallback}</>
  // super_admin always has access, or if user's role is in the allowed list
  if (user.role === 'super_admin' || roles.includes(user.role)) {
    return <>{children}</>
  }
  return <>{fallback}</>
}
