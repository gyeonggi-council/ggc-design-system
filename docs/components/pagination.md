# 페이지네이션 — `.ggc-pagination`

목록(Explore)의 하단. **페이지네이션 없이 전량 렌더하지 않는다.** 기본 20건, 정렬 기본값은 최근 접수순.

## 마크업

```html
<nav class="ggc-pagination" aria-label="페이지">
  <span class="summary">총 147건 · 2 / 8쪽</span>
  <a class="nav" href="?page=1">← 이전</a>
  <ol class="pages">
    <li><a href="?page=1">1</a></li>
    <li><a href="?page=2" aria-current="page"><span class="ggc-sr">현재 페이지 </span>2</a></li>
    <li><a href="?page=3">3</a></li>
    <li><span class="gap" aria-hidden="true">…</span></li>
    <li><a href="?page=8">8</a></li>
  </ol>
  <a class="nav" href="?page=3">다음 →</a>
</nav>
```

첫 쪽에서 "이전" 은 `aria-disabled="true" tabindex="-1"` 로 둔다(링크를 없애지 않는다 — 자리가 흔들린다).

## 변형

| 클래스 | 무엇 |
|---|---|
| `--start` | 좌측 정렬 (표 하단 좌측 요약과 나란히) |
| `.summary` | "총 N건 · a / b쪽" — 좌측 보조. ≤480px 에서는 한 줄 위로 올라간다 |

## 키보드 · ARIA

전부 링크다. 현재 쪽은 `aria-current="page"` + 화면 밖 텍스트 "현재 페이지". 별도 스크립트 없음.
SPA 면 `<a>` 대신 `<button>` 을 써도 같은 클래스가 먹는다.

## 규칙

- 숫자는 `tabular-nums`. 쪽 수가 7개를 넘으면 생략(…)을 둔다.
- 페이지 크기 선택은 `.ggc-select--sm.ggc-select--inline` 으로 요약 옆에 둔다.

## 프로필

버튼 높이 `--ggc-control-h-sm`(업무 34 / 대민 40), 글자 `--ggc-control-font-sm`.

## Tier 2

`pagination`.

## 근거

KRDS `html/code/pagination.html` · archetypes Explore 슬롯 6.
