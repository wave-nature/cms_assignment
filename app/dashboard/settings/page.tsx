import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SettingsForm } from "@/components/dashboard/settings-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Settings" text="Manage your account and preferences" />
      <SettingsForm />
    </div>
  )
}
