# 아코디언 · 디스클로저 — `.ggc-accordion` · `.ggc-accordion-group`

네이티브 `<details>` 라 JS 가 0 이다. **정말 접어도 되는 내용**에만 쓴다 — FAQ, 고급 검색 조건, 근거 조문 전문.
필수 입력이나 오류를 접어 두지 않는다.

## 마크업

```html
<!-- 묶음 — 같은 name 이면 한 번에 하나만 열린다 -->
<div class="ggc-accordion-group">
  <details class="ggc-accordion" name="faq" open>
    <summary>의안은 누가 발의할 수 있는가 <span class="meta">「지방자치법」 제76조</span></summary>
    <div class="body">…</div>
  </details>
  <details class="ggc-accordion" name="faq">
    <summary>회부 후 심사 기한은</summary>
    <div class="body">…</div>
  </details>
</div>

<!-- 단독 디스클로저 -->
<details class="ggc-accordion">
  <summary>고급 검색 조건</summary>
  <div class="body">…</div>
</details>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 열림 | `open` 속성 — 브라우저가 관리한다. 첫 항목을 열어 둘지는 화면이 정한다 |
| 배타 | 같은 `name` — 브라우저가 하나만 연다(Chrome 120+ · Safari 17.2+ · Firefox 130+, 그 밖에서는 전부 독립) |
| 카드 안 | `--flush` — 테두리 없이 구분선만 |
| 부가 정보 | `summary` 안 `.meta`(오른쪽, 옅게) |

## 키보드 · ARIA

`summary` 가 포커스를 받고 `Enter`/`Space` 로 토글, 상태(펼침/접힘)를 브라우저가 읽는다. 별도 ARIA 를 붙이지 않는다 —
`role="button"` 이나 `aria-expanded` 를 덧붙이면 오히려 두 번 읽힌다. 화살표는 CSS 라 스크린리더가 읽지 않는다.

## 규칙

- `summary` 텍스트가 곧 접근 가능한 이름이다 — 비우거나 아이콘만 두지 않는다.
- 접힌 본문 안에 폼 오류가 있으면 **펼친 뒤** 포커스를 옮긴다(`details.open = true`).
- 한 묶음 10개를 넘기면 검색을 붙이거나 페이지를 나눈다.

## 프로필

summary 글자 `--ggc-control-font`(13.5 / 17). 패딩은 같다.

## Tier 2

`accordion` — Radix Accordion.

## 근거

KRDS `accordion` · `disclosure` · §26.
