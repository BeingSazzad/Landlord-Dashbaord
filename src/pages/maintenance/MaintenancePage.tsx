import { PageHeader } from '@/components/layout/PageHeader'
import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable'

export function MaintenancePage() {
  return (
    <>
      <PageHeader title="Maintenance" description="Open jobs, contractors and resolution status." />
      <MaintenanceTable />
    </>
  )
}
