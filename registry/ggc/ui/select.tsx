import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* 네이티브 셀렉트 — ggc-components.css §16. 항목 20개 이하는 이것으로 충분하다.
 * 검색·다중 선택이 필요하면 Radix Select 기반 listbox(P2)를 쓴다. */
function Select({ className, size = "default", ...props }: Omit<React.ComponentProps<"select">, "size"> & { size?: "default" | "sm" }) {
  return (
    <span data-slot="select" className={cn("relative block", className)}>
      <select
        className={cn(
          "w-full cursor-pointer appearance-none rounded-(--ggc-radius) border border-input bg-card pr-[38px] pl-[14px] text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring) disabled:cursor-default disabled:bg-(--ggc-control-bg) disabled:text-(--ggc-text-subtle) aria-invalid:border-destructive",
          size === "sm" ? "h-(--ggc-control-h-sm) text-(length:--ggc-control-font-sm)" : "h-(--ggc-input-h) text-(length:--ggc-control-font)"
        )}
        {...props}
      />
      <ChevronDownIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 right-[13px] size-4 -translate-y-1/2 text-(--ggc-text-muted)" />
    </span>
  )
}

export { Select }
