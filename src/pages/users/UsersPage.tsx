import { PageHeader } from '@/components/layout/PageHeader'
import { UsersTable } from '@/components/users/UsersTable'

export function UsersPage() {
  return (
    <>
      <PageHeader
        title="User Directory"
        description="Search, manage and monitor landlords, tenants and approved contractors across the platform."
      />
      <UsersTable />
    </>
  )
}
