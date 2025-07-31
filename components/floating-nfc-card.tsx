"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"

export function FloatingNFCCard() {
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    // Smooth return to center
    x.set(0)
    y.set(0)
  }

  return (
    <div className="fixed top-1/2 right-4 lg:right-8 xl:right-16 -translate-y-1/2 translate-y-16 z-10 pointer-events-none">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* NFC Card */}
      <motion.div
        ref={cardRef}
        className="pointer-events-auto cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotateX, rotateY }}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1 }}
        animate={{
          y: isDragging ? 0 : [-5, 5, -5],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
          scale: {
            duration: 0.2,
          },
        }}
      >
        <div className="relative">
          {/* Card Shadow */}
          <motion.div
            className="absolute inset-0 bg-black/20 rounded-xl blur-lg"
            style={{
              y: useTransform(y, [0, 100], [5, 15]),
              opacity: useTransform(y, [0, 100], [0.2, 0.4]),
            }}
          />

          {/* Main Card */}
          <div className="relative w-64 h-40 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border border-white rounded" />
            </div>

            {/* Card Content */}
            <div className="relative p-6 h-full flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">ClientIn</h3>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-sm opacity-90">Employee Feedback</p>
              </div>

              <div>
                <div className="text-xs opacity-75 mb-1">ID: EMP001</div>
                <div className="font-semibold">Mohammed B.</div>
                <div className="text-sm opacity-90">Serveur</div>
              </div>
            </div>

            {/* NFC Indicator */}
            <div className="absolute top-4 left-4">
              <motion.div
                className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </div>

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{
                x: [-300, 300],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
