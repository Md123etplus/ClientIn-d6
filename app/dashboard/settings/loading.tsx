import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4 flex flex-col">
        <Skeleton className="h-8 w-3/4 mb-8 bg-secondary" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full bg-secondary" />
          ))}
        </div>
        <Skeleton className="h-24 w-full mt-auto bg-primary" />
      </div>

      {/* Main Content Skeleton */}
      <div className="ml-64 p-6 flex-1">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2 bg-secondary" />
            <Skeleton className="h-5 w-48 bg-secondary" />
          </div>
          <Skeleton className="h-10 w-32 bg-primary" />
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full bg-card" /> {/* General Settings */}
          <Skeleton className="h-48 w-full bg-card" /> {/* Account Settings */}
          <Skeleton className="h-32 w-full bg-card" /> {/* Notifications */}
          <Skeleton className="h-48 w-full bg-card" /> {/* Integrations */}
        </div>
      </div>
    </div>
  )
}
