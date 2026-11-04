import { api } from '@/services/api'
import type { ApiResponse, LoginResponseData } from '@/types'
import type { ChangePasswordRequest, LoginRequest } from '@/types/api.types'

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
// Injected into the shared `api` instance so RTK Query can manage
// caching, loading states, and cache invalidation automatically.
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/login
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // POST /auth/change-password
    changePassword: builder.mutation<ApiResponse<unknown>, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),

  // Prevents duplicate endpoint registration in development hot-reloads
  overrideExisting: false,
})

// Auto-generated typed hooks — import these in components/hooks
export const { useLoginMutation, useChangePasswordMutation } = authApi
