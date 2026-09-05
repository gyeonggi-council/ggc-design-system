# 업무 셸 — `.ggc-utility-bar` · `.ggc-gnb` · `.ggc-lnb` · `.ggc-shell-main` · `.ggc-footer` (v3.0)

구조와 치수는 [guides/layout-shell.md](../guides/layout-shell.md). 여기는 마크업이다 — `design/examples/dashboard.html` · `explore.html` 과 같다.
v3.0(ADR 0010): **브레드크럼은 GNB 경로부에, `<h1>` 은 본문 첫 줄 `.ggc-page-head` 에.** LNB 항목은 lucide 아이콘 + 라벨, 접힘 변형 `.ggc-lnb--icon`.

## 마크업

```html
<a class="ggc-skip-link" href="#main">본문 바로가기</a>
<!-- 정적 HTML · file:// 이면 <body> 첫 줄에 아이콘 스프라이트 인라인(guides/icons.md) -->
<div class="ggc-shell">
  <div class="ggc-utility-bar">
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
    <button class="ggc-icon-btn ex-only-narrow" type="button" data-ggc-drawer-toggle aria-expanded="false" aria-controls="lnb" aria-label="메뉴 열기">
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-menu"/></svg>
    </button>                                                 <!-- ≤900 에서만 보이게 -->
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
| `.ggc-utility-bar` `.brand` `nav a.active` `.disabled` | 최상단 띠(토큰 파일 정의). 내부망 전용 시스템은 외부 배포본에서 `span.disabled` + "(내부망)" |
| `.ggc-gnb-brand` `.org` `.svc` | 마크 40px + 기관 + 서비스명. 폭이 LNB 와 같아 세로선이 이어진다 |
| `.ggc-gnb-page` | **경로부** — 브레드크럼만. 브랜드 슬롯과 검색 사이(`flex:1 · min-width:0`), 검색은 밀리지 않는다. 마지막 항목만 말줄임. 홈은 비운다. `.ggc-gnb-page-title` 은 폐기 예정(v3.1 삭제) |
| `.ggc-search` | 300×`--ggc-search-h`(36). 아이콘은 스프라이트 |
| `.ggc-icon-btn` | `--ggc-control-h`(36) 정사각 아이콘 버튼 — `aria-label` 필수 |
| `.ggc-lnb-group` · `.ggc-lnb-item` (`svg` · `.label` · `.count`) · `.ggc-lnb-divider` | 캡션 · 항목(높이 32 · 14px · 아이콘 16 · 우측 건수) · 구분선. 현재 항목은 `aria-current="page"` |
| `.ggc-lnb--icon` | 접힌 사이드바 48px — 라벨·캡션·건수는 시각만 숨김. 토글은 서비스 몫(`ggc-behaviors.js` 는 drawer 만) |
| `.ggc-shell-main` (`--wide` `--split`) | 본문 1320 / 1360. Converse 화면만 `--split` |
| `.ggc-scroll` | 커스텀 스크롤바 (LNB · 대화 스트림) |

## 규칙

- 유틸리티 바의 스위처 항목 이름은 통합서비스 목록과 같아야 한다. 현재 시스템은 `.active`.
- 사용자 표기(GNB 우측)는 **실명 · 역할 · 부서** — UUID 금지.
- **화면의 `<h1>` 은 본문 첫 줄 `.ggc-page-head` 에 하나다**(24px). GNB 에 두지 않는다 — 크롬처럼 읽힌다(ADR 0010). `<main aria-labelledby="page-title">`.
- 헤더에는 **화면마다 자리가 같은 정보**만: 경로 · 검색 · 알림. ≤900px 브레드크럼 숨김(경로는 LNB drawer 의 현재 항목).
- LNB 항목에는 아이콘을 둔다 — 접었을 때 아이콘만 남는다. 이모지 금지(guides/icons.md).
- 로그인 화면(`login.html`)은 GNB/LNB 없이 유틸리티 바 + `.ggc-login` 컨테이너만.
- 대민 화면에는 이 셸을 쓰지 않는다 — 검사기 D3 가 FAIL 로 잡는다.

## Tier 2

`@ggc/ggc-shell` (v3, shadcn sidebar 기반) — `Shell` `ShellFrame` `AppSidebar brand groups systems user` `ShellInset` `ShellHeader breadcrumb search notifications` `ShellMain wide titleId` `SkipLink`.
사이드바는 `collapsible="icon"`(⌘B), ≤768 은 Sheet. 시스템 스위처는 사이드바 머리 드롭다운(`systems`) 또는 `@ggc/ggc-utility-bar` 중 하나.
제목은 `@ggc/ggc-page-head` 가 그린다.

## 근거

계약 §2 · ggc-components.css §9 · ggc-tokens.css 유틸리티 바/푸터 · shadcn dashboard-01 · [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) · [ADR 0010](../decisions/0010-page-title-in-content.md).
