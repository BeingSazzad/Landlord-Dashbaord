import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface NotificationsTabProps {
  onFlash: (message: string) => void
}

export function NotificationsTab({ onFlash }: NotificationsTabProps) {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityAlerts: true,
    weeklyDigest: false,
  })

  const handleSave = () => {
    onFlash('Notification preferences updated successfully.')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="admin-card p-6 sm:p-7 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage your notification settings</p>
        </div>

        <div className="space-y-5 divide-y divide-slate-100">
          {/* Alert 1: Email Notifications */}
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-semibold text-slate-900">Email Notifications</p>
              <p className="text-xs text-slate-500">
                Receive important updates and platform activity alerts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) =>
                  setNotifications((p) => ({ ...p, emailAlerts: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Alert 2: Security & Login Alerts */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-semibold text-slate-900">Security & Login Alerts</p>
              <p className="text-xs text-slate-500">
                Get notified of new sign-ins and security-related changes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={(e) =>
                  setNotifications((p) => ({ ...p, securityAlerts: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          {/* Alert 3: Weekly Digest */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <p className="text-sm font-semibold text-slate-900">Weekly Activity Digest</p>
              <p className="text-xs text-slate-500">
                A weekly summary of key platform metrics and activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) =>
                  setNotifications((p) => ({ ...p, weeklyDigest: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <Button onClick={handleSave} className="!bg-brand-600 hover:!bg-brand-700 font-bold">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

