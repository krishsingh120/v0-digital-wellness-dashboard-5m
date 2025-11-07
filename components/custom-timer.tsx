"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomTimer {
  id: string
  name: string
  duration: number
  remaining: number
  isRunning: boolean
}

export function CustomTimer() {
  const { toast } = useToast()
  const [timers, setTimers] = useState<CustomTimer[]>([])
  const [newName, setNewName] = useState("")
  const [newDuration, setNewDuration] = useState("5")
  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({})

  useEffect(() => {
    const saved = localStorage.getItem("custom-timers")
    if (saved) {
      setTimers(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("custom-timers", JSON.stringify(timers))
  }, [timers])

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => clearInterval(interval))
    }
  }, [])

  const addTimer = () => {
    if (!newName.trim() || !newDuration || isNaN(Number(newDuration))) {
      toast({
        title: "Invalid input",
        description: "Please enter a name and valid duration",
        variant: "destructive",
      })
      return
    }

    const duration = Number(newDuration) * 60
    const timer: CustomTimer = {
      id: Date.now().toString(),
      name: newName,
      duration,
      remaining: duration,
      isRunning: false,
    }

    setTimers([...timers, timer])
    setNewName("")
    setNewDuration("5")
    toast({
      title: "Timer added",
      description: `${newName} timer created`,
    })
  }

  const toggleTimer = (id: string) => {
    setTimers(
      timers.map((timer) => {
        if (timer.id === id) {
          const newState = !timer.isRunning

          if (newState) {
            // Start
            intervalsRef.current[id] = setInterval(() => {
              setTimers((prevTimers) => {
                return prevTimers.map((t) => {
                  if (t.id === id) {
                    const newRemaining = t.remaining - 1
                    if (newRemaining <= 0) {
                      clearInterval(intervalsRef.current[id])
                      delete intervalsRef.current[id]
                      toast({
                        title: "Timer complete!",
                        description: `${t.name} finished`,
                      })
                      return { ...t, remaining: 0, isRunning: false }
                    }
                    return { ...t, remaining: newRemaining }
                  }
                  return t
                })
              })
            }, 1000)
          } else {
            // Pause
            if (intervalsRef.current[id]) {
              clearInterval(intervalsRef.current[id])
              delete intervalsRef.current[id]
            }
          }

          return { ...timer, isRunning: newState }
        }
        return timer
      }),
    )
  }

  const resetTimer = (id: string) => {
    setTimers(
      timers.map((timer) => {
        if (timer.id === id) {
          if (intervalsRef.current[id]) {
            clearInterval(intervalsRef.current[id])
            delete intervalsRef.current[id]
          }
          return { ...timer, remaining: timer.duration, isRunning: false }
        }
        return timer
      }),
    )
  }

  const deleteTimer = (id: string) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id])
      delete intervalsRef.current[id]
    }
    setTimers(timers.filter((t) => t.id !== id))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Custom Timers</CardTitle>
        <CardDescription>Create unlimited timers for any activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Timer */}
        <div className="flex gap-2">
          <Input
            placeholder="Timer name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Minutes"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            className="w-20"
            min="1"
          />
          <Button onClick={addTimer} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Timer List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {timers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No timers yet</p>
              <p className="text-xs mt-1">Create one to get started</p>
            </div>
          ) : (
            timers.map((timer) => (
              <div
                key={timer.id}
                className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{timer.name}</p>
                    <p className="text-2xl font-mono font-bold text-primary mt-1">{formatTime(timer.remaining)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => toggleTimer(timer.id)}
                      size="sm"
                      variant={timer.isRunning ? "default" : "outline"}
                    >
                      {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button onClick={() => resetTimer(timer.id)} size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTimer(timer.id)}
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(1 - timer.remaining / timer.duration) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
