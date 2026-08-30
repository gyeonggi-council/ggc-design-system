import * as React from "react"

import { cn } from "@/lib/utils"

/* 마스트헤드 — ggc-public.css §1. 공식 누리집 띠 — 문구는 바꾸지 않는다(KRDS masthead).
 * flag 는 정부 제공 자산 슬롯(<img alt="">) — 비우면 CSS 가 기관색 원으로 자리를 표시한다.
 * children 을 주면 <details> 안내 접기가 붙는다(정본이 details 라 JS 0). */
function Masthead({ className, flag, children, ...props }: React.ComponentProps<"div"> & { flag?: React.ReactNode }) {
  return (
    <div data-slot="masthead" className={cn("border-b border-border bg-(--ggc-surface-inset) text-[13px] text-(--ggc-text-muted) print:hidden forced-colors:border", className)} {...props}>
      <div className="mx-auto flex min-h-9 w-full max-w-(--ggc-container-max) flex-wrap items-center gap-x-2.5 gap-y-1.5 px-6 max-[900px]:px-4">
        <span
          aria-hidden="true"
          className="inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary has-[img]:w-auto has-[img]:rounded-none has-[img]:bg-transparent forced-colors:border [&_img]:block [&_img]:size-full [&_img]:object-cover"
        >
          {flag}
        </span>
        <span>이 누리집은 대한민국 공식 전자정부 누리집입니다.</span>
        {children && (
          <details className="group ml-auto open:ml-0 open:flex open:basis-full open:flex-wrap">
            <summary className="cursor-pointer list-none rounded-(--ggc-radius-sm) px-1.5 py-1 text-primary underline underline-offset-2 group-open:font-bold [&::-webkit-details-marker]:hidden">안내</summary>
            <p className="m-0 mt-1 mb-2 basis-full rounded-(--ggc-radius) border border-border bg-card px-3 py-2.5 leading-[1.6] text-(--ggc-text-body)">{children}</p>
          </details>
        )}
      </div>
    </div>
  )
}

export { Masthead }
