import { api } from '@/services/api'
import type {
  ApiResponse,
  CreatePackageRequest,
  PackageItem,
  UpdatePackageRequest,
} from '@/types'

export const packagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /packages
    getPackages: builder.query<ApiResponse<PackageItem[]>, void>({
      query: () => ({
        url: '/packages',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Packages' as const, id: _id })),
              { type: 'Packages', id: 'LIST' },
            ]
          : [{ type: 'Packages', id: 'LIST' }],
    }),

    // POST /packages
    createPackage: builder.mutation<ApiResponse<PackageItem>, CreatePackageRequest>({
      query: (body) => ({
        url: '/packages',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Packages', id: 'LIST' }],
    }),

    // PATCH /packages/:id
    updatePackage: builder.mutation<
      ApiResponse<PackageItem>,
      { id: string; body: UpdatePackageRequest }
    >({
      query: ({ id, body }) => ({
        url: `/packages/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Packages', id },
        { type: 'Packages', id: 'LIST' },
      ],
    }),

    // DELETE /packages/:id
    deletePackage: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Packages', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi

