# 0008 — 페이지 제목과 브레드크럼은 GNB 제목부에 (2026-09-04)

> **대체됨 (2026-09-05, [ADR 0010](0010-page-title-in-content.md))** — 브레드크럼은 헤더에 남고, `<h1>` 은 본문 첫 줄 24px 로 돌아갔다.
> 갤러리 실물에서 18px 제목이 크롬처럼 읽혀 "한눈에 안 들어온다" 의 첫 원인으로 확인됐다. 아래는 기록용 원문이다.

## 상황
업무 셸의 GNB(64px)는 브랜드 슬롯(256px)과 검색(300px) 사이가 비어 있었고, 브레드크럼과 페이지 제목은 본문 첫 줄
(`.ggc-page-head`)에 있었다. 실제 소비 서비스(업무 위키 등)에서 그 빈 띠 아래에 같은 정보를 다시 한 줄 쓰는 낭비가 보였고,
사용자가 "네비게이션을 위로" 를 요청했다. 계약 §2 의 GNB 구성 목록에는 제목부가 없었고, `breadcrumb.md` · `page-head.md` ·
`archetypes.md` 는 "본문 첫 줄" 을 기본으로 못 박고 있었다.

## 결정
- **업무 셸의 기본 규칙**으로 바꾼다(선택 변형이 아니다). 브레드크럼 + `<h1>` 은 `.ggc-gnb-page`(§9)에 두고, 본문 첫 줄
  `.ggc-page-head` 는 메타 + 주 액션만 갖는다. 화면당 h1 은 GNB 에 하나이고 `<main aria-labelledby="page-title">` 로 잇는다.
- **줄바꿈 대신 말줄임.** `--ggc-gnb-h` 가 LNB sticky · drawer · `--split` 의 기준이라 GNB 를 늘릴 수 없다. 브레드크럼은
  마지막 항목(화면 이름)만 줄어들고, 잘릴 수 있는 레코드명(의안명)은 본문 첫 카드에 전문을 다시 적는다.
- **반응형**: ≤900px 브레드크럼 숨김(경로는 LNB drawer 의 `aria-current`). ≤480px 제목은 시각만 숨김 — 390px 에서
  GNB 남은 폭이 ≈100px 이라 제목과 검색이 함께 읽히지 않는데, 검색이 유일한 GNB 동선(계약 §2)이라 검색을 남긴다.
  `display:none` 이 아니므로 접근성 트리와 `aria-labelledby` 는 유지된다.
- **Monitor 첫 화면**은 GNB 에 제목만(홈이라 경로가 없다). 인사말은 본문 `.ggc-page-head--greeting` 의 `<p class="title">`.
- **셸 ⓐ(유틸리티 바만)** 는 GNB 가 없으므로 예전처럼 `.ggc-page-head` 에 브레드크럼 + h1 을 둔다.
- **대민 셸은 제외** — KRDS 페이지 타이틀 패턴 그대로.

## 근거
GNB 의 빈 폭은 화면마다 같은 자리이고, 브레드크럼·제목은 화면마다 반드시 있는 정보다. 둘을 합치면 본문 첫 줄(≈60px)이
콘텐츠에 돌아온다. 새 값은 없다 — 글자 크기·색은 §12/§13 의 것을 그대로 쓰고 간격은 `--ggc-space-*` 다.

## 결과
`ggc-components.css` §9 `.ggc-gnb-page` · §10 반응형 · §12 주석 · 계약 §2 · `guides/layout-shell.md` · `components/shell.md` ·
`breadcrumb.md` · `page-head.md` · `archetypes.md` · 갤러리 8쪽 · `build-standalone.py`(쪽 전환 시 제목부 교체) ·
Tier 2 `ggc-shell` `GnbPage` · `ggc-page-head`(title 선택 · greeting 은 `<p>`).
⚠ D1 — `ggc-components.css` 바이트가 바뀌었다(토큰 파일은 불변).

## 후속
≤480px 에서 검색을 아이콘으로 접는 패턴이 생기면 제목 시각 숨김을 되돌린다.
