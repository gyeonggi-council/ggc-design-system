"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 체크박스 — ggc-components.css §17. 20px 상자 · 선택은 네이비 채움 + 흰 체크. 고대비는 시스템 색. */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-(--ggc-radius-sm) border-[1.5px] border-input bg-card transition-[background-color,border-color] outline-none focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring) disabled:cursor-default disabled:border-border disabled:bg-(--ggc-control-bg) data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground disabled:data-[state=checked]:border-(--ggc-text-faint) disabled:data-[state=checked]:bg-(--ggc-text-faint) forced-colors:border forced-colors:data-[state=checked]:bg-[Highlight]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current">
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
