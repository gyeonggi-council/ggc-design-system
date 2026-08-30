# 통계 타일 — `.ggc-stat-grid` · `.ggc-stat`

Monitor 화면의 첫 행. **정확히 4개** — 격자가 `repeat(4,1fr)` 고정이라 5개를 넣으면 깨진다. ≤1024 2열, ≤560 1열. 셋이면 `--3`.

## 마크업

```html
<div class="ggc-stat-grid">
  <div class="ggc-stat">
    <div class="label-row"><span class="label">접수 의안</span><span class="icon icon--info" aria-hidden="true">📋</span></div>
    <div class="value">147<span class="unit">건</span></div>
    <div class="trend trend--up">▲ 전 회기 대비 12건</div>
  </div>
  …3개 더
</div>
```

## 부분

| 클래스 | 무엇 |
|---|---|
| `.label` | 13px/600 muted — 명사구 |
| `.icon` (`--info` `--success` `--warning` `--danger`) | 34px 틴트 박스. 갤러리의 이모지는 자리 표시 — 실제는 인라인 SVG(`aria-hidden`) |
| `.value` + `.unit` | 30px/800 `tabular-nums` + 단위. **숫자는 항상 단위와 함께** |
| `.trend` (`--up` `--down` `--warn`) | 추이 한 줄. ▲▼ 기호 + 문구 |

## 규칙

- 대시보드에 표를 넣지 않는다 — 그건 Explore 다. KPI 는 "처리할 건수" 를 말한다.
- 빈 상태: 0 으로 렌더한다(타일을 숨기지 않는다). 오류: 카드 단위 격리. 로딩: 타일 자리 유지.
- 값이 숫자가 아니면(예: "회기 중") 배지를 `.value` 자리에 두지 말고 상태 카드로 따로 만든다.

## Tier 2

`ggc-stat` — `<StatGrid><Stat label value unit icon tone trend trendTone /></StatGrid>`.

## 근거

ggc-components.css §3 · archetypes Monitor 슬롯 3 · 대시보드.dc.html KPI row 실측.
