import type { Status, UserRole } from './common.types'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

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

export interface MonthlyMetric {
  month: string
  revenue: number
  users: number
  landlords: number
}

export interface CmsPage {
  id: string
  title: string
  slug: string
  updated: string
  published: boolean
  preview: string
}

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

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: 'super' | 'admin'
  addedAt: string
  avatarUrl?: string
}
