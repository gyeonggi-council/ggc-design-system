/* 배지 — shadcn 변형 + 이 저장소의 상태 7종(회기·결재)과 역할 4종. 색 단독 금지 — 텍스트와 lucide 아이콘을 함께. Tag 는 분류·출처용 사각 태그. (shadcn 공식 소스 + 토큰 · ADR 0011) */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /* 상태(회기 · 결재) — ggc-tokens.css .ggc-badge 와 같은 7종. 배경 틴트 + 같은 계열 글자, 전부 AA */
        session: "bg-(--ggc-info-tint) text-(--ggc-info) forced-colors:border-current",
        meeting: "bg-(--ggc-success-tint) text-(--ggc-success) forced-colors:border-current",
        recess: "bg-(--ggc-hairline) text-(--ggc-text-subtle) forced-colors:border-current",
        approved: "bg-(--ggc-success-tint) text-(--ggc-success) forced-colors:border-current",
        pending: "bg-(--ggc-warning-tint) text-(--ggc-warning) forced-colors:border-current",
        rejected: "bg-(--ggc-danger-tint) text-(--ggc-danger) forced-colors:border-current",
        paid: "bg-(--ggc-primary-light-strong) text-primary forced-colors:border-current",
        /* 역할(신원) — 상태와 다른 축. 배지에서만 */
        "role-member": "bg-(--ggc-role-member-tint) text-(--ggc-role-member) forced-colors:border-current",
        "role-staff": "bg-(--ggc-role-staff-tint) text-(--ggc-role-staff) forced-colors:border-current",
        "role-policy": "bg-(--ggc-role-policy-tint) text-(--ggc-role-policy) forced-colors:border-current",
        "role-other": "bg-(--ggc-role-other-tint) text-(--ggc-role-other) forced-colors:border-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}


/* 태그(사각) — 분류·출처(본회의 · 상임위 · 시급). 상태 배지(알약)와 모양을 다르게 두어 한 화면에서 두 뜻이 섞이지 않게 한다. */
const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-bold leading-[1.4] whitespace-nowrap forced-colors:border forced-colors:border-current [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-(--ggc-control-bg) text-muted-foreground",
        primary: "bg-(--ggc-primary-light) text-(--ggc-primary-deep)",
        info: "bg-(--ggc-info-tint) text-(--ggc-info)",
        success: "bg-(--ggc-success-tint) text-(--ggc-success)",
        warning: "bg-(--ggc-warning-tint) text-(--ggc-warning)",
        danger: "bg-(--ggc-danger-tint) text-(--ggc-danger)",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Tag({ className, variant = "default", ...props }: React.ComponentProps<"span"> & VariantProps<typeof tagVariants>) {
  return <span data-slot="tag" data-variant={variant} className={cn(tagVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants, Tag, tagVariants }
