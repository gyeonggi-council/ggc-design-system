import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* 페이지네이션 — ggc-components.css §15 (KRDS). 현재 쪽은 aria-current + 화면 밖 "현재 페이지".
 * 전량 렌더하지 않는다(archetypes Explore). */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav role="navigation" aria-label="페이지" data-slot="pagination" className={cn("flex w-full flex-wrap items-center justify-center gap-2 text-(length:--ggc-control-font-sm)", className)} {...props} />
}

function PaginationSummary({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="pagination-summary" className={cn("mr-auto text-(--ggc-text-subtle) max-sm:mr-0 max-sm:basis-full max-sm:text-center", className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="pagination-content" className={cn("m-0 flex items-center gap-0.5 p-0", className)} {...props} />
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" className="list-none" {...props} />
}

const base = "inline-flex h-(--ggc-control-h-sm) min-w-(--ggc-control-h-sm) items-center justify-center rounded-(--ggc-radius-sm) px-2 tabular-nums no-underline transition-colors outline-none focus-visible:shadow-(--ggc-focus-ring)"

function PaginationLink({ className, isActive, ...props }: React.ComponentProps<"a"> & { isActive?: boolean }) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(base, isActive ? "bg-primary font-bold text-primary-foreground forced-colors:outline forced-colors:outline-2 forced-colors:outline-[Highlight]" : "text-(--ggc-text-muted) hover:bg-(--ggc-control-bg) hover:text-foreground", className)}
      {...props}
    >
      {isActive && <span className="sr-only">현재 페이지 </span>}
      {props.children}
    </a>
  )
}

function PaginationNav({ className, disabled, ...props }: React.ComponentProps<"a"> & { disabled?: boolean }) {
  return (
    <a
      data-slot="pagination-nav"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(base, "gap-1 border border-input bg-card px-3 font-semibold text-(--ggc-primary-deep) hover:bg-(--ggc-surface-inset)", disabled && "pointer-events-none border-border text-(--ggc-text-faint)", className)}
      {...props}
    />
  )
}

function PaginationPrevious({ children, ...props }: React.ComponentProps<typeof PaginationNav>) {
  return <PaginationNav aria-label="이전 페이지" {...props}><ChevronLeftIcon className="size-4" />{children ?? "이전"}</PaginationNav>
}

function PaginationNext({ children, ...props }: React.ComponentProps<typeof PaginationNav>) {
  return <PaginationNav aria-label="다음 페이지" {...props}>{children ?? "다음"}<ChevronRightIcon className="size-4" /></PaginationNav>
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden data-slot="pagination-ellipsis" className={cn(base, "text-(--ggc-text-faint)", className)} {...props}>…</span>
}

export { Pagination, PaginationSummary, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis }
