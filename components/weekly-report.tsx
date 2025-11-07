"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Target, Zap } from "lucide-react"

interface WeeklyStats {
  screenTimeReduction: number
  focusSessionsCompleted: number
  exercisesCompleted: number
  breaksTaken: number
  averageWellnessScore: number
  bestDay: string
}

export function WeeklyReport() {
  const [report, setReport] = useState<WeeklyStats>({
    screenTimeReduction: 15,
    focusSessionsCompleted: 24,
    exercisesCompleted: 18,
    breaksTaken: 35,
    averageWellnessScore: 78,
    bestDay: "Wednesday",
  })

  const achievements = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Focus Champion",
      description: "Completed 20+ focus sessions",
      completed: report.focusSessionsCompleted >= 20,
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Break Master",
      description: "Took 30+ breaks this week",
      completed: report.breaksTaken >= 30,
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Wellness Warrior",
      description: "Average score above 75%",
      completed: report.averageWellnessScore >= 75,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Consistent Exerciser",
      description: "Completed 15+ exercises",
      completed: report.exercisesCompleted >= 15,
    },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Weekly Report</CardTitle>
        <CardDescription>Your wellness achievements this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground">Screen Time Reduction</p>
            <p className="text-2xl font-bold text-primary">{report.screenTimeReduction}%</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground">Focus Sessions</p>
            <p className="text-2xl font-bold text-accent">{report.focusSessionsCompleted}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-xs text-muted-foreground">Exercises</p>
            <p className="text-2xl font-bold text-secondary">{report.exercisesCompleted}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-muted-foreground">Best Day</p>
            <p className="text-xl font-bold text-blue-500">{report.bestDay}</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm mb-3">Achievements Unlocked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`p-3 rounded-lg border transition-colors ${
                  achievement.completed ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted/50 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${achievement.completed ? "text-primary" : "text-muted-foreground"}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                  </div>
                  {achievement.completed && <Badge className="ml-auto bg-primary text-primary-foreground">✓</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 space-y-2">
          <p className="font-medium text-sm">Recommendations for Next Week</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Try to reduce screen time by 10%</li>
            <li>• Aim for 25+ focus sessions</li>
            <li>• Take at least one breathing exercise daily</li>
            <li>• Remember eye care exercises every 2 hours</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
