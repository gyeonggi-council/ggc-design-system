"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/* 폼 라벨 — --ggc-label-font(업무 13 / 대민 17) · 700 · text-muted. 필수는 <Label required>. */
function Label({
  className,
  required = false,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("flex items-center gap-1 text-(length:--ggc-label-font) font-bold leading-none text-(--ggc-text-muted) select-none peer-disabled:cursor-default peer-disabled:opacity-60", className)}
      {...props}
    >
      {children}
      {required && <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }
