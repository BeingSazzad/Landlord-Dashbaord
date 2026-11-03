import { api } from '@/services/api'
import type {
  ApiResponse,
  GetTransactionsParams,
  GetTransactionsResponse,
  TransactionSummaryStats,
} from '@/types'

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/transactions/stats
    getTransactionStats: builder.query<ApiResponse<TransactionSummaryStats>, void>({
      query: () => ({
        url: '/admin/transactions/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Transactions', id: 'STATS' }],
    }),

    // GET /admin/transactions
    getTransactions: builder.query<GetTransactionsResponse, GetTransactionsParams | void>({
      query: (params) => ({
        url: '/admin/transactions',
        method: 'GET',
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.status && params.status !== 'all' ? { status: params.status } : {}),
            }
          : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Transactions' as const, id })),
              { type: 'Transactions', id: 'LIST' },
            ]
          : [{ type: 'Transactions', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetTransactionStatsQuery,
  useGetTransactionsQuery,
} = transactionsApi

