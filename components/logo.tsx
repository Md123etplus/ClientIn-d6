"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  animated?: boolean
}

export function Logo({ className = "h-8 w-auto", animated = false }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`${className} flex items-center`}>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg tracking-wider">
          ClientIn
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className={`${className} flex items-center`}>
      <div
        className={`
          bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-lg tracking-wider
          ${animated ? "animate-pulse" : ""}
          ${isDark ? "shadow-lg shadow-purple-500/25" : "shadow-lg shadow-purple-500/20"}
        `}
      >
        ClientIn
      </div>
    </div>
  )
}
