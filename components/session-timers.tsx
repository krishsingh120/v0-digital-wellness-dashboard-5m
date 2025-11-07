"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Coffee, Leaf } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Timer {
  type: "focus" | "break" | "meditate"
  duration: number
  label: string
  icon: React.ReactNode
  color: string
}

export function SessionTimers() {
  const { toast } = useToast()
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(0)

  const timers: Timer[] = [
    {
      type: "focus",
      duration: 25 * 60,
      label: "Focus Session",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-primary",
    },
    {
      type: "break",
      duration: 5 * 60,
      label: "Short Break",
      icon: <Coffee className="w-5 h-5" />,
      color: "bg-accent",
    },
    {
      type: "meditate",
      duration: 10 * 60,
      label: "Meditation",
      icon: <Leaf className="w-5 h-5" />,
      color: "bg-secondary",
    },
  ]

  const startTimer = (duration: number, label: string) => {
    setActiveTimer(label)
    setRemaining(duration)
    toast({
      title: "Timer started",
      description: `${label} for ${Math.floor(duration / 60)} minutes`,
    })

    let count = duration
    const interval = setInterval(() => {
      count--
      setRemaining(count)

      if (count === 0) {
        clearInterval(interval)
        setActiveTimer(null)
        toast({
          title: "Timer complete!",
          description: `${label} session finished`,
        })
      }
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <Card className="border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Timers</CardTitle>
        <CardDescription>Session management tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active Timer Display */}
        {activeTimer && (
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">{activeTimer}</p>
            <div className="text-3xl font-bold font-mono text-primary">{formatTime(remaining)}</div>
          </div>
        )}

        {/* Timer Buttons */}
        {timers.map((timer) => (
          <Button
            key={timer.type}
            onClick={() => startTimer(timer.duration, timer.label)}
            disabled={activeTimer !== null}
            className="w-full justify-start gap-3 h-12"
            variant={activeTimer === timer.label ? "default" : "outline"}
          >
            <div className={`w-2 h-2 rounded-full ${timer.color}`}></div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{timer.label}</div>
              <div className="text-xs opacity-70">{Math.floor(timer.duration / 60)} min</div>
            </div>
          </Button>
        ))}

        {activeTimer && (
          <Button
            onClick={() => {
              setActiveTimer(null)
              setRemaining(0)
            }}
            variant="destructive"
            className="w-full"
          >
            Cancel Timer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
