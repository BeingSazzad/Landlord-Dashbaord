import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { CmsSidebarNav } from './components/CmsSidebarNav'
import { FaqsTab } from './tabs/faqs/FaqsTab'
import { OptionsTab } from './tabs/options/OptionsTab'
import { RuleDocumentTab } from './tabs/rules/RuleDocumentTab'
import type { CmsSection } from './types'

export function CmsPanel() {
  const [activeSection, setActiveSection] = useState<CmsSection>('options')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Split Grid: Left Sidebar Tabs vs Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Menu */}
        <div className="lg:col-span-3">
          <CmsSidebarNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          {activeSection === 'options' && <OptionsTab onFlash={showToast} />}
          {activeSection === 'faqs' && <FaqsTab onFlash={showToast} />}
          {activeSection === 'privacy' && (
            <RuleDocumentTab
              type="policy"
              title="Privacy Policy"
              onFlash={showToast}
            />
          )}
          {activeSection === 'terms' && (
            <RuleDocumentTab
              type="terms"
              title="Terms & Conditions"
              onFlash={showToast}
            />
          )}
          {activeSection === 'about' && (
            <RuleDocumentTab
              type="about"
              title="About Us"
              onFlash={showToast}
            />
          )}
        </div>
      </div>
    </div>
  )
}
