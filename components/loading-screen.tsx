"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2.5
      })
    }, 80)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Simple Logo */}
        <div className="mb-8">
          <div className="text-5xl font-bold text-white mb-4">ClientIn</div>
          <div className="w-2 h-2 bg-white rounded-full mx-auto animate-pulse" />
        </div>

        {/* Simple Progress Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Simple Text */}
        <p className="text-white/80 text-sm">Loading... {Math.round(progress)}%</p>
      </div>
    </div>
  )
}
