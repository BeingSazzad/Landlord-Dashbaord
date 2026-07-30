export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  SUBSCRIPTIONS: '/subscriptions',
  CMS: '/cms',
  SUPPORT: '/support',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
