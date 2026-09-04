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
- 첫 항목은 "홈". **업무 셸에서는 GNB 제목부(`.ggc-gnb-page`, [shell.md](shell.md)) 안이 기본**이다(v2.1, ADR 0008). 거기서는 줄바꿈하지 않고 마지막 항목만 말줄임한다 — 마지막 항목은 **화면 이름**이고, 레코드명(의안명)은 h1 과 본문이 전문을 갖는다.
- 본문(셸 ⓐ 의 `.ggc-page-head`)이나 대민 화면(`.ggc-page-title`)에 둘 때는 줄바꿈된다(`flex-wrap`). 말줄임하지 않는다 — 의안명은 잘리면 다른 의안이 된다.

## 키보드 · ARIA

링크는 일반 링크다. 별도 동작 없음.

## 프로필

치수 차이 없음. 대민 화면에서도 같은 컴포넌트를 쓴다(KRDS 와 구조 동일).

## Tier 2

`breadcrumb` (shadcn 이름 그대로, GGC 테마).

## 근거

KRDS `html/code/breadcrumb.html` · archetypes "GNB 제목부" · ADR 0008.
