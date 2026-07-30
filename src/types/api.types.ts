import type { Status, UserRole } from './common.types'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface Property {
  id: number
  name: string
  address: string
  status: string
  rent: string
  compliance: boolean
  units: number
  occupied: number
}

export interface PlatformUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: Status
  property?: string
  unit?: string
}

export interface Invoice {
  id: number
  num: string
  tenant: string
  prop: string
  unit: string
  amount: string
  status: 'Pending' | 'Paid' | 'Overdue'
  due: string
  type: string
}

export interface MaintenanceJob {
  id: number
  issue: string
  prop: string
  unit: string
  priority: string
  status: string
  contractor: string
  tenantName?: string
}

export interface DashboardStats {
  landlords: number
  tenants: number
  contractors: number
  properties: number
  units: number
  occupiedUnits: number
  openMaintenance: number
  overdueInvoices: number
  collectedThisMonth: number
  expectedThisMonth: number
  complianceAlerts: number
}
