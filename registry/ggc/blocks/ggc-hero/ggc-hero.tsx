import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/* 히어로 — ggc-public.css §4. 대민 메인 첫 화면 전용: 안내 문구 + 통합검색 + 바로가기 칩.
 * 하위 페이지는 PageTitle 부터 시작한다. PublicMain bleed 안에 둔다(가로 전폭). */
function Hero({
  className,
  title,
  lede,
  search,
  links,
  ...props
}: React.ComponentProps<"section"> & {
  title: React.ReactNode
  lede?: React.ReactNode
  search?: { action?: string; label?: string; placeholder?: string; name?: string; buttonLabel?: React.ReactNode }
  links?: React.ReactNode
}) {
  const titleId = React.useId()
  const inputId = React.useId()
  return (
    <section
      data-slot="hero"
      aria-labelledby={titleId}
      className={cn("border-b border-border bg-(--ggc-primary-light) py-(--ggc-space-9) max-[900px]:py-(--ggc-space-7)", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-(--ggc-container-max) px-6 max-[900px]:px-4">
        <h1 id={titleId} className="m-0 mb-(--ggc-space-3) text-[28px] font-extrabold tracking-[-0.03em] text-(--ggc-text-strong) max-[900px]:text-[22px]">
          {title}
        </h1>
        {lede && <p className="m-0 mb-(--ggc-space-6) text-[17px] text-(--ggc-text-muted)">{lede}</p>}
        {search && (
          <form role="search" action={search.action} className="flex max-w-[720px] gap-(--ggc-space-2) max-[900px]:flex-col">
            <label htmlFor={inputId} className="sr-only">
              {search.label ?? "통합검색"}
            </label>
            {/* 정본 56px = 대민 프로필의 --ggc-control-h-lg — 프로필 값을 하드코딩하지 않는다 */}
            <Input id={inputId} type="search" name={search.name} placeholder={search.placeholder} className="h-(--ggc-control-h-lg) flex-1 border-2 border-primary px-5" />
            <Button type="submit" className="h-(--ggc-control-h-lg) px-6 max-[900px]:w-full">
              {search.buttonLabel ?? "검색"}
            </Button>
          </form>
        )}
        {links && (
          <div
            data-slot="hero-links"
            className="mt-(--ggc-space-5) flex flex-wrap gap-(--ggc-space-2) [&_a]:inline-flex [&_a]:h-(--ggc-control-h-sm) [&_a]:items-center [&_a]:rounded-full [&_a]:border [&_a]:border-(--ggc-border-strong) [&_a]:bg-card [&_a]:px-3.5 [&_a]:text-(length:--ggc-control-font-sm) [&_a]:font-semibold [&_a]:text-(--ggc-primary-deep) [&_a]:no-underline [&_a:hover]:border-primary"
          >
            {links}
          </div>
        )}
      </div>
    </section>
  )
}

export { Hero }
