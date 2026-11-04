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

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/** Shape of data.data from POST /auth/login */
export interface LoginResponseData {
  token: string
  refreshToken: string
  data: AuthUser
}

// ─── Platform Users ───────────────────────────────────────────────────────────

export interface UserPortfolio {
  propertiesCount: number
  unitsCount: number
  maxUnits: number | null
  formattedPortfolio: string
  formattedUnits: string
  isNearLimit: boolean
}

export interface UserPlanInfo {
  packageName: string
  price: number
  formattedPrice: string
  billingCadence: string
  isTrial: boolean
  status: string
}

export interface UserStatusBadge {
  label: string
  variant: string
}

export interface BackendUser {
  _id: string
  name: string
  role: UserRole
  email: string
  profileImage?: string
  gender?: string
  status: 'active' | 'inactive' | 'pending' | 'banned'
  verified?: boolean
  nidPhoto?: string
  property?: unknown
  flat?: unknown
  timezone?: string
  isDeleted?: boolean
  certificates?: string[]
  createdAt: string
  updatedAt: string
  portfolio?: UserPortfolio
  plan?: UserPlanInfo | null
  displayStatus?: string
  statusBadge?: UserStatusBadge
}

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

export interface GetUsersResponse {
  success: boolean
  message: string
  data: BackendUser[]
  meta: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export interface LandlordDetailsStats {
  managedProperties: number
  rentalUnits: number
  activeTenants: number
  assignedContractors: number
}

export interface LandlordInfo {
  id: string
  displayId: string
  name: string
  email: string
  profileImage?: string
  initials: string
  status: string
  statusBadge: string
  joinedDate: string
  createdAt: string
  plan: UserPlanInfo | null
  stats: LandlordDetailsStats
}

export interface LandlordFullDetailsData {
  landlord: LandlordInfo
  properties: unknown[]
  tenants: unknown[]
  contractors: unknown[]
}

export interface PlatformUser {
  id: number | string
  _id?: string
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
  portfolio?: UserPortfolio
}

// ─── Subscriptions & Packages ─────────────────────────────────────────────────

export interface PackageItem {
  _id: string
  name: string
  description?: string
  monthlyPrice: number
  yearlyPrice: number
  stripeProductId?: string
  stripeMonthlyPriceId?: string
  stripeYearlyPriceId?: string
  maxProperties: number
  maxFlats: number
  features: string[]
  hasTrial?: boolean
  trialDays?: number
  isPopular?: boolean
  isActive?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreatePackageRequest {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  maxProperties: number
  maxFlats: number
  features: string[]
}

export type UpdatePackageRequest = Partial<CreatePackageRequest>

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

// ─── CMS & App Options ────────────────────────────────────────────────────────

export type AppOptionType = 'trade' | 'communal_area' | 'issue_type' | 'property_type'

export interface AppOptionItem {
  _id: string
  name: string
  type: AppOptionType
  isActive?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateAppOptionRequest {
  name: string
  type: AppOptionType
}

export interface UpdateAppOptionRequest {
  name: string
  type: AppOptionType
}

export interface GetAppOptionsResponse {
  success: boolean
  message: string
  data: AppOptionItem[]
  meta?: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export interface CmsPage {
  id: string
  title: string
  slug: string
  updated: string
  published: boolean
  preview: string
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export type FaqRole = 'landlord' | 'tenant' | 'contractor'

export interface FaqItem {
  _id: string
  question: string
  answer: string
  role: FaqRole
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateFaqRequest {
  question: string
  answer: string
  role: FaqRole
}

export type UpdateFaqRequest = Partial<CreateFaqRequest>

export interface GetFaqsResponse {
  success: boolean
  message: string
  data: FaqItem[]
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

export interface TransactionSummaryStats {
  totalCollected: number
  formattedTotalCollected: string
  currency: string
  currencySymbol: string
  totalTransactions: number
  payingLandlords: number
}

export interface TransactionLandlord {
  id: string
  name: string
  email: string
  profileImage?: string
}

export interface AdminTransactionItem {
  id: string
  transactionId: string
  invoiceNumber: string
  landlord: TransactionLandlord
  plan: string
  billing: string
  amount: number
  formattedAmount: string
  currency: string
  currencySymbol: string
  method: string
  status: string
  date: string
  formattedDate: string
  invoiceUrl?: string
  invoicePdf?: string
}

export interface GetTransactionsParams {
  page?: number
  limit?: number
  status?: string
}

export interface GetTransactionsResponse {
  success: boolean
  message: string
  data: AdminTransactionItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}

export interface PaymentTransaction {
  id: number | string
  userId: number | string
  userName: string
  email: string
  plan: string
  amount: number
  billing: 'monthly' | 'yearly' | string
  method: 'card' | 'bank' | string
  status: 'completed' | 'failed' | 'refunded' | string
  date: string
  reference: string
}

// ─── Admin Accounts ───────────────────────────────────────────────────────────

export interface AdminItem {
  _id: string
  name: string
  role: string
  email: string
  profileImage?: string
  status: 'active' | 'inactive' | string
  createdAt: string
  updatedAt: string
}

export interface GetAdminsResponse {
  success: boolean
  message: string
  data: {
    data: AdminItem[]
    meta: {
      page: number
      limit: number
      total: number
      totalPage: number
    }
  }
}

export interface CreateAdminRequest {
  name: string
  email: string
  password: string
  role: 'admin' | 'super_admin' | string
}

export interface UpdateAdminStatusRequest {
  id: string
  status: 'active' | 'inactive'
}

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: 'super' | 'admin'
  addedAt: string
  avatarUrl?: string
}
