"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Activity } from "lucide-react" // Declared the Activity variable

export function ScreenTimeTracker() {
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [screenTime, setScreenTime] = useState(0)
  const [sessionStart, setSessionStart] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("wellness-tracking")
    if (saved) {
      const data = JSON.parse(saved)
      setScreenTime(data.totalTime || 0)
      setIsTracking(data.isTracking || false)
      if (data.isTracking) {
        setSessionStart(data.sessionStart)
      }
    }
  }, [])

  useEffect(() => {
    if (!isTracking) return

    const startTime = sessionStart || Date.now()
    const interval = setInterval(() => {
      setScreenTime((prev) => prev + 1)
      localStorage.setItem(
        "wellness-tracking",
        JSON.stringify({
          totalTime: screenTime + 1,
          isTracking: true,
          sessionStart: startTime,
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking, screenTime, sessionStart])

  const toggleTracking = () => {
    if (!isTracking) {
      setSessionStart(Date.now())
      setIsTracking(true)
      toast({
        title: "Tracking started",
        description: "Your screen time is being monitored",
      })
    } else {
      setIsTracking(false)
      toast({
        title: "Tracking paused",
        description: "Session data saved",
      })
    }
  }

  const resetSession = () => {
    setScreenTime(0)
    setIsTracking(false)
    setSessionStart(null)
    localStorage.removeItem("wellness-tracking")
    toast({
      title: "Session reset",
      description: "All tracking data cleared",
    })
  }

  const hours = Math.floor(screenTime / 3600)
  const minutes = Math.floor((screenTime % 3600) / 60)
  const seconds = screenTime % 60

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Screen Time Tracker
        </CardTitle>
        <CardDescription>Real-time monitoring of your screen exposure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 text-center border border-primary/10">
          <div className="text-5xl font-bold text-primary font-mono">
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Time monitored today</p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className={`w-2 h-2 rounded-full ${isTracking ? "bg-accent animate-pulse" : "bg-muted"}`}></div>
          <span className="text-sm font-medium">
            {isTracking ? "Actively tracking your screen time" : "Tracking paused"}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={toggleTracking}
            className={`flex-1 gap-2 ${isTracking ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}`}
          >
            {isTracking ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" onClick={resetSession} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Warning */}
        {screenTime > 28800 && (
          <div className="flex gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-sm text-destructive">High screen time detected</p>
              <p className="text-xs text-destructive/80 mt-1">Consider taking a break with one of our exercises</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
