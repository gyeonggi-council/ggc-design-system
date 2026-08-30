import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/* 상태 배지(알약) — ggc-tokens.css 의 .ggc-badge 와 같은 7 상태 + 역할 4종.
 * ⚠ 색 단독 금지 — 항상 텍스트·기호(✓ ◷ ✕ ● ◆ ○)를 함께 넣는다. 고대비에서 테두리가 붙는다. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-semibold leading-none whitespace-nowrap forced-colors:border forced-colors:border-current [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-(--ggc-primary-light-strong) text-primary",
        session: "bg-(--ggc-info-tint) text-(--ggc-info)",
        meeting: "bg-(--ggc-success-tint) text-(--ggc-success)",
        recess: "bg-(--ggc-hairline) text-(--ggc-text-subtle)",
        approved: "bg-(--ggc-success-tint) text-(--ggc-success)",
        pending: "bg-(--ggc-warning-tint) text-(--ggc-warning)",
        rejected: "bg-(--ggc-danger-tint) text-(--ggc-danger)",
        paid: "bg-(--ggc-primary-light-strong) text-primary",
        "role-member": "bg-(--ggc-role-member-tint) text-(--ggc-role-member)",
        "role-staff": "bg-(--ggc-role-staff-tint) text-(--ggc-role-staff)",
        "role-policy": "bg-(--ggc-role-policy-tint) text-(--ggc-role-policy)",
        "role-other": "bg-(--ggc-role-other-tint) text-(--ggc-role-other)",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />
}

/* 태그(사각) — 분류·출처. 상태 배지와 모양을 다르게 두어 한 화면에서 두 뜻이 섞이지 않게 한다. */
const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-(--ggc-radius-sm) px-2 py-0.5 text-[10.5px] font-bold leading-[1.4] whitespace-nowrap forced-colors:border forced-colors:border-current",
  {
    variants: {
      variant: {
        default: "bg-(--ggc-control-bg) text-(--ggc-text-muted)",
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
