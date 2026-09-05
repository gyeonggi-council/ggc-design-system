import * as React from "react"

import { cn } from "@/lib/utils"

/* 페이지 헤더 — ggc-components.css §12 (v3.0, ADR 0010). 본문 첫 줄.
 * 화면의 <h1> 은 여기 하나다 — 그 화면에서 가장 큰 글자(--ggc-h1-size 24)여야 시선의 닻이 된다.
 * 브레드크럼은 헤더(ggc-shell ShellHeader.breadcrumb)에 있다. desc 에는 기관 맥락(제N대 · 제NNN회 · 소관)과 건수를 적는다.
 * Monitor 첫 화면: title 은 화면 이름("대시보드"), 인사말은 desc — 인사말을 h1 으로 쓰지 않는다.
 * 주 액션은 하나다 — 둘 이상이면 무엇을 눌러야 하는지 흐려진다(archetypes Learn/Decide).
 * 레코드 화면(의안 상세)의 h1 은 의안명 — 두 줄까지 허용(잘리면 다른 의안이 된다). */
function PageHead({
  className,
  title,
  titleId = "page-title",
  desc,
  actions,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode
  titleId?: string
  desc?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div data-slot="page-head" className={cn("mb-5 flex flex-col gap-2", className)} {...props}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1
            id={titleId}
            data-slot="page-title"
            className="m-0 line-clamp-2 text-(length:--ggc-h1-size) leading-(--ggc-leading-tight) font-bold tracking-[-0.02em] text-(--ggc-text-strong) max-[480px]:text-(length:--ggc-text-xl)"
          >
            {title}
          </h1>
          {desc && <p data-slot="page-desc" className="m-0 mt-1 text-(length:--ggc-text-sm) leading-(--ggc-leading-normal) text-muted-foreground">{desc}</p>}
        </div>
        {actions && <div data-slot="page-actions" className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

/* 섹션 제목 — 카드 밖 구획(--ggc-h2-size 18). 카드 안 제목은 CardTitle(--ggc-h3-size). */
function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="section-title" className={cn("m-0 mb-3 text-(length:--ggc-h2-size) leading-(--ggc-leading-tight) font-bold tracking-[-0.02em] text-(--ggc-text-strong)", className)} {...props} />
}

export { PageHead, SectionTitle }
