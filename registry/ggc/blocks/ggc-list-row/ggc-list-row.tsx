import * as React from "react"

import { cn } from "@/lib/utils"

/* 행 리스트 — ggc-components.css §5 .ggc-list-row (카드 안 큐·최근 항목·결재 흐름).
 * 열이 셋을 넘으면 표다. 상태는 end 슬롯 배지로, 심각도는 severity 좌측 바로 — 한 행에 둘을 동시에 쓰지 않는다. */
const SEV = {
  danger: "bg-(--ggc-danger)",
  warning: "bg-(--ggc-warning)",
  info: "bg-(--ggc-info)",
} as const

function ListRowGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="list-row-group" className={className} {...props} />
}

function ListRow({
  className,
  icon,
  title,
  meta,
  end,
  severity,
  href,
  onClick,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "title" | "onClick"> & {   /* ref 없는 공통 속성 — a/button/div 어느 태그로 렌더해도 맞는다 */
  icon?: React.ReactNode
  title: React.ReactNode
  meta?: React.ReactNode
  end?: React.ReactNode
  severity?: keyof typeof SEV
  href?: string
  onClick?: React.MouseEventHandler<HTMLElement>
}) {
  const Comp: React.ElementType = href ? "a" : onClick ? "button" : "div"
  return (
    <Comp
      data-slot="list-row"
      href={href}
      type={Comp === "button" ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-t border-(--ggc-hairline) p-(--ggc-row-pad) text-left font-sans hover:bg-(--ggc-row-hover)",
        (href || onClick) && "cursor-pointer text-inherit no-underline",
        className
      )}
      {...props}
    >
      {severity && <span aria-hidden="true" className={cn("w-[5px] shrink-0 self-stretch rounded-[3px]", SEV[severity])} />}
      {icon && <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-(--ggc-radius) bg-(--ggc-control-bg) text-(--ggc-text-muted) [&>svg]:size-(--ggc-icon-lg)">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 truncate text-(length:--ggc-text-base) font-semibold text-foreground">{title}</div>
        {meta && <div className="text-(length:--ggc-text-xs) text-(--ggc-text-subtle)">{meta}</div>}
      </div>
      {end && <div className="flex shrink-0 items-center gap-2.5 text-right text-(length:--ggc-text-xs) text-(--ggc-text-subtle)">{end}</div>}
    </Comp>
  )
}

export { ListRowGroup, ListRow }
