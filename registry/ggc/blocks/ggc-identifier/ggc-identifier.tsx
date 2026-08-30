import * as React from "react"

import { cn } from "@/lib/utils"

/* 아이덴티파이어 — ggc-public.css §7. "이 누리집은 {기관명} 누리집입니다." — 공개 푸터 .bottom 안에 둔다.
 * logo 는 정부 제공 자산 슬롯(마스트헤드 .flag 와 같은 원칙) — 비우면 기관색 원.
 * children 을 주면 문구 전체를 대체한다. address 는 정본 CSS 에 없는 선택 보조 표기(운영기관 정보). */
function Identifier({
  className,
  logo,
  org = "경기도의회",
  address,
  children,
  ...props
}: React.ComponentProps<"div"> & { logo?: React.ReactNode; org?: React.ReactNode; address?: React.ReactNode }) {
  return (
    <div data-slot="identifier" className={cn("inline-flex items-center gap-2 text-[13px] text-(--ggc-text-muted)", className)} {...props}>
      <span
        aria-hidden="true"
        className="inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary has-[img]:w-auto has-[img]:rounded-none has-[img]:bg-transparent forced-colors:border [&_img]:block [&_img]:size-full [&_img]:object-cover"
      >
        {logo}
      </span>
      <span className="whitespace-nowrap">{children ?? <>이 누리집은 {org} 누리집입니다.</>}</span>
      {address && <span>{address}</span>}
    </div>
  )
}

export { Identifier }
