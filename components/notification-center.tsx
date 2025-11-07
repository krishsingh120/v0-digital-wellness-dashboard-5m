"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Trash2, CheckCircle2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning"
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem("notifications")
    if (saved) {
      const parsed = JSON.parse(saved)
      setNotifications(
        parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })),
      )
    }

    // Subscribe to notification events
    const handleNotification = (event: CustomEvent) => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: event.detail.title,
        message: event.detail.message,
        type: event.detail.type || "info",
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => {
        const updated = [newNotif, ...prev]
        localStorage.setItem("notifications", JSON.stringify(updated))
        return updated
      })
    }

    window.addEventListener("wellness-notification", handleNotification as EventListener)
    return () => window.removeEventListener("wellness-notification", handleNotification as EventListener)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      localStorage.setItem("notifications", JSON.stringify(updated))
      return updated
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      localStorage.setItem("notifications", JSON.stringify(updated))
      return updated
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
      case "warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-700"
      default:
        return "bg-primary/10 border-primary/20 text-primary"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </CardTitle>
            <CardDescription>Activity alerts and achievements</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-xs mt-1">Your achievements and alerts will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-3 rounded-lg border ${getTypeColor(notif.type)} group`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs opacity-75 mt-0.5">{notif.message}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {notif.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <Button onClick={() => markAsRead(notif.id)} size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteNotification(notif.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
