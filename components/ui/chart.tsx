"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: { color: [CSS_VAR] } }
const COLOR_PAYLOAD = {
  light: {
    chart1: "hsl(var(--chart-1))",
    chart2: "hsl(var(--chart-2))",
    chart3: "hsl(var(--chart-3))",
    chart4: "hsl(var(--chart-4))",
    chart5: "hsl(var(--chart-5))",
    chart6: "hsl(var(--chart-6))",
  },
  dark: {
    chart1: "hsl(var(--chart-1))",
    chart2: "hsl(var(--chart-2))",
    chart3: "hsl(var(--chart-3))",
    chart4: "hsl(var(--chart-4))",
    chart5: "hsl(var(--chart-5))",
    chart6: "hsl(var(--chart-6))",
  },
}

type ChartContextProps = {
  config: Record<string, { label?: string; color?: string }>
  children: React.ReactNode
} & (
  | {
      /**
       * @deprecated Use the `data` prop instead.
       */
      data?: never
      /**
       * @deprecated Use the `series` prop instead.
       */
      series?: never
    }
  | {
      /**
       * The data to be displayed in the chart.
       * @deprecated Use the `series` prop instead.
       */
      data?: RechartsPrimitive.ChartProps["data"]
      /**
       * The series to be displayed in the chart.
       * @deprecated Use the `data` prop instead.
       */
      series?: never
    }
  | {
      /**
       * The series to be displayed in the chart.
       */
      series?: Record<string, unknown>[]
      /**
       * The data to be displayed in the chart.
       */
      data?: never
    }
)

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & ChartContextProps>(
  ({ config, children, className, ...props }, ref) => {
    const uniqueId = React.useId()
    const { theme } = useChart()
    const chartColors = COLOR_PAYLOAD[theme as keyof typeof COLOR_PAYLOAD]

    return (
      <ChartContext.Provider value={{ config, children, ...props }}>
        <div
          data-chart={uniqueId}
          ref={ref}
          className={cn("flex h-[300px] w-full flex-col items-center justify-center overflow-hidden", className)}
          style={
            Object.entries(config).reduce((acc, [key, value], index) => {
              return {
                ...acc,
                [`--color-${key}`]: `hsl(var(--chart-${index + 1}))`,
              }
            }, {}) as React.CSSProperties
          }
          {...props}
        >
          <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  RechartsPrimitive.TooltipProps &
    React.HTMLAttributes<HTMLDivElement> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "dot" | "line" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      className,
      viewBox,
      active,
      payload,
      label,
      labelFormatter,
      payloadFormatter,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      ...props
    },
    ref,
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel) {
        return null
      }

      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      if (labelKey) {
        return payload?.[0]?.payload?.[labelKey] ?? label
      }

      return label
    }, [hideLabel, label, labelFormatter, payload, labelKey])

    if (active && payload && payload.length) {
      return (
        <div
          ref={ref}
          className={cn(
            "grid min-w-[8rem] items-start gap-0.5 rounded-lg border border-border bg-background px-2.5 py-2 text-xs shadow-xl",
            className,
          )}
          {...props}
        >
          {!hideLabel && tooltipLabel ? <div className="text-muted-foreground">{tooltipLabel}</div> : null}
          <div className="flex flex-col gap-0.5">
            {payload.map((item, index) => {
              const key = nameKey ? item.payload[nameKey] : item.name

              const content = config[key as keyof typeof config]

              if (!content) return null

              return (
                <div
                  key={item.dataKey}
                  className="flex items-center gap-1.5 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
                >
                  {hideIndicator ? null : indicator === "dot" ? (
                    <svg
                      className="h-2.5 w-2.5"
                      style={{
                        fill: content.color,
                      }}
                    >
                      <circle cx="50%" cy="50%" r="3" />
                    </svg>
                  ) : indicator === "line" ? (
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: content.color,
                      }}
                    />
                  ) : indicator === "dashed" ? (
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-dashed"
                      style={{
                        borderColor: content.color,
                      }}
                    />
                  ) : null}
                  {payloadFormatter && item.value !== undefined ? (
                    payloadFormatter(item.value, item.name, item, index, payload)
                  ) : (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{content.label ?? item.name}</span>
                      <span className="font-mono font-medium text-foreground">{item.value}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
