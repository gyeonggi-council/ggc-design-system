# 페이지 내 내비게이션 — `.ggc-in-page-nav`

긴 문서(검토보고서 · 안내 페이지 · 조례 전문)의 절 목차. 본문 옆에 붙어(sticky) 스크롤에 따라 현재 절을 표시한다.
절이 3개 미만이면 두지 않는다.

## 마크업

```html
<div style="display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:var(--ggc-space-6)">
  <article class="ggc-prose">
    <h2 id="s1">Ⅰ. 제안 이유</h2> …
    <h2 id="s2">Ⅱ. 검토 의견</h2>
    <h3 id="s2-1">1. 상위법 정합성</h3> …
  </article>
  <nav class="ggc-in-page-nav" aria-label="이 페이지의 내용" data-ggc-in-page-nav>
    <p class="heading">이 페이지</p>
    <ul>
      <li><a href="#s1" aria-current="location">Ⅰ. 제안 이유</a></li>
      <li><a href="#s2">Ⅱ. 검토 의견</a>
        <ul><li><a href="#s2-1">1. 상위법 정합성</a></li></ul>
      </li>
    </ul>
  </nav>
</div>
```

대민 화면에서는 `.ggc-public-main--side` 의 사이드 슬롯에 둔다([guides/public-shell.md](../guides/public-shell.md)).

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 현재 절 | `a[aria-current="location"]` — 색 + 왼쪽 띠 + 굵기. JS 가 옮긴다(없으면 마크업 값 그대로) |
| 2단 | 중첩 `ul` — `h3` 급. 3단은 두지 않는다 |
| ≤1024px | sticky 해제, 본문 위 가로 칩 목록(2단은 숨김) |

## 동작 (`data-ggc-in-page-nav`)

스크롤마다(rAF 스로틀) 뷰포트 위 25% 기준선을 **지난 마지막 제목**을 현재로 표시한다 — 제목이 띠에 걸린 순간만 보는
방식은 제목 사이 긴 본문에서 갱신을 건너뛴다(실측). 앵커 이동 뒤에도 같은 계산이 맞는 절을 고른다.
`scroll-behavior` 는 CSS 가 정한다(`prefers-reduced-motion` 에서 즉시 이동).

## 규칙

- 링크 대상은 **실제 제목 요소의 id** 다. 본문 제목과 목차 문구를 같게 유지한다.
- `nav` 에 `aria-label` 을 둔다 — 대민 셸의 다른 `nav`(주 메뉴 · 사이드 내비)와 구분된다.
- 절 8개를 넘기면 2단을 접거나 문서를 나눈다.

## 프로필

글자 13px 고정. 대민에서도 같다.

## Tier 2

없음 — 마크업 그대로 + `GGC.initInPageNav()` 또는 같은 IntersectionObserver.

## 근거

KRDS `in_page_navigation` · §34.
