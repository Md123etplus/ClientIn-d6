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
          <Skeleton className="h-10 w-48 rounded-md bg-primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Cards Skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg bg-card" />
          ))}
        </div>
      </div>
    </div>
  )
}
