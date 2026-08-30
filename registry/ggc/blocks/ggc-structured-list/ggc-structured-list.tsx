import * as React from "react"

import { cn } from "@/lib/utils"

/* 구조화 목록 — ggc-public.css §6. 공모·접수·방청 카드 격자 — 제목 + 설명(최대 3줄) + 기간 + 행동.
 * 300px 최소 폭으로 자동 접힌다(390 에서 1열). 업무 화면의 목록은 표다. */

function StructuredList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="structured-list" className={cn("m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-(--ggc-space-5) p-0", className)} {...props} />
}

function StructuredItem({
  className,
  badge,
  href,
  title,
  desc,
  dateLabel,
  date,
  tags,
  actions,
  ...props
}: React.ComponentProps<"li"> & {
  badge?: React.ReactNode
  href?: string
  title: React.ReactNode
  desc?: React.ReactNode
  dateLabel?: React.ReactNode
  date?: React.ReactNode
  tags?: React.ReactNode
  actions?: React.ReactNode
}) {
  const Text = href ? "a" : "div"
  return (
    <li data-slot="structured-item" className={cn("flex flex-col gap-(--ggc-space-3) rounded-(--ggc-radius-lg) border border-border bg-card p-(--ggc-card-pad) forced-colors:border", className)} {...props}>
      {badge && <div data-slot="structured-item-top">{badge}</div>}
      <Text {...(href ? { href } : {})} className="group/text flex-1 text-inherit no-underline">
        <p className={cn("m-0 mb-1.5 text-[19px] font-bold tracking-[-0.02em] text-(--ggc-text-strong)", href && "group-hover/text:text-primary group-hover/text:underline")}>{title}</p>
        {desc && <p className="m-0 mb-2.5 line-clamp-3 text-[15px] text-(--ggc-text-muted)">{desc}</p>}
        {date && (
          <p className="m-0 flex flex-wrap gap-2 text-sm text-(--ggc-text-subtle)">
            {dateLabel && <strong className="font-bold text-(--ggc-text-muted)">{dateLabel}</strong>}
            <span>{date}</span>
          </p>
        )}
      </Text>
      {tags && <div data-slot="structured-item-tags" className="flex flex-wrap gap-1">{tags}</div>}
      {actions && <div data-slot="structured-item-actions" className="flex gap-(--ggc-space-2)">{actions}</div>}
    </li>
  )
}

export { StructuredList, StructuredItem }
