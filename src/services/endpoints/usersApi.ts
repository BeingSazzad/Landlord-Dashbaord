import { api } from '@/services/api'
import type { PlatformUser } from '@/types/api.types'
import { MOCK_USERS } from '@/lib/mockData'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PlatformUser[], void>({
      // When backend /users endpoint is live, replace queryFn with:
      // query: () => '/users',
      queryFn: async () => ({ data: MOCK_USERS }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Example mutation with tag invalidation:
    updateUserStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

export const { useGetUsersQuery, useUpdateUserStatusMutation } = usersApi
