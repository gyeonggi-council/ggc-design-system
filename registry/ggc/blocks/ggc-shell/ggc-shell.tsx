"use client"

import * as React from "react"
import { BellIcon, ChevronsUpDownIcon, LogOutIcon, SearchIcon, UserIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

/* 업무 셸 v3 (ADR 0009 · 0010 · 0011) — shadcn dashboard-01 과 같은 구조.
 *
 *   <Shell>                                  SidebarProvider · 페이지 배경
 *     <UtilityBar …/>                        (선택) 모든 시스템 최상단 진네이비 띠 — @ggc/ggc-utility-bar. switcher="bar" 일 때
 *     <ShellFrame>
 *       <AppSidebar brand groups user …/>    사이드바 256 · 접으면 48(아이콘만) · ≤768 은 Sheet(drawer)
 *       <ShellInset>
 *         <ShellHeader breadcrumb …/>        64px — 토글 · 브레드크럼(경로) · 검색 · 알림 · (슬롯)
 *         <ShellMain>                        본문 1320(Monitor) / --wide 1360. 첫 줄은 @ggc/ggc-page-head 의 <h1>
 *
 * 제목(h1)은 헤더가 아니라 본문 첫 줄이다(ADR 0010). 헤더에는 화면마다 자리가 같은 것만 둔다.
 * 시스템 스위처는 사이드바 머리(드롭다운, switcher="sidebar") 또는 유틸리티 바(switcher="bar") 중 하나다 — 둘 다 두지 않는다.
 * 대민 화면에는 쓰지 않는다(계약 §9 — ggc-public-header). */

type NavItem = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
  badge?: React.ReactNode         /* 우측 건수 — 업무 큐의 "처리할 건" */
}
type NavGroup = { label?: string; items: NavItem[] }
type SystemLink = { name: string; href?: string; active?: boolean; disabled?: boolean }

/* 공식 sidebar 의 접힘 툴팁이 TooltipProvider 를 요구한다 — 셸이 한 번 감싼다(소비자 실증 2026-09-05 에서 잡힌 결함) */
function Shell({ className, defaultOpen = true, children, ...props }: React.ComponentProps<typeof SidebarProvider>) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        data-slot="shell"
        className={cn("min-h-svh flex-col bg-background font-sans text-foreground antialiased", className)}
        {...props}
      >
        {children}
      </SidebarProvider>
    </TooltipProvider>
  )
}

/* 사이드바 + 본문을 가로로 — 유틸리티 바가 위에 있을 수 있어 Provider 와 분리한다 */
function ShellFrame({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="shell-frame" className={cn("flex min-h-0 flex-1", className)} {...props} />
}

function AppSidebar({
  brand,
  groups,
  systems,
  user,
  footer,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  brand: { mark: React.ReactNode; org: React.ReactNode; service?: React.ReactNode; href?: string }
  groups: NavGroup[]
  systems?: SystemLink[]         /* 있으면 브랜드가 시스템 스위처 드롭다운이 된다(switcher="sidebar") */
  user?: { name: React.ReactNode; role?: React.ReactNode; dept?: React.ReactNode; onLogout?: () => void }
  footer?: React.ReactNode
}) {
  const brandInner = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md [&>img]:size-8 [&>img]:object-contain">{brand.mark}</span>
      <span className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate text-(length:--ggc-text-base) font-bold tracking-[-0.02em] text-foreground">{brand.org}</span>
        {brand.service && <span className="truncate text-(length:--ggc-text-xs) font-semibold text-primary">{brand.service}</span>}
      </span>
    </>
  )
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-(--ggc-gnb-h) justify-center border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            {systems?.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent" aria-label="시스템 전환">
                    {brandInner}
                    <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">통합서비스</DropdownMenuLabel>
                  {systems.map((s) => (
                    <DropdownMenuItem key={s.name} asChild disabled={s.disabled} data-active={s.active || undefined}>
                      <a href={s.href ?? "#"} aria-current={s.active ? "page" : undefined} className={cn(s.active && "font-semibold text-primary")}>
                        {s.name}
                        {s.disabled && <span className="ml-auto text-xs text-muted-foreground">내부망</span>}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg" asChild>
                <a href={brand.href ?? "/"}>{brandInner}</a>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g, gi) => (
          <SidebarGroup key={gi}>
            {g.label && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => (
                  <SidebarMenuItem key={it.href + it.title}>
                    <SidebarMenuButton asChild isActive={it.active} tooltip={it.title}>
                      <a href={it.href} aria-current={it.active ? "page" : undefined}>
                        {it.icon && <it.icon />}
                        <span>{it.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {it.badge != null && <SidebarMenuBadge className="tabular-nums">{it.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {(user || footer) && (
        <SidebarFooter className="border-t border-sidebar-border">
          {footer}
          {user && (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" aria-label="사용자 메뉴">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--ggc-primary-light) text-primary"><UserIcon className="size-4" /></span>
                      <span className="grid min-w-0 flex-1 leading-tight">
                        <span className="truncate text-sm font-semibold">{user.name}</span>
                        {(user.role || user.dept) && (
                          <span className="truncate text-xs text-muted-foreground">{[user.role, user.dept].filter(Boolean).map((x, i) => <React.Fragment key={i}>{i > 0 && " · "}{x}</React.Fragment>)}</span>
                        )}
                      </span>
                      <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                    <DropdownMenuLabel className="font-normal">
                      <span className="block text-sm font-semibold">{user.name}</span>
                      {(user.role || user.dept) && <span className="block text-xs text-muted-foreground">{[user.role, user.dept].filter(Boolean).map((x, i) => <React.Fragment key={i}>{i > 0 && " · "}{x}</React.Fragment>)}</span>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={user.onLogout}><LogOutIcon />로그아웃</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

function ShellInset({ className, ...props }: React.ComponentProps<typeof SidebarInset>) {
  return <SidebarInset data-slot="shell-inset" className={cn("min-w-0 bg-background", className)} {...props} />
}

/* 헤더 64 — 토글 · 브레드크럼(@ggc/breadcrumb 조립을 받는다) · 검색(@ggc/ggc-search) · 알림 · 슬롯.
 * 제목은 여기 없다(ADR 0010). ≤900 에서 브레드크럼은 숨긴다 — 경로는 사이드바 drawer 의 현재 항목이 준다. */
function ShellHeader({
  className,
  breadcrumb,
  search,
  notifications,
  onNotificationsClick,
  children,
  ...props
}: React.ComponentProps<"header"> & {
  breadcrumb?: React.ReactNode
  search?: React.ReactNode
  notifications?: number
  onNotificationsClick?: () => void
}) {
  return (
    <header
      data-slot="shell-header"
      className={cn(
        "sticky top-0 z-40 flex h-(--ggc-gnb-h) shrink-0 items-center gap-3 border-b border-(--ggc-shell-border) bg-card px-4",
        "[&_[data-slot=breadcrumb]]:max-[900px]:hidden",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1" aria-label="메뉴 열기/닫기" />
      <div className="min-w-0 flex-1">{breadcrumb}</div>
      {search ?? null}
      {notifications != null && (
        <Button variant="outline" size="icon" className="relative" aria-label={`알림 ${notifications}건`} onClick={onNotificationsClick}>
          <BellIcon />
          {notifications > 0 && <span aria-hidden="true" className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />}
        </Button>
      )}
      {children}
    </header>
  )
}

/* 본문 — 계약 §2: Monitor 1320 · 그 외 --wide 1360 · ≥1680 확폭(§2-1)은 소비자가 className 으로 켠다.
 * titleId 는 @ggc/ggc-page-head 의 h1 id 와 같아야 한다(기본 page-title). */
function ShellMain({
  className,
  wide = false,
  titleId = "page-title",
  ...props
}: React.ComponentProps<"main"> & { wide?: boolean; titleId?: string }) {
  return (
    <main
      id="main"
      data-slot="shell-main"
      aria-labelledby={titleId}
      className={cn(
        "w-full min-w-0 flex-1 px-8 pt-6 pb-12 max-[900px]:px-4 max-[900px]:pt-4 max-[900px]:pb-10",
        wide ? "max-w-(--ggc-main-max-wide)" : "max-w-(--ggc-main-max)",
        className
      )}
      {...props}
    />
  )
}

/* 스킵 링크 — 계약 §3 · KRDS skip_link. 첫 자식으로 둔다 */
function SkipLink({ className, href = "#main", children = "본문 바로가기", ...props }: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      className={cn("sr-only z-50 rounded-br-sm bg-(--ggc-primary-deep) px-4 py-2 text-sm font-bold text-primary-foreground focus:not-sr-only focus:absolute focus:top-0 focus:left-0", className)}
      {...props}
    >
      {children}
    </a>
  )
}

export { Shell, ShellFrame, AppSidebar, ShellInset, ShellHeader, ShellMain, SkipLink, SearchIcon as ShellSearchIcon }
export type { NavItem, NavGroup, SystemLink }
