# 대민 헤더 · 주 메뉴 · 통합검색 — `.ggc-header` · `.ggc-main-menu` (대민)

KRDS `header` + `main_menu_pc` / `main_menu_mobile` 을 하나로 묶었다. 유틸리티(로그인·언어) → 브랜딩(로고·검색·전체메뉴)
→ 주 메뉴 순. 업무 화면의 GNB/LNB 와 섞지 않는다.

## 마크업

```html
<header class="ggc-header">
  <div class="utility"><div class="inner">
    <ul><li><a href="/login">로그인</a></li><li><a href="/join">회원가입</a></li><li><a href="/en" lang="en">ENGLISH</a></li></ul>
  </div></div>
  <div class="branding"><div class="inner">
    <a class="logo" href="/"><img src="/assembly-mark.png" alt=""><span class="org">경기도의회</span><span class="svc">의정정보 누리집</span></a>
    <div class="actions">
      <button class="action search" type="button" data-ggc-search-toggle aria-expanded="false" aria-controls="site-search">
        <svg …></svg><span class="label">통합검색</span></button>
      <button class="action menu" type="button" data-ggc-menu-toggle aria-expanded="false" aria-controls="main-menu">
        <span class="bars" aria-hidden="true"></span> 전체메뉴</button>
    </div>
  </div></div>
  <div class="site-search" id="site-search">
    <form class="inner" role="search" action="/search">
      <label for="site-q" class="ggc-sr">누리집 통합검색</label>
      <input id="site-q" type="search" placeholder="의안명 · 의원명 · 회의록 검색">
      <button class="ggc-btn ggc-btn--primary" type="submit">검색</button>
    </form>
  </div>
  <nav class="ggc-main-menu" id="main-menu" aria-label="주 메뉴">
    <div class="inner">
      <div class="head">전체메뉴 <button class="close" type="button" data-ggc-menu-toggle aria-label="메뉴 닫기">✕</button></div>
      <ul class="depth1">
        <li><button type="button" aria-expanded="false" aria-controls="mm-1" data-ggc-submenu>의회소개</button>
          <ul class="depth2" id="mm-1"><li><a href="…">의장 인사말</a></li>…</ul></li>
        <li><a href="…">의원소개</a></li>
        <li><a href="…" aria-current="page">의안정보</a></li>
      </ul>
    </div>
  </nav>
</header>
```

## 동작 (`ggc-behaviors.js`)

| 무엇 | 어떻게 |
|---|---|
| 2단 펼침 (PC) | `:hover` · `:focus-within` — 키보드로 1단 버튼에서 `Tab` 하면 2단으로 들어간다 |
| 2단 펼침 (모바일) | 1단 버튼 클릭 → `aria-expanded` 토글, 한 번에 하나만 열린다 |
| 전체메뉴 (≤900) | `data-ggc-menu-toggle` → `.ggc-main-menu[data-open]` 오른쪽 패널. 열리면 패널 첫 요소에 포커스, `Esc`·닫기 → 토글 버튼으로 복귀. 뒤 문서 스크롤 잠금 |
| 통합검색 | `data-ggc-search-toggle` → `.site-search[data-open]` + 입력에 포커스 |

## 규칙

- **1단 6개 이하, 2단 8개 이하.** 현재 위치는 1단·2단 모두 `aria-current="page"`.
- 하위가 없는 1단은 `<a>`, 있으면 `<button aria-expanded aria-controls data-ggc-submenu>` + `<ul class="depth2" id>`.
- 로고의 `<img alt="">` — 기관명이 텍스트로 있으므로 이미지는 장식이다.
- ≤900 에서 `.utility` 는 숨는다 — 로그인은 메뉴 패널 안에 다시 둔다(서비스가 `.head` 아래에 추가).
- 헤더는 sticky 가 아니다(KRDS 기본). 긴 페이지에서 상단 이동은 페이지 내 내비(P2)로.

## Tier 2

`ggc-public-header` (block).

## 근거

KRDS `header.html` · `main_menu_pc.html` · `main_menu_mobile.html`.
