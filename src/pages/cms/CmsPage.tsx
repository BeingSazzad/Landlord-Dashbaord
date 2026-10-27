import { PageHeader } from '@/components/layout/PageHeader'
import { CmsPanel } from '@/components/cms/CmsPanel'

export function CmsPage() {
  return (
    <>
      <PageHeader
        title="CMS"
        description="Manage website policies, partner brand logos, FAQs, and branding assets."
      />
      <CmsPanel />
    </>
  )
}
