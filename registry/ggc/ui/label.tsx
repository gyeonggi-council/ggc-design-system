/* 라벨 — --ggc-label-font. 필수 표시는 <Label required>. (shadcn 공식 소스 + 토큰 · ADR 0011) */
import * as React from "react"
import { cn } from "@/lib/utils"
import { Label as LabelPrimitive } from "radix-ui"

function Label({
  className,
  required = false,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 text-(length:--ggc-label-font) leading-none font-semibold text-muted-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && <span aria-hidden="true" className="text-destructive">*</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }
