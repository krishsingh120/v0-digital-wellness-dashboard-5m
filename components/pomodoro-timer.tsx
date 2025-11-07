"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PomodoroSession {
  id: string
  date: string
  type: "focus" | "break"
  duration: number
  completed: boolean
}

export function PomodoroTimer() {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [sessionType, setSessionType] = useState<"focus" | "break">("focus")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const focusDuration = 25 * 60
  const breakDuration = 5 * 60
  const longBreakDuration = 15 * 60

  useEffect(() => {
    const saved = localStorage.getItem("pomodoro-sessions")
    if (saved) {
      const sessions = JSON.parse(saved)
      const todaySessions = sessions.filter((s: PomodoroSession) => s.date === new Date().toISOString().split("T")[0])
      setSessionsCompleted(todaySessions.filter((s: PomodoroSession) => s.completed).length)
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          playSound()
          saveSession()
          switchSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const playSound = () => {
    if (!soundEnabled || !audioRef.current) return
    audioRef.current.play().catch(() => {})
  }

  const saveSession = () => {
    const sessions = JSON.parse(localStorage.getItem("pomodoro-sessions") || "[]")
    sessions.push({
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: sessionType,
      duration: sessionType === "focus" ? focusDuration : breakDuration,
      completed: true,
    })
    localStorage.setItem("pomodoro-sessions", JSON.stringify(sessions))
    setSessionsCompleted((prev) => prev + 1)
  }

  const switchSession = () => {
    if (sessionType === "focus") {
      setSessionType(sessionsCompleted % 4 === 3 ? "break" : "break")
      setTimeLeft(sessionsCompleted % 4 === 3 ? longBreakDuration : breakDuration)
      toast({
        title: "Great work!",
        description: "Time for a break. You've completed a focus session!",
      })
    } else {
      setSessionType("focus")
      setTimeLeft(focusDuration)
      toast({
        title: "Break over!",
        description: "Ready for another focus session?",
      })
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(sessionType === "focus" ? focusDuration : breakDuration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isFocusSession = sessionType === "focus"
  const bgColor = isFocusSession ? "from-primary/5 to-primary/10" : "from-accent/5 to-accent/10"
  const borderColor = isFocusSession ? "border-primary/20" : "border-accent/20"
  const textColor = isFocusSession ? "text-primary" : "text-accent"

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
        <CardDescription>Proven technique for focused work sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <audio
          ref={audioRef}
          src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
        />

        {/* Session Type Indicator */}
        <Tabs
          defaultValue="focus"
          value={sessionType}
          onValueChange={(v) => {
            setSessionType(v as "focus" | "break")
            resetTimer()
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="break">Break</TabsTrigger>
          </TabsList>
          <TabsContent value="focus" className="mt-4"></TabsContent>
          <TabsContent value="break" className="mt-4"></TabsContent>
        </Tabs>

        {/* Timer Display */}
        <div className={`bg-gradient-to-br ${bgColor} rounded-xl p-8 text-center border ${borderColor}`}>
          <div className={`text-6xl font-bold font-mono ${textColor}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <p className="text-sm text-muted-foreground mt-3">{isFocusSession ? "Focus Session" : "Break Time"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-muted-foreground">Sessions Today</p>
            <p className="text-2xl font-bold text-secondary">{sessionsCompleted}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">Focus Time</p>
            <p className="text-2xl font-bold text-primary">
              {sessionsCompleted * 25} <span className="text-xs">min</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button onClick={toggleTimer} className="flex-1 gap-2 bg-primary hover:bg-primary/90">
            {isRunning ? (
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
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="outline" size="icon">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isFocusSession ? "bg-primary" : "bg-accent"}`}
            style={{
              width: `${(((isFocusSession ? focusDuration : breakDuration) - timeLeft) / (isFocusSession ? focusDuration : breakDuration)) * 100}%`,
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}
