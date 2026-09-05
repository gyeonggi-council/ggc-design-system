import * as React from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* 통계 타일 — ggc-components.css §3 (v3.0). Monitor 첫 행, 정확히 4개(격자 repeat(4,1fr) · ≤1024 2열 · ≤560 1열).
 * 숫자는 --ggc-kpi-size(30) · 라벨 --ggc-text-sm · 아이콘은 lucide 요소를 icon 으로 넘긴다(이모지 금지).
 * 추이는 trendTone 이 아이콘까지 정한다 — 색 단독 금지(▲▼ 기호 대신 lucide). */
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
  href,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "title"> & {   /* a/div 어느 태그로 렌더해도 맞는 공통 속성 */
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  icon?: React.ReactNode
  tone?: keyof typeof TONE
  trend?: React.ReactNode
  trendTone?: "up" | "down" | "warn"
  href?: string
}) {
  const Comp: React.ElementType = href ? "a" : "div"
  return (
    <Comp
      data-slot="stat"
      href={href}
      className={cn(
        "rounded-xl border border-border bg-card px-5 py-4 text-inherit no-underline forced-colors:border",
        href && "transition-colors hover:border-primary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-(length:--ggc-text-sm) font-semibold text-muted-foreground">{label}</span>
        {icon && <span aria-hidden="true" className={cn("flex size-8 shrink-0 items-center justify-center rounded-md [&>svg]:size-(--ggc-icon-lg)", TONE[tone])}>{icon}</span>}
      </div>
      <div className="text-(length:--ggc-kpi-size) leading-none font-extrabold tracking-[-0.03em] text-(--ggc-text-strong) tabular-nums">
        {value}
        {unit && <span className="ml-1 text-(length:--ggc-text-base) font-semibold text-(--ggc-text-subtle)">{unit}</span>}
      </div>
      {trend && (
        <div className={cn("mt-2 flex items-center gap-1 text-(length:--ggc-text-xs) font-semibold [&>svg]:size-3.5", trendTone === "up" && "text-(--ggc-success)", trendTone === "down" && "text-(--ggc-danger)", trendTone === "warn" && "text-(--ggc-warning)", !trendTone && "text-(--ggc-text-subtle)")}>
          {trendTone === "up" && <TrendingUpIcon aria-hidden="true" />}
          {trendTone === "down" && <TrendingDownIcon aria-hidden="true" />}
          <span>{trend}</span>
        </div>
      )}
    </Comp>
  )
}

export { StatGrid, Stat }
