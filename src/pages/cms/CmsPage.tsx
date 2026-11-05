import { PageHeader } from '@/components/layout/PageHeader'
import { CmsPanel } from '@/components/cms/CmsPanel'

export function CmsPage() {
  return (
    <>
      <PageHeader
        title="CMS"
        description="Mobile app FAQs, privacy policy, and terms."
      />
      <CmsPanel />
    </>
  )
}
