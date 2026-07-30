import { PageHeader } from '@/components/layout/PageHeader'
import { SettingsPanel } from '@/components/settings/SettingsPanel'

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Admin profile, password, photo and team management." />
      <SettingsPanel />
    </>
  )
}
