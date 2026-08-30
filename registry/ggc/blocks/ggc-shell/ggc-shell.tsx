"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* 업무 셸 — ggc-components.css §9 + 토큰 파일의 .ggc-utility-bar/.ggc-footer 를 React 로.
 * 계약 §2: GNB 64 · LNB 256 · 본문 1320(대시보드)/1360(--wide). ≤900 에서 LNB 는 drawer.
 * 대민 화면에는 쓰지 않는다(계약 §9). */
function Shell({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="shell" className={cn("flex min-h-screen flex-col bg-background font-sans text-foreground antialiased", className)} {...props} />
}

function UtilityBar({ className, brand, children, ...props }: React.ComponentProps<"div"> & { brand: React.ReactNode }) {
  return (
    <div data-slot="utility-bar" className={cn("bg-(--ggc-primary-deep) text-[13px] leading-none text-[#c9d6ea]", className)} {...props}>
      <div className="mx-auto flex max-w-(--ggc-container-max) items-center justify-between gap-3 px-4 py-2">
        <span className="font-bold text-white">{brand}</span>
        <nav className="flex flex-wrap items-center gap-1">{children}</nav>
      </div>
    </div>
  )
}

function UtilityLink({ className, active, ...props }: React.ComponentProps<"a"> & { active?: boolean }) {
  return <a data-slot="utility-link" className={cn("rounded-(--ggc-radius-sm) px-2 py-[3px] no-underline transition-colors", active ? "bg-primary font-semibold text-white" : "text-[#c9d6ea] hover:bg-white/10 hover:text-white", className)} {...props} />
}

function Gnb({ className, ...props }: React.ComponentProps<"header">) {
  return <header data-slot="gnb" className={cn("sticky top-0 z-50 flex h-(--ggc-gnb-h) shrink-0 items-center gap-5 border-b border-(--ggc-shell-border) bg-card pr-6 max-[900px]:gap-3 max-[900px]:pr-4", className)} {...props} />
}

function GnbBrand({ className, mark, org, service, ...props }: React.ComponentProps<"a"> & { mark: React.ReactNode; org: React.ReactNode; service?: React.ReactNode }) {
  return (
    <a data-slot="gnb-brand" className={cn("flex h-full w-(--ggc-lnb-w) shrink-0 items-center gap-[11px] border-r border-(--ggc-shell-border) px-[18px] text-inherit no-underline max-[900px]:w-auto max-[900px]:border-r-0 max-[900px]:px-3", className)} {...props}>
      <span className="size-10 shrink-0 [&>img]:size-10 [&>img]:object-contain">{mark}</span>
      <span className="flex flex-col leading-tight whitespace-nowrap">
        <span className="text-[15px] font-bold tracking-[-0.02em] text-foreground">{org}</span>
        {service && <span className="text-[13px] font-semibold tracking-[-0.01em] text-primary max-[900px]:hidden">{service}</span>}
      </span>
    </a>
  )
}

function ShellBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="shell-body" className={cn("flex flex-1 items-stretch", className)} {...props} />
}

function Lnb({ className, open = false, ...props }: React.ComponentProps<"nav"> & { open?: boolean }) {
  return (
    <nav
      data-slot="lnb"
      data-open={open || undefined}
      className={cn(
        "sticky top-(--ggc-gnb-h) h-[calc(100vh-var(--ggc-gnb-h))] w-(--ggc-lnb-w) shrink-0 overflow-y-auto border-r border-(--ggc-shell-border) bg-card px-[14px] py-5",
        "max-[900px]:fixed max-[900px]:left-0 max-[900px]:z-40 max-[900px]:-translate-x-full max-[900px]:shadow-[0_8px_24px_rgba(20,30,50,0.12)] max-[900px]:transition-transform max-[900px]:data-[open]:translate-x-0",
        className
      )}
      {...props}
    />
  )
}

function LnbGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="lnb-group" className={cn("px-2 pb-3 text-[11px] font-bold tracking-[0.06em] text-(--ggc-text-subtle)", className)} {...props} />
}

function LnbItem({ className, active, ...props }: React.ComponentProps<"a"> & { active?: boolean }) {
  return (
    <a
      data-slot="lnb-item"
      aria-current={active ? "page" : undefined}
      className={cn("mb-[3px] flex w-full items-center gap-[11px] rounded-(--ggc-radius) px-3 py-2.5 text-[13.5px] font-semibold no-underline transition-colors", active ? "bg-(--ggc-primary-light) font-bold text-(--ggc-primary-deep) forced-colors:border" : "text-(--ggc-text-muted) hover:bg-(--ggc-control-bg)", className)}
      {...props}
    />
  )
}

function ShellMain({ className, wide = false, ...props }: React.ComponentProps<"main"> & { wide?: boolean }) {
  return <main data-slot="shell-main" className={cn("min-w-0 flex-1 px-8 pt-[26px] pb-12 max-[900px]:px-4 max-[900px]:pt-[18px] max-[900px]:pb-10", wide ? "max-w-(--ggc-main-max-wide)" : "max-w-(--ggc-main-max)", className)} {...props} />
}

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer data-slot="footer" className={cn("border-t border-border bg-background text-xs text-(--ggc-text-muted)", className)}>
      <div className="mx-auto max-w-(--ggc-container-max) p-4" {...props} />
    </footer>
  )
}

export { Shell, UtilityBar, UtilityLink, Gnb, GnbBrand, ShellBody, Lnb, LnbGroup, LnbItem, ShellMain, Footer }
