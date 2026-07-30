import { PageHeader } from '@/components/layout/PageHeader'
import { PropertiesTable } from '@/components/properties/PropertiesTable'

export function PropertiesPage() {
  return (
    <>
      <PageHeader title="Properties" description="All buildings and unit occupancy across landlords." />
      <PropertiesTable />
    </>
  )
}
