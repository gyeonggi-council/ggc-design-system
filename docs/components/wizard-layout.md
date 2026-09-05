# 위저드 배치 — `@ggc/ggc-wizard-layout` (Tier 2, v3.0)

Configure 슬롯(`archetypes.md`): 스텝퍼 카드 → 단계 본문 + 보조 패널 → 하단 스티키 액션바. Tier 1 실물은 `design/examples/wizard.html`.

## 쓰기

```tsx
import { WizardLayout } from "@/components/ggc-wizard-layout"
import { Stepper, Step } from "@/components/ggc-stepper"
import { ActionBar } from "@/components/ggc-actionbar"

<PageHead title="조례 초안 작성" desc={<>경기도 청년 기본조례 일부개정조례안 · <code className="font-mono">DRAFT-2026-0088</code></>} />
<WizardLayout
  steps={<Stepper><Step index={1} state="done" label="개요 설정" /><Step index={2} state="done" label="유사 조례 검토" /><Step index={3} state="current" label="조문 작성" sub="본칙 8조" /><Step index={4} label="검토 · 제출" /></Stepper>}
  aside={<Card>…진행 상황…</Card>}
  actions={<ActionBar status="08-22 14:07 자동저장됨"><Button variant="outline">임시저장</Button><Button>다음</Button></ActionBar>}
>
  <Card>…3단계 폼(@ggc/field + react-hook-form)…</Card>
</WizardLayout>
```

## 규칙

- **액션바가 없으면 Configure 가 아니다.** 순서는 임시저장(outline) → 상신/다음(primary) 고정.
- 검증 실패는 **첫 실패 필드로 포커스**를 옮기고 `FieldError` 문구로 — 색 단독 금지.
- 스텝퍼의 현재 단계는 색 + 링(형태) 둘 다. 완료는 체크 아이콘.
- 본문 하단 패딩(`pb-24`)은 액션바가 가리는 만큼이다 — 마지막 필드가 가려지지 않게.
- 5단계를 넘으면 단계를 합친다. 단계 이름은 업무 어휘(개요 · 검토 · 조문 · 제출).

## 근거

`skills/ggc-design/references/archetypes.md` Configure · [ADR 0011](../decisions/0011-tier2-primary-for-react.md).
