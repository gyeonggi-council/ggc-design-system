import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/* 브레드크럼 — ggc-components.css §13 (KRDS). 마지막 항목은 링크가 아니라 aria-current="page" 텍스트. */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="현재 경로" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("m-0 flex flex-wrap items-center gap-x-1 gap-y-0.5 p-0 text-[12.5px] break-words text-(--ggc-text-subtle)", className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1", className)} {...props} />
}

function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return <Comp data-slot="breadcrumb-link" className={cn("rounded-(--ggc-radius-sm) px-1 -mx-1 py-0.5 text-(--ggc-text-muted) no-underline transition-colors hover:text-primary hover:underline", className)} {...props} />
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn("font-semibold text-foreground", className)} {...props} />
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3 text-(--ggc-text-faint)", className)} {...props}>
      {children ?? <ChevronRight />}
    </li>
  )
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator }
