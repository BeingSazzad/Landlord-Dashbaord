import { api } from '@/services/api'
import type {
  ApiResponse,
  CreateFaqRequest,
  FaqItem,
  FaqRole,
  GetFaqsResponse,
  UpdateFaqRequest,
} from '@/types'

export const faqsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /faqs?role=...
    getFaqs: builder.query<GetFaqsResponse, { role?: FaqRole } | void>({
      query: (params) => ({
        url: '/faqs',
        method: 'GET',
        params: params?.role ? { role: params.role } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Faqs' as const, id: _id })),
              { type: 'Faqs', id: 'LIST' },
            ]
          : [{ type: 'Faqs', id: 'LIST' }],
    }),

    // POST /faqs
    createFaq: builder.mutation<ApiResponse<FaqItem>, CreateFaqRequest>({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),

    // PATCH /faqs/:id
    updateFaq: builder.mutation<ApiResponse<FaqItem>, { id: string; body: UpdateFaqRequest }>({
      query: ({ id, body }) => ({
        url: `/faqs/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Faqs', id },
        { type: 'Faqs', id: 'LIST' },
      ],
    }),

    // DELETE /faqs/:id
    deleteFaq: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqsApi

