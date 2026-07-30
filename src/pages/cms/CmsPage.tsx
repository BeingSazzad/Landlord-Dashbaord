import { PageHeader } from '@/components/layout/PageHeader'
import { CmsPanel } from '@/components/cms/CmsPanel'

export function CmsPage() {
  return (
    <>
      <PageHeader title="CMS" description="Edit FAQ, Privacy, Terms and About shown in the mobile app." />
      <CmsPanel />
    </>
  )
}
