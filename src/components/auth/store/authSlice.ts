import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/types/api.types'
import { AUTH_STORAGE_KEY } from '@/lib/constants'

interface AuthState {
  token: string | null
  user: AuthUser | null
}

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AuthState
  } catch {
    /* ignore */
  }
  return { token: null, user: null }
}

const initialState: AuthState = loadAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
