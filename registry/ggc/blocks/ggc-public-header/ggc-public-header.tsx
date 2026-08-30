"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/* 대민 헤더 — ggc-public.css §2·§3 + ggc-behaviors.js ④. 유틸리티 → 브랜딩(로고·통합검색·전체메뉴) → 주 메뉴.
 * PC 2단은 hover/focus-within(CSS)이 열고, ≤900 은 오른쪽 패널(useState) + 클릭 아코디언(한 번에 하나).
 * 정본과 달리 html 스크롤 잠금은 하지 않는다 — 패널만 연다. 업무 GNB/LNB 와 섞지 않는다(계약 §9). */

type HeaderContextValue = {
  menuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
  menuId: string
}

const HeaderContext = React.createContext<HeaderContextValue>({ menuOpen: false, toggleMenu: () => {}, closeMenu: () => {}, menuId: "main-menu" })

/* .ggc-header .action — 통합검색·전체메뉴 토글 버튼 겉모습 */
const ACTION =
  "inline-flex h-(--ggc-control-h-sm) shrink-0 cursor-pointer items-center gap-1.5 rounded-(--ggc-radius) border border-(--ggc-border-strong) bg-card px-3 text-(length:--ggc-control-font-sm) font-semibold text-foreground hover:bg-(--ggc-surface-inset)"

function PublicHeader({
  className,
  utility,
  logo,
  org,
  service,
  homeHref = "/",
  actions,
  search = true,
  searchAction,
  searchPlaceholder = "의안명 · 의원명 · 회의록 검색",
  children,
  ...props
}: React.ComponentProps<"header"> & {
  /** 유틸리티 줄의 <a> 들 — li 로 감싸 나열한다. ≤900 에서 줄 전체가 숨는다 */
  utility?: React.ReactNode
  /** 브랜딩 로고 이미지 슬롯(<img alt="">) — 기관명이 텍스트로 있으므로 이미지는 장식 */
  logo?: React.ReactNode
  org: React.ReactNode
  service?: React.ReactNode
  homeHref?: string
  /** 토글 앞에 붙는 추가 액션 */
  actions?: React.ReactNode
  /** false 면 통합검색 토글·패널을 만들지 않는다 */
  search?: boolean
  searchAction?: string
  searchPlaceholder?: string
}) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const menuToggleRef = React.useRef<HTMLButtonElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchInputId = React.useId()
  const searchId = "site-search"
  const menuId = "main-menu"

  /* 통합검색을 열면 입력으로 포커스 (behaviors ④와 동일) */
  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const context = React.useMemo<HeaderContextValue>(
    () => ({
      menuOpen,
      toggleMenu: () => setMenuOpen((open) => !open),
      /* 패널 안 닫기·ESC — 닫고 바깥 토글로 포커스 복귀 */
      closeMenu: () => {
        setMenuOpen(false)
        menuToggleRef.current?.focus()
      },
      menuId,
    }),
    [menuOpen]
  )

  return (
    <HeaderContext.Provider value={context}>
      <header data-slot="public-header" className={cn("relative z-50 border-b border-(--ggc-shell-border) bg-card print:hidden forced-colors:border", className)} {...props}>
        {utility && (
          <div data-slot="header-utility" className="border-b border-(--ggc-hairline) text-[13px] max-[900px]:hidden">
            <div className="mx-auto flex w-full max-w-(--ggc-container-max) justify-end px-6">
              <ul className="m-0 flex list-none items-center p-0 [&_a]:inline-block [&_a]:py-2 [&_a]:text-(--ggc-text-muted) [&_a]:no-underline [&_a:hover]:text-primary [&_a:hover]:underline [&>li+li]:before:mx-2.5 [&>li+li]:before:inline-block [&>li+li]:before:h-3 [&>li+li]:before:w-px [&>li+li]:before:bg-(--ggc-border-strong) [&>li+li]:before:align-[-1px] [&>li+li]:before:content-['']">
                {React.Children.map(utility, (child, i) => (child == null ? null : <li key={i}>{child}</li>))}
              </ul>
            </div>
          </div>
        )}
        <div data-slot="header-branding">
          <div className="mx-auto flex min-h-[88px] w-full max-w-(--ggc-container-max) items-center justify-between gap-(--ggc-space-5) px-6 max-[900px]:min-h-16 max-[900px]:px-4">
            <a className="flex min-w-0 items-center gap-3 text-inherit no-underline" href={homeHref}>
              {logo && <span className="shrink-0 [&_img]:size-12 [&_img]:object-contain max-[900px]:[&_img]:size-9">{logo}</span>}
              <span className="whitespace-nowrap text-[22px] font-extrabold tracking-[-0.03em] text-(--ggc-text-strong) max-[900px]:text-lg">{org}</span>
              {service && <span className="ml-2 whitespace-nowrap text-[15px] font-semibold text-primary max-[900px]:hidden">{service}</span>}
            </a>
            <div data-slot="header-actions" className="flex shrink-0 items-center gap-(--ggc-space-2)">
              {actions}
              {search && (
                <button type="button" className={ACTION} aria-expanded={searchOpen} aria-controls={searchId} onClick={() => setSearchOpen((open) => !open)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <span className="max-[900px]:hidden">통합검색</span>
                </button>
              )}
              <button ref={menuToggleRef} type="button" className={cn(ACTION, "hidden max-[900px]:inline-flex")} aria-expanded={menuOpen} aria-controls={menuId} onClick={context.toggleMenu}>
                <span
                  aria-hidden="true"
                  className="relative inline-block h-0.5 w-4 bg-current before:absolute before:-top-[5px] before:left-0 before:h-0.5 before:w-4 before:bg-current before:content-[''] after:absolute after:top-[5px] after:left-0 after:h-0.5 after:w-4 after:bg-current after:content-['']"
                />
                전체메뉴
              </button>
            </div>
          </div>
        </div>
        {search && (
          <div data-slot="header-search" id={searchId} hidden={!searchOpen} className="border-t border-(--ggc-hairline) bg-(--ggc-surface-inset)">
            <form role="search" action={searchAction} className="mx-auto flex w-full max-w-(--ggc-container-max) gap-(--ggc-space-2) px-6 py-3.5 max-[900px]:px-4">
              <label htmlFor={searchInputId} className="sr-only">
                누리집 통합검색
              </label>
              <Input ref={searchInputRef} id={searchInputId} type="search" placeholder={searchPlaceholder} className="flex-1" />
              <Button type="submit">검색</Button>
            </form>
          </div>
        )}
        {children}
      </header>
    </HeaderContext.Provider>
  )
}

/* --- 주 메뉴 (.ggc-main-menu) — 1단 6개 이하 · 2단 8개 이하 (KRDS 권고) --- */

type MainMenuItem = {
  label: React.ReactNode
  href?: string
  current?: boolean
  children?: { label: React.ReactNode; href: string; current?: boolean }[]
}

/* .depth1 > li > a·button — PC 는 li(group/mm) hover/focus-within, 현재·펼침은 aria 속성으로 */
const TRIGGER = cn(
  "inline-flex h-14 cursor-pointer items-center gap-1.5 border-b-[3px] border-b-transparent px-5 text-[17px] font-bold whitespace-nowrap text-(--ggc-text-strong) no-underline",
  "group-hover/mm:border-b-primary group-hover/mm:text-(--ggc-primary-deep) group-focus-within/mm:border-b-primary group-focus-within/mm:text-(--ggc-primary-deep)",
  "aria-expanded:border-b-primary aria-expanded:text-(--ggc-primary-deep) aria-[current=page]:border-b-primary aria-[current=page]:text-(--ggc-primary-deep)",
  "forced-colors:aria-[current=page]:outline-2 forced-colors:aria-[current=page]:outline-[Highlight] forced-colors:aria-[current=page]:-outline-offset-2",
  "max-[900px]:h-auto max-[900px]:min-h-[52px] max-[900px]:w-full max-[900px]:justify-between max-[900px]:border-b-0 max-[900px]:px-4 max-[900px]:py-3 max-[900px]:text-left max-[900px]:whitespace-normal"
)

/* .depth2 — PC 드롭다운(hover/focus-within/aria-expanded), ≤900 은 아코디언(aria-expanded 만) */
const DEPTH2 = cn(
  "absolute top-full left-0 z-[60] m-0 hidden min-w-[220px] list-none rounded-b-(--ggc-radius-lg) border border-border bg-card py-2 shadow-[0_12px_32px_rgba(20,30,50,0.12)]",
  "peer-aria-expanded:block min-[901px]:group-hover/mm:block min-[901px]:group-focus-within/mm:block",
  "max-[900px]:static max-[900px]:min-w-0 max-[900px]:rounded-none max-[900px]:border-0 max-[900px]:bg-(--ggc-surface-inset) max-[900px]:py-1 max-[900px]:shadow-none"
)

const DEPTH2_LINK = cn(
  "block px-5 py-2.5 text-[15px] font-medium text-foreground no-underline",
  "hover:bg-(--ggc-primary-light) hover:text-(--ggc-primary-deep) focus-visible:bg-(--ggc-primary-light) focus-visible:text-(--ggc-primary-deep)",
  "aria-[current=page]:font-bold aria-[current=page]:text-(--ggc-primary-deep)",
  "forced-colors:aria-[current=page]:outline-2 forced-colors:aria-[current=page]:outline-[Highlight] forced-colors:aria-[current=page]:-outline-offset-2",
  "max-[900px]:pr-4 max-[900px]:pl-7"
)

function MainMenu({ className, items, label = "주 메뉴", ...props }: Omit<React.ComponentProps<"nav">, "children"> & { items: MainMenuItem[]; label?: string }) {
  const { menuOpen, closeMenu, menuId } = React.useContext(HeaderContext)
  /* 모바일 아코디언 — 한 번에 하나만 (behaviors ④와 동일). PC 클릭도 같은 상태를 옮긴다 */
  const [openIndex, setOpenIndex] = React.useState(-1)
  const subIdBase = React.useId()

  return (
    <nav
      data-slot="main-menu"
      id={menuId}
      aria-label={label}
      data-open={menuOpen || undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) closeMenu()
      }}
      className={cn(
        "border-t border-(--ggc-hairline) bg-card forced-colors:border",
        "max-[900px]:fixed max-[900px]:top-0 max-[900px]:right-0 max-[900px]:bottom-0 max-[900px]:z-[70] max-[900px]:w-[min(360px,88vw)] max-[900px]:translate-x-full max-[900px]:overflow-y-auto max-[900px]:border-t-0 max-[900px]:border-l max-[900px]:border-border max-[900px]:shadow-[-8px_0_24px_rgba(20,30,50,0.12)] max-[900px]:transition-transform max-[900px]:duration-[180ms] max-[900px]:data-[open]:translate-x-0",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-(--ggc-container-max) px-6 max-[900px]:px-0">
        {/* .head — 모바일 패널 머리 */}
        <div className="hidden items-center justify-between border-b border-border px-4 py-3.5 text-[17px] font-extrabold text-(--ggc-text-strong) max-[900px]:flex">
          전체메뉴
          <button type="button" aria-label="메뉴 닫기" onClick={closeMenu} className="size-10 cursor-pointer rounded-(--ggc-radius-sm) border-0 bg-transparent text-xl text-(--ggc-text-muted)">
            ✕
          </button>
        </div>
        <ul className="m-0 flex list-none items-stretch p-0 max-[900px]:flex-col">
          {items.map((item, i) => {
            const expanded = openIndex === i
            const subId = `${subIdBase}-${i}`
            return (
              <li key={i} className="group/mm relative max-[900px]:border-b max-[900px]:border-(--ggc-hairline)">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={subId}
                      aria-current={item.current ? "page" : undefined}
                      onClick={() => setOpenIndex(expanded ? -1 : i)}
                      className={cn(TRIGGER, "peer group/mbtn border-x-0 border-t-0 bg-transparent")}
                    >
                      {item.label}
                      <span aria-hidden="true" className="-mt-[3px] size-1.5 shrink-0 rotate-45 border-r-2 border-b-2 border-current max-[900px]:group-aria-expanded/mbtn:rotate-[-135deg]" />
                    </button>
                    <ul id={subId} className={DEPTH2}>
                      {item.children.map((child, j) => (
                        <li key={j}>
                          <a href={child.href} aria-current={child.current ? "page" : undefined} className={DEPTH2_LINK}>
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a href={item.href} aria-current={item.current ? "page" : undefined} className={TRIGGER}>
                    {item.label}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export { PublicHeader, MainMenu, type MainMenuItem }
