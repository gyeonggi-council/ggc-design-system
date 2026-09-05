# 상세 배치 — `@ggc/ggc-detail-layout` (Tier 2, v3.0)

Learn/Decide 격자(`archetypes.md`): 본문 1fr + 우측 레일 320(결재선 · 감사 이력). 레일은 sticky, ≤1024 에서 본문 아래로.

## 쓰기

```tsx
import { DetailLayout, MetaList, MetaItem } from "@/components/ggc-detail-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHead } from "@/components/ggc-page-head"

<PageHead title="경기도 청년 기본조례 일부개정조례안" desc="2026-0147 · 기획재정위원회 · 김○○ 의원 외 12인" actions={<Button>상신</Button>} />
<DetailLayout rail={<Card><CardHeader><CardTitle>결재선</CardTitle></CardHeader><CardContent>…</CardContent></Card>}>
  <Card><CardContent>
    <MetaList>
      <MetaItem label="의안번호"><code className="font-mono">2026-0147</code></MetaItem>
      <MetaItem label="소관">기획재정위원회</MetaItem>
      <MetaItem label="접수일">2026-09-04</MetaItem>
    </MetaList>
  </CardContent></Card>
  <Card><CardContent><Prose>…조문…</Prose></CardContent></Card>
</DetailLayout>
```

## 규칙

- h1 은 **레코드명**(의안명) — `PageHead` 가 그린다. 두 줄까지 허용.
- 메타는 `<dl>`(`MetaList`) — 스크린리더가 이름·값을 짝으로 읽는다. 작성자는 실명 · 역할 · 부서, UUID 금지(계약 §2).
- 레일에는 **주 액션 하나**(상신 · 승인). 본문에 primary 를 또 두지 않는다.
- AI 산출(검토보고서 요약)에는 출처를 병기한다 — `domain-language.md`.
- 문서형(`--doc`)은 `@ggc/ggc-prose`, 수치형(`--figure`)은 `@ggc/table` + 막대(`@ggc/chart`).

## 근거

`skills/ggc-design/references/archetypes.md` Learn/Decide · 계약 §2 · [ADR 0011](../decisions/0011-tier2-primary-for-react.md).
