import * as React from "react"

import { cn } from "@/lib/utils"

/* 공개 푸터 — ggc-public.css §7. .quick(관련 누리집) → .main(기관 정보 · 링크) → .bottom(메뉴 · 아이덴티파이어 · 저작권).
 * 기관명 · 주소 · 대표전화 · 개인정보처리방침(point, 강조색) · 아이덴티파이어는 필수(검사기 D3).
 * identifier 슬롯에는 @ggc/ggc-identifier 의 <Identifier> 를 둔다. 인쇄에서는 quick · links 가 사라진다. */
function PublicFooter({
  className,
  quick,
  org = "경기도의회",
  address,
  tel,
  telNote,
  links,
  point,
  menus,
  copy = "© 경기도의회. All rights reserved.",
  identifier,
  ...props
}: React.ComponentProps<"footer"> & {
  quick?: React.ReactNode
  org?: React.ReactNode
  address?: React.ReactNode
  tel?: React.ReactNode
  telNote?: React.ReactNode
  links?: React.ReactNode
  point?: { href: string; label?: React.ReactNode }
  menus?: React.ReactNode
  copy?: React.ReactNode
  identifier?: React.ReactNode
}) {
  return (
    <footer data-slot="public-footer" className={cn("mt-auto border-t border-border bg-(--ggc-surface-inset) text-sm text-(--ggc-text-muted) forced-colors:border", className)} {...props}>
      {quick && (
        <div data-slot="footer-quick" className="border-b border-border bg-card print:hidden">
          <div className="mx-auto flex w-full max-w-(--ggc-container-max) flex-wrap gap-x-(--ggc-space-6) px-6 max-[900px]:gap-x-(--ggc-space-4) max-[900px]:px-4 [&_a]:inline-block [&_a]:py-3 [&_a]:font-semibold [&_a]:text-(--ggc-text-muted) [&_a]:no-underline [&_a:hover]:text-primary [&_a:hover]:underline">
            {quick}
          </div>
        </div>
      )}
      <div data-slot="footer-main" className="mx-auto flex w-full max-w-(--ggc-container-max) flex-wrap justify-between gap-(--ggc-space-5) px-6 py-(--ggc-space-7) max-[900px]:flex-col max-[900px]:px-4">
        <div data-slot="footer-info">
          <p className="m-0 mb-2 text-[17px] font-extrabold text-(--ggc-text-strong)">{org}</p>
          {address && <p className="m-0 mb-1">{address}</p>}
          {tel && (
            <p className="m-0 mb-1">
              <strong className="mr-1.5 text-foreground">{tel}</strong>
              {telNote && <span>{telNote}</span>}
            </p>
          )}
        </div>
        {links && (
          <div data-slot="footer-links" className="flex flex-wrap content-start gap-(--ggc-space-4) print:hidden [&_a]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2">
            {links}
          </div>
        )}
      </div>
      <div data-slot="footer-bottom" className="border-t border-border">
        <div className="mx-auto flex w-full max-w-(--ggc-container-max) flex-wrap items-center justify-between gap-x-(--ggc-space-5) gap-y-(--ggc-space-3) px-6 py-4 max-[900px]:px-4">
          {(point || menus) && (
            <div data-slot="footer-menu" className="flex flex-wrap gap-x-(--ggc-space-4)">
              {point && (
                <a className="font-bold text-(--ggc-danger) no-underline hover:underline" href={point.href}>
                  {point.label ?? "개인정보처리방침"}
                </a>
              )}
              {menus && <span className="contents [&_a]:text-(--ggc-text-muted) [&_a]:no-underline [&_a:hover]:underline">{menus}</span>}
            </div>
          )}
          {identifier}
          {copy && <p className="m-0 basis-full text-[13px] text-(--ggc-text-subtle)">{copy}</p>}
        </div>
      </div>
    </footer>
  )
}

export { PublicFooter }
