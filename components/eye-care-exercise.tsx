"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EyeExercise {
  name: string
  description: string
  duration: number
  instructions: string[]
}

export function EyeCareExercise() {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<EyeExercise | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const exercises: EyeExercise[] = [
    {
      name: "20-20-20 Rule",
      description: "Look away from screen every 20 minutes",
      duration: 20,
      instructions: ["Look at something 20 feet away", "For 20 seconds", "Blink naturally", "Return to work"],
    },
    {
      name: "Eye Circles",
      description: "Trace circles with your eyes",
      duration: 30,
      instructions: [
        "Look up and slowly move eyes clockwise",
        "Complete a full circle",
        "Reverse direction counterclockwise",
        "Repeat 5 times each direction",
      ],
    },
    {
      name: "Focus Shift",
      description: "Alternate focus between near and far objects",
      duration: 40,
      instructions: [
        "Focus on something close (1-2 feet)",
        "Hold for 5 seconds",
        "Switch focus to something far away",
        "Hold for 5 seconds",
        "Repeat 10 times",
      ],
    },
    {
      name: "Palming",
      description: "Soothe eyes with gentle pressure",
      duration: 60,
      instructions: [
        "Rub hands together until warm",
        "Cup hands over closed eyes",
        "Avoid pressure on eyeballs",
        "Breathe deeply and relax",
      ],
    },
  ]

  useEffect(() => {
    if (!isActive || !currentExercise) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          toast({
            title: "Exercise complete!",
            description: `${currentExercise.name} finished. Take a moment to rest your eyes.`,
          })
          saveExercise()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, currentExercise])

  const saveExercise = () => {
    if (!currentExercise) return
    const exercises = JSON.parse(localStorage.getItem("eye-exercises") || "[]")
    exercises.push({
      date: new Date().toISOString().split("T")[0],
      exercise: currentExercise.name,
      duration: currentExercise.duration,
      timestamp: Date.now(),
    })
    localStorage.setItem("eye-exercises", JSON.stringify(exercises))
  }

  const startExercise = (exercise: EyeExercise) => {
    setCurrentExercise(exercise)
    setTimeLeft(exercise.duration)
    setCurrentStep(0)
    setIsActive(true)
    toast({
      title: "Starting exercise",
      description: exercise.name,
    })
  }

  const reset = () => {
    setIsActive(false)
    setCurrentExercise(null)
    setTimeLeft(0)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentExercise && currentStep < currentExercise.instructions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Eye Care Exercises
        </CardTitle>
        <CardDescription>Reduce eye strain with guided exercises</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isActive && currentExercise ? (
          <>
            {/* Active Exercise Display */}
            <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-8 text-center border border-accent/20 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">{currentExercise.name}</p>
              <div className="text-5xl font-bold text-accent">{String(timeLeft).padStart(2, "0")}</div>
              <p className="text-xs text-muted-foreground">seconds remaining</p>
            </div>

            {/* Current Step */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-xs text-muted-foreground font-medium">
                Step {currentStep + 1} of {currentExercise.instructions.length}
              </p>
              <p className="text-lg font-medium">{currentExercise.instructions[currentStep]}</p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStep === currentExercise.instructions.length - 1}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Stop Button */}
            <Button onClick={reset} variant="destructive" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Stop Exercise
            </Button>
          </>
        ) : (
          <>
            {/* Exercise Selection */}
            <div className="grid grid-cols-1 gap-2">
              {exercises.map((exercise) => (
                <Button
                  key={exercise.name}
                  onClick={() => startExercise(exercise)}
                  variant="outline"
                  className="justify-start h-auto py-3 flex-col items-start"
                >
                  <div className="font-medium text-sm">{exercise.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {exercise.description} • {exercise.duration} sec
                  </div>
                </Button>
              ))}
            </div>

            {/* Tips */}
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Eye strain tips:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Follow the 20-20-20 rule during work</li>
                <li>Increase screen brightness</li>
                <li>Maintain 20-26 inch distance from screen</li>
                <li>Blink more frequently</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
