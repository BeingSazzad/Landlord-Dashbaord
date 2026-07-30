import type { DashboardStats, Invoice, MaintenanceJob, PlatformUser, Property } from '@/types/api.types'

export const MOCK_PROPERTIES: Property[] = [
  { id: 0, name: '12 Park Lane', address: 'London, SW1A 1AA', status: 'Partial', rent: '£2,450', compliance: true, units: 4, occupied: 2 },
  { id: 1, name: '45 Queens Road', address: 'London, SW2 3TR', status: 'Partial', rent: '£1,850', compliance: true, units: 4, occupied: 1 },
  { id: 2, name: '88 King Street', address: 'London, EC2V 8BB', status: 'Vacant', rent: '£2,100', compliance: false, units: 1, occupied: 0 },
  { id: 3, name: '15 Victoria Ave', address: 'London, N1 5EH', status: 'Partial', rent: '£1,950', compliance: true, units: 4, occupied: 1 },
]

export const MOCK_USERS: PlatformUser[] = [
  { id: 0, name: 'John Smith', email: 'john@landlordhq.co.uk', role: 'landlord', status: 'active' },
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'tenant', status: 'active', property: '12 Park Lane', unit: 'Flat 2A' },
  { id: 2, name: 'David Wilson', email: 'david.w@email.com', role: 'tenant', status: 'active', property: '45 Queens Road', unit: 'Flat 1A' },
  { id: 3, name: 'Michael Lee', email: 'michael.l@email.com', role: 'tenant', status: 'active', property: '15 Victoria Ave', unit: 'Flat 2A' },
  { id: 4, name: 'Priya Sharma', email: 'priya.s@email.com', role: 'tenant', status: 'active', property: '12 Park Lane', unit: 'Flat 2B' },
  { id: 5, name: 'James Chen', email: 'james.chen@email.com', role: 'tenant', status: 'pending', property: '12 Park Lane', unit: 'Flat 2B' },
  { id: 6, name: 'Mike Thompson', email: 'mike@plumberpro.co.uk', role: 'contractor', status: 'active' },
  { id: 7, name: 'Heating Co.', email: 'jobs@heatingco.co.uk', role: 'contractor', status: 'active' },
  { id: 8, name: 'Emma Roberts', email: 'emma.r@email.com', role: 'tenant', status: 'inactive', property: '88 King Street', unit: 'Main Flat' },
]

export const MOCK_INVOICES: Invoice[] = [
  { id: 0, num: 'INV-2026-1048', tenant: 'Sarah Johnson', prop: '12 Park Lane', unit: 'Flat 2A', amount: '£2,450', status: 'Pending', due: 'Jul 1, 2026', type: 'rent' },
  { id: 1, num: 'INV-2026-1047', tenant: 'David Wilson', prop: '45 Queens Road', unit: 'Flat 1A', amount: '£1,850', status: 'Overdue', due: 'Jul 1, 2026', type: 'rent' },
  { id: 2, num: 'INV-2026-1045', tenant: 'Michael Lee', prop: '15 Victoria Ave', unit: 'Flat 2A', amount: '£1,950', status: 'Pending', due: 'Jul 28, 2026', type: 'rent' },
  { id: 3, num: 'INV-2026-1044', tenant: 'Sarah Johnson', prop: '12 Park Lane', unit: 'Flat 2A', amount: '£2,450', status: 'Paid', due: 'Jun 1, 2026', type: 'rent' },
  { id: 4, num: 'INV-2026-1043', tenant: 'David Wilson', prop: '45 Queens Road', unit: 'Flat 1A', amount: '£1,850', status: 'Paid', due: 'Jun 1, 2026', type: 'rent' },
  { id: 5, num: 'INV-2026-1042', tenant: 'Priya Sharma', prop: '12 Park Lane', unit: 'Flat 2B', amount: '£2,200', status: 'Pending', due: 'Jul 1, 2026', type: 'rent' },
]

export const MOCK_MAINTENANCE: MaintenanceJob[] = [
  { id: 0, issue: 'Kitchen sink leaking', prop: '12 Park Lane', unit: 'Flat 2A', priority: 'High', status: 'progress', contractor: 'Plumber Pro', tenantName: 'Sarah Johnson' },
  { id: 1, issue: 'Window latch broken', prop: '88 King Street', unit: 'Main Flat', priority: 'Medium', status: 'open', contractor: '—' },
  { id: 2, issue: 'Damp patch in bedroom', prop: '12 Park Lane', unit: 'Flat 2A', priority: 'Low', status: 'open', contractor: '—', tenantName: 'Sarah Johnson' },
  { id: 3, issue: 'Boiler not working', prop: '45 Queens Road', unit: 'Flat 1A', priority: 'High', status: 'progress', contractor: 'Heating Co.', tenantName: 'David Wilson' },
  { id: 4, issue: 'Radiator not heating', prop: '15 Victoria Ave', unit: 'Flat 2A', priority: 'Medium', status: 'progress', contractor: 'Heating Co.', tenantName: 'Michael Lee' },
  { id: 5, issue: 'Light flickering', prop: '15 Victoria Ave', unit: 'Flat 2A', priority: 'Low', status: 'done', contractor: 'Electric Fix', tenantName: 'Michael Lee' },
  { id: 6, issue: 'Hallway light out', prop: '12 Park Lane', unit: 'Communal', priority: 'Medium', status: 'open', contractor: '—' },
]

export function getDashboardStats(): DashboardStats {
  const landlords = MOCK_USERS.filter((u) => u.role === 'landlord').length
  const tenants = MOCK_USERS.filter((u) => u.role === 'tenant' && u.status === 'active').length
  const contractors = MOCK_USERS.filter((u) => u.role === 'contractor').length
  const units = MOCK_PROPERTIES.reduce((sum, p) => sum + p.units, 0)
  const occupiedUnits = MOCK_PROPERTIES.reduce((sum, p) => sum + p.occupied, 0)
  const openMaintenance = MOCK_MAINTENANCE.filter((m) => m.status === 'open' || m.status === 'progress').length
  const overdueInvoices = MOCK_INVOICES.filter((i) => i.status === 'Overdue').length
  const collectedThisMonth = MOCK_INVOICES.filter((i) => i.status === 'Paid').reduce((s, i) => s + parseInt(i.amount.replace(/[^\d]/g, ''), 10), 0)
  const expectedThisMonth = MOCK_INVOICES.reduce((s, i) => s + parseInt(i.amount.replace(/[^\d]/g, ''), 10), 0)
  const complianceAlerts = MOCK_PROPERTIES.filter((p) => !p.compliance).length

  return {
    landlords,
    tenants,
    contractors,
    properties: MOCK_PROPERTIES.length,
    units,
    occupiedUnits,
    openMaintenance,
    overdueInvoices,
    collectedThisMonth,
    expectedThisMonth,
    complianceAlerts,
  }
}
