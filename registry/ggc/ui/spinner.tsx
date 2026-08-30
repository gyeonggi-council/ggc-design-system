import * as React from "react"

import { cn } from "@/lib/utils"

/* 스피너 — ggc-components.css §21. role=status + sr 텍스트. 버튼 안에서는 aria-hidden + 버튼 글자가 상태를 말한다. */
const SIZE = { sm: "size-4 border-2", default: "size-7 border-[3px]", lg: "size-10 border-4" } as const

function Spinner({ className, size = "default", label = "불러오는 중", ...props }: React.ComponentProps<"span"> & { size?: keyof typeof SIZE; label?: string | null }) {
  return (
    <span
      data-slot="spinner"
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0 animate-spin rounded-full border-(--ggc-primary-light-strong) border-t-primary align-middle motion-reduce:animate-none", SIZE[size], className)}
      {...props}
    >
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}

export { Spinner }
