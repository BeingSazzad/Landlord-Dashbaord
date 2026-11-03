import { api } from '@/services/api'
import type {
  AdminDashboardData,
  ApiResponse,
  MonthlyRevenueData,
  UserGrowthData,
} from '@/types'

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/dashboard
    getDashboardStats: builder.query<ApiResponse<AdminDashboardData>, void>({
      query: () => ({
        url: '/admin/dashboard',
        method: 'GET',
      }),
      providesTags: [{ type: 'Dashboard', id: 'STATS' }],
    }),

    // GET /admin/monthly-revenue
    getMonthlyRevenue: builder.query<ApiResponse<MonthlyRevenueData>, { year?: string | number } | void>({
      query: (params) => ({
        url: '/admin/monthly-revenue',
        method: 'GET',
        params: params?.year ? { year: params.year } : undefined,
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Dashboard', id: `REVENUE-${arg?.year ?? 'CURRENT'}` },
      ],
    }),

    // GET /admin/user-growth
    getUserGrowth: builder.query<ApiResponse<UserGrowthData>, { year?: string | number } | void>({
      query: (params) => ({
        url: '/admin/user-growth',
        method: 'GET',
        params: params?.year ? { year: params.year } : undefined,
      }),
      providesTags: (_result, _error, arg) => [
        { type: 'Dashboard', id: `GROWTH-${arg?.year ?? 'CURRENT'}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetDashboardStatsQuery,
  useGetMonthlyRevenueQuery,
  useGetUserGrowthQuery,
} = dashboardApi

