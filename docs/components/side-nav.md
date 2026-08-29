# 사이드 내비게이션 — `.ggc-side-nav` (대민)

하위 메뉴가 3개 이상인 대민 섹션의 왼쪽 메뉴. KRDS `side_navigation` 을 `<details>` 로 단순화했다 — JS 0.
`.ggc-public-main--side` 격자의 첫 컬럼(240px)에 둔다. ≤900 에서는 본문 위로 올라간다.

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
- `sticky` 라 긴 본문에서도 따라온다. ≤900 에서는 `static`.

## Tier 2

`ggc-side-nav`.

## 근거

KRDS `side_navigation.html`.
