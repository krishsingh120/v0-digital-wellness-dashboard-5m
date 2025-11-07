"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Habit {
  id: string
  name: string
  color: string
  completedDates: string[]
}

const COLORS = ["bg-primary", "bg-accent", "bg-secondary", "bg-blue-500", "bg-emerald-500", "bg-purple-500"]

export function HabitTracker() {
  const { toast } = useToast()
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitColor, setNewHabitColor] = useState(COLORS[0])
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const saved = localStorage.getItem("habits")
    if (saved) {
      setHabits(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (!newHabitName.trim()) {
      toast({
        title: "Enter habit name",
        description: "Please enter a name for your habit",
        variant: "destructive",
      })
      return
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      color: newHabitColor,
      completedDates: [],
    }

    setHabits([...habits, habit])
    setNewHabitName("")
    setNewHabitColor(COLORS[0])
    toast({
      title: "Habit added",
      description: `${newHabitName} tracking started`,
    })
  }

  const toggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(today)
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((d) => d !== today)
              : [...habit.completedDates, today],
          }
        }
        return habit
      }),
    )
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
  }

  const getStreak = (habit: Habit) => {
    let streak = 0
    const dates = [...habit.completedDates].sort().reverse()
    let currentDate = new Date(today)

    for (const date of dates) {
      const checkDate = new Date(date)
      const diff = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diff === streak) {
        streak++
      } else {
        break
      }

      currentDate = new Date(date)
    }

    return streak
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Daily Habits</CardTitle>
        <CardDescription>Track healthy habits to build better routines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Habit */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a new habit..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addHabit()}
            className="flex-1"
          />
          <Button onClick={addHabit} className="bg-primary">
            +
          </Button>
        </div>

        {/* Habits List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No habits yet</p>
              <p className="text-xs mt-1">Start tracking a new habit to build a better you</p>
            </div>
          ) : (
            habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(today)
              const streak = getStreak(habit)

              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <button onClick={() => toggleHabit(habit.id)} className="flex items-center gap-3 flex-1 text-left">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-6 h-6 ${habit.color}`} />
                    ) : (
                      <Circle className="w-6 h-6 text-muted" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                        {habit.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Streak: {streak} days</p>
                    </div>
                  </button>

                  <Button
                    onClick={() => deleteHabit(habit.id)}
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
