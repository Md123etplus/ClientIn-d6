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
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-32 w-full rounded-lg bg-primary" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="ml-64 p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48 bg-muted" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-64 rounded-md bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeletons */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Collecté Skeleton */}
            <Skeleton className="h-32 w-full rounded-lg bg-card" />

            {/* General Feedback List Skeleton */}
            <Skeleton className="h-64 w-full rounded-lg bg-card" />

            {/* Employé Actif Skeleton */}
            <Skeleton className="h-40 w-full rounded-lg bg-card" />
          </div>

          {/* Right Column Skeletons */}
          <div className="space-y-6">
            {/* Subscription Card Skeleton */}
            <Skeleton className="h-48 w-full rounded-lg bg-primary" />

            {/* Feedback Statistique Skeleton */}
            <Skeleton className="h-48 w-full rounded-lg bg-card" />

            {/* Service Client Skeleton */}
            <Skeleton className="h-32 w-full rounded-lg bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
