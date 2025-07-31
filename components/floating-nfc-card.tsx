"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { QrCode, Wifi } from "lucide-react"

export function FloatingNFCCard() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Auto-floating animation when not being dragged
  useEffect(() => {
    if (!isDragging) {
      const animate = () => {
        const time = Date.now() * 0.002
        setPosition({
          x: Math.sin(time * 0.8) * 25,
          y: Math.cos(time * 0.6) * 15,
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && cardRef.current) {
      const container = cardRef.current.parentElement?.getBoundingClientRect()
      if (container) {
        const newX = e.clientX - container.left - container.width / 2 - dragOffset.x
        const newY = e.clientY - container.top - container.height / 2 - dragOffset.y

        setPosition({
          x: Math.max(-200, Math.min(200, newX)),
          y: Math.max(-100, Math.min(250, newY)),
        })
      }
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
    <div className="absolute top-1/2 right-4 lg:right-8 xl:right-16 transform -translate-y-1/2 translate-y-16 pointer-events-none z-40">
      <div className="relative">
        {/* Clean Floating ID Card */}
        <div
          ref={cardRef}
          className={`
            w-72 h-44 bg-white dark:bg-gray-100 rounded-xl shadow-2xl border border-gray-200 
            pointer-events-auto cursor-grab overflow-hidden
            ${isDragging ? "cursor-grabbing scale-110 shadow-3xl" : "hover:scale-105"}
            transition-all duration-200
          `}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.05}deg)`,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Card Header Strip */}
          <div className="w-full h-8 bg-gradient-to-r from-purple-600 to-blue-600" />

          {/* Card Content */}
          <div className="p-6">
            {/* Profile Section */}
            <div className="flex items-start space-x-4 mb-4">
              {/* Profile Picture Placeholder */}
              <div className="w-16 h-20 bg-gray-300 dark:bg-gray-400 rounded flex items-center justify-center relative">
                <div className="w-10 h-10 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-600 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="absolute bottom-0 w-12 h-6 bg-gray-500 dark:bg-gray-600 rounded-b-full" />
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">JOHN DOE</h2>
                <p className="text-sm text-gray-600 mb-2">Service Department</p>
                <p className="text-xs text-gray-500">ID: EMP***</p>
                <p className="text-xs text-gray-500">Valid: 2024-2025</p>
              </div>

              {/* QR Code */}
              <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-gray-700">ClientIn NFC</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Floating particles around card */}
          {!isDragging && (
            <>
              <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping animation-delay-1000" />
              <div className="absolute top-1/2 -left-3 w-1 h-1 bg-green-400 rounded-full animate-pulse animation-delay-2000" />
            </>
          )}
        </div>

        {/* Shadow */}
        <div
          className="absolute top-2 left-2 w-72 h-44 bg-black/10 dark:bg-black/20 rounded-xl blur-lg -z-10"
          style={{
            transform: `translate(${position.x * 0.3}px, ${position.y * 0.3}px)`,
          }}
        />
      </div>

      {/* Simple Interaction hint */}
      {!isDragging && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-sm font-medium animate-pulse">
          🎮 Drag me!
        </div>
      )}
    </div>
  )
}
