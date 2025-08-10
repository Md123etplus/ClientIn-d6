import { Logo } from "@/components/logo"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <Logo className="h-16 w-auto animate-pulse" />
      <div className="mt-8 text-lg font-medium">Chargement de l'application...</div>
      <Skeleton className="mt-4 h-4 w-48 animate-pulse rounded-md" />
    </div>
  )
}
