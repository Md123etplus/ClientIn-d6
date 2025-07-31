"use client"

import { useState, useEffect } from "react"
import { Logo } from "./logo"

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
    <div className="fixed inset-0 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Logo className="scale-150" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ClientIn
            <span className="inline-block w-2 h-2 bg-violet-500 rounded-full ml-1 animate-pulse" />
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Chargement de votre espace...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto space-y-2">
          <div className="w-full bg-white/30 dark:bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white dark:bg-violet-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{progress}%</p>
        </div>
      </div>
    </div>
  )
}
