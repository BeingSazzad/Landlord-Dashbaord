import {
  FileText,
  HelpCircle,
  Info,
  Shield,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CmsSection } from '../types'

interface NavItem {
  id: CmsSection
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { id: 'options', label: 'App Dropdown Options', icon: SlidersHorizontal },
  { id: 'faqs', label: 'Help & FAQ', icon: HelpCircle },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'about', label: 'About Us', icon: Info },
]

interface CmsSidebarNavProps {
  activeSection: CmsSection
  onSectionChange: (section: CmsSection) => void
}

export function CmsSidebarNav({
  activeSection,
  onSectionChange,
}: CmsSidebarNavProps) {
  return (
    <div className="space-y-2.5">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={cn(
              'w-full text-left rounded-2xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between',
              isActive
                ? 'bg-white border-2 border-brand-500 shadow-sm text-brand-700 font-bold'
                : 'bg-white border border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-medium'
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-brand-600' : 'text-slate-400')}
              />
              <span className="text-sm truncate">{label}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

