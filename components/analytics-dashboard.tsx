"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DailyStats {
  date: string
  screenTime: number
  focusTime: number
  breakTime: number
  exercises: number
  wellnessScore: number
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<DailyStats[]>([])
  const [period, setPeriod] = useState<"week" | "month">("week")

  useEffect(() => {
    const loadStats = () => {
      // Generate sample data for demo - in production this would aggregate from all trackers
      const days = period === "week" ? 7 : 30
      const data: DailyStats[] = []

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        data.push({
          date: dateStr,
          screenTime: Math.floor(Math.random() * 480) + 240, // 4-12 hours in minutes
          focusTime: Math.floor(Math.random() * 300) + 60, // 1-6 hours
          breakTime: Math.floor(Math.random() * 180) + 30, // 30 min - 4 hours
          exercises: Math.floor(Math.random() * 5),
          wellnessScore: Math.floor(Math.random() * 40) + 60, // 60-100
        })
      }

      setStats(data)
    }

    loadStats()
  }, [period])

  // Calculate totals and averages
  const totalStats = stats.reduce(
    (acc, day) => ({
      screenTime: acc.screenTime + day.screenTime,
      focusTime: acc.focusTime + day.focusTime,
      breakTime: acc.breakTime + day.breakTime,
      exercises: acc.exercises + day.exercises,
      wellnessScore: acc.wellnessScore + day.wellnessScore,
    }),
    { screenTime: 0, focusTime: 0, breakTime: 0, exercises: 0, wellnessScore: 0 },
  )

  const avgStats = {
    screenTime: Math.round(totalStats.screenTime / stats.length),
    focusTime: Math.round(totalStats.focusTime / stats.length),
    breakTime: Math.round(totalStats.breakTime / stats.length),
    exercises: Math.round(totalStats.exercises / stats.length),
    wellnessScore: Math.round(totalStats.wellnessScore / stats.length),
  }

  // Prepare chart data
  const screenTimeByDay = stats.map((d) => ({
    name: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    value: Math.round(d.screenTime / 60),
  }))

  const activityDistribution = [
    { name: "Screen Time", value: totalStats.screenTime },
    { name: "Focus Time", value: totalStats.focusTime },
    { name: "Break Time", value: totalStats.breakTime },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriod("week")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "week"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setPeriod("month")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === "month"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          This Month
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Screen Time</p>
              <p className="text-2xl font-bold text-primary">
                {Math.round(avgStats.screenTime / 60)}h{" "}
                <span className="text-xs font-normal">{avgStats.screenTime % 60}m</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Focus Time</p>
              <p className="text-2xl font-bold text-accent">
                {Math.round(avgStats.focusTime / 60)}h{" "}
                <span className="text-xs font-normal">{avgStats.focusTime % 60}m</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Avg Breaks</p>
              <p className="text-2xl font-bold text-secondary">
                {Math.round(avgStats.breakTime / 60)}h{" "}
                <span className="text-xs font-normal">{avgStats.breakTime % 60}m</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Exercises/Day</p>
              <p className="text-2xl font-bold text-primary">{avgStats.exercises}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Wellness Score</p>
              <p className="text-2xl font-bold text-accent">{avgStats.wellnessScore}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screen Time Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Daily Screen Time</CardTitle>
            <CardDescription>Hours spent on screens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={screenTimeByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid var(--color-border)`,
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>Time breakdown over {period}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid var(--color-border)`,
                    }}
                    formatter={(value) => `${Math.round((value as number) / 60)}h`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {activityDistribution.map((item, i) => (
                <div key={item.name}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS[i] }}></div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-sm font-bold">{Math.round(item.value / 60)}h</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wellness Trend */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Wellness Score Trend</CardTitle>
            <CardDescription>Your wellness index over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-muted-foreground)"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid var(--color-border)`,
                    }}
                    labelStyle={{ color: "var(--color-foreground)" }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="wellnessScore"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-primary)" }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
