import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* 알림 · 콜아웃 — ggc-components.css §18. 기호 + 제목 + 문구, 색 단독 금지.
 * role 은 정보·상태면 status, 즉시 알려야 하는 오류면 alert (danger 기본값). */
const alertVariants = cva(
  "flex items-start gap-3 rounded-(--ggc-radius) border border-l-4 px-4 py-3 text-[13px] leading-[1.6] break-keep [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-(--ggc-surface-inset) text-(--ggc-text-muted) [&_[data-slot=alert-title]]:text-(--ggc-text-strong)",
        info: "border-(--ggc-info) bg-(--ggc-info-tint) text-(--ggc-info)",
        success: "border-(--ggc-success) bg-(--ggc-success-tint) text-(--ggc-success)",
        warning: "border-(--ggc-warning) bg-(--ggc-warning-tint) text-(--ggc-warning)",
        danger: "border-(--ggc-danger) bg-(--ggc-danger-tint) text-(--ggc-danger)",
      },
      banner: { true: "rounded-none border-t-0 border-l px-5 py-2.5", false: "" },
    },
    defaultVariants: { variant: "default", banner: false },
  }
)

const ICON: Record<string, string> = { default: "§", info: "ⓘ", success: "✓", warning: "⚠", danger: "✕" }

function Alert({
  className,
  variant = "default",
  banner = false,
  icon,
  role,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & { icon?: React.ReactNode }) {
  const v = variant ?? "default"
  return (
    <div
      data-slot="alert"
      data-variant={v}
      role={role ?? (v === "danger" ? "alert" : "status")}
      className={cn(alertVariants({ variant, banner }), className)}
      {...props}
    >
      <span aria-hidden="true" className="shrink-0 text-[15px] leading-[1.3]">{icon ?? ICON[v]}</span>
      <div data-slot="alert-body" className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"strong">) {
  return <strong data-slot="alert-title" className={cn("mb-0.5 block font-bold", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("[&_p]:m-0 [&_p+p]:mt-1", className)} {...props} />
}

function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-actions" className={cn("mt-2 flex items-center gap-2", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertActions, alertVariants }
