import * as React from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* GNB 검색 — ggc-components.css §9 .ggc-search. 300×40(--ggc-search-h) · ≤900 에서 flex-1, kbd 숨김.
 * ⚠ placeholder 를 유일한 라벨로 쓰지 않는다(정본 §9) — aria-label 이 필수 prop 이다. */
function SearchBox({
  className,
  shortcut,
  ...props
}: React.ComponentProps<"input"> & { "aria-label": string; shortcut?: React.ReactNode }) {
  return (
    <div data-slot="search" className={cn("flex h-(--ggc-search-h) w-[300px] min-w-[120px] items-center gap-2 rounded-(--ggc-radius) border border-(--ggc-shell-border) bg-(--ggc-control-bg) px-3 max-[900px]:w-auto max-[900px]:min-w-0 max-[900px]:flex-1", className)}>
      <SearchIcon aria-hidden="true" strokeWidth={2.2} className="size-[15px] shrink-0 text-(--ggc-text-faint)" />
      <input data-slot="search-input" type="search" className="w-full min-w-0 border-none bg-transparent text-[13.5px] text-foreground placeholder:text-(--ggc-text-subtle)" {...props} />
      {shortcut && (
        <kbd data-slot="search-kbd" className="shrink-0 font-mono text-[11px] text-(--ggc-text-subtle) max-[900px]:hidden">
          {shortcut}
        </kbd>
      )}
    </div>
  )
}

export { SearchBox }
