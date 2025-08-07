import { Skeleton } from "@/components/ui/skeleton"

export default function QRCodesLoading() {
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

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-card" />
          ))}
        </div>

        {/* QR Codes Grid Skeleton */}
        <Skeleton className="h-96 w-full bg-card" />
      </div>
    </div>
  )
}
