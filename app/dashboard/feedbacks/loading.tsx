import { Skeleton } from "@/components/ui/skeleton"
import { Logo } from "@/components/logo"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar Skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4">
        <div className="mb-8">
          <Logo className="h-8 mb-2" />
        </div>
        <nav className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md bg-sidebar-accent" />
          ))}
        </nav>
      </div>

      {/* Main Content Skeleton */}
      <div className="ml-64 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2 bg-muted" />
            <Skeleton className="h-5 w-80 bg-muted" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md bg-primary" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-20 w-full rounded-lg bg-card" />
        </div>

        {/* Feedback Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg bg-card" />
          ))}
        </div>

        {/* Feedbacks List Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-16 w-64 mb-4 bg-card" /> {/* CardHeader title */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16 rounded-md bg-secondary" />
                    <Skeleton className="h-6 w-24 rounded-md bg-secondary" />
                  </div>
                  <Skeleton className="h-4 w-32 bg-secondary" />
                </div>
                <Skeleton className="h-5 w-full mb-1 bg-secondary" />
                <Skeleton className="h-4 w-full bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
