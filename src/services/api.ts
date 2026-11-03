import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { env } from '@/config/env'
import type { RootState } from '@/store'
import { logout, setCredentials } from '@/store/slices/authSlice'
import type { ApiResponse, LoginResponseData } from '@/types'

// ─── Base Query ───────────────────────────────────────────────────────────────
// Attaches the Bearer token from Redux state to every outgoing request.
const baseQuery = fetchBaseQuery({
  baseUrl: env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const state = api.getState() as RootState
    const refreshToken = state.auth.refreshToken

    if (refreshToken) {
      // Try to get a new access token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      )

      const refreshData = refreshResult.data as ApiResponse<LoginResponseData> | undefined

      if (refreshData?.success && refreshData.data) {
        // Store the new tokens and retry the original request
        api.dispatch(
          setCredentials({
            token: refreshData.data.token,
            refreshToken: refreshData.data.refreshToken,
            user: refreshData.data.data,
          }),
        )
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh failed — force logout
        api.dispatch(logout())
      }
    } else {
      // No refresh token available — force logout
      api.dispatch(logout())
    }
  }

  return result
}

// ─── RTK Query API Instance ───────────────────────────────────────────────────
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,


  tagTypes: [
    'Auth',
    'Users',
    'Dashboard',
    'Subscriptions',
    'Packages',
    'Transactions',
    'Support',
    'Cms',
    'Settings',
  ],

  endpoints: () => ({}),
})
