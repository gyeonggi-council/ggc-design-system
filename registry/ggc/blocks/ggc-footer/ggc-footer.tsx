import * as React from "react"

import { cn } from "@/lib/utils"

/* 업무 푸터 — ggc-tokens.css .ggc-footer (+ .inner 1280). 대민 화면은 ggc-public-footer 를 쓴다. */
function Footer({ className, children, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer data-slot="footer" className={cn("border-t border-border bg-background font-sans text-xs text-(--ggc-text-muted)", className)} {...props}>
      <div className="mx-auto max-w-(--ggc-container-max) p-4">{children}</div>
    </footer>
  )
}

export { Footer }
