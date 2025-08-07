import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function FeedbackLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-32 mx-auto mb-4 bg-secondary" />
          <Skeleton className="h-5 w-24 mx-auto mb-2 bg-secondary" />
          <Skeleton className="h-6 w-20 mx-auto bg-secondary" />
        </div>

        {/* Employee Card Skeleton */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="p-6 flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48 bg-secondary" />
              <Skeleton className="h-4 w-32 bg-secondary" />
              <Skeleton className="h-5 w-24 bg-secondary" />
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form Skeleton */}
        <Card className="bg-card border-border">
          <CardContent className="space-y-6 p-6">
            <Skeleton className="h-6 w-40 bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full bg-secondary" />
              ))}
            </div>
            <Skeleton className="h-4 w-32 bg-secondary" />
            <Skeleton className="h-6 w-40 bg-secondary" />
            <Skeleton className="h-24 w-full bg-secondary" />
            <Skeleton className="h-4 w-48 bg-secondary" />
            <Skeleton className="h-12 w-full bg-primary" />
            <Skeleton className="h-4 w-64 mx-auto bg-secondary" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
