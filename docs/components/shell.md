# 업무 셸 — `.ggc-utility-bar` · `.ggc-gnb` · `.ggc-lnb` · `.ggc-shell-main` · `.ggc-footer` (v3.0 · 메뉴 v3.2)

구조와 치수는 [guides/layout-shell.md](../guides/layout-shell.md). 여기는 마크업이다 — `design/examples/dashboard.html` · `explore.html` 과 같다.
v3.0(ADR 0010): **브레드크럼은 GNB 경로부에, `<h1>` 은 본문 첫 줄 `.ggc-page-head` 에.** LNB 항목은 lucide 아이콘 + 라벨, 접힘 변형 `.ggc-lnb--icon`.
v3.2.1(2026-10-25): **유틸리티 바(통합서비스 띠)는 기본 숨김**이다 — 마크업은 그대로 둔다(계약 §2).
v3.2([ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md)): **메뉴 단추가 둘로 나뉜다.** PC(>900)는 GNB 맨 앞 접기 단추, 900 이하는 GNB 맨 끝 「전체메뉴」 → 오른쪽 서랍(대민 셸과 같은 자리 · 같은 말).

## 마크업

```html
<a class="ggc-skip-link" href="#main">본문 바로가기</a>
<!-- 정적 HTML · file:// 이면 <body> 첫 줄에 아이콘 스프라이트 인라인(guides/icons.md) -->
<div class="ggc-shell">
  <div class="ggc-utility-bar">                               <!-- 기본 숨김(v3.2.1) — 마크업은 둔다 -->
    <div class="inner">
      <a class="brand" href="/">경기도의회 업무플랫폼</a>
      <nav>
        <span class="label">통합서비스</span>
        <a class="active" href="/">입법역량지원</a>
        <a href="…">의안처리</a>
        <span class="disabled">의사일정 (내부망)</span>
      </nav>
    </div>
  </div>

  <header class="ggc-gnb">
    <a class="ggc-gnb-brand" href="/">
      <img src="assembly-mark.png" alt="">
      <span class="ggc-gnb-title"><span class="org">경기도의회</span><span class="svc">의안관리</span></span>
    </a>
    <div class="ggc-gnb-page">                                   <!-- 경로부: 브레드크럼만 (v3.0). 홈은 비워 둔다 -->
      <nav class="ggc-breadcrumb" aria-label="현재 경로">
        <ol><li><a href="/">홈</a></li><li><a href="/bills">의안</a></li><li aria-current="page">의안 목록</li></ol>
      </nav>
    </div>
    <div class="ggc-search">
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-search"/></svg>
      <label for="q" class="ggc-sr">의안 · 조례 검색</label><input id="q" type="search" placeholder="의안 · 조례 검색">
    </div>
    <button class="ggc-icon-btn" type="button" aria-label="알림 3건"><svg class="ggc-icon" aria-hidden="true"><use href="#i-bell"/></svg></button>
    <button class="ggc-gnb-menu" type="button" data-ggc-drawer-toggle aria-expanded="false" aria-controls="lnb">
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-menu"/></svg><span>전체메뉴</span>
    </button>                                                 <!-- ≤900 에서만 보인다 · GNB 맨 끝(대민 셸과 같은 자리) -->
  </header>

  <div class="ggc-shell-body">
    <nav class="ggc-lnb ggc-scroll" id="lnb" aria-label="주 메뉴">
      <div class="ggc-lnb-group">의안</div>
      <a class="ggc-lnb-item" href="…" aria-current="page"><svg class="ggc-icon" aria-hidden="true"><use href="#i-layout-dashboard"/></svg><span class="label">대시보드</span></a>
      <a class="ggc-lnb-item" href="…"><svg class="ggc-icon" aria-hidden="true"><use href="#i-table-2"/></svg><span class="label">의안 목록</span><span class="count">21</span></a>
      <div class="ggc-lnb-divider"></div>
      <div class="ggc-lnb-group">관리</div>
      <a class="ggc-lnb-item" href="…"><svg class="ggc-icon" aria-hidden="true"><use href="#i-settings"/></svg><span class="label">설정</span></a>
    </nav>
    <main class="ggc-shell-main ggc-shell-main--wide" id="main" aria-labelledby="page-title">
      <div class="ggc-page-head">                                <!-- 본문 첫 줄: h1 24 + 설명 + 주 액션 (page-head.md) -->
        <div class="row">
          <div><h1 class="ggc-page-title" id="page-title">의안 목록</h1><p class="desc">제12대 · 제380회 정례회 · 접수 147건</p></div>
          <div class="actions"><button class="ggc-btn ggc-btn--primary" type="button"><svg class="ggc-icon" aria-hidden="true"><use href="#i-plus"/></svg>의안 등록</button></div>
        </div>
      </div>
      …
    </main>
  </div>

  <footer class="ggc-footer"><div class="inner">경기도의회 의회사무처 공간정보화과 · 통합 의정정보시스템</div></footer>
</div>
```

## 부분

| 클래스 | 무엇 |
|---|---|
| `.ggc-utility-bar` `.brand` `nav a.active` `.disabled` | 최상단 띠(토큰 파일 정의) — **기본 숨김**(v3.2.1). 다시 보일 곳만 서비스 CSS 에서 `display` 를 되돌린다. 내부망 전용 시스템은 외부 배포본에서 `span.disabled` + "(내부망)" |
| `.ggc-gnb-brand` `.org` `.svc` | 마크 40px + 기관 + 서비스명. 폭이 LNB 와 같아 세로선이 이어진다. 앞에 접기 단추가 있으면(>900) 폭을 내용에 맞춘다 · 900 이하에서는 왼쪽에 붙고 나머지를 오른쪽으로 민다 |
| `.ggc-gnb-page` | **경로부** — 브레드크럼만. 브랜드 슬롯과 검색 사이(`flex:1 · min-width:0`), 검색은 밀리지 않는다. 마지막 항목만 말줄임. 홈은 비운다. `.ggc-gnb-page-title` 은 폐기 예정(v3.1 삭제) |
| `.ggc-search` | 300×`--ggc-search-h`(36). 아이콘은 스프라이트. ≤600 에서는 알림 단추와 같은 정사각 아이콘으로 접히고, 누르면(`:focus-within`) GNB 폭으로 펼쳐진다 — 스크립트 없음 |
| `.ggc-icon-btn` | `--ggc-control-h`(36) 정사각 아이콘 버튼 — `aria-label` 필수 |
| `[data-ggc-lnb-toggle]` | **PC(>900) 접기 단추** — `.ggc-icon-btn` + lucide `menu`. **GNB 맨 앞.** `aria-label` 「메뉴 접기」/「메뉴 펼치기」 · `aria-expanded`. 900 이하에서 숨는다. 없으면 behaviors ③ 이 만든다 |
| `.ggc-gnb-menu` `[data-ggc-drawer-toggle]` | **「전체메뉴」 단추**(≤900) — lucide `menu` + 글자 「전체메뉴」. **GNB 맨 끝**(대민 `.action.menu` 와 같은 자리). 글자가 이름이라 `aria-label` 을 따로 두지 않는다. 900 초과에서 숨는다 |
| `.ggc-drawer-head` (`.title` · `.ggc-drawer-close`) | 서랍 머리 — 「전체메뉴」 + 닫기 아이콘 단추(`aria-label` 「메뉴 닫기」). behaviors ③ 이 LNB 맨 앞에 만든다. ≤900 에서만 보인다 |
| `.ggc-lnb-group` · `.ggc-lnb-item` (`svg` · `.label` · `.count`) · `.ggc-lnb-divider` | 캡션 · 항목(높이 32 · 14px · 아이콘 16 · 우측 건수) · 구분선. 현재 항목은 `aria-current="page"` |
| `.ggc-lnb--icon` | 접힌 사이드바 — 라벨·캡션·건수는 시각만 숨김. PC 접기 단추가 켜고 끈다. 서랍(≤900)은 늘 펼친 모양이고, PC 폭으로 돌아오면 접힘을 되살린다 |
| `.ggc-shell-main` (`--wide` `--split`) | 본문 1320 / 1360. Converse 화면만 `--split` |
| `.ggc-scroll` | 커스텀 스크롤바 (LNB · 대화 스트림) |

## 규칙

`ggc-behaviors.js` ③ 을 로드하면 빠진 단추 둘(PC 접기 · 「전체메뉴」)과 서랍 머리 · 배경을 만든다.
옛 마크업이 `[data-ggc-drawer-toggle]` 을 GNB 맨 앞에 두었어도 스크립트가 맨 끝으로 옮긴다 — 서비스는 마크업을 고치지 않아도 된다.
새 마크업은 위 예시처럼 맨 끝(알림 다음)에 둔다.
닫힌 서랍은 `inert` 로 포커스 진입을 막는다. 열면 닫기 단추로 포커스를 옮기고 Tab 을 서랍 안에서 돌린다.
`Esc` · 배경 클릭 · 메뉴 링크 클릭으로 닫히고, 포커스는 여는 단추로 돌아온다.
화면을 PC 폭으로 바꾸면 서랍을 닫고 잠금을 푼다.

- 유틸리티 바의 스위처 항목 이름은 통합서비스 목록과 같아야 한다. 현재 시스템은 `.active`.
- 사용자 표기(GNB 우측)는 **실명 · 역할 · 부서** — UUID 금지.
- **화면의 `<h1>` 은 본문 첫 줄 `.ggc-page-head` 에 하나다**(24px). GNB 에 두지 않는다 — 크롬처럼 읽힌다(ADR 0010). `<main aria-labelledby="page-title">`.
- 헤더에는 **화면마다 자리가 같은 정보**만: 경로 · 검색 · 알림. ≤900px 브레드크럼 숨김(경로는 「전체메뉴」 서랍의 현재 항목).
- ≤900 GNB 순서는 **CI 왼쪽 → 검색 → 알림 → 「전체메뉴」 맨 오른쪽**이고, 서랍도 오른쪽에서 나온다(폭 · 그림자 · 머리는 대민 `.ggc-main-menu` 패널과 같다). 대민 셸과 같은 자리라, 두 셸을 오가도 손이 같은 곳으로 간다.
- **하단 탭 바를 두지 않는다**(ADR 0014). 서비스 메뉴가 4~12개 · 2단이라 탭 몇 칸에 담기지 않는다. 바닥은 이미 `.ggc-actionbar` · `.ggc-solo-bar` · `.ggc-work-actions` 자리이고, 카톡 인앱 도구 막대 · iOS 홈 막대와 부딪힌다.
- 휴대폰(≤600)에서 셸 안 단추 · 쪽 번호는 최소 높이 `--ggc-space-8`(40) — 손가락 목표다.
- LNB 항목에는 아이콘을 둔다 — 접었을 때 아이콘만 남는다. 이모지 금지(guides/icons.md).
- 로그인 화면(`login.html`)은 GNB/LNB 없이 유틸리티 바(기본 숨김) + `.ggc-login` 컨테이너만.
- 대민 화면에는 이 셸을 쓰지 않는다 — 검사기 D3 가 FAIL 로 잡는다.

## Tier 2

`@ggc/ggc-shell` (v3, shadcn sidebar 기반) — `Shell` `ShellFrame` `AppSidebar brand groups systems user` `ShellInset` `ShellHeader breadcrumb search notifications` `ShellMain wide titleId` `SkipLink`.
사이드바는 `collapsible="icon"`(⌘B), ≤768 은 Sheet. Tier 2 는 아직 shadcn 기본 배치(헤더 맨 앞 토글 · 왼쪽 Sheet)라 위 v3.2 Tier 1 배치와 다르다 — 맞추는 일은 다음 PR(ADR 0014). 시스템 스위처는 사이드바 머리 드롭다운(`systems`) 또는 `@ggc/ggc-utility-bar` 중 하나.
제목은 `@ggc/ggc-page-head` 가 그린다.

## 근거

계약 §2 · ggc-components.css §9 · §10 · ggc-tokens.css 유틸리티 바/푸터 · shadcn dashboard-01 · [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) · [ADR 0010](../decisions/0010-page-title-in-content.md) · [ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md).
