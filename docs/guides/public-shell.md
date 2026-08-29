# 대민 셸 — `ggc-public.css`

도민이 보는 공개 화면의 뼈대. KRDS(정부 디자인 시스템)의 masthead · header · main menu · footer ·
identifier 구조를 그대로 따르고, 색만 기관 CI(`--ggc-*`)로 썼다. 업무 GNB/LNB 셸과 섞지 않는다.

## 순서 (위 → 아래)

```
<a class="ggc-skip-link">          본문 바로가기 — 키보드 첫 Tab
<div class="ggc-masthead">         "이 누리집은 대한민국 공식 전자정부 누리집입니다." + 안내 접기
<header class="ggc-header">
  .utility                          로그인 · 회원가입 · ENGLISH (≤900 숨김)
  .branding                         로고(마크 + 경기도의회 + 서비스명) · 통합검색 · 전체메뉴(≤900)
  .site-search                      통합검색 패널 (data-ggc-search-toggle 이 연다)
  <nav class="ggc-main-menu">       1단 6개 이하 · 2단 드롭다운 · ≤900 오른쪽 패널
<main id="main" class="ggc-public-main">
  .inner  또는  .inner.ggc-public-main--side (사이드 내비 240 + 본문)
<footer class="ggc-footer ggc-footer--public">
  .quick                            관련 누리집
  .inner.main                       기관명 · 주소 · 대표전화 · 링크
  .bottom                           개인정보처리방침(강조) · 저작권 · .ggc-identifier
```

전체 마크업은 `design/examples/public/index.html` 을 복사한다 — 짐작해 짜지 않는다.

## 각 부분

| 부분 | 문서 | 핵심 |
|---|---|---|
| 마스트헤드 | [components/masthead.md](../components/masthead.md) | 문구 고정. 국가 상징 이미지는 `.flag img` 슬롯 — 정부 제공 자산 |
| 헤더 · 주 메뉴 · 통합검색 | [components/public-header.md](../components/public-header.md) | 1단 ≤6, 2단 ≤8. `aria-current` 로 현재 위치 |
| 공개 푸터 | [components/public-footer.md](../components/public-footer.md) | 기관명 · 주소 · 대표전화는 필수. 개인정보처리방침은 강조색 |
| 아이덴티파이어 | [components/identifier.md](../components/identifier.md) | "이 누리집은 경기도의회 누리집입니다." 푸터 안 |
| 사이드 내비 | [components/side-nav.md](../components/side-nav.md) | 2단 `<details>` — JS 0 |
| 구조화 목록 | [components/structured-list.md](../components/structured-list.md) | 공모 · 접수 안내 카드 격자 |
| 페이지 타이틀 · 히어로 | 이 문서 아래 | |

## 페이지 타이틀 · 히어로 · 본문 제목

```html
<div class="ggc-page-title">
  <nav class="ggc-breadcrumb" aria-label="현재 경로">…</nav>
  <h1>의안 검색</h1>
  <p class="desc">제12대 경기도의회에 접수된 의안을 검색합니다.</p>
</div>
<h2 class="ggc-h2">검색 결과</h2>
```

메인 첫 화면만 `.ggc-hero`(안내 문구 + 통합검색 + 바로가기 칩)를 쓴다. 하위 페이지는 페이지 타이틀부터 시작한다.

## 동작 (`ggc-behaviors.js`)

| 속성 | 무엇 |
|---|---|
| `data-ggc-menu-toggle` | ≤900 에서 주 메뉴 패널 열고 닫기. 열리면 패널 첫 요소로 포커스, `Esc`·닫기로 돌아온다 |
| `data-ggc-submenu` (1단 버튼) | `aria-expanded` 토글 — 모바일 아코디언. PC 는 hover / `:focus-within` 으로도 열린다 |
| `data-ggc-search-toggle` | 통합검색 패널 열고 입력에 포커스 |

## 규칙

- **주 메뉴 1단은 6개 이하, 2단은 8개 이하.** 넘치면 정보 구조를 다시 본다(KRDS 권고).
- 마스트헤드 문구 "이 누리집은 대한민국 공식 전자정부 누리집입니다." 는 바꾸지 않는다.
- 푸터의 **기관명 · 주소 · 대표전화 · 개인정보처리방침** 은 필수다.
- 본문은 `.ggc-public-main` 안 `.inner`(최대 1248px). 사이드 내비는 하위 메뉴가 3개 이상일 때만.
- ≤900 에서 유틸리티가 숨고 주 메뉴가 패널이 된다. 390 에서 가로 스크롤 0 이어야 한다.
- 인쇄(`@media print`)에서 셸은 사라지고 본문만 남는다 — 안내문·신청서는 출력된다.

## 검사

```bash
python design/check_design.py --gate <서비스경로>            # 마크업의 data-ggc-profile 로 판정
python design/check_design.py --gate <서비스경로> --profile public
```

D3 가 스킵 링크 · 마스트헤드 · 공개 푸터 · 아이덴티파이어 4종을 보고, 대민 화면에 업무 GNB/LNB 가
있으면 FAIL 이다. D1 은 `ggc-public.css` 사본도 정본과 대조한다.
