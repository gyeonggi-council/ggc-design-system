# 업무 셸 — `.ggc-utility-bar` · `.ggc-gnb` · `.ggc-lnb` · `.ggc-shell-main` · `.ggc-footer`

구조와 치수는 [guides/layout-shell.md](../guides/layout-shell.md). 여기는 마크업이다 — `design/examples/dashboard.html` 과 같다.

## 마크업

```html
<a class="ggc-skip-link" href="#main">본문 바로가기</a>
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
    <button class="ggc-icon-btn" type="button" data-ggc-drawer-toggle aria-expanded="false" aria-controls="lnb" aria-label="메뉴 열기">☰</button>  <!-- ≤900 에서만 보이게 -->
    <a class="ggc-gnb-brand" href="/">
      <img src="assembly-mark.png" alt="">
      <span class="ggc-gnb-title"><span class="org">경기도의회</span><span class="svc">입법역량지원 플랫폼</span></span>
    </a>
    <div class="ggc-gnb-page">                                   <!-- 제목부: 화면의 h1 은 여기 하나 (v2.1, ADR 0008) -->
      <nav class="ggc-breadcrumb" aria-label="현재 경로">
        <ol><li><a href="/">홈</a></li><li><a href="/bills">의안</a></li><li aria-current="page">의안 목록</li></ol>
      </nav>
      <h1 class="ggc-gnb-page-title" id="page-title">의안 목록</h1>
    </div>
    <div class="ggc-search"><label for="q" class="ggc-sr">검색</label><input id="q" type="search" placeholder="의안 · 조례 검색"></div>
    <button class="ggc-icon-btn" type="button" aria-label="알림 3건">…svg…</button>
  </header>

  <div class="ggc-shell-body">
    <nav class="ggc-lnb ggc-scroll" id="lnb" aria-label="주 메뉴">
      <div class="ggc-lnb-group">의안</div>
      <a class="ggc-lnb-item" href="…" aria-current="page">대시보드</a>
      <a class="ggc-lnb-item" href="…">의안 목록</a>
      <div class="ggc-lnb-divider"></div>
      <div class="ggc-lnb-group">관리</div>
      <a class="ggc-lnb-item" href="…">설정</a>
    </nav>
    <main class="ggc-shell-main" id="main" aria-labelledby="page-title"> … </main>   <!-- 대시보드 1320 · 그 외 .ggc-shell-main--wide 1360 -->
  </div>

  <footer class="ggc-footer"><div class="inner">경기도의회 의회사무처 공간정보화과 · 통합 의정정보시스템</div></footer>
</div>
```

## 부분

| 클래스 | 무엇 |
|---|---|
| `.ggc-utility-bar` `.brand` `nav a.active` `.disabled` | 최상단 띠(토큰 파일 정의). 내부망 전용 시스템은 외부 배포본에서 `span.disabled` + "(내부망)" |
| `.ggc-gnb-brand` `.org` `.svc` | 마크 40px + 기관 + 서비스명. 폭이 LNB 와 같아 세로선이 이어진다 |
| `.ggc-gnb-page` · `.ggc-gnb-page-title` | 제목부 — 브레드크럼(`.ggc-breadcrumb`) + `h1#page-title`. 브랜드 슬롯과 검색 사이를 채우고(`flex:1 · min-width:0`) 검색은 밀리지 않는다. 줄바꿈 없음·말줄임. Monitor 는 제목만. 제목부가 있으면 `.ggc-gnb-spacer` 는 두지 않는다 |
| `.ggc-search` | 300×40 · `--ggc-search-h` |
| `.ggc-icon-btn` | 40px 정사각 아이콘 버튼 — `aria-label` 필수 |
| `.ggc-lnb-group` · `.ggc-lnb-item` · `.ggc-lnb-divider` | 캡션 · 항목(`aria-current="page"` 또는 `.is-active`) · 구분선 |
| `.ggc-shell-main` (`--wide` `--split`) | 본문. Converse 화면만 `--split` |
| `.ggc-scroll` | 커스텀 스크롤바 (LNB · 대화 스트림) |

## 규칙

- 유틸리티 바의 스위처 항목 이름은 통합서비스 목록과 같아야 한다. 현재 시스템은 `.active`.
- 사용자 표기(GNB 우측)는 **실명 · 역할 · 부서** — UUID 금지.
- **화면의 `<h1>` 은 GNB 제목부에 하나다.** 본문에 h1 을 두지 않고, `<main aria-labelledby="page-title">` 로 본문 랜드마크에 잇는다. 본문 첫 줄은 `.ggc-page-head`(메타 + 주 액션).
- 제목부는 64px 안에서 **말줄임**한다 — 잘릴 수 있는 식별자(의안명)는 본문 첫 카드에 전문을 다시 적는다. ≤900px 브레드크럼 숨김, ≤480px 제목 시각 숨김(접근성 트리 유지).
- 로그인 화면(`login.html`)은 GNB/LNB 없이 유틸리티 바 + `.ggc-login` 컨테이너만.
- 대민 화면에는 이 셸을 쓰지 않는다 — 검사기 D3 가 FAIL 로 잡는다.

## Tier 2

`ggc-shell` — `Shell` `UtilityBar` `UtilityLink` `Gnb` `GnbBrand` `GnbPage breadcrumb title titleId` `ShellBody` `Lnb open` `LnbGroup` `LnbItem active` `ShellMain wide titleId` `Footer`.

## 근거

계약 §2 · ggc-components.css §9 · ggc-tokens.css 유틸리티 바/푸터 · 의정지원 플랫폼.dc.html 마스터 · [ADR 0008](../decisions/0008-page-title-in-gnb.md).
