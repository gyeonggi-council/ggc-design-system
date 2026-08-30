import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/* 경기도의회 버튼 — ggc-components.css §6 과 같은 모습.
 * 높이·글자는 --ggc-control-h* / --ggc-control-font* 토큰이라 대민 프로필에서 자동으로 커진다.
 * primary 만 그림자(--ggc-shadow-primary). 색은 전부 토큰 — hex 없음. */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-(--ggc-radius) border border-transparent font-bold whitespace-nowrap transition-[background-color,border-color,color] outline-none focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring) disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-(--ggc-shadow-primary) hover:bg-(--ggc-primary-dark) active:bg-(--ggc-primary-deep)",
        secondary: "border-(--ggc-border-strong) bg-card text-(--ggc-primary-deep) hover:bg-(--ggc-surface-inset)",
        ghost: "bg-transparent text-(--ggc-primary-deep) hover:bg-(--ggc-primary-light)",
        dashed: "w-full border-[1.5px] border-dashed border-(--ggc-border-strong) bg-(--ggc-row-hover) font-semibold text-(--ggc-text-muted) hover:border-primary hover:text-(--ggc-primary-deep)",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline underline-offset-2 hover:text-(--ggc-primary-dark)",
      },
      size: {
        default: "h-(--ggc-control-h) px-[18px] text-(length:--ggc-control-font)",
        sm: "h-(--ggc-control-h-sm) rounded-[8px] px-[14px] text-(length:--ggc-control-font-sm)",
        lg: "h-(--ggc-control-h-lg) rounded-[11px] px-5 text-(length:--ggc-control-font-lg)",
        icon: "size-(--ggc-control-h) rounded-(--ggc-radius)",
        "icon-sm": "size-(--ggc-control-h-sm) rounded-[8px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
