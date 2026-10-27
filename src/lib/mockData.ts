import type {
  AdminAccount,
  CmsPage,
  MonthlyMetric,
  PaymentTransaction,
  PlatformStats,
  PlatformUser,
  Subscription,
  SubscriptionPlan,
  SupportMessage,
} from '@/types/api.types'

export const MOCK_USERS: PlatformUser[] = [
  // B2B Paying Landlords (The Platform's Core Paying Customers)
  {
    id: 0,
    name: 'John Smith (Smith Holdings)',
    email: 'john@landlordhq.co.uk',
    role: 'landlord',
    status: 'active',
    joined: 'Jan 12, 2024',
    propertyCount: 4,
    unitCount: 8,
    plan: 'Portfolio',
    mrr: 49,
    activeTenantsCount: 7,
  },
  {
    id: 9,
    name: 'Lisa Patel (Patel Estates)',
    email: 'lisa.patel@email.com',
    role: 'landlord',
    status: 'active',
    joined: 'Apr 3, 2025',
    propertyCount: 2,
    unitCount: 4,
    plan: 'Pro',
    mrr: 19,
    activeTenantsCount: 3,
  },
  {
    id: 11,
    name: 'Anna Kowalski',
    email: 'anna.k@email.com',
    role: 'landlord',
    status: 'active',
    joined: 'Jun 22, 2025',
    propertyCount: 3,
    unitCount: 6,
    plan: 'Pro',
    mrr: 19,
    activeTenantsCount: 5,
  },
  {
    id: 10,
    name: 'Tom Wright',
    email: 'tom.wright@email.com',
    role: 'landlord',
    status: 'active',
    joined: 'May 18, 2025',
    propertyCount: 1,
    unitCount: 2,
    plan: 'Starter',
    mrr: 0,
    activeTenantsCount: 1,
  },
  {
    id: 12,
    name: 'Nordica Properties UK Ltd',
    email: 'partnerships@nordicaproperties.co.uk',
    role: 'landlord',
    status: 'active',
    joined: 'Jan 8, 2025',
    propertyCount: 6,
    unitCount: 14,
    plan: 'Portfolio',
    mrr: 49,
    activeTenantsCount: 11,
  },

  // Tenants (Renters with persistent universal platform passports across landlords)
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'tenant',
    status: 'active',
    joined: 'Jan 15, 2024',
    currentProperty: 'Flat 4B, 18 Westminster Court',
    currentLandlord: { name: 'John Smith (Smith Holdings)', id: 0 },
    tenancyStatus: 'Active AST',
    depositScheme: 'DPS Custodial #DPS-8821',
    rightToRent: 'Verified',
    pastTenanciesCount: 1,
  },
  {
    id: 2,
    name: 'David Wilson',
    email: 'david.w@email.com',
    role: 'tenant',
    status: 'active',
    joined: 'Jun 1, 2023',
    currentProperty: '12 Gloucester Road, Flat 2',
    currentLandlord: { name: 'Lisa Patel (Patel Estates)', id: 9 },
    tenancyStatus: 'Active AST',
    depositScheme: 'TDS Insured #TDS-4419',
    rightToRent: 'Verified',
    pastTenanciesCount: 2,
  },
  {
    id: 3,
    name: 'Michael Lee',
    email: 'michael.l@email.com',
    role: 'tenant',
    status: 'active',
    joined: 'Mar 10, 2024',
    currentProperty: '9 The Crescent, Bath',
    currentLandlord: { name: 'Lisa Patel (Patel Estates)', id: 9 },
    tenancyStatus: 'Active AST',
    depositScheme: 'DPS Custodial #DPS-3301',
    rightToRent: 'Verified',
    pastTenanciesCount: 0,
  },
  {
    id: 8,
    name: 'Emma Roberts (In-Transit Renter)',
    email: 'emma.r@email.com',
    role: 'tenant',
    status: 'active',
    joined: 'Dec 1, 2022',
    currentProperty: 'Relocating (Previous: 22 Kensington Gardens)',
    currentLandlord: { name: 'Nordica Properties UK Ltd', id: 12 },
    tenancyStatus: 'In-Transit',
    depositScheme: 'DPS Transfer In-Flight',
    rightToRent: 'Verified',
    pastTenanciesCount: 3,
  },
  {
    id: 5,
    name: 'James Chen',
    email: 'james.chen@email.com',
    role: 'tenant',
    status: 'pending',
    joined: 'Jul 2, 2026',
    currentProperty: '44 Park Lane, Mayfair',
    currentLandlord: { name: 'John Smith (Smith Holdings)', id: 0 },
    tenancyStatus: 'Notice Served',
    depositScheme: 'DPS Custodial #DPS-9912',
    rightToRent: 'Pending',
    pastTenanciesCount: 1,
  },
  {
    id: 4,
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    role: 'tenant',
    status: 'active',
    joined: 'Jun 5, 2024',
    currentProperty: 'Unit 8, High Street Wharf',
    currentLandlord: { name: 'Anna Kowalski', id: 11 },
    tenancyStatus: 'Active AST',
    depositScheme: 'DPS Custodial #DPS-7740',
    rightToRent: 'Verified',
    pastTenanciesCount: 1,
  },

  // Verified Contractors (Tradespeople servicing multiple landlords)
  {
    id: 6,
    name: 'Apex Heating & Gas Ltd',
    email: 'jobs@apexheating.co.uk',
    role: 'contractor',
    status: 'active',
    joined: 'Feb 20, 2024',
    trade: 'Gas Safe Heating & Boiler Engineer (CP12)',
    accreditationId: 'Gas Safe #559102',
    assignedLandlordsCount: 6,
    jobsCompleted: 48,
    rating: 4.9,
  },
  {
    id: 7,
    name: 'NICEIC Certified Electricians Ltd',
    email: 'compliance@niceicelectric.co.uk',
    role: 'contractor',
    status: 'active',
    joined: 'Nov 8, 2023',
    trade: 'NICEIC Approved Electrical Inspector (EICR)',
    accreditationId: 'NICEIC #88129',
    assignedLandlordsCount: 5,
    jobsCompleted: 34,
    rating: 4.8,
  },
]

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 0,
    name: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 property', 'Up to 2 units', 'Basic support'],
    active: true,
    subscribers: 1,
  },
  {
    id: 1,
    name: 'Pro',
    priceMonthly: 19,
    priceYearly: 190,
    features: ['Up to 5 properties', 'Unlimited units', 'Tenant portal', 'Priority support'],
    active: true,
    subscribers: 2,
  },
  {
    id: 2,
    name: 'Portfolio',
    priceMonthly: 49,
    priceYearly: 490,
    features: ['Unlimited properties', 'Multi-user team', 'API access', 'Dedicated support'],
    active: true,
    subscribers: 1,
  },
]

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 0, userId: 0, userName: 'John Smith', email: 'john@landlordhq.co.uk', role: 'landlord', plan: 'Portfolio', billing: 'monthly', amount: 49, status: 'active', started: 'Jan 12, 2024', renews: 'Aug 12, 2026' },
  { id: 1, userId: 9, userName: 'Lisa Patel', email: 'lisa.patel@email.com', role: 'landlord', plan: 'Pro', billing: 'yearly', amount: 190, status: 'active', started: 'Apr 3, 2025', renews: 'Apr 3, 2027' },
  { id: 2, userId: 11, userName: 'Anna Kowalski', email: 'anna.k@email.com', role: 'landlord', plan: 'Pro', billing: 'monthly', amount: 19, status: 'active', started: 'Jun 22, 2025', renews: 'Jul 22, 2026' },
  { id: 3, userId: 10, userName: 'Tom Wright', email: 'tom.wright@email.com', role: 'landlord', plan: 'Starter', billing: 'monthly', amount: 0, status: 'trial', started: 'May 18, 2025', renews: '—' },
]

const landlordUserIds = () => new Set(MOCK_USERS.filter((u) => u.role === 'landlord').map((u) => u.id))

/** Subscriptions are landlord-only — tenants and contractors never appear here */
export function getLandlordSubscriptions(): Subscription[] {
  const ids = landlordUserIds()
  return MOCK_SUBSCRIPTIONS.filter((s) => s.role === 'landlord' && ids.has(s.userId))
}

export const MONTHLY_METRICS: MonthlyMetric[] = [
  { month: 'Jan', revenue: 420, users: 42, landlords: 8 },
  { month: 'Feb', revenue: 480, users: 48, landlords: 9 },
  { month: 'Mar', revenue: 510, users: 55, landlords: 10 },
  { month: 'Apr', revenue: 620, users: 62, landlords: 11 },
  { month: 'May', revenue: 680, users: 71, landlords: 12 },
  { month: 'Jun', revenue: 740, users: 78, landlords: 13 },
  { month: 'Jul', revenue: 820, users: 86, landlords: 14 },
]

export const MOCK_CMS: CmsPage[] = [
  { id: 'faq', title: 'FAQ', slug: 'faq', updated: 'Jul 10, 2026', published: true, preview: 'How do I add a property? How does tenant invite work?' },
  { id: 'privacy', title: 'Privacy Policy', slug: 'privacy', updated: 'Jun 1, 2026', published: true, preview: 'We collect account data, property details, and usage analytics…' },
  { id: 'terms', title: 'Terms & Conditions', slug: 'terms', updated: 'Jun 1, 2026', published: true, preview: 'By using Landlord HQ you agree to our service terms…' },
  { id: 'about', title: 'About', slug: 'about', updated: 'May 15, 2026', published: true, preview: 'Landlord HQ helps UK landlords manage properties, tenants, and compliance.' },
]

export const MOCK_SUPPORT: SupportMessage[] = [
  { id: 0, from: 'John Smith', email: 'john@landlordhq.co.uk', role: 'landlord', subject: 'Billing question', message: 'Can I switch from monthly to yearly billing?', status: 'open', time: '2h ago' },
  { id: 1, from: 'Lisa Patel', email: 'lisa.patel@email.com', role: 'landlord', subject: 'Add team member', message: 'How do I invite a co-manager to my account?', status: 'replied', time: '1d ago' },
  { id: 2, from: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'tenant', subject: 'Cannot log in', message: 'Password reset link expired. Please help.', status: 'open', time: '1d ago' },
  { id: 3, from: 'Mike Thompson', email: 'mike@plumberpro.co.uk', role: 'contractor', subject: 'Profile verification', message: 'Submitted documents 3 days ago — any update?', status: 'closed', time: '3d ago' },
]

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  { id: 0, userId: 0, userName: 'John Smith', email: 'john@landlordhq.co.uk', plan: 'Portfolio', amount: 49, billing: 'monthly', method: 'card', status: 'completed', date: 'Jul 12, 2026', reference: 'TXN-7F2A91' },
  { id: 1, userId: 9, userName: 'Lisa Patel', email: 'lisa.patel@email.com', plan: 'Pro', amount: 190, billing: 'yearly', method: 'card', status: 'completed', date: 'Jul 3, 2026', reference: 'TXN-8B14C2' },
  { id: 2, userId: 11, userName: 'Anna Kowalski', email: 'anna.k@email.com', plan: 'Pro', amount: 19, billing: 'monthly', method: 'card', status: 'completed', date: 'Jun 22, 2026', reference: 'TXN-3D9E55' },
  { id: 3, userId: 0, userName: 'John Smith', email: 'john@landlordhq.co.uk', plan: 'Portfolio', amount: 49, billing: 'monthly', method: 'card', status: 'completed', date: 'Jun 12, 2026', reference: 'TXN-1A8F33' },
  { id: 4, userId: 11, userName: 'Anna Kowalski', email: 'anna.k@email.com', plan: 'Pro', amount: 19, billing: 'monthly', method: 'bank', status: 'failed', date: 'May 22, 2026', reference: 'TXN-FAIL02' },
  { id: 5, userId: 9, userName: 'Lisa Patel', email: 'lisa.patel@email.com', plan: 'Pro', amount: 19, billing: 'monthly', method: 'card', status: 'refunded', date: 'Apr 3, 2025', reference: 'TXN-REF881' },
]

export const MOCK_ADMINS: AdminAccount[] = [
  { id: 'admin-0', name: 'Sazzad Chowdhury', email: 'sazzad.uiuxdesign@gmail.com', role: 'super', addedAt: 'Jan 10, 2025' },
  { id: 'admin-1', name: 'Camille Laurent', email: 'camille@landlordhq.co.uk', role: 'admin', addedAt: 'Mar 12, 2025' },
  { id: 'admin-2', name: 'Julian Vance', email: 'julian.finance@landlordhq.co.uk', role: 'admin', addedAt: 'Apr 5, 2025' },
  { id: 'admin-3', name: 'Amara Diallo', email: 'amara.compliance@landlordhq.co.uk', role: 'admin', addedAt: 'Jun 18, 2025' },
]

export function getPlatformStats(): PlatformStats {
  const landlords = MOCK_USERS.filter((u) => u.role === 'landlord').length
  const tenants = MOCK_USERS.filter((u) => u.role === 'tenant').length
  const contractors = MOCK_USERS.filter((u) => u.role === 'contractor').length
  const subs = getLandlordSubscriptions()
  const activeSubscriptions = subs.filter((s) => s.status === 'active').length
  const mrr = subs.filter((s) => s.status === 'active' && s.billing === 'monthly').reduce((s, sub) => s + sub.amount, 0)
    + Math.round(subs.filter((s) => s.status === 'active' && s.billing === 'yearly').reduce((s, sub) => s + sub.amount, 0) / 12)
  const trialLandlords = subs.filter((s) => s.status === 'trial').length
  const openSupport = MOCK_SUPPORT.filter((m) => m.status === 'open').length

  return {
    totalUsers: MOCK_USERS.length,
    landlords,
    tenants,
    contractors,
    activeSubscriptions,
    mrr,
    arr: mrr * 12,
    trialLandlords,
    openSupport,
  }
}
