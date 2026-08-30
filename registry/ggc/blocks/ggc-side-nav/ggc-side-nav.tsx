import * as React from "react"

import { cn } from "@/lib/utils"

/* 사이드 내비 — ggc-public.css §5. .ggc-public-main--side 첫 컬럼(240px). 2단은 정본대로 <details> — JS 0.
 * 현재 항목이 든 그룹은 처음부터 열어 둔다(open 을 주지 않아도 current 로 판단). */

type SideNavLink = { label: React.ReactNode; href: string; current?: boolean }
type SideNavGroup = SideNavLink | { label: React.ReactNode; open?: boolean; items: SideNavLink[] }

const ROW = "flex cursor-pointer items-center justify-between px-5 py-3.5 text-[15px] font-semibold text-foreground no-underline hover:bg-(--ggc-surface-inset)"

function SideNavItem({ link, sub }: { link: SideNavLink; sub?: boolean }) {
  return (
    <a
      href={link.href}
      aria-current={link.current ? "page" : undefined}
      className={cn(
        ROW,
        sub && "py-[9px] pr-5 pl-8 text-sm font-medium",
        "aria-[current=page]:bg-(--ggc-primary-light) aria-[current=page]:font-bold aria-[current=page]:text-(--ggc-primary-deep) aria-[current=page]:shadow-[inset_3px_0_0_var(--ggc-primary)]",
        "forced-colors:aria-[current=page]:outline-2 forced-colors:aria-[current=page]:outline-[Highlight] forced-colors:aria-[current=page]:-outline-offset-2"
      )}
    >
      {link.label}
    </a>
  )
}

function SideNav({ className, label, groups, ...props }: React.ComponentProps<"nav"> & { label: React.ReactNode; groups: SideNavGroup[] }) {
  return (
    <nav
      data-slot="side-nav"
      aria-label={typeof label === "string" ? `${label} 메뉴` : undefined}
      className={cn("sticky top-(--ggc-space-5) overflow-hidden rounded-(--ggc-radius-lg) border border-border bg-card max-[900px]:static print:hidden forced-colors:border", className)}
      {...props}
    >
      <h2 className="m-0 bg-primary p-5 text-[19px] font-extrabold tracking-[-0.02em] text-primary-foreground forced-colors:border-b">{label}</h2>
      <ul className="m-0 list-none p-0">
        {groups.map((group, i) => (
          <li key={i} className="border-t border-(--ggc-hairline)">
            {"items" in group ? (
              <details className="group/snav" open={(group.open ?? group.items.some((item) => item.current)) || undefined}>
                <summary className={cn(ROW, "list-none [&::-webkit-details-marker]:hidden")}>
                  {group.label}
                  <span aria-hidden="true" className="-mt-[3px] size-[7px] rotate-45 border-r-2 border-b-2 border-(--ggc-text-faint) group-open/snav:mt-[3px] group-open/snav:rotate-[-135deg]" />
                </summary>
                <ul className="m-0 list-none border-t border-(--ggc-hairline) bg-(--ggc-surface-inset) py-1.5">
                  {group.items.map((item, j) => (
                    <li key={j}>
                      <SideNavItem link={item} sub />
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <SideNavItem link={group} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { SideNav, type SideNavGroup, type SideNavLink }
