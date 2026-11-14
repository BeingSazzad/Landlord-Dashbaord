import { api } from '@/services/api'
import type { ApiResponse, LoginResponseData } from '@/types'
import type { ChangePasswordRequest, LoginRequest } from '@/types/api.types'

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

  overrideExisting: false,
})

export const { useLoginMutation, useChangePasswordMutation } = authApi
