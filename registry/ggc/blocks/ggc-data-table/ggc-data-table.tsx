"use client"

import * as React from "react"
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns3Icon,
  InboxIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/* 데이터 표 — shadcn Data Table 패턴(TanStack Table) + 이 저장소 표 규칙.
 * Explore 화면의 본체다(archetypes.md). 정렬 · 검색 · 열 표시 · 쪽 이동 · 행 선택을 가지며, 밀도는 --ggc-cell-pad(8×12)라
 * 1440×900 첫 화면에 15~20행이 들어온다(domain-language.md). 숫자 열은 meta.num · 식별자(접수번호)는 왼쪽 첫 열.
 *
 *   const columns: ColumnDef<Bill>[] = [
 *     { accessorKey: "no", header: ({ column }) => <DataTableColumnHeader column={column} title="의안번호" /> },
 *     { accessorKey: "count", header: "건수", meta: { num: true } },
 *   ]
 *   <DataTable columns={columns} data={rows} searchKey="title" searchPlaceholder="의안명 검색" pageSize={20} />
 *
 * 빈 상태는 필터 때문인지 데이터가 없는지 **구분**한다(emptyFiltered / empty). 상태 열은 <Badge> + 텍스트 — 색 단독 금지. */

type ColumnMeta = { num?: boolean; label?: string; className?: string }

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: React.ComponentProps<"div"> & { column: Column<TData, TValue>; title: React.ReactNode }) {
  const meta = column.columnDef.meta as ColumnMeta | undefined
  if (!column.getCanSort()) {
    return <div className={cn(meta?.num && "text-right", className)}>{title}</div>
  }
  const sorted = column.getIsSorted()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn("-ml-2 h-7 gap-1 px-2 font-bold text-muted-foreground hover:text-foreground data-[sorted=true]:text-foreground", meta?.num && "-mr-2 ml-0 flex-row-reverse", className)}
      data-sorted={!!sorted}
      aria-label={typeof title === "string" ? `${title} 정렬` : undefined}
    >
      <span>{title}</span>
      {sorted === "asc" ? <ArrowUpIcon className="size-3.5" /> : sorted === "desc" ? <ArrowDownIcon className="size-3.5" /> : <ArrowUpDownIcon className="size-3.5 opacity-60" />}
    </Button>
  )
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "검색",
  pageSize = 20,
  toolbar,
  toolbarEnd,
  emptyTitle = "항목이 없습니다",
  emptyDesc,
  emptyFilteredTitle = "조건에 맞는 항목이 없습니다",
  emptyFilteredDesc = "검색어나 필터를 바꿔 보세요.",
  columnToggle = true,
  onRowClick,
  getRowId,
  className,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  toolbar?: React.ReactNode          /* 검색 옆 — 필터 셀렉트 · 칩 */
  toolbarEnd?: React.ReactNode       /* 우측 — 내려받기 · 등록 */
  emptyTitle?: React.ReactNode
  emptyDesc?: React.ReactNode
  emptyFilteredTitle?: React.ReactNode
  emptyFilteredDesc?: React.ReactNode
  columnToggle?: boolean
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData, index: number) => string
  className?: string
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const filtered = columnFilters.length > 0
  const rows = table.getRowModel().rows
  const total = table.getFilteredRowModel().rows.length
  const selected = table.getFilteredSelectedRowModel().rows.length

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {(searchKey || toolbar || toolbarEnd || columnToggle) && (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {searchKey && (
            <div className="relative w-full max-w-xs">
              <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-(--ggc-text-faint)" />
              <Input
                type="search"
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          {toolbar}
          <div className="ml-auto flex items-center gap-2">
            {toolbarEnd}
            {columnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm"><Columns3Icon />열</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">표시할 열</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table.getAllColumns().filter((c) => c.getCanHide()).map((c) => (
                    <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={(v) => c.toggleVisibility(!!v)}>
                      {(c.columnDef.meta as ColumnMeta | undefined)?.label ?? (typeof c.columnDef.header === "string" ? c.columnDef.header : c.id)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div data-slot="data-table-body" className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => {
                  const meta = h.column.columnDef.meta as ColumnMeta | undefined
                  return (
                    <TableHead key={h.id} num={meta?.num} className={meta?.className} style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as ColumnMeta | undefined
                    return (
                      <TableCell key={cell.id} num={meta?.num} className={meta?.className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <span aria-hidden="true" className="mb-1 inline-flex size-11 items-center justify-center rounded-full bg-(--ggc-surface-inset) text-(--ggc-text-faint)"><InboxIcon className="size-5" /></span>
                    <p className="m-0 text-(length:--ggc-text-base) font-bold text-(--ggc-text-strong)">{filtered ? emptyFilteredTitle : emptyTitle}</p>
                    {(filtered ? emptyFilteredDesc : emptyDesc) && <p className="m-0 text-(length:--ggc-text-sm)">{filtered ? emptyFilteredDesc : emptyDesc}</p>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={table.getState().pagination.pageIndex + 1}
        pageCount={table.getPageCount()}
        pageSize={table.getState().pagination.pageSize}
        total={total}
        selected={selected}
        canPrev={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onFirst={() => table.setPageIndex(0)}
        onPrev={() => table.previousPage()}
        onNext={() => table.nextPage()}
        onLast={() => table.setPageIndex(table.getPageCount() - 1)}
        onPageSize={(n) => table.setPageSize(n)}
      />
    </div>
  )
}

function DataTablePagination({
  page,
  pageCount,
  pageSize,
  total,
  selected = 0,
  canPrev,
  canNext,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onPageSize,
  pageSizes = [20, 50, 100],
  className,
}: {
  page: number
  pageCount: number
  pageSize: number
  total: number
  selected?: number
  canPrev: boolean
  canNext: boolean
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  onPageSize?: (n: number) => void
  pageSizes?: number[]
  className?: string
}) {
  return (
    <div data-slot="data-table-pagination" className={cn("flex flex-wrap items-center justify-between gap-3 text-(length:--ggc-text-sm) text-muted-foreground", className)}>
      <div className="tabular-nums">
        총 <b className="text-foreground">{total.toLocaleString("ko-KR")}</b>건
        {selected > 0 && <> · 선택 <b className="text-foreground">{selected}</b>건</>}
      </div>
      <div className="flex items-center gap-4">
        {onPageSize && (
          <label className="flex items-center gap-2">
            <span>쪽당</span>
            <NativeSelect size="sm" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} aria-label="쪽당 건수">
              {pageSizes.map((n) => <NativeSelectOption key={n} value={n}>{n}건</NativeSelectOption>)}
            </NativeSelect>
          </label>
        )}
        <span className="tabular-nums">{page} / {Math.max(pageCount, 1)} 쪽</span>
        <nav aria-label="쪽 이동" className="flex items-center gap-1">
          <Button type="button" variant="outline" size="icon-sm" onClick={onFirst} disabled={!canPrev} aria-label="첫 쪽"><ChevronsLeftIcon /></Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={onPrev} disabled={!canPrev} aria-label="이전 쪽"><ChevronLeftIcon /></Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={onNext} disabled={!canNext} aria-label="다음 쪽"><ChevronRightIcon /></Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={onLast} disabled={!canNext} aria-label="마지막 쪽"><ChevronsRightIcon /></Button>
        </nav>
      </div>
    </div>
  )
}

export { DataTable, DataTableColumnHeader, DataTablePagination }
export type { ColumnMeta }
