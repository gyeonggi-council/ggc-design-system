import * as React from "react"

import { cn } from "@/lib/utils"

/* 하단 스티키 액션바 — ggc-components.css §20. Configure 슬롯 5.
 * <ShellMain> 의 마지막 자식으로 두면 sticky 로 바닥에 붙는다. 순서: 임시저장(secondary) → 상신(primary). */
function ActionBar({ className, status, children, ...props }: React.ComponentProps<"div"> & { status?: React.ReactNode }) {
  return (
    <div
      data-slot="actionbar"
      className={cn(
        "sticky bottom-0 z-40 -mx-8 -mb-12 mt-6 flex items-center justify-between gap-4 border-t border-border bg-[rgba(255,255,255,0.92)] px-8 py-[14px] shadow-[0_-4px_16px_rgba(20,30,50,0.06)] backdrop-blur-[8px] forced-colors:bg-[Canvas]",
        "max-[900px]:-mx-4 max-[900px]:-mb-10 max-[900px]:px-4 max-[900px]:py-3",
        className
      )}
      {...props}
    >
      {status && <div className="min-w-0 text-(length:--ggc-text-sm) text-(--ggc-text-subtle) max-[900px]:hidden">{status}</div>}
      <div className="ml-auto flex shrink-0 items-center gap-2 max-[900px]:w-full max-[900px]:[&>*]:flex-1">{children}</div>
    </div>
  )
}

export { ActionBar }
