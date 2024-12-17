import { cn } from "lib/utils"

import React from 'react'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-[pulse_0.5s_ease-in-out_infinite] rounded-sm bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }