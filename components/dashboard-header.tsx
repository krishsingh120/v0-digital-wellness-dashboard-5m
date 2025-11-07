"use client"

import { useState } from "react"
import { Moon, Sun, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  return (
    <header className="border-b border-border/30 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breathe">
              <div className="w-6 h-6 rounded-full bg-primary/60"></div>
            </div>
            <div>
              <h1 className="text-3xl font-light text-foreground tracking-wide">Digital Wellness</h1>
              <p className="text-xs text-muted-foreground tracking-widest">Take care of yourself</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full hover:bg-primary/10"
            >
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-primary" />}
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon" aria-label="Settings" className="rounded-full hover:bg-primary/10">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
