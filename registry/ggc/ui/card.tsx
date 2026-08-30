import * as React from "react"

import { cn } from "@/lib/utils"

/* 카드 — ggc-components.css §2. 흰 면 · 1px 테두리 · radius 16 · **그림자 없음**(계약 §2).
 * CardHeader = 제목 + 부제 + 우측 액션(CardAction). CardContent 는 목록형(패딩 0)이 기본이고
 * 자유 본문은 <CardContent padded>. CardFooter 는 상단 hairline. */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-center gap-x-3 px-[22px] pt-[18px] pb-[14px] has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="card-title" className={cn("m-0 text-base font-extrabold tracking-[-0.02em] text-(--ggc-text-strong)", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("m-0 mt-[3px] text-[12.5px] text-(--ggc-text-subtle)", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-center justify-self-end text-[13px] font-semibold text-primary [&_a]:no-underline [&_a:hover]:underline", className)}
      {...props}
    />
  )
}

function CardContent({ className, padded = false, ...props }: React.ComponentProps<"div"> & { padded?: boolean }) {
  return <div data-slot="card-content" className={cn(padded && "p-(--ggc-card-pad)", className)} {...props} />
}

function CardFooter({ className, inset = false, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center justify-between gap-3 border-t border-(--ggc-hairline) px-[22px] py-[13px] text-[13px] text-(--ggc-text-muted)", inset && "bg-(--ggc-surface-inset)", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
