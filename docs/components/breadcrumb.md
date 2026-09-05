# 브레드크럼 — `.ggc-breadcrumb`

현재 경로. KRDS `breadcrumb` 구조 그대로 — `<nav aria-label="현재 경로">` 안의 `<ol>`.

## 마크업

```html
<nav class="ggc-breadcrumb" aria-label="현재 경로">
  <ol>
    <li><a href="/">홈</a></li>
    <li><a href="/legislation">입법지원</a></li>
    <li aria-current="page">조례 초안 작성</li>
  </ol>
</nav>
```

## 규칙

- **마지막 항목은 링크가 아니다** — `aria-current="page"` 텍스트다.
- 구분자(›)는 CSS 가 그린다. 마크업에 "/" 나 ">" 를 적으면 스크린리더가 읽는다.
- 첫 항목은 "홈". **업무 셸에서는 GNB 경로부(`.ggc-gnb-page`, [shell.md](shell.md)) 안이 기본**이다(v3.0, ADR 0010). 거기서는 줄바꿈하지 않고
  마지막 항목만 말줄임한다 — 마지막 항목은 **화면 이름**이고, 레코드명(의안명)은 본문 h1 이 전문을 갖는다. 홈(Monitor)은 경로가 없어 비운다.
- 본문이나 대민 화면에 둘 때는 줄바꿈된다(`flex-wrap`). 말줄임하지 않는다 — 의안명은 잘리면 다른 의안이 된다.
- 제목(`<h1>`)은 브레드크럼 옆이 아니라 본문 첫 줄이다([page-head.md](page-head.md)).

## 키보드 · ARIA

링크는 일반 링크다. 별도 동작 없음.

## 프로필

치수 차이 없음. 대민 화면에서도 같은 컴포넌트를 쓴다(KRDS 와 구조 동일).

## Tier 2

`@ggc/breadcrumb` (shadcn 공식 소스 + 테마) — 업무 셸에서는 `ShellHeader breadcrumb={<Breadcrumb>…</Breadcrumb>}` 로 넘긴다.

## 근거

KRDS `html/code/breadcrumb.html` · [ADR 0010](../decisions/0010-page-title-in-content.md).
