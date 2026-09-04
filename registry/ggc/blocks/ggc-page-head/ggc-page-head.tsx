import * as React from "react"

import { cn } from "@/lib/utils"

/* 페이지 헤더 — ggc-components.css §12. 본문 첫 줄의 **메타 + 주 액션 하나**.
 * v2.1(ADR 0008): 브레드크럼과 h1 은 GNB 제목부(ggc-shell 의 GnbPage)로 갔다. title/breadcrumb 은
 *   ① 셸 ⓐ(GNB 없음)에서만 h1 로,  ② greeting(Monitor 첫 화면 "{이름}님, 오늘 처리할 {업무} {N}건이 있습니다")은
 *   <p> 로 렌더한다 — h1 은 GNB 에 있다. 둘 다 아니면 메타·액션만. */
function PageHead({
  className,
  breadcrumb,
  title,
  meta,
  actions,
  greeting = false,
  ...props
}: React.ComponentProps<"div"> & { breadcrumb?: React.ReactNode; title?: React.ReactNode; meta?: React.ReactNode; actions?: React.ReactNode; greeting?: boolean }) {
  const Title = greeting ? "p" : "h1"
  return (
    <div data-slot="page-head" className={cn("mb-5 flex flex-col gap-2", className)} {...props}>
      {breadcrumb}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {title && <Title className={cn("m-0 leading-[1.3] font-extrabold text-(--ggc-text-strong)", greeting ? "text-[17px] tracking-[-0.03em]" : "text-lg tracking-[-0.02em]")}>{title}</Title>}
          {meta && <p className={cn("m-0 text-[12.5px] text-(--ggc-text-subtle)", title && "mt-[3px]")}>{meta}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export { PageHead }
