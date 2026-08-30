"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 탭 — ggc-components.css §14 (KRDS line). 선택 표시는 색 + 하단 2px 선 둘 다. Radix 가 roving tabindex · 화살표를 준다. */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex gap-1 overflow-x-auto border-b border-input [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, count, children, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger> & { count?: React.ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "-mb-px inline-flex items-center gap-1 border-b-2 border-transparent bg-transparent px-[14px] py-2.5 text-(length:--ggc-control-font) leading-tight font-semibold whitespace-nowrap text-(--ggc-text-muted) transition-colors outline-none hover:bg-(--ggc-row-hover) hover:text-foreground focus-visible:shadow-(--ggc-focus-ring) data-[state=active]:border-primary data-[state=active]:font-bold data-[state=active]:text-(--ggc-primary-deep) forced-colors:data-[state=active]:outline forced-colors:data-[state=active]:outline-2 forced-colors:data-[state=active]:outline-[Highlight]",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && <span className="ml-1 text-[11.5px] font-semibold text-(--ggc-text-subtle) group-data-[state=active]:text-primary">{count}</span>}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("pt-5 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
