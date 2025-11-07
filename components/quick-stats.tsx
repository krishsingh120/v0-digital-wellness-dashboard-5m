"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Activity, Target, TrendingUp, Clock } from "lucide-react"

export function QuickStats() {
  const [stats, setStats] = useState({
    todayScreenTime: 0,
    focusTime: 0,
    breaksTaken: 0,
    attentionScore: 0,
  })

  useEffect(() => {
    const loadStats = () => {
      const saved = localStorage.getItem("wellness-stats")
      if (saved) {
        setStats(JSON.parse(saved))
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const stat = (icon: React.ReactNode, label: string, value: string | number, unit = "") => (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/20 hover:border-border/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
      <div className="p-4 bg-primary/8 rounded-full flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">{label}</p>
        <p className="text-3xl font-light text-foreground mt-1">
          {String(typeof value === "number" && !isNaN(value) ? Math.round(value) : value)}{" "}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </p>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stat(
        <Activity className="w-6 h-6 text-primary" />,
        "Screen Time Today",
        Math.round(stats.todayScreenTime / 60),
        "min",
      )}
      {stat(<Target className="w-6 h-6 text-accent" />, "Focus Sessions", stats.focusTime, "")}
      {stat(<TrendingUp className="w-6 h-6 text-secondary" />, "Breaks Taken", stats.breaksTaken, "")}
      {stat(
        <Clock className="w-6 h-6 text-primary" />,
        "Wellness Score",
        Number.isNaN(stats.attentionScore) ? 0 : stats.attentionScore,
        "%",
      )}
    </div>
  )
}
