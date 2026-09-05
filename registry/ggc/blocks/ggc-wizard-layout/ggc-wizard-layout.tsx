import * as React from "react"

import { cn } from "@/lib/utils"

/* 위저드 배치 — Configure 슬롯(archetypes.md): 스텝퍼(카드) → 단계 본문 + 보조 패널 → 하단 스티키 액션바.
 * 스텝퍼는 @ggc/ggc-stepper, 액션바는 @ggc/ggc-actionbar 를 슬롯으로 받는다 — 배치만 갖는다.
 * 본문 하단 패딩을 크게 둔다(액션바가 가린다). 보조 패널(aside)은 ≤1024 에서 본문 아래로.
 *
 *   <WizardLayout steps={<Stepper>…</Stepper>} aside={<Card>진행 상황</Card>} actions={<ActionBar>…</ActionBar>}>
 *     <Card>3단계 · 조문 작성 …</Card>
 *   </WizardLayout> */
function WizardLayout({ className, steps, aside, actions, children, ...props }: React.ComponentProps<"div"> & { steps?: React.ReactNode; aside?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div data-slot="wizard-layout" className={cn("flex flex-col gap-5 pb-24", className)} {...props}>
      {steps && <div data-slot="wizard-steps" className="rounded-xl border border-border bg-card px-6 py-5">{steps}</div>}
      <div className={cn("grid items-start gap-5", aside ? "grid-cols-[minmax(0,1fr)_320px] max-[1024px]:grid-cols-1" : "grid-cols-1")}>
        <div data-slot="wizard-body" className="flex min-w-0 flex-col gap-5">{children}</div>
        {aside && <aside data-slot="wizard-aside" className="flex flex-col gap-5">{aside}</aside>}
      </div>
      {actions}
    </div>
  )
}

export { WizardLayout }
