"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 라디오 — ggc-components.css §17. 20px 원 · 선택은 네이비 채움 + 흰 점. 묶음은 <fieldset><legend>. */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-5 shrink-0 rounded-full border-[1.5px] border-input bg-card transition-[background-color,border-color] outline-none focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring) disabled:cursor-default disabled:border-border disabled:bg-(--ggc-control-bg) data-[state=checked]:border-primary data-[state=checked]:bg-primary forced-colors:border forced-colors:data-[state=checked]:bg-[Highlight]",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center">
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground forced-colors:bg-[HighlightText]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
