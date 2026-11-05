import { api } from '@/services/api'
import type { ApiResponse, RuleItem, RuleType, SaveRuleRequest } from '@/types'

export const rulesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /rules/:type (about, terms, policy)
    getRuleByType: builder.query<ApiResponse<RuleItem>, RuleType>({
      query: (type) => ({
        url: `/rules/${type}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, type) => [{ type: 'Cms', id: type }],
    }),

    // POST /rules
    saveRule: builder.mutation<ApiResponse<RuleItem>, SaveRuleRequest>({
      query: (body) => ({
        url: '/rules',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { type }) => [
        { type: 'Cms', id: type },
        { type: 'Cms', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const { useGetRuleByTypeQuery, useSaveRuleMutation } = rulesApi

