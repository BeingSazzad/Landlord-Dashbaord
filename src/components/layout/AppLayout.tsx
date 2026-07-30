import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const titles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/analytics': 'Analytics',
  '/users': 'Users',
  '/subscriptions': 'Landlord subscriptions',
  '/cms': 'CMS',
  '/support': 'Support',
  '/transactions': 'Transactions',
  '/settings': 'Settings',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const pageTitle = titles[pathname] || 'Admin'

  return (
    <div className="admin-shell flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar pageTitle={pageTitle} />
        <main className="flex-1 px-4 py-5 md:px-8 md:py-6">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
