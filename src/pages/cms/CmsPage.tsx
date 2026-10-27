import { PageHeader } from '@/components/layout/PageHeader'
import { CmsPanel } from '@/components/cms/CmsPanel'

export function CmsPage() {
  return (
    <>
      <PageHeader
        title="CMS"
        description="Manage website policies, FAQs, contractor trades, regulatory compliance partners, and branding assets for the mobile app."
      />
      <CmsPanel />
    </>
  )
}
