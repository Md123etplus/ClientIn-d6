"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, User, Building, Calendar } from "lucide-react"

export function FloatingNFCCard() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      className="fixed top-1/2 right-4 lg:right-8 xl:right-16 transform -translate-y-1/2 translate-y-16 z-40 cursor-move"
      style={
        isDragging
          ? {
              left: position.x,
              top: position.y,
              right: "auto",
              transform: "none",
            }
          : {}
      }
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-80 bg-white/95 backdrop-blur-sm border-2 border-purple-200 shadow-2xl transition-all duration-300 ${
          isDragging ? "scale-105 rotate-2" : "hover:scale-105 hover:shadow-purple-500/25"
        } animate-float`}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-purple-600 text-white">
              <Wifi className="w-3 h-3 mr-1" />
              NFC ENABLED
            </Badge>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">CI</span>
            </div>
          </div>

          {/* Employee Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Demo Employee</h3>
                <p className="text-sm text-gray-600">Service Representative</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <Building className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">ClientIn Corp</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">ID: DEMO001</span>
              </div>
            </div>
          </div>

          {/* NFC Indicator */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-700">Tap to give feedback</span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse animation-delay-500"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full opacity-60 animate-ping animation-delay-1000"></div>
      <div className="absolute top-1/2 -left-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-ping animation-delay-2000"></div>
    </div>
  )
}
