"use client"

export function useNotifications() {
  const sendNotification = (title: string, message: string, type: "info" | "success" | "warning" = "info") => {
    const event = new CustomEvent("wellness-notification", {
      detail: { title, message, type },
    })
    window.dispatchEvent(event)
  }

  return { sendNotification }
}
