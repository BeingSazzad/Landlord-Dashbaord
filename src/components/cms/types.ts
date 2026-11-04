import type { AppOptionType } from '@/types/api.types'

export type CmsSection = 'options' | 'faqs' | 'privacy' | 'terms' | 'about'

export const OPTION_TABS: { label: string; type: AppOptionType }[] = [
  { label: 'Issue type', type: 'issue_type' },
  { label: 'Primary Trade', type: 'trade' },
  { label: 'Property type', type: 'property_type' },
  { label: 'Communal area', type: 'communal_area' },
]

