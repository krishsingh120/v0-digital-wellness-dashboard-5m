"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function AccessibilityInfo() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Accessibility Features
        </CardTitle>
        <CardDescription>How to use this app with assistive technologies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Keyboard Navigation</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Tab to navigate between interactive elements</li>
            <li>Enter to activate buttons and select options</li>
            <li>Space to toggle checkboxes and switches</li>
            <li>Arrow keys for range sliders</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Screen Reader Support</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>All interactive elements have descriptive labels</li>
            <li>Form inputs include associated labels</li>
            <li>ARIA landmarks for page structure</li>
            <li>Semantic HTML for better context</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Visual Accessibility</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>High contrast mode available in settings</li>
            <li>Adjustable text sizes (small, medium, large)</li>
            <li>Focus indicators clearly visible on all buttons</li>
            <li>Color not used as the only method of communication</li>
            <li>Sufficient color contrast ratios (WCAG AA)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Motion Accessibility</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Reduce Motion option in settings</li>
            <li>Animations can be disabled for users with vestibular disorders</li>
            <li>Auto-playing content can be paused</li>
          </ul>
        </div>

        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Supported Assistive Technologies:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>NVDA (Windows)</li>
            <li>JAWS (Windows)</li>
            <li>VoiceOver (Mac/iOS)</li>
            <li>TalkBack (Android)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
