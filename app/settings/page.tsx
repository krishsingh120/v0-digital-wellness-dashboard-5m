"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsPanel } from "@/components/settings-panel"
import { AccessibilityInfo } from "@/components/accessibility-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, HelpCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings & Preferences</h1>
          <p className="text-muted-foreground">Customize your wellness dashboard experience</p>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6 mt-6">
            <AccessibilityInfo />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
