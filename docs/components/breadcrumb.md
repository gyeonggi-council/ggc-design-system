# 브레드크럼 — `.ggc-breadcrumb`

현재 경로. KRDS `breadcrumb` 구조 그대로 — `<nav aria-label="현재 경로">` 안의 `<ol>`.

## 마크업

```html
<nav class="ggc-breadcrumb" aria-label="현재 경로">
  <ol>
    <li><a href="/">홈</a></li>
    <li><a href="/legislation">입법지원</a></li>
    <li aria-current="page">경기도 청년 기본 조례 일부개정조례안</li>
  </ol>
</nav>
```

## 규칙

- **마지막 항목은 링크가 아니다** — `aria-current="page"` 텍스트다.
- 구분자(›)는 CSS 가 그린다. 마크업에 "/" 나 ">" 를 적으면 스크린리더가 읽는다.
- 첫 항목은 "홈". 페이지 헤더(`.ggc-page-head`) 안에 두는 것이 기본이고, 단독으로도 쓴다.
- 긴 제목은 줄바꿈된다(`flex-wrap`). 말줄임하지 않는다 — 의안명은 잘리면 다른 의안이 된다.

## 키보드 · ARIA

링크는 일반 링크다. 별도 동작 없음.

## 프로필

치수 차이 없음. 대민 화면에서도 같은 컴포넌트를 쓴다(KRDS 와 구조 동일).

## Tier 2

`breadcrumb` (shadcn 이름 그대로, GGC 테마).

## 근거

KRDS `html/code/breadcrumb.html` · archetypes 헤더 2형.
