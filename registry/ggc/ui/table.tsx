/* 표 — thead 상단 2px primary-deep · 행 구분 hairline · 합계행 인셋. 숫자 칸은 <TableHead num> <TableCell num>(우정렬 tabular-nums). 셀 패딩 --ggc-cell-pad. (shadcn 공식 소스 + 토큰 · ADR 0011) */
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-(length:--ggc-table-font)", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-t-2 [&_tr]:border-t-(--ggc-primary-deep) [&_tr]:border-b [&_tr]:border-b-(--ggc-shell-border)", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t-2 border-t-(--ggc-primary-deep) bg-(--ggc-surface-inset) font-bold text-(--ggc-text-strong) [&>tr]:last:border-b-0 forced-colors:border-t-2",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-(--ggc-hairline) transition-colors hover:bg-(--ggc-row-hover) has-aria-expanded:bg-(--ggc-row-hover) data-[state=selected]:bg-(--ggc-primary-light)",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, num, ...props }: React.ComponentProps<"th"> & { num?: boolean }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "p-(--ggc-cell-pad) text-left align-middle font-bold whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0",
        num && "text-right tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, num, ...props }: React.ComponentProps<"td"> & { num?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-(--ggc-cell-pad) align-middle text-(--ggc-text-body) [&:has([role=checkbox])]:pr-0",
        num && "text-right tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("sr-only", className)}   /* 표 제목은 화면 밖 — 카드 제목이 이미 보인다 */
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
