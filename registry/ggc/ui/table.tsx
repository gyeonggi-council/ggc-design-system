"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* 표 — ggc-components.css §8. thead 상단 2px primary-deep · 행 구분 hairline · 합계행 인셋.
 * 숫자 칸은 <TableCell num> — 우정렬 + tabular-nums. 넓은 표는 래퍼가 가로 스크롤한다. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full border-collapse text-(length:--ggc-table-font)", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-t-2 [&_tr]:border-t-(--ggc-primary-deep) [&_tr]:border-b [&_tr]:border-b-(--ggc-shell-border)", className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t-2 border-t-(--ggc-primary-deep) bg-(--ggc-surface-inset) font-extrabold text-(--ggc-text-strong) [&_td]:border-b-0 [&_td]:py-[13px] forced-colors:border-t-2", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("transition-colors hover:bg-(--ggc-row-hover) data-[state=selected]:bg-(--ggc-primary-light)", className)} {...props} />
}

function TableHead({ className, num, ...props }: React.ComponentProps<"th"> & { num?: boolean }) {
  return <th data-slot="table-head" className={cn("p-(--ggc-cell-pad) text-left align-middle font-bold whitespace-nowrap text-(--ggc-text-muted)", num && "text-right tabular-nums", className)} {...props} />
}

function TableCell({ className, num, ...props }: React.ComponentProps<"td"> & { num?: boolean }) {
  return <td data-slot="table-cell" className={cn("border-b border-(--ggc-hairline) p-(--ggc-cell-pad) align-middle text-(--ggc-text-body)", num && "text-right tabular-nums", className)} {...props} />
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("sr-only", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
