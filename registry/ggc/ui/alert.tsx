/* 알림·콜아웃 — 공식 default/destructive + 이 저장소의 info/success/warning/danger(틴트 + 좌측 4px 띠). 아이콘은 lucide. (shadcn 공식 소스 + 토큰 · ADR 0011) */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
        /* 이 저장소의 콜아웃 4종 — 틴트 배경 + 좌측 4px 띠(ggc-components.css §18). 아이콘은 lucide 를 자식으로 */
        info: "border-l-4 border-(--ggc-info-tint) border-l-(--ggc-info) bg-(--ggc-info-tint) text-foreground *:data-[slot=alert-title]:text-(--ggc-info) *:[svg]:text-(--ggc-info)",
        success: "border-l-4 border-(--ggc-success-tint) border-l-(--ggc-success) bg-(--ggc-success-tint) text-foreground *:data-[slot=alert-title]:text-(--ggc-success) *:[svg]:text-(--ggc-success)",
        warning: "border-l-4 border-(--ggc-warning-tint) border-l-(--ggc-warning) bg-(--ggc-warning-tint) text-foreground *:data-[slot=alert-title]:text-(--ggc-warning) *:[svg]:text-(--ggc-warning)",
        danger: "border-l-4 border-(--ggc-danger-tint) border-l-(--ggc-danger) bg-(--ggc-danger-tint) text-foreground *:data-[slot=alert-title]:text-(--ggc-danger) *:[svg]:text-(--ggc-danger)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
