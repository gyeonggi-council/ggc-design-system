# 툴팁 — `.ggc-tooltip-wrap` · `.ggc-tooltip`

**보조 설명**에만 쓴다 — 아이콘 버튼의 이름 풀이, 약어, 잘린 값의 전체. 툴팁에만 있는 정보는 없는 정보다
(터치 · 스크린리더 · hover 못 하는 사용자). 필수 내용은 화면에 적는다.

| 옮길 것 | 부품 (v3.3, [ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md)) |
|---|---|
| 아이콘 단추 이름 · 약어 풀이 · 잘린 값 전체 | **툴팁** (마우스 · 초점) |
| 집계 기준 · 용어 설명 · 전 회기 대비 같은 보충 설명 | [토글팁](toggletip.md) (누르면 열림 — 휴대폰 · 화면낭독기 가능) |
| 한 건의 담당 · 소관 · 시각 · 장소 · 이력 요약 | [정보 서랍](sheet.md) |
| 상태 · 마감 · 오류 · 실행하면 일어나는 일 | 화면에 적는다 |

## 마크업

```html
<span class="ggc-tooltip-wrap">
  <button class="ggc-icon-btn" type="button" aria-label="위원회 회부">…</button>
  <span class="ggc-tooltip" role="tooltip" id="tt1" aria-hidden="true">위원회 회부</span>
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
| 머무르기 | 포인터를 툴팁 위로 옮겨도 보인다(v3.3 — 트리거와의 간격을 메웠다) |
| `--float` | 접힌 LNB 아이콘 줄 이름 전용. behaviors ③ 이 body 에 하나 두고 항목 오른쪽에 놓는다 — 서비스가 마크업에 쓰지 않는다 |

## 키보드 · ARIA

`role="tooltip"` + 트리거의 `aria-describedby`. 트리거의 접근 가능한 이름이 이미 툴팁과 같으면(`aria-label="회부"` 와 툴팁 "회부")
`aria-describedby` 를 두지 않는다 — 두 번 읽는다(위 첫 예처럼 툴팁은 `aria-hidden` 으로 눈에만). `Esc` 로 닫힌다(WCAG 1.4.13 dismissable) · 툴팁 위로 마우스를 옮겨도 닫히지 않는다(hoverable) ·
hover/focus 가 유지되는 동안 보인다(persistent).

## 규칙

- 툴팁에 링크 · 버튼을 넣지 않는다. 링크 하나가 필요하면 [토글팁](toggletip.md), 그 이상은 모달이다.
- 실행 결과(「회부하면 심사 기한이 시작된다」 같은 것)는 툴팁에 두지 않는다 — 확인 모달이나 단추 옆 문장이다.
- 두 줄을 넘기지 않는다(최대 260px). 길면 화면에 적는다.
- `overflow:auto` 컨테이너(`.ggc-table-wrap`) 안에서는 잘린다 — `--bottom` 이나 셀 밖 배치.
- 지연 없이 보인다. 지연을 두면 사용자는 툴팁이 없다고 판단한다.

## 프로필

글자 12.5px 고정. 대민에서도 같다.

## Tier 2

`tooltip` — Radix Tooltip.

## 근거

KRDS `tooltip` · WCAG 1.4.13 · §33.
