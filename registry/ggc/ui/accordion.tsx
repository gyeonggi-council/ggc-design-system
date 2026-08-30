"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 아코디언 — ggc-components.css §26 카드형. 정말 접어도 되는 내용에만(FAQ · 고급 검색 · 근거 조문) —
 * 필수 입력·오류를 접어 두지 않는다. Root 가 묶음(테두리 하나) · Item 사이 hairline 구분선.
 * type="single" collapsible 이 §26 의 배타 열림(같은 name)과 같다. */
function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("rounded-(--ggc-radius-lg) border border-border bg-card forced-colors:border-[CanvasText]", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      /* 모서리는 Root 의 radius 를 물려받는다 — 첫 항목 위, 마지막 닫힌 항목 아래(§26 group 과 동일) */
      className={cn("border-t border-(--ggc-hairline) first:rounded-t-[inherit] first:border-t-0 last:data-[state=closed]:rounded-b-[inherit]", className)}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex rounded-[inherit]">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 cursor-pointer items-center gap-3 rounded-[inherit] px-[18px] py-[14px] text-left text-(length:--ggc-control-font) font-bold text-(--ggc-text-strong) transition-colors outline-none hover:bg-(--ggc-row-hover) focus-visible:shadow-(--ggc-focus-ring) [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="ml-auto size-4 shrink-0 text-(--ggc-text-muted) transition-transform" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className="overflow-hidden" {...props}>
      <div className={cn("px-[18px] pt-0.5 pb-[18px] text-[13.5px] leading-[1.7] text-(--ggc-text-body) [&>:first-child]:mt-0 [&>:last-child]:mb-0", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
