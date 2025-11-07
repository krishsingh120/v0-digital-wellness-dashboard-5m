"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BreakReminderSettings {
  enabled: boolean
  interval: number
  breakDuration: number
  notificationsEnabled: boolean
}

export function BreakReminder() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<BreakReminderSettings>({
    enabled: true,
    interval: 60, // minutes
    breakDuration: 5,
    notificationsEnabled: true,
  })
  const [timeUntilBreak, setTimeUntilBreak] = useState(settings.interval * 60)
  const [nextBreakTime, setNextBreakTime] = useState<Date | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("break-reminder-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("break-reminder-settings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!settings.enabled) return

    // Set next break time
    const next = new Date()
    next.setMinutes(next.getMinutes() + settings.interval)
    setNextBreakTime(next)

    const interval = setInterval(() => {
      setTimeUntilBreak((prev) => {
        if (prev <= 1) {
          if (settings.notificationsEnabled) {
            sendNotification()
          }
          // Reset for next break
          setTimeUntilBreak(settings.interval * 60)
          const nextBreak = new Date()
          nextBreak.setMinutes(nextBreak.getMinutes() + settings.interval)
          setNextBreakTime(nextBreak)
          return settings.interval * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [settings])

  const sendNotification = () => {
    if (!("Notification" in window)) return

    if (Notification.permission === "granted") {
      new Notification("Time for a break!", {
        body: `You've been working for ${settings.interval} minutes. Take a ${settings.breakDuration} minute break to rest your eyes and stretch.`,
        icon: "/icon.svg",
        tag: "break-reminder",
      })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Time for a break!", {
            body: `You've been working for ${settings.interval} minutes. Take a ${settings.breakDuration} minute break to rest your eyes and stretch.`,
            icon: "/icon.svg",
            tag: "break-reminder",
          })
        }
      })
    }

    toast({
      title: "Time for a break!",
      description: `You've been working for ${settings.interval} minutes. Take a ${settings.breakDuration} minute break.`,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Break Reminders
        </CardTitle>
        <CardDescription>Smart notifications for regular breaks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div>
            <p className="font-medium text-sm">Reminders {settings.enabled ? "Active" : "Inactive"}</p>
            {nextBreakTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Next break at {nextBreakTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
          <div className="text-3xl font-bold font-mono text-primary">{formatTime(timeUntilBreak)}</div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Enable Reminders</span>
              <button
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Reminder Interval: {settings.interval} minutes</label>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={settings.interval}
              onChange={(e) => {
                setSettings({ ...settings, interval: Number(e.target.value) })
                setTimeUntilBreak(Number(e.target.value) * 60)
              }}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Set how often you want break reminders</p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Break Duration: {settings.breakDuration} minutes</label>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={settings.breakDuration}
              onChange={(e) => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Recommended break length</p>
          </div>

          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium">Browser Notifications</span>
              <button
                onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notificationsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <p className="text-xs text-muted-foreground mt-1">Receive system notifications for breaks</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={sendNotification} variant="outline" className="gap-2 bg-transparent">
            <Bell className="w-4 h-4" />
            Test Alert
          </Button>
          <Button onClick={() => setTimeUntilBreak(0)} variant="outline" className="gap-2">
            <Pause className="w-4 h-4" />
            Skip Ahead
          </Button>
        </div>

        {/* Tips */}
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Break Reminder Tips:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Take breaks every 60 minutes for best focus</li>
            <li>Use breaks for eye exercises (20-20-20 rule)</li>
            <li>Walk around or stretch during breaks</li>
            <li>Stay hydrated and take deep breaths</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
