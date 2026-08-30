import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[72px] w-full rounded-(--ggc-radius) border border-input bg-card px-[14px] py-2.5 text-(length:--ggc-control-font) leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-(--ggc-text-subtle) disabled:cursor-default disabled:bg-(--ggc-control-bg)",
        "focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring) aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
