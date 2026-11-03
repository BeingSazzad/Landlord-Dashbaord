import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/types/api.types'

// ─── Constants ────────────────────────────────────────────────────────────────
const AUTH_STORAGE_KEY = 'lhq_admin_auth'

// ─── State Shape ──────────────────────────────────────────────────────────────
interface AuthState {
  token: string | null
  refreshToken: string | null
  user: AuthUser | null
}

// ─── Persist / Hydrate from localStorage ─────────────────────────────────────
function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AuthState
  } catch {
    /* ignore malformed JSON */
  }
  return { token: null, refreshToken: null, user: null }
}

function persistAuth(state: AuthState): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore storage quota errors */
  }
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuth,   // lazy initializer — runs once on store creation

  reducers: {
    /**
     * Called after a successful login or token refresh.
     * Stores access token, refresh token, and user profile in both
     * Redux state and localStorage.
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string
        refreshToken: string
        user: AuthUser
      }>,
    ) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user
      persistAuth({ ...state })
    },

    /**
     * Updates the logged-in user's profile fields (e.g. after a
     * successful PUT /auth/update-profile call).
     */
    updateProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
      persistAuth({ ...state })
    },

    /**
     * Clears all auth state and removes persisted data.
     * Dispatched automatically by baseQueryWithReauth on 401 failures,
     * and explicitly by the Sign-Out button.
     */
    logout: (state) => {
      state.token = null
      state.refreshToken = null
      state.user = null
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },
  },
})

export const { setCredentials, updateProfile, logout } = authSlice.actions
export default authSlice.reducer
export { AUTH_STORAGE_KEY }

