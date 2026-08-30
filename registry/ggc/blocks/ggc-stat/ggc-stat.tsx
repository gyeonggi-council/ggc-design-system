import * as React from "react"

import { cn } from "@/lib/utils"

/* 통계 타일 — ggc-components.css §3. Monitor 첫 행, 정확히 4개(격자 repeat(4,1fr) · ≤1024 2열 · ≤560 1열). */
function StatGrid({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stat-grid" className={cn("grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[560px]:grid-cols-1", className)} {...props} />
}

const TONE = {
  primary: "bg-(--ggc-primary-light) text-primary",
  info: "bg-(--ggc-info-tint) text-(--ggc-info)",
  success: "bg-(--ggc-success-tint) text-(--ggc-success)",
  warning: "bg-(--ggc-warning-tint) text-(--ggc-warning)",
  danger: "bg-(--ggc-danger-tint) text-(--ggc-danger)",
} as const

function Stat({
  className,
  label,
  value,
  unit,
  icon,
  tone = "primary",
  trend,
  trendTone,
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  icon?: React.ReactNode
  tone?: keyof typeof TONE
  trend?: React.ReactNode
  trendTone?: "up" | "down" | "warn"
}) {
  return (
    <div data-slot="stat" className={cn("rounded-[14px] border border-border bg-card px-5 py-[18px] forced-colors:border", className)} {...props}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-(--ggc-text-muted)">{label}</span>
        {icon && <span aria-hidden="true" className={cn("flex size-[34px] shrink-0 items-center justify-center rounded-[9px]", TONE[tone])}>{icon}</span>}
      </div>
      <div className="text-[30px] leading-none font-extrabold tracking-[-0.03em] text-(--ggc-text-strong) tabular-nums">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-(--ggc-text-faint)">{unit}</span>}
      </div>
      {trend && (
        <div className={cn("mt-[9px] text-xs font-semibold", trendTone === "up" && "text-(--ggc-success)", trendTone === "down" && "text-(--ggc-danger)", trendTone === "warn" && "text-(--ggc-warning)", !trendTone && "text-(--ggc-text-subtle)")}>
          {trend}
        </div>
      )}
    </div>
  )
}

export { StatGrid, Stat }
