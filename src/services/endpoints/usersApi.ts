import { api } from '@/services/api'
import { updateProfile } from '@/store/slices/authSlice'
import type {
  AdminItem,
  ApiResponse,
  AuthUser,
  CreateAdminRequest,
  GetAdminsResponse,
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

    // ─── Admin Team Endpoints ───────────────────────────────────────────────

    // GET /users/admins
    getAdmins: builder.query<
      GetAdminsResponse,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) => ({
        url: '/users/admins',
        method: 'GET',
        params: params
          ? {
              ...(params.page ? { page: params.page } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
              ...(params.search ? { search: params.search } : {}),
            }
          : undefined,
      }),
      providesTags: (result) => {
        const raw = result?.data as any
        const list: AdminItem[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : []
        return [
          ...list.map(({ _id }) => ({ type: 'Admins' as const, id: _id })),
          { type: 'Admins', id: 'LIST' },
        ]
      },
    }),

    // POST /users/create-admin
    createAdmin: builder.mutation<ApiResponse<AdminItem>, CreateAdminRequest>({
      query: (body) => ({
        url: '/users/create-admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Admins', id: 'LIST' }],
    }),

    // PATCH /users/admin/status/:id
    updateAdminStatus: builder.mutation<
      ApiResponse<unknown>,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/users/admin/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Admins', id },
        { type: 'Admins', id: 'LIST' },
      ],
    }),

    // DELETE /users/admins/:id
    deleteAdmin: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/users/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Admins', id: 'LIST' }],
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
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminStatusMutation,
  useDeleteAdminMutation,
} = usersApi
