import { api } from '@/services/api'
import type { PlatformUser } from '@/types/api.types'
import { MOCK_USERS } from '@/lib/mockData'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PlatformUser[], void>({
      queryFn: async () => ({ data: MOCK_USERS }),
    }),
  }),
})

export const { useGetUsersQuery } = usersApi
