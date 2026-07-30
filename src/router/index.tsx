import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { PrivateRoute } from './PrivateRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { PropertiesPage } from '@/pages/properties/PropertiesPage'
import { FinancesPage } from '@/pages/finances/FinancesPage'
import { MaintenancePage } from '@/pages/maintenance/MaintenancePage'
import { CompliancePage } from '@/pages/compliance/CompliancePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
          { path: ROUTES.USERS, element: <UsersPage /> },
          { path: ROUTES.PROPERTIES, element: <PropertiesPage /> },
          { path: ROUTES.FINANCES, element: <FinancesPage /> },
          { path: ROUTES.MAINTENANCE, element: <MaintenancePage /> },
          { path: ROUTES.COMPLIANCE, element: <CompliancePage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: '*', element: <NotFoundPage /> },
])
