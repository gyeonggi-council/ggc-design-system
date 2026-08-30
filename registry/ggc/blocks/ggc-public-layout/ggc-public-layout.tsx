import * as React from "react"

import { cn } from "@/lib/utils"

/* 대민 본문 배치 — ggc-public.css §0·§4. 대민 치수는 소비자가 <html data-ggc-profile="public"> 로 켠다 —
 * 여기는 토큰만 읽는다. 순서: Masthead → PublicHeader → PublicMain → PublicFooter (스킵 링크는 서비스 셸 담당). */

/* .ggc-public — 페이지 컨테이너. 보통 body 바로 아래 한 번. */
function PublicPage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="public-page"
      className={cn("flex min-h-screen flex-col bg-card font-sans text-(length:--ggc-control-font) leading-[1.6] break-keep text-foreground antialiased print:text-[12pt]", className)}
      {...props}
    />
  )
}

/* .ggc-public .inner — 컨테이너 폭(--ggc-container-max) + 좌우 24/16. */
function Inner({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="inner" className={cn("mx-auto w-full max-w-(--ggc-container-max) px-6 max-[900px]:px-4", className)} {...props} />
}

/* .ggc-public-main — 본문 랜드마크. side 를 주면 --side 격자(240 + minmax(0,1fr) > .content min-w-0).
 * bleed 는 히어로처럼 가로 전폭 구획을 직접 배치할 때 — inner 로 감싸지 않고 pt 0 (정본 index.html). */
function PublicMain({ className, side, bleed = false, children, ...props }: React.ComponentProps<"main"> & { side?: React.ReactNode; bleed?: boolean }) {
  return (
    <main
      id="main"
      data-slot="public-main"
      className={cn("flex-1 pt-(--ggc-space-8) pb-(--ggc-space-10) max-[900px]:pt-(--ggc-space-6) max-[900px]:pb-(--ggc-space-8)", bleed && "pt-0 max-[900px]:pt-0", className)}
      {...props}
    >
      {side ? (
        <Inner className="grid grid-cols-[240px_minmax(0,1fr)] items-start gap-(--ggc-space-8) max-[900px]:grid-cols-[minmax(0,1fr)] max-[900px]:gap-(--ggc-space-5) print:grid-cols-1">
          {side}
          <div data-slot="content" className="min-w-0">
            {children}
          </div>
        </Inner>
      ) : bleed ? (
        children
      ) : (
        <Inner>{children}</Inner>
      )}
    </main>
  )
}

/* .ggc-page-title — 브레드크럼 + h1 + 설명. 하위 페이지는 여기서 시작한다(히어로는 메인 첫 화면만). */
function PageTitle({
  className,
  breadcrumb,
  title,
  desc,
  children,
  ...props
}: React.ComponentProps<"div"> & { breadcrumb?: React.ReactNode; title: React.ReactNode; desc?: React.ReactNode }) {
  return (
    <div data-slot="page-title" className={cn("mb-(--ggc-space-7)", className)} {...props}>
      {breadcrumb && <div className="mb-(--ggc-space-3)">{breadcrumb}</div>}
      <h1 className="m-0 text-[32px] leading-[1.3] font-extrabold tracking-[-0.03em] text-(--ggc-text-strong) max-[900px]:text-2xl">{title}</h1>
      {desc && <p className="m-0 mt-2.5 text-[17px] text-(--ggc-text-muted)">{desc}</p>}
      {children}
    </div>
  )
}

/* .ggc-public h2.ggc-h2 — 본문 구획 제목. */
function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="section-title" className={cn("mt-(--ggc-space-8) mb-(--ggc-space-4) text-2xl font-extrabold tracking-[-0.02em] text-(--ggc-text-strong) first:mt-0", className)} {...props} />
}

export { PublicPage, Inner, PublicMain, PageTitle, SectionTitle }
