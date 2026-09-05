import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* 스텝퍼 — ggc-components.css §4 (가로형, v3.0). 완료 = success + 체크(lucide) · 현재 = primary + 링 · 대기 = 중립.
 * 현재 단계는 색과 형태(링·굵기) 둘 다로 표시한다 — 색 단독 금지. 원 32(shadcn 밀도) · 라벨 --ggc-text-sm. */
type StepState = "done" | "current" | "todo"

function Stepper({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="stepper" className={cn("m-0 flex list-none p-0", className)} {...props} />
}

function Step({
  className,
  state = "todo",
  index,
  label,
  sub,
  ...props
}: React.ComponentProps<"li"> & { state?: StepState; index: number; label: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <li data-slot="step" data-state={state} aria-current={state === "current" ? "step" : undefined} className={cn("flex flex-1 flex-col items-center text-center", className)} {...props}>
      <div className="flex w-full items-center">
        <span className={cn("h-0.5 flex-1", state === "todo" ? "bg-border" : "bg-(--ggc-success)")} />
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-(length:--ggc-text-sm) font-bold [&>svg]:size-4",
            state === "done" && "border-(--ggc-success) bg-(--ggc-success) text-white",
            state === "current" && "border-primary bg-primary text-white shadow-(--ggc-focus-ring) forced-colors:outline forced-colors:outline-2 forced-colors:outline-[Highlight]",
            state === "todo" && "border-input bg-card text-(--ggc-text-subtle)"
          )}
        >
          {state === "done" ? <CheckIcon aria-hidden="true" strokeWidth={3} /> : index}
          {state === "done" && <span className="sr-only">완료</span>}
        </span>
        <span className={cn("h-0.5 flex-1", state === "done" ? "bg-(--ggc-success)" : "bg-border")} />
      </div>
      <div className="mt-2 px-1">
        <div className={cn("text-(length:--ggc-text-sm) font-bold", state === "current" ? "text-(--ggc-primary-deep)" : state === "done" ? "text-foreground" : "text-(--ggc-text-subtle)")}>{label}</div>
        {sub && <div className="mt-0.5 text-(length:--ggc-text-xs) text-(--ggc-text-subtle)">{sub}</div>}
      </div>
    </li>
  )
}

export { Stepper, Step }
export type { StepState }
