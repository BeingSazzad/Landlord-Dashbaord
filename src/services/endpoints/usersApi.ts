import { api } from '@/services/api'
import { updateProfile } from '@/store/slices/authSlice'
import type {
  ApiResponse,
  AuthUser,
  GetUsersParams,
  GetUsersResponse,
  LandlordFullDetailsData,
} from '@/types'

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/profile
    getUserProfile: builder.query<ApiResponse<AuthUser>, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'Users', id: 'PROFILE' }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.data) {
            dispatch(updateProfile(data.data))
          }
        } catch {
          // ignore
        }
      },
    }),

    // PATCH /users (accepts FormData with text field 'data' & file 'profileImage')
    updateUserProfile: builder.mutation<ApiResponse<AuthUser>, FormData>({
      query: (formData) => ({
        url: '/users',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Users', id: 'PROFILE' },
        { type: 'Users', id: 'LIST' },
      ],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.data) {
            dispatch(updateProfile(data.data))
          }
        } catch {
          // ignore
        }
      },
    }),

    // GET /users
    getUsers: builder.query<GetUsersResponse, GetUsersParams | void>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.search ? { search: params.search } : {}),
              ...(params.role && params.role !== 'all' ? { role: params.role } : {}),
              ...(params.status && params.status !== 'all' ? { status: params.status } : {}),
            }
          : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // GET /users/:id/full-details
    getUserFullDetails: builder.query<ApiResponse<LandlordFullDetailsData>, string>({
      query: (id) => ({
        url: `/users/${id}/full-details`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Users', id: `DETAILS-${id}` }],
    }),

    // PATCH /users/status/:id
    updateUserStatus: builder.mutation<
      ApiResponse<unknown>,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/users/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        { type: 'Users', id: `DETAILS-${id}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUsersQuery,
  useGetUserFullDetailsQuery,
  useLazyGetUserFullDetailsQuery,
  useUpdateUserStatusMutation,
} = usersApi
