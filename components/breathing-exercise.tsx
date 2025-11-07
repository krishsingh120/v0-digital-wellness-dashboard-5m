"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BreathingPhase = "inhale" | "hold" | "exhale" | "rest"

interface BreathingTechnique {
  name: string
  inhale: number
  hold: number
  exhale: number
  rest: number
  cycles: number
}

export function BreathingExercise() {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathingPhase>("inhale")
  const [progress, setProgress] = useState(0)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [currentTechnique, setCurrentTechnique] = useState<BreathingTechnique>({
    name: "4-7-8 Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    cycles: 5,
  })

  const techniques: BreathingTechnique[] = [
    {
      name: "4-7-8 Box Breathing",
      inhale: 4,
      hold: 4,
      exhale: 4,
      rest: 4,
      cycles: 5,
    },
    {
      name: "Deep Breathing",
      inhale: 4,
      hold: 2,
      exhale: 6,
      rest: 2,
      cycles: 5,
    },
    {
      name: "Quick Reset",
      inhale: 2,
      hold: 1,
      exhale: 2,
      rest: 1,
      cycles: 8,
    },
    {
      name: "Calm Focus",
      inhale: 5,
      hold: 5,
      exhale: 5,
      rest: 3,
      cycles: 4,
    },
  ]

  useEffect(() => {
    if (!isActive) return

    const phaseDurations: { [key in BreathingPhase]: number } = {
      inhale: currentTechnique.inhale,
      hold: currentTechnique.hold,
      exhale: currentTechnique.exhale,
      rest: currentTechnique.rest,
    }

    const totalPhaseDuration = phaseDurations[phase]
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed++
      setProgress((elapsed / totalPhaseDuration) * 100)

      if (elapsed >= totalPhaseDuration) {
        const phases: BreathingPhase[] = ["inhale", "hold", "exhale", "rest"]
        const currentIndex = phases.indexOf(phase)
        const nextPhase = phases[(currentIndex + 1) % phases.length]

        if (nextPhase === "inhale" && phase === "rest") {
          setCyclesCompleted((prev) => {
            const next = prev + 1
            if (next >= currentTechnique.cycles) {
              setIsActive(false)
              toast({
                title: "Exercise complete!",
                description: `You completed ${next} cycles of ${currentTechnique.name}`,
              })
              saveExercise()
              return 0
            }
            return next
          })
        }

        setPhase(nextPhase)
        setProgress(0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, currentTechnique])

  const saveExercise = () => {
    const exercises = JSON.parse(localStorage.getItem("breathing-exercises") || "[]")
    exercises.push({
      date: new Date().toISOString().split("T")[0],
      technique: currentTechnique.name,
      cycles: currentTechnique.cycles,
      timestamp: Date.now(),
    })
    localStorage.setItem("breathing-exercises", JSON.stringify(exercises))
  }

  const startExercise = (technique: BreathingTechnique) => {
    setCurrentTechnique(technique)
    setCyclesCompleted(0)
    setPhase("inhale")
    setProgress(0)
    setIsActive(true)
    toast({
      title: "Starting exercise",
      description: `${technique.name} for ${technique.cycles} cycles`,
    })
  }

  const reset = () => {
    setIsActive(false)
    setCyclesCompleted(0)
    setPhase("inhale")
    setProgress(0)
  }

  const getPhaseLabel = () => {
    const labels = {
      inhale: "Breathe In",
      hold: "Hold",
      exhale: "Breathe Out",
      rest: "Rest",
    }
    return labels[phase]
  }

  const getPhaseColor = () => {
    const colors = {
      inhale: "text-primary",
      hold: "text-secondary",
      exhale: "text-accent",
      rest: "text-muted-foreground",
    }
    return colors[phase]
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          Breathing Exercises
        </CardTitle>
        <CardDescription>Guided breathing techniques for relaxation and focus</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isActive ? (
          <>
            {/* Active Exercise Display */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 text-center border border-primary/20 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">{currentTechnique.name}</p>
              <div className={`text-5xl font-bold transition-all duration-300 ${getPhaseColor()}`}>
                {getPhaseLabel()}
              </div>
              <p className="text-2xl font-mono text-primary">{Math.ceil((100 - progress) / 20)}</p>
              <p className="text-xs text-muted-foreground">
                Cycle {cyclesCompleted + 1} of {currentTechnique.cycles}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    phase === "inhale"
                      ? "bg-primary"
                      : phase === "hold"
                        ? "bg-secondary"
                        : phase === "exhale"
                          ? "bg-accent"
                          : "bg-muted-foreground"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Cycle Progress */}
            <div className="flex gap-1 justify-center">
              {Array.from({ length: currentTechnique.cycles }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < cyclesCompleted ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>

            {/* Stop Button */}
            <Button onClick={reset} variant="destructive" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Stop Exercise
            </Button>
          </>
        ) : (
          <>
            {/* Technique Selection */}
            <div className="grid grid-cols-1 gap-2">
              {techniques.map((technique) => (
                <Button
                  key={technique.name}
                  onClick={() => startExercise(technique)}
                  variant="outline"
                  className="justify-start h-auto py-3 flex-col items-start"
                >
                  <div className="font-medium text-sm">{technique.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {technique.cycles} cycles •{" "}
                    {Math.round(
                      ((technique.inhale + technique.hold + technique.exhale + technique.rest) * technique.cycles) / 60,
                    )}{" "}
                    min
                  </div>
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Info */}
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-xs text-muted-foreground space-y-1">
          <p>Benefits of breathing exercises:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Reduces stress and anxiety</li>
            <li>Improves focus and clarity</li>
            <li>Lowers blood pressure</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
