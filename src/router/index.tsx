import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { PrivateRoute } from './PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageLoader, ErrorBoundary } from '@/components/ui'

// Lazy-loaded routes for code-splitting and performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const AnalyticsPage = lazy(() =>
  import('@/pages/dashboard/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
)
const UsersPage = lazy(() => import('@/pages/users/UsersPage').then((m) => ({ default: m.UsersPage })))
const SubscriptionsPage = lazy(() =>
  import('@/pages/subscriptions/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage })),
)
const CmsPage = lazy(() => import('@/pages/cms/CmsPage').then((m) => ({ default: m.CmsPage })))
const SupportPage = lazy(() => import('@/pages/support/SupportPage').then((m) => ({ default: m.SupportPage })))
const TransactionsPage = lazy(() =>
  import('@/pages/transactions/TransactionsPage').then((m) => ({ default: m.TransactionsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function withSuspense(Component: React.ComponentType) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: withSuspense(LoginPage) },
  { path: ROUTES.FORGOT_PASSWORD, element: withSuspense(ForgotPasswordPage) },
  { path: ROUTES.REGISTER, element: <Navigate to={ROUTES.LOGIN} replace /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: withSuspense(DashboardPage) },
          { path: ROUTES.ANALYTICS, element: withSuspense(AnalyticsPage) },
          { path: ROUTES.USERS, element: withSuspense(UsersPage) },
          { path: ROUTES.SUBSCRIPTIONS, element: withSuspense(SubscriptionsPage) },
          { path: ROUTES.CMS, element: withSuspense(CmsPage) },
          { path: ROUTES.SUPPORT, element: withSuspense(SupportPage) },
          { path: ROUTES.TRANSACTIONS, element: withSuspense(TransactionsPage) },
          { path: ROUTES.SETTINGS, element: withSuspense(SettingsPage) },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: '*', element: withSuspense(NotFoundPage) },
])
