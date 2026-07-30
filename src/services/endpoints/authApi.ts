import { api } from '@/services/api'
import type { LoginRequest, LoginResponse } from '@/types/api.types'
import { ADMIN_CREDENTIALS } from '@/lib/constants'

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async ({ email, password }) => {
        await new Promise((r) => setTimeout(r, 400))
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          return {
            data: {
              token: 'mock-admin-jwt-token',
              user: {
                id: 'admin-1',
                email,
                name: 'Platform Admin',
                role: 'admin',
              },
            },
          }
        }
        return { error: { status: 401, data: { message: 'Invalid email or password' } } }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi
