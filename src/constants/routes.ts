export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  PROPERTIES: '/properties',
  FINANCES: '/finances',
  MAINTENANCE: '/maintenance',
  COMPLIANCE: '/compliance',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
