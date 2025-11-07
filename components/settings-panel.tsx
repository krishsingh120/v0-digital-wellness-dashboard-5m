"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, Volume2, Eye, Type } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AppSettings {
  soundEnabled: boolean
  theme: "light" | "dark" | "auto"
  textSize: "small" | "medium" | "large"
  highContrast: boolean
  reduceMotion: boolean
  focusModeEnabled: boolean
  dataRetention: number // days
}

export function SettingsPanel() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    theme: "auto",
    textSize: "medium",
    highContrast: false,
    reduceMotion: false,
    focusModeEnabled: false,
    dataRetention: 365,
  })

  useEffect(() => {
    const saved = localStorage.getItem("app-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings))
    applySettings()
  }, [settings])

  const applySettings = () => {
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark")
    }

    // Apply text size
    const sizeMap = { small: "14px", medium: "16px", large: "18px" }
    document.documentElement.style.fontSize = sizeMap[settings.textSize]

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply reduce motion
    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }

  const exportData = () => {
    const allData = {
      screenTime: localStorage.getItem("wellness-tracking"),
      pomodoroSessions: localStorage.getItem("pomodoro-sessions"),
      breathingExercises: localStorage.getItem("breathing-exercises"),
      eyeExercises: localStorage.getItem("eye-exercises"),
      habits: localStorage.getItem("habits"),
      customTimers: localStorage.getItem("custom-timers"),
      notifications: localStorage.getItem("notifications"),
      settings: localStorage.getItem("app-settings"),
      breakReminderSettings: localStorage.getItem("break-reminder-settings"),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `wellness-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    toast({
      title: "Data exported",
      description: "Your wellness data has been downloaded",
    })
  }

  const importData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result)
          Object.entries(data).forEach(([key, value]) => {
            if (key !== "exportDate" && value) {
              localStorage.setItem(key, value as string)
            }
          })
          toast({
            title: "Data imported",
            description: "Your wellness data has been restored",
          })
          window.location.reload()
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The file format is invalid",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      localStorage.clear()
      sessionStorage.clear()
      toast({
        title: "Data cleared",
        description: "All wellness data has been deleted",
      })
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Display Settings
          </CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {["light", "dark", "auto"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme: theme as AppSettings["theme"] })}
                  className={`p-2 rounded-lg border transition-colors text-sm font-medium capitalize ${
                    settings.theme === theme
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Text Size</label>
            <div className="flex gap-2">
              {["small", "medium", "large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, textSize: size as AppSettings["textSize"] })}
                  className={`flex-1 p-2 rounded-lg border transition-colors text-sm font-medium capitalize ${
                    settings.textSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Type className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <label className="text-sm font-medium">High Contrast</label>
            <button
              onClick={() => setSettings({ ...settings, highContrast: !settings.highContrast })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.highContrast ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.highContrast ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <label className="text-sm font-medium">Reduce Motion</label>
            <button
              onClick={() => setSettings({ ...settings, reduceMotion: !settings.reduceMotion })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reduceMotion ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reduceMotion ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-accent" />
            Sound Settings
          </CardTitle>
          <CardDescription>Configure audio notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
            <label className="text-sm font-medium">Sound Effects</label>
            <button
              onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Focus Mode */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Focus Mode
          </CardTitle>
          <CardDescription>Minimize distractions while working</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div>
              <label className="text-sm font-medium">Enable Focus Mode</label>
              <p className="text-xs text-muted-foreground mt-1">Hides non-essential UI elements</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, focusModeEnabled: !settings.focusModeEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.focusModeEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.focusModeEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-secondary" />
            Data Management
          </CardTitle>
          <CardDescription>Export, import, or delete your wellness data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={exportData} variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Data as JSON
          </Button>
          <Button onClick={importData} variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Import Data from File
          </Button>
          <Button
            onClick={clearAllData}
            variant="outline"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* About & Help */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>About Wellness Dashboard</CardTitle>
          <CardDescription>Version 1.0.0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>A comprehensive wellness tracking application designed to help you maintain digital health.</p>
          <ul className="list-disc list-inside space-y-1 text-xs mt-3">
            <li>Real-time screen-time tracking</li>
            <li>Pomodoro and custom timers</li>
            <li>Guided breathing and eye exercises</li>
            <li>Habit tracking and analytics</li>
            <li>Smart break reminders</li>
            <li>Full data export and privacy control</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
