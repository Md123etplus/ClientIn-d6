import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Wifi } from "lucide-react"
import { Logo } from "@/components/logo"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-4 w-20 bg-muted" />
          </div>
          <Skeleton className="h-6 w-24 mx-auto mb-4 bg-muted" />
        </div>

        {/* Employee Card Skeleton */}
        <Skeleton className="mb-6 h-32 w-full rounded-lg bg-card" />

        {/* Feedback Form Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2 bg-muted" />
            <Skeleton className="h-5 w-full bg-muted" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Skeleton */}
            <div>
              <Skeleton className="h-5 w-32 mb-3 bg-muted" />
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full bg-muted" />
                ))}
              </div>
            </div>

            {/* Comment Skeleton */}
            <div>
              <Skeleton className="h-5 w-48 mb-3 bg-muted" />
              <Skeleton className="h-24 w-full rounded-md bg-muted" />
              <Skeleton className="h-4 w-32 mt-1 bg-muted" />
            </div>

            <Skeleton className="h-12 w-full rounded-md bg-primary" />
            <Skeleton className="h-4 w-64 mx-auto bg-muted" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
