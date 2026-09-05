/* 입력 — 높이 --ggc-input-h · 흰 면 · 공통 포커스 링. placeholder 를 유일한 라벨로 쓰지 않는다. (shadcn 공식 소스 + 토큰 · ADR 0011) */
import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-(--ggc-input-h) w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1 text-(length:--ggc-control-font) transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
