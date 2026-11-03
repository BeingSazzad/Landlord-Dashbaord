import { useAppSelector } from '@/store/hooks'

// ─── useAuth ──────────────────────────────────────────────────────────────────
// Convenience hook that reads the auth slice from Redux.
// Components should always use this hook instead of selecting
// `state.auth` directly — it provides a stable, typed API.
export function useAuth() {
  const { token, refreshToken, user } = useAppSelector((s) => s.auth)

  return {
    token,
    refreshToken,
    user,
    isAuthenticated: Boolean(token && user),
    isSuperAdmin: user?.role === 'super_admin',
  }
}
