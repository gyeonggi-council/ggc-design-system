import * as React from "react"

import { cn } from "@/lib/utils"

/* 빈 상태 — ggc-components.css §31. 레이아웃만 정본(ADR 0006) — 문구·행동은 화면이 정한다.
 * 제목 = 무엇이 없는지 · 설명 = 왜 없는지(필터 때문인지 데이터가 없는지) · 행동 = 다음에 할 일.
 * 카드 · 표 본문 · 탭 패널 어디에나 들어간다 — 자기 테두리가 없다. */
function Empty({
  className,
  icon,
  title,
  desc,
  actions,
  variant,
  compact = false,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode
  title: React.ReactNode
  desc?: React.ReactNode
  actions?: React.ReactNode
  variant?: "error"
  compact?: boolean
}) {
  const error = variant === "error"
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(
        "flex flex-col items-center gap-1.5 px-5 py-10 text-center text-(--ggc-text-muted)",
        compact && "gap-1 px-4 py-5",
        className
      )}
      {...props}
    >
      {icon != null && (
        <span
          data-slot="empty-icon"
          aria-hidden="true"
          className={cn(
            "mb-1.5 inline-flex size-11 items-center justify-center rounded-full bg-(--ggc-surface-inset) text-(--ggc-text-faint) forced-colors:border [&>svg]:size-(--ggc-icon-lg)",
            error && "bg-(--ggc-danger-tint) text-(--ggc-danger)",
            compact && "size-9 [&>svg]:size-(--ggc-icon)"
          )}
        >
          {icon}
        </span>
      )}
      <p data-slot="empty-title" className={cn("m-0 text-(length:--ggc-text-base) font-bold text-(--ggc-text-strong)", error && "text-(--ggc-danger)")}>
        {title}
      </p>
      {desc != null && (
        <p data-slot="empty-desc" className="m-0 max-w-[440px] text-(length:--ggc-text-sm) leading-(--ggc-leading-normal) text-(--ggc-text-muted)">{desc}</p>
      )}
      {actions != null && (
        <div data-slot="empty-actions" className="mt-3 flex flex-wrap justify-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export { Empty }
