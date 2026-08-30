"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 툴팁 — ggc-components.css §33. **보조 설명**에만 — 툴팁에만 있는 정보는 없는 정보다(터치 · 스크린리더).
 * 링크·버튼을 넣지 않는다. 지연 0 — 지연을 두면 사용자는 툴팁이 없다고 판단한다. 색은 전부 토큰. */
function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({ className, sideOffset = 8, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-[70] w-max max-w-[260px] rounded-(--ggc-radius-sm) bg-(--ggc-text-strong) px-2.5 py-1.5 text-left text-[12.5px] leading-[1.45] font-medium text-primary-foreground animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow data-slot="tooltip-arrow" className="fill-(--ggc-text-strong) forced-colors:hidden" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
