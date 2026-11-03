import { combineReducers } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import authReducer from './slices/authSlice'

export const rootReducer = combineReducers({
  // ─── Feature Slices ────────────────────────────────────────────────────────
  auth: authReducer,

  // ─── RTK Query Cache ───────────────────────────────────────────────────────
  // Key must match the `reducerPath` defined in createApi()
  [api.reducerPath]: api.reducer,
})
