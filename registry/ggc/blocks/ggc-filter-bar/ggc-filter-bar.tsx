import * as React from "react"
import { RotateCcwIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* 필터 스트립 — Explore 슬롯 2(archetypes.md). 흰 카드 한 줄에 검색 · 셀렉트 · 칩을 늘어놓고 오른쪽에 적용/초기화.
 * 기본 필터는 "내 소관 · 처리 대기" 다(domain-language.md) — 초기화는 그 기본으로 돌아간다(전부 해제가 아니다).
 * 컨트롤은 @ggc/input · select · native-select · toggle-group · badge 를 자식으로 조립한다 — 이 블록은 배치와 라벨만 갖는다.
 *
 *   <FilterBar onReset={…} onApply={…}>
 *     <FilterField label="위원회"><NativeSelect …/></FilterField>
 *     <FilterField label="상태"><ToggleGroup …/></FilterField>
 *   </FilterBar> */
function FilterBar({
  className,
  children,
  onApply,
  onReset,
  applyLabel = "적용",
  resetLabel = "초기화",
  end,
  ...props
}: React.ComponentProps<"form"> & { onApply?: () => void; onReset?: () => void; applyLabel?: React.ReactNode; resetLabel?: React.ReactNode; end?: React.ReactNode }) {
  return (
    <form
      role="search"
      data-slot="filter-bar"
      onSubmit={(e) => { e.preventDefault(); onApply?.() }}
      className={cn("flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card px-4 py-3", className)}
      {...props}
    >
      {children}
      <div className="ml-auto flex items-center gap-2 self-end">
        {end}
        {onReset && (
          <Button type="button" variant="ghost" size="sm" onClick={onReset}><RotateCcwIcon />{resetLabel}</Button>
        )}
        {onApply && <Button type="submit" size="sm">{applyLabel}</Button>}
      </div>
    </form>
  )
}

function FilterField({ className, label, htmlFor, children, ...props }: React.ComponentProps<"div"> & { label: React.ReactNode; htmlFor?: string }) {
  return (
    <div data-slot="filter-field" className={cn("flex min-w-0 flex-col gap-1", className)} {...props}>
      <label htmlFor={htmlFor} className="text-(length:--ggc-text-xs) font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

/* 결과 요약 — Explore 슬롯 3. "총 147건 · 처리 대기 21건". 숫자는 tabular-nums */
function ResultSummary({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="result-summary" className={cn("m-0 text-(length:--ggc-text-sm) text-muted-foreground tabular-nums [&_b]:font-semibold [&_b]:text-foreground", className)} {...props} />
}

export { FilterBar, FilterField, ResultSummary }
