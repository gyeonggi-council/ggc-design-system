import * as React from "react"

import { cn } from "@/lib/utils"

/* 페이지 헤더 — ggc-components.css §12. 브레드크럼(children 앞) + 제목 + 메타 + 주 액션 하나.
 * Monitor 첫 화면만 greeting — "{이름}님, 오늘 처리할 {업무} {N}건이 있습니다". */
function PageHead({
  className,
  breadcrumb,
  title,
  meta,
  actions,
  greeting = false,
  ...props
}: React.ComponentProps<"div"> & { breadcrumb?: React.ReactNode; title: React.ReactNode; meta?: React.ReactNode; actions?: React.ReactNode; greeting?: boolean }) {
  return (
    <div data-slot="page-head" className={cn("mb-5 flex flex-col gap-2", className)} {...props}>
      {breadcrumb}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={cn("m-0 leading-[1.3] font-extrabold text-(--ggc-text-strong)", greeting ? "text-[17px] tracking-[-0.03em]" : "text-lg tracking-[-0.02em]")}>{title}</h1>
          {meta && <p className="m-0 mt-[3px] text-[12.5px] text-(--ggc-text-subtle)">{meta}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export { PageHead }
