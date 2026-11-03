import type { Status, UserRole } from './common.types'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: UserRole
  profileImage?: string
  avatarUrl?: string
  gender?: string
  status?: Status
  phone?: string
  countryCode?: string
  verified?: boolean
  nidPhoto?: string
  property?: string | null
  flat?: string | null
  timezone?: string
  isDeleted?: boolean
  certificates?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Shape of data.data from POST /auth/login */
export interface LoginResponseData {
  token: string
  refreshToken: string
  data: AuthUser
}

// ─── Platform Users ───────────────────────────────────────────────────────────

export interface PlatformUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: Status
  joined: string
  /** Landlords only — how many properties they added */
  propertyCount?: number
  /** Landlord-only — tenants and contractors do not subscribe */
  plan?: string
  mrr?: number
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: number
  name: string
  priceMonthly: number
  priceYearly: number
  features: string[]
  active: boolean
  /** Number of landlords on this plan */
  subscribers: number
}

/** Landlord subscription — tenants and contractors are never billed */
export interface Subscription {
  id: number
  userId: number
  userName: string
  email: string
  role: 'landlord'
  plan: string
  billing: 'monthly' | 'yearly'
  amount: number
  status: 'active' | 'cancelled' | 'trial' | 'past_due'
  started: string
  renews: string
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface MonthlyMetric {
  month: string
  revenue: number
  users: number
  landlords: number
}

// ─── CMS ─────────────────────────────────────────────────────────────────────

export interface CmsPage {
  id: string
  title: string
  slug: string
  updated: string
  published: boolean
  preview: string
}

// ─── Support ─────────────────────────────────────────────────────────────────

export interface SupportMessage {
  id: number
  from: string
  email: string
  role: string
  subject: string
  message: string
  status: 'open' | 'replied' | 'closed'
  time: string
  reply?: string
  repliedAt?: string
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface AdminDashboardData {
  totalLandlords: number
  monthlyRevenue: number
  activeSubscriptions: number
}

export interface MonthlyRevenueItem {
  month: string
  revenue: number
}

export interface MonthlyRevenueData {
  year: number
  totalRevenue: number
  revenue: MonthlyRevenueItem[]
}

export interface UserGrowthItem {
  month: string
  landlords: number
  tenants: number
  contractors: number
  total: number
  newLandlords: number
  newTenants: number
  newContractors: number
}

export interface UserGrowthData {
  year: number
  growth: UserGrowthItem[]
}

export interface PlatformStats {
  totalUsers: number
  landlords: number
  tenants: number
  contractors: number
  activeSubscriptions: number
  mrr: number
  arr: number
  trialLandlords: number
  openSupport: number
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface PaymentTransaction {
  id: number
  userId: number
  userName: string
  email: string
  plan: string
  amount: number
  billing: 'monthly' | 'yearly'
  method: 'card' | 'bank'
  status: 'completed' | 'failed' | 'refunded'
  date: string
  reference: string
}

// ─── Admin Accounts ───────────────────────────────────────────────────────────

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: 'super' | 'admin'
  addedAt: string
  avatarUrl?: string
}
