"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function WellnessChart() {
  const data = [
    { time: "6am", wellness: 85, focus: 80 },
    { time: "9am", wellness: 72, focus: 90 },
    { time: "12pm", wellness: 65, focus: 75 },
    { time: "3pm", wellness: 55, focus: 60 },
    { time: "6pm", wellness: 70, focus: 85 },
    { time: "9pm", wellness: 80, focus: 70 },
    { time: "12am", wellness: 65, focus: 40 },
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Daily Wellness Trend</CardTitle>
        <CardDescription>Your wellness and focus levels throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="wellness"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)" }}
                name="Wellness"
              />
              <Line
                type="monotone"
                dataKey="focus"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-secondary)" }}
                name="Focus"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
