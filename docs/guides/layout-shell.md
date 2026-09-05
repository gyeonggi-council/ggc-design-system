# 업무 셸 — 유틸리티 바 · GNB · LNB · 본문

의원·사무처가 쓰는 업무 화면의 뼈대(계약 §2). 대민 화면은 [public-shell.md](public-shell.md) — 섞지 않는다.

## 구조 (위 → 아래)

```
<a class="ggc-skip-link" href="#main">본문 바로가기</a>
<div class="ggc-shell">
  <div class="ggc-utility-bar">     기관명 + 통합서비스 스위처 (모든 시스템 최상단 동일)
  <header class="ggc-gnb">          64px 흰 띠 — 브랜드 슬롯(256px, LNB 와 세로선이 이어진다) · 경로부(.ggc-gnb-page: 브레드크럼만) · 검색 300×36 · 아이콘 버튼
  <div class="ggc-shell-body">
    <nav class="ggc-lnb">           256px, sticky · 접힘 .ggc-lnb--icon 48px. .ggc-lnb-group(캡션) · .ggc-lnb-item(svg 아이콘 + .label + .count · aria-current)
    <main class="ggc-shell-main">   1320px (대시보드) / --wide 1360px (그 외) / --split (Converse 만) · aria-labelledby="page-title"
      <div class="ggc-page-head">   본문 첫 줄 — <h1 class="ggc-page-title"> 24px + .desc + .actions (v3.0, ADR 0010)
  <footer class="ggc-footer">       기관 · 소관 부서
```

마크업은 `design/examples/dashboard.html` 에서 복사한다. 유틸리티 바 · 배지 · 푸터는 **토큰 파일**에 정의돼 있어 토큰만 복사해도 따라온다.
GNB/LNB 는 `ggc-components.css` §9.

**페이지 제목은 본문 첫 줄에 있다**(v3.0, [ADR 0010](../decisions/0010-page-title-in-content.md) — 0008 대체). 헤더의 `.ggc-gnb-page` 에는 브레드크럼만 두고,
`.ggc-page-head` 가 `<h1 class="ggc-page-title" id="page-title">`(24px) + 설명 + 주 액션을 갖는다. 마크업은 [components/shell.md](../components/shell.md) · [page-head.md](../components/page-head.md).

## 치수 (토큰)

| 무엇 | 토큰 |
|---|---|
| GNB 높이 | `--ggc-gnb-h` |
| LNB 폭 · 브랜드 슬롯 폭 · 접힘 폭 | `--ggc-lnb-w` · `--ggc-lnb-w-icon` |
| 본문 최대폭 | `--ggc-main-max` (대시보드) · `--ggc-main-max-wide` (기타) |
| 유틸리티 바 · 푸터 inner | `--ggc-container-max` |

카드는 흰 면 · 1px `--ggc-border` · radius 14~16 · **그림자 없음**. 페이지 배경 `--ggc-bg`. 사용자 표기는 실명 · 역할 · 부서 — UUID 금지.

## 셸 형태 세 가지 (Phase 1 문항 2)

| | 언제 |
|---|---|
| ⓐ 유틸리티 바만 | 단폭 PoC · 화면 5개 이하. GNB 가 없으므로 브레드크럼도 `.ggc-page-head` 위에 둔다(h1 은 어느 셸이든 본문) |
| ⓑ 풀셸 (GNB + LNB) | **화면이 5개를 넘으면.** LNB 없이 넘기면 자체 내비를 발명하게 되고 그게 다음 드리프트다 |
| ⓒ 이관 셸 유지 + 유틸리티 바 | 리스킨 1단계 — 기존 셸을 당장 못 바꿀 때 |

## 반응형

- **≤900px**: GNB 압축(브랜드 슬롯 폭 auto · 서비스명 숨김), LNB 는 `data-open` drawer(`data-ggc-drawer-toggle` 버튼, `ggc-behaviors.js`).
  본문 패딩 18/16/40. **390px 에서 가로 스크롤 0.** GNB 경로부는 브레드크럼을 접고(경로는 LNB drawer 의 `aria-current`), 검색이 남은 폭을 쓴다. h1 은 본문이라 ≤480 에서 20px 로 줄어들 뿐 숨지 않는다.
- **≥1680px** (계약 §2-1, 옵션): 본문 1560/1600 으로 확폭, 긴 문서 측정 폭은 920px 캡. 1679px 이하는 수치 보존.
- 2단 배치는 `grid-template-columns: A B` 대신 **`flex-wrap` + `flex-basis`** — 미디어 쿼리 없이 접힌다. `nowrap` 텍스트에는 `min-width: 0`.

## 화면 패턴 (Surface Archetype 6종)

| 패턴 | 판정(구성요소) | 격자 |
|---|---|---|
| Monitor | KPI 4열 + 업무 큐, 표 없음 | `.ggc-shell-main` 1320 · 하단 `1fr 320px` |
| Explore | 필터 스트립 + 표 + 페이지네이션 — 첫 화면 15행 이상 | `--wide` 단일 컬럼 · 실물 `explore.html` |
| Learn/Decide | 단일 레코드 상세 + 결재 레일 | `--wide` · `1fr 320px` |
| Configure | 스텝퍼 + **스티키 액션바** | `--wide` |
| Converse | 대화 + 출처 패널 | `--split` |
| Operate | 실시간 상태 + 로그 + 복구 액션 | `--wide` · `1fr 380px` |

슬롯 순서와 세 상태(빈·오류·로딩) 처방은 `skills/ggc-design/references/archetypes.md`. 실물: `dashboard.html`(Monitor) · `explore.html`(Explore) · `wizard.html`(Configure).

Tier 2 는 `@ggc/ggc-shell`(shadcn sidebar 기반) — [components/sidebar.md](../components/sidebar.md).
