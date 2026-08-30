"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 토글 스위치 — ggc-components.css §24. 즉시 적용되는 켬/끔에만(제출로 반영되는 선택은 체크박스).
 * 트랙 40×22 · 손잡이 15px 흰 원. 켬/끔은 색 + 손잡이 위치 + 상태 문구 셋 — 색 단독 금지. 색은 전부 토큰. */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[22px] w-10 shrink-0 items-center rounded-full border-[1.5px] border-transparent bg-(--ggc-text-faint) transition-[background-color,border-color] outline-none focus-visible:border-(--ggc-primary-deep) focus-visible:shadow-(--ggc-focus-ring) disabled:cursor-default disabled:border-border disabled:bg-(--ggc-control-bg) data-[state=checked]:bg-primary disabled:data-[state=checked]:bg-(--ggc-text-faint) forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:data-[state=checked]:border-[Highlight] forced-colors:data-[state=checked]:bg-[Highlight]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-[15px] translate-x-0.5 rounded-full bg-card transition-transform data-[state=checked]:translate-x-[20px] data-[disabled]:bg-(--ggc-border-strong) data-[disabled]:data-[state=checked]:bg-card forced-colors:bg-[CanvasText] forced-colors:data-[state=checked]:bg-[HighlightText]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
