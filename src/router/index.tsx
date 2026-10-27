import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { PrivateRoute } from './PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { SubscriptionsPage } from '@/pages/subscriptions/SubscriptionsPage'
import { CmsPage } from '@/pages/cms/CmsPage'
import { SupportPage } from '@/pages/support/SupportPage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.REGISTER, element: <Navigate to={ROUTES.LOGIN} replace /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
          { path: ROUTES.USERS, element: <UsersPage /> },
          { path: ROUTES.SUBSCRIPTIONS, element: <SubscriptionsPage /> },
          { path: ROUTES.CMS, element: <CmsPage /> },
          { path: ROUTES.SUPPORT, element: <SupportPage /> },
          { path: ROUTES.TRANSACTIONS, element: <TransactionsPage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: '*', element: <NotFoundPage /> },
])
