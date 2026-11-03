import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from '@/services/api'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // RTK Query middleware — enables caching, invalidation,
      // polling, and other RTK Query lifecycle features.
      .concat(api.middleware),
})

// Enables refetchOnFocus and refetchOnReconnect behaviors
// (e.g. re-fetch data when user switches back to the tab or
// comes back online).
setupListeners(store.dispatch)

// ─── Inferred Types ───────────────────────────────────────────────────────────
// These are derived from the store so they always stay in sync
// with the reducer shape — no manual typing needed.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
