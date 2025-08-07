"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label: string
    color: string
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ config, className, children, ...props }, ref) => {
  const id = React.useId()
  if (!config || typeof config !== "object") {
    return null
  }
  return (
    <div
      ref={ref}
      className={cn("h-[200px] w-full", className)}
      style={
        Object.entries(config).reduce(
          (acc, [key, value]) => {
            acc[`--color-${key}`] = value.color
            return acc
          },
          {} as React.CSSProperties
        )
      }
    >
      <RechartsPrimitive.ResponsiveContainer {...props}>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentPropsWithoutRef<"div">
>(({ active, payload, className, ...props }, ref) => {
  if (active && payload && payload.length) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background p-2 text-sm shadow-md",
          className
        )}
        {...props}
      >
        {payload.map((item: any) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-x-4"
          >
            {item.name && <span className="text-muted-foreground">{item.name}:</span>}
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
})
ChartTooltipContent.displayName = "ChartTooltipContent"

// Workaround for https://github.com/recharts/recharts/issues/3615
const CartesianGrid = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>
>((props, ref) => (
  <RechartsPrimitive.CartesianGrid
    ref={ref}
    strokeDasharray="8 8"
    vertical={false}
    {...props}
  />
))
CartesianGrid.displayName = "CartesianGrid"

export { ChartContainer, ChartTooltip, ChartTooltipContent, CartesianGrid }
