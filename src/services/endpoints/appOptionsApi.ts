import { api } from '@/services/api'
import type {
  ApiResponse,
  AppOptionItem,
  AppOptionType,
  CreateAppOptionRequest,
  GetAppOptionsResponse,
  UpdateAppOptionRequest,
} from '@/types'

export const appOptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /app-options
    getAppOptions: builder.query<
      GetAppOptionsResponse,
      { type?: AppOptionType; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/app-options',
        method: 'GET',
        params: params
          ? {
              ...(params.type ? { type: params.type } : {}),
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
            }
          : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'AppOptions' as const, id: _id })),
              { type: 'AppOptions', id: 'LIST' },
            ]
          : [{ type: 'AppOptions', id: 'LIST' }],
    }),

    // POST /app-options
    createAppOption: builder.mutation<ApiResponse<AppOptionItem>, CreateAppOptionRequest>({
      query: (body) => ({
        url: '/app-options',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AppOptions', id: 'LIST' }],
    }),

    // PATCH /app-options/:id
    updateAppOption: builder.mutation<
      ApiResponse<AppOptionItem>,
      { id: string; body: UpdateAppOptionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/app-options/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AppOptions', id },
        { type: 'AppOptions', id: 'LIST' },
      ],
    }),

    // DELETE /app-options/:id
    deleteAppOption: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/app-options/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AppOptions', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAppOptionsQuery,
  useCreateAppOptionMutation,
  useUpdateAppOptionMutation,
  useDeleteAppOptionMutation,
} = appOptionsApi

