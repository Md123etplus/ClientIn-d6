import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps extends React.ComponentPropsWithoutRef<typeof Image> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Image
      src="/images/clientin-logo-white.png"
      alt="ClientIn Logo"
      width={120}
      height={40}
      className={cn("h-10 w-auto", className)}
      priority
      {...props}
    />
  )
}
