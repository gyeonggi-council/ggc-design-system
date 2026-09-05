# 필터 스트립 — `@ggc/ggc-filter-bar` (Tier 2, v3.0)

Explore 슬롯 2(`archetypes.md`). 흰 카드 한 줄에 검색 · 셀렉트 · 칩을 늘어놓고 오른쪽에 적용/초기화.
Tier 1 실물은 `design/examples/explore.html` 의 `<form class="ggc-card ggc-card--pad" role="search">`.

## 쓰기

```tsx
import { FilterBar, FilterField, ResultSummary } from "@/components/ggc-filter-bar"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<FilterBar onApply={apply} onReset={reset}>
  <FilterField label="의안명 · 의안번호" htmlFor="q" className="min-w-64 flex-1"><Input id="q" type="search" placeholder="예: 청년 기본 조례" /></FilterField>
  <FilterField label="소관위원회" htmlFor="c"><NativeSelect id="c"><NativeSelectOption>내 소관</NativeSelectOption><NativeSelectOption>전체</NativeSelectOption></NativeSelect></FilterField>
  <FilterField label="의안 종류">
    <ToggleGroup type="multiple" defaultValue={["조례안", "동의안"]} variant="outline" size="sm">
      <ToggleGroupItem value="조례안">조례안</ToggleGroupItem><ToggleGroupItem value="동의안">동의안</ToggleGroupItem><ToggleGroupItem value="청원">청원</ToggleGroupItem>
    </ToggleGroup>
  </FilterField>
</FilterBar>
<ResultSummary>총 <b>21건</b> · 내 소관 · 처리 대기 · 정렬 최근 접수순</ResultSummary>
```

## 규칙

- `<form role="search">` — Enter 로 적용된다. `onApply` 가 없으면 적용 버튼이 없다(즉시 필터형).
- **초기화는 기본 필터로 돌아간다**("내 소관 · 처리 대기"), 전부 해제가 아니다 — `domain-language.md`.
- 컨트롤은 `@ggc/input` `select` `native-select` `toggle-group` `badge` 를 자식으로 조립한다. 이 블록은 배치와 라벨만 갖는다.
- 필터가 6개를 넘으면 `@ggc/collapsible` 로 "상세 조건" 을 접는다. 스트립이 두 줄을 넘지 않게.
- 결과 요약은 표 바로 위 한 줄 — 건수는 `tabular-nums`.

## 근거

`skills/ggc-design/references/archetypes.md` Explore 슬롯 2·3 · `domain-language.md` §2 · [ADR 0011](../decisions/0011-tier2-primary-for-react.md).
