import * as React from "react"

import { cn } from "@/lib/utils"

/* 유틸리티 바 — ggc-tokens.css .ggc-utility-bar (모든 시스템 최상단 동일 노출).
 * 진네이비 띠 + inner 1280 + 통합서비스 스위처. 현재 시스템은 active, 내부망 전용은 disabled. */
function UtilityBar({ className, brand, children, ...props }: React.ComponentProps<"div"> & { brand: React.ReactNode }) {
  return (
    <div data-slot="utility-bar" className={cn("bg-(--ggc-primary-deep) font-sans text-[13px] leading-none text-primary-foreground/80", className)} {...props}>
      <div className="mx-auto flex max-w-(--ggc-container-max) items-center justify-between gap-3 px-4 py-2">
        <span data-slot="utility-brand" className="font-bold tracking-[-0.2px] text-primary-foreground [&_a]:text-inherit [&_a]:no-underline">{brand}</span>
        <nav className="flex flex-wrap items-center gap-1">{children}</nav>
      </div>
    </div>
  )
}

/* nav .label — "통합서비스" 같은 묶음 라벨 */
function UtilityLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="utility-label" className={cn("mr-1 text-primary-foreground/60", className)} {...props} />
}

function UtilityLink({ className, active, ...props }: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="utility-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-(--ggc-radius-sm) px-2 py-[3px] no-underline transition-colors",
        active ? "bg-primary font-semibold text-primary-foreground forced-colors:border" : "text-primary-foreground/80 hover:bg-primary-foreground/12 hover:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

/* nav .disabled — 링크가 아니다. 외부 배포본의 내부망 전용 항목("의사일정 (내부망)") */
function UtilityDisabled({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="utility-disabled" className={cn("cursor-default px-2 py-[3px] text-primary-foreground/50", className)} {...props} />
}

export { UtilityBar, UtilityLabel, UtilityLink, UtilityDisabled }
