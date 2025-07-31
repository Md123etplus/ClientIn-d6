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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <Logo className="h-16 mx-auto mb-8" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            ClientIn
            <span className="inline-block w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></span>
          </h2>
          <p className="text-white/70">Chargement de votre expérience</p>
        </div>

        <div className="w-80 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  )
}
