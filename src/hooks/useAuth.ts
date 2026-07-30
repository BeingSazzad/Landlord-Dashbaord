import { useAppSelector } from '@/store/hooks'

export function useAuth() {
  const { token, user } = useAppSelector((s) => s.auth)
  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  }
}
