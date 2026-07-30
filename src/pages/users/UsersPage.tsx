import { PageHeader } from '@/components/layout/PageHeader'
import { UsersTable } from '@/components/users/UsersTable'

export function UsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Landlords, tenants and contractors on the platform." />
      <UsersTable />
    </>
  )
}
