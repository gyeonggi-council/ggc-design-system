# 사이드 내비게이션 — `.ggc-side-nav` (대민)

하위 메뉴가 3개 이상인 대민 섹션의 왼쪽 메뉴. KRDS `side_navigation` 을 `<details>` 로 단순화했다 — JS 0.
`.ggc-public-main--side` 격자의 첫 컬럼(240px)에 둔다. ≤900 에서는 숨는다 — 휴대폰 첫 화면이 본문이 되게 하고, 메뉴는 「전체메뉴」로 찾는다(v3.2, [ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md) · KRDS `side_navigation`).

## 마크업

```html
<div class="inner ggc-public-main--side">
  <nav class="ggc-side-nav" aria-label="의안정보 메뉴">
    <h2 class="title">의안정보</h2>
    <ul>
      <li><a href="/bills" aria-current="page">의안 검색</a></li>
      <li><a href="/ordinances">조례 현황</a></li>
      <li><details open>
        <summary>의안 통계</summary>
        <ul><li><a href="/stats/session">회기별 처리 현황</a></li><li><a href="/stats/committee">위원회별 현황</a></li></ul>
      </details></li>
    </ul>
  </nav>
  <div class="content">…</div>
</div>
```

## 규칙

- 제목(`.title`)은 1단 메뉴 이름이다 — 주 메뉴의 현재 1단과 같아야 한다.
- 현재 페이지는 `aria-current="page"` (왼쪽 3px 강조선 + 틴트 배경 + 굵게).
- 현재 페이지가 2단 안에 있으면 그 `<details>` 를 `open` 으로 둔다.
- 2단까지만. 3단이 필요하면 페이지 내 탭이나 페이지 내 내비(P2)로 푼다.
- `sticky` 라 긴 본문에서도 따라온다. ≤900 에서 `.ggc-public-main--side` 안의 사이드 내비는 숨는다(다른 자리에 두면 `static`).
- **사이드 내비의 모든 목적지는 전체메뉴 `.ggc-main-menu` 의 `.depth2` 에도 둔다**(v3.2). 휴대폰에서는 전체메뉴가 유일한 길이다.
  그 아래 `<details>` 항목(3단)은 `.depth2` 자리에 펼쳐 넣는다 — 예: 「의안 통계」 대신 「회기별 처리 현황 · 위원회별 현황 · 의원별 발의 현황」.
  묶음 이름(3단의 부모)은 빼도 된다. `.depth2` 가 8개를 넘으면 사이트 메뉴 구조를 다시 본다.

## Tier 2

`ggc-side-nav`.

## 근거

KRDS `side_navigation.html`.
