export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  SUBSCRIPTIONS: '/subscriptions',
  CMS: '/cms',
  SUPPORT: '/support',
  TRANSACTIONS: '/transactions',
  SETTINGS: '/settings',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
