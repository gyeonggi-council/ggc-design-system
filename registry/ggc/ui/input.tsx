import * as React from "react"

import { cn } from "@/lib/utils"

/* 입력 — ggc-components.css §7. 높이 --ggc-input-h(업무 44 / 대민 48) · 1px border-strong · radius 10.
 * placeholder 를 유일한 라벨로 쓰지 않는다. 오류는 aria-invalid + 문구. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-(--ggc-input-h) w-full min-w-0 rounded-(--ggc-radius) border border-input bg-card px-[14px] text-(length:--ggc-control-font) text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-(--ggc-text-subtle) file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-default disabled:bg-(--ggc-control-bg) disabled:text-(--ggc-text-subtle)",
        "focus-visible:border-primary focus-visible:shadow-(--ggc-focus-ring)",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

/* 폼 필드 묶음 — 라벨 · 컨트롤 · 힌트 · 오류. .ggc-field 와 같은 간격. */
function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function FieldHint({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-hint" className={cn("m-0 text-[11.5px] text-(--ggc-text-subtle)", className)} {...props} />
}

function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-error" role="alert" className={cn("m-0 text-[11.5px] font-semibold text-destructive", className)} {...props} />
}

export { Input, Field, FieldHint, FieldError }
