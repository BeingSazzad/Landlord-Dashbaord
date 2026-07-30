export type UserRole = 'landlord' | 'tenant' | 'contractor' | 'admin'

export type Status = 'active' | 'inactive' | 'pending' | 'banned'

export interface ApiError {
  message: string
  status?: number
}
