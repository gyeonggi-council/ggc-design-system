# 업무 셸 — 유틸리티 바 · GNB · LNB · 본문

의원·사무처가 쓰는 업무 화면의 뼈대(계약 §2). 대민 화면은 [public-shell.md](public-shell.md) — 섞지 않는다.

## 구조 (위 → 아래)

```
<a class="ggc-skip-link" href="#main">본문 바로가기</a>
<div class="ggc-shell">
  <div class="ggc-utility-bar">     기관명 + 통합서비스 스위처 — 기본 숨김(v3.2.1). 마크업은 둔다
  <header class="ggc-gnb">          64px 흰 띠 — [PC 접기 단추] · 브랜드 슬롯(256px, LNB 와 세로선이 이어진다) · 경로부(.ggc-gnb-page: 브레드크럼만) · 검색 300×36 · 아이콘 버튼 · [≤900 「전체메뉴」]
  <div class="ggc-shell-body">
    <nav class="ggc-lnb">           256px, sticky · 접힘 .ggc-lnb--icon 48px · [data-ggc-lnb-collapse="hide"] 면 완전 숨김(v3.3). .ggc-lnb-group(캡션) · .ggc-lnb-item(svg 아이콘 + .label · aria-current)
    <main class="ggc-shell-main">   1320px (대시보드) / --wide 1360px (그 외) / --split (Converse 만) · aria-labelledby="page-title"
      <div class="ggc-page-head">   본문 첫 줄 — <h1 class="ggc-page-title"> 24px + 주 액션(있을 때) · 설명 줄은 기본 없음 (ADR 0010 · 0012)
  <footer class="ggc-footer">       기관 · 소관 부서
```

마크업은 `design/examples/dashboard.html` 에서 복사한다. 유틸리티 바 · 배지 · 푸터는 **토큰 파일**에 정의돼 있어 토큰만 복사해도 따라온다.
GNB/LNB 는 `ggc-components.css` §9.

**페이지 제목은 본문 첫 줄에 있다**(v3.0, [ADR 0010](../decisions/0010-page-title-in-content.md) — 0008 대체). 헤더의 `.ggc-gnb-page` 에는 브레드크럼만 두고,
`.ggc-page-head` 가 `<h1 class="ggc-page-title" id="page-title">`(24px) + 주 액션을 갖는다. 설명 줄 · 메타는 쓰임이 있을 때만이고([less.md](less.md) R2),
자세한 정보는 툴팁 · 토글팁 · 정보 서랍으로 옮긴다([less.md](less.md) 「덜어낸 정보는 어디로」). 마크업은 [components/shell.md](../components/shell.md) · [page-head.md](../components/page-head.md).

## 치수 (토큰)

| 무엇 | 토큰 |
|---|---|
| GNB 높이 | `--ggc-gnb-h` |
| LNB 폭 · 브랜드 슬롯 폭 · 접힘 폭 | `--ggc-lnb-w` · `--ggc-lnb-w-icon` |
| 본문 최대폭 | `--ggc-main-max` (대시보드) · `--ggc-main-max-wide` (기타) |
| 유틸리티 바 · 푸터 inner | `--ggc-container-max` |

카드는 흰 면 · 1px `--ggc-border` · 모서리 `--ggc-radius-lg` · **그림자 없음**. 카드 머리 · 바닥 여백은 목록 행과 같은 `--ggc-row-pad` 라 카드 제목과 행 제목의 왼쪽 끝이 맞는다(v3.2). 페이지 배경 `--ggc-bg`. 사용자 표기는 실명 · 역할 · 부서 — UUID 금지.

## 셸 형태 세 가지 (Phase 1 문항 2)

| | 언제 |
|---|---|
| ⓐ 유틸리티 바만 | 단폭 PoC · 화면 5개 이하. 띠가 기본 숨김이라 본문 `.ggc-page-head` 가 맨 위다. GNB 가 없으므로 브레드크럼도 `.ggc-page-head` 위에 둔다(h1 은 어느 셸이든 본문) |
| ⓑ 풀셸 (GNB + LNB) | **화면이 5개를 넘으면.** LNB 없이 넘기면 자체 내비를 발명하게 되고 그게 다음 드리프트다 |
| ⓒ 이관 셸 유지 + 유틸리티 바 | 리스킨 1단계 — 기존 셸을 당장 못 바꿀 때 |

## 반응형

- **>900px (PC)**: GNB 맨 앞 접기 단추 `[data-ggc-lnb-toggle]`(아이콘만, `aria-label` 「메뉴 접기」/「메뉴 펼치기」)가 LNB 를 아이콘 줄(`.ggc-lnb--icon`)로 접고 편다.
  LNB 에 `data-ggc-lnb-collapse="hide"` 를 두면 같은 단추(「메뉴 숨기기」/「메뉴 표시」)가 메뉴를 **완전히 숨기고** 본문이 그 폭을 갖는다(v3.3, ADR 0015 — 새 화면은 이 방식).
  처음엔 펼친다. 접힘 · 숨김은 서비스(첫 경로 조각)마다 `localStorage` 에 기억하고, 휴대폰 폭에서 돌아오면 되살린다. 아이콘 줄의 항목 이름은 디자인 툴팁으로 보인다.
- **≤900px**: GNB 압축(브랜드 슬롯 폭 auto · 서비스명 숨김). 순서는 **CI 왼쪽 → 검색 → 알림 → 「전체메뉴」 맨 오른쪽**이다 — 대민 셸과 같은 자리 · 같은 말([ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md)).
  LNB 는 **오른쪽에서 나오는 서랍**(`data-open`)이 된다. 폭 · 그림자는 대민 `.ggc-main-menu` 패널과 같고, 머리는 「전체메뉴」 + 닫기 아이콘 단추다. 단추는 `.ggc-gnb-menu` `[data-ggc-drawer-toggle]`, 동작은 `ggc-behaviors.js` ③([behaviors-js.md](behaviors-js.md)). PC 접기 단추는 이 폭에서 숨는다.
  본문 패딩 18/16/40. **390px 에서 가로 스크롤 0.** GNB 경로부는 브레드크럼을 접고(경로는 서랍의 `aria-current`), 검색이 남은 폭을 쓴다. h1 은 본문이라 숨지 않고 크기(`--ggc-h1-size`)도 그대로다(v3.2 — ≤480 에서 줄이던 규칙은 지웠다).
- **≤600px (휴대폰)**: GNB 검색은 알림 단추와 같은 정사각 아이콘으로 접혔다가, 누르면 GNB 폭으로 펼쳐진다(`:focus-within`, 스크립트 없음).
  페이지 머리 줄은 제목 → 액션 순으로 세로로 쌓는다. 셸 안 단추 · 쪽 번호는 최소 높이 `--ggc-space-8`(40) — 손가락 목표다.
  `.ggc-field` 입력 글자는 `max(--ggc-control-font, --ggc-text-md)` — 16 미만이면 iOS 가 확대한다. 이 보정은 v3.2 부터 `.ggc-work` 밖에도 걸린다.
- **하단 탭 바는 두지 않는다**(ADR 0014). 서비스 메뉴가 4~12개 · 2단이라 탭 몇 칸에 담기지 않는다. 바닥은 이미 스티키 액션바(`.ggc-actionbar` · `.ggc-solo-bar` · `.ggc-work-actions`) 자리이고, 카톡 인앱 도구 막대 · iOS 홈 막대와 부딪힌다.
- **한글 줄바꿈**: `.ggc-shell` · `.ggc-page` · `.ggc-public` · `.ggc-solo` · `.ggc-modal` 은 `word-break: keep-all` — 「기획재 / 정위원회」처럼 낱말 가운데서 끊지 않는다(v3.2). 넓어진 표는 `.ggc-table-wrap` 안에서 가로로 민다.
- **≥1680px** (계약 §2-1, 옵션): 본문 1560/1600 으로 확폭, 긴 문서 측정 폭은 920px 캡. 1679px 이하는 수치 보존.
- 2단 배치는 `grid-template-columns: A B` 대신 **`flex-wrap` + `flex-basis`** — 미디어 쿼리 없이 접힌다. `nowrap` 텍스트에는 `min-width: 0`.

## 화면 패턴 (Surface Archetype 6종)

| 패턴 | 판정(구성요소) | 격자 |
|---|---|---|
| Monitor | 업무 큐 우선 + 요약 숫자(쓰임이 있을 때 0~4), 표 없음 | `.ggc-shell-main` 1320 · 하단 `1fr 320px` |
| Explore | 필터 스트립 + 표 + 페이지네이션 — 행 수는 참고 목표(less.md R8). 한 건의 부가 정보는 정보 서랍 | `--wide` 단일 컬럼 · 실물 `explore.html` |
| Learn/Decide | 단일 레코드 상세 + 결재 레일 | `--wide` · `1fr 320px` |
| Configure | 스텝퍼 + **스티키 액션바** | `--wide` |
| Converse | 대화 + 출처 패널 | `--split` |
| Operate | 실시간 상태 + 로그 + 복구 액션 | `--wide` · `1fr 380px` |

슬롯 순서와 세 상태(빈·오류·로딩) 처방은 `skills/ggc-design/references/archetypes.md`. 실물: `dashboard.html`(Monitor) · `explore.html`(Explore) · `wizard.html`(Configure).

Tier 2 는 `@ggc/ggc-shell`(shadcn sidebar 기반) — [components/sidebar.md](../components/sidebar.md).
