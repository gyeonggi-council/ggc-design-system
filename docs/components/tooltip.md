# 툴팁 — `.ggc-tooltip-wrap` · `.ggc-tooltip`

**보조 설명**에만 쓴다 — 아이콘 버튼의 이름 풀이, 약어, 잘린 값의 전체. 툴팁에만 있는 정보는 없는 정보다
(터치 · 스크린리더 · hover 못 하는 사용자). 필수 내용은 화면에 적는다.

## 마크업

```html
<span class="ggc-tooltip-wrap">
  <button class="ggc-icon-btn" type="button" aria-label="회부" aria-describedby="tt1">…</button>
  <span class="ggc-tooltip" role="tooltip" id="tt1">소관위원회로 회부한다 — 30일 심사 기한이 시작된다</span>
</span>

<!-- 약어 -->
<span class="ggc-tooltip-wrap">
  <abbr tabindex="0" aria-describedby="tt2">KWCAG</abbr>
  <span class="ggc-tooltip ggc-tooltip--start" role="tooltip" id="tt2">한국형 웹 콘텐츠 접근성 지침 2.2</span>
</span>
```

트리거를 감싸고 툴팁은 **형제**로 둔다. 트리거가 포커스를 못 받는 요소면 `tabindex="0"` 을 준다.

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 위치 | 기본 위 · `--bottom` · `--start`(왼쪽 정렬) · `--end`(오른쪽 정렬). 좁은 폭에서 잘리면 `--bottom` |
| 보임 | `:hover` · `:focus-within` — CSS 만. JS 없이도 동작한다 |
| 닫기 | `Esc` (`ggc-behaviors.js`) — 떠나면 다시 보인다 |

## 키보드 · ARIA

`role="tooltip"` + 트리거의 `aria-describedby`. 트리거의 접근 가능한 이름이 이미 툴팁과 같으면(`aria-label="회부"` 와 툴팁 "회부")
`aria-describedby` 를 두지 않는다 — 두 번 읽는다. `Esc` 로 닫힌다(WCAG 1.4.13 dismissable) · 툴팁 위로 마우스를 옮겨도 닫히지 않는다(hoverable) ·
hover/focus 가 유지되는 동안 보인다(persistent).

## 규칙

- 툴팁에 링크 · 버튼을 넣지 않는다(`pointer-events:none`). 상호작용이 필요하면 팝오버나 모달이다.
- 두 줄을 넘기지 않는다(최대 260px). 길면 화면에 적는다.
- `overflow:auto` 컨테이너(`.ggc-table-wrap`) 안에서는 잘린다 — `--bottom` 이나 셀 밖 배치.
- 지연 없이 보인다. 지연을 두면 사용자는 툴팁이 없다고 판단한다.

## 프로필

글자 12.5px 고정. 대민에서도 같다.

## Tier 2

`tooltip` (Phase 9b) — Radix Tooltip.

## 근거

KRDS `tooltip` · WCAG 1.4.13 · §33.
