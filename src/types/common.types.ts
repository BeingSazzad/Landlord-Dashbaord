// ─── User Roles ─────────────────────────────────────────────────────────────
export type UserRole = 'landlord' | 'tenant' | 'contractor' | 'admin' | 'super_admin'

// ─── Record Statuses ─────────────────────────────────────────────────────────
export type Status = 'active' | 'inactive' | 'pending' | 'banned'

// ─── Generic API Response Shape ───────────────────────────────────────────────
// Matches the backend envelope:
// { success: boolean, message: string, data: T }
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

// ─── Generic Paginated API Response ──────────────────────────────────────────
// { success, message, data: { result: T[], meta: PaginationMeta } }
export interface PaginatedApiResponse<T = unknown> {
  success: boolean
  message: string
  data: {
    result: T[]
    meta: PaginationMeta
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

// ─── API Error Shape ─────────────────────────────────────────────────────────
export interface ApiError {
  message: string
  status?: number
  success?: false
}
