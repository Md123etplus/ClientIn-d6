"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 80)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="text-center">
        <Logo className="h-16 w-auto animate-pulse text-primary" />
        <p className="mt-4 text-lg font-medium text-foreground">Chargement de ClientIn...</p>
      </div>
    </div>
  )
}
