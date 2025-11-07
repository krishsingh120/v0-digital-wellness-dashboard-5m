"use client"

import { useState, useEffect } from "react"
import { ScreenTimeTracker } from "@/components/screen-time-tracker"
import { SessionTimers } from "@/components/session-timers"
import { DashboardHeader } from "@/components/dashboard-header"
import { QuickStats } from "@/components/quick-stats"
import { WellnessChart } from "@/components/wellness-chart"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { CustomTimer } from "@/components/custom-timer"
import { BreathingExercise } from "@/components/breathing-exercise"
import { EyeCareExercise } from "@/components/eye-care-exercise"
import { HabitTracker } from "@/components/habit-tracker"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { WeeklyReport } from "@/components/weekly-report"
import { BreakReminder } from "@/components/break-reminder"
import { NotificationCenter } from "@/components/notification-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-8">
          {/* Dashboard Content */}
          <div className="animate-fade-in">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/30 p-2 rounded-xl border border-border/20">
                <TabsTrigger
                  value="dashboard"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="tools"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Tools
                </TabsTrigger>
                <TabsTrigger
                  value="reminders"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Reminders
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-8 mt-8">
                <QuickStats />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <ScreenTimeTracker />
                    <WellnessChart />
                  </div>
                  <div>
                    <SessionTimers />
                  </div>
                </div>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <PomodoroTimer />
                    <CustomTimer />
                    <BreathingExercise />
                    <EyeCareExercise />
                    <HabitTracker />
                  </div>
                  <div>
                    <SessionTimers />
                  </div>
                </div>
              </TabsContent>

              {/* Reminders Tab */}
              <TabsContent value="reminders" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <BreakReminder />
                    <NotificationCenter />
                  </div>
                  <div>
                    <SessionTimers />
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-8 mt-8">
                <AnalyticsDashboard />
                <WeeklyReport />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}
