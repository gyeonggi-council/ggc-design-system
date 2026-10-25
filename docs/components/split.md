# 좌우 두 칸 작업대 — `.ggc-split`

왼쪽 목록에서 고르고 오른쪽에서 문서를 보는 두 칸이다. [덜어내기 R9](../guides/less.md)(함께 대조하는 자료는 함께 보이게)의 구현이다.
경계를 끌거나 키보드로 폭을 바꾸고, 바꾼 폭을 기억한다. 좁은 화면에서는 한 칸씩 보인다.
실물: 갤러리 [workbench](../../design/examples/workbench.html).

## 마크업

```html
<div class="ggc-split" data-ggc-split="weekly-compile">
  <section class="ggc-split-list" id="sp-list" aria-labelledby="sp-list-h">
    <h2 id="sp-list-h">3주차 보고 6건</h2>
    <ul>
      <li><button type="button" aria-current="true" data-ggc-split-show="view">2025년 하반기 만족도 조사 결과</button></li>
      …
    </ul>
  </section>
  <div class="ggc-split-handle" role="separator" aria-orientation="vertical"
       aria-controls="sp-list" aria-label="목록 폭"></div>
  <section class="ggc-split-view" aria-labelledby="sp-view-h">
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm ggc-split-back" type="button" data-ggc-split-show="list">
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-chevron-left"/></svg>목록으로</button>
    <h2 id="sp-view-h">2025년 하반기 만족도 조사 결과</h2>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-split-step="-80">목록 좁게</button>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-split-step="80">목록 넓게</button>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-split-toggle
            aria-controls="sp-list" aria-expanded="true"><svg class="ggc-icon" aria-hidden="true"><use href="#i-panel-left"/></svg>목록 접기</button>
    …문서 보기(.ggc-viewer)…
  </section>
</div>
```

`data-ggc-split` 의 값은 폭을 기억하는 이름이다(`localStorage` 키 `ggc-split:이름`). 화면마다 다르게 준다.

| 부분 | 무엇 | 필수 |
|---|---|---|
| `.ggc-split-list` | 왼쪽 목록 칸. 자기 안에서 스크롤 | 필수 |
| `.ggc-split-handle` | 경계. `role="separator"` · 끌기 · 키보드 | 필수 |
| `.ggc-split-view` | 오른쪽 보기 칸. 자기 안에서 스크롤 | 필수 |
| `.ggc-split-back` | 「목록으로」. 좁은 화면의 보기 칸에서만 보인다 | 필수 |
| `[data-ggc-split-step]` | 「목록 좁게 · 넓게」 — 끌기를 한 번 누르기로 대신한다 | 선택. 없으면 폭 바꾸기가 끌기 · 키보드뿐이라 WCAG 2.5.7 을 못 맞춘다 — 두기를 권한다 |
| `[data-ggc-split-toggle]` | 「목록 접기」. 넓은 화면에서 목록을 접고 편다 | 선택 |

## 폭

| 값 | 얼마 | 원천 |
|---|---|---|
| 기본 | 400 | `--ggc-split-w` = `--ggc-space-11` × 5 |
| 최소 | 240 | `--ggc-space-11` × 3 |
| 최대 | 560 과 칸 전체의 45% 중 작은 값 | `min(--ggc-space-11 × 7, 45%)` |
| 남는 폭 | 오른쪽 보기 칸 | 큰 모니터에서 늘어나는 것은 보기 칸이다 |

- 바꾼 폭은 `style` 속성이 아니라 CSSOM(`style.setProperty('--ggc-split-w', …)`)으로 넣는다. CSP 에 걸리지 않는다.
- 범위를 넘는 값은 CSS `clamp` 가 막는다.

## 동작 (`ggc-behaviors.js` ⑮)

| 입력 | 결과 |
|---|---|
| 경계 끌기 | 폭을 바꾼다. 끄는 동안 덮개를 깔아 오른쪽 `iframe` 이 포인터를 가져가지 않게 한다. 놓으면 기억한다 |
| `←` / `→`(경계에 초점) | 목록 폭을 10 줄이거나 늘린다 |
| `Shift` + `←` / `→` | 50씩 |
| `Home` / `End` | 최소 / 최대 |
| `Enter` | 목록 접기 — **다시 펼 단추 `[data-ggc-split-toggle]` 이 있을 때만.** 접으면 경계가 사라지므로 초점을 그 단추로 옮긴다 |
| 경계 더블클릭 | 기본 폭으로. 기억도 지운다 |
| 「목록 좁게 · 넓게」 | `data-ggc-split-step` 값(±80)만큼 |
| 「목록 접기」 | 접기 · 펴기. `aria-expanded` 를 바꾼다 |

경계의 `aria-valuemin` · `aria-valuemax` · `aria-valuenow`(지금 목록 폭)는 behaviors 가 채운다.

**기억** — **폭만** `localStorage` 에 기억한다. 다시 열어도 같은 폭이다.
**접힘은 기억하지 않는다** — 다음에 열었을 때 목록이 사라져 있지 않게(R9).

## 오른쪽 제목 = 왼쪽에서 고른 것

- 오른쪽 칸 제목은 늘 왼쪽에서 고른 항목의 이름이다. 고른 행에 `aria-current="true"`.
- 고른 것과 보이는 것이 어긋나면 사용자는 무엇을 보고 있는지 모른다.
- 새 항목을 고르면 제목과 문서를 함께 바꾼다. 문서를 불러오는 동안 이전 문서를 새 제목 아래 두지 않는다(viewer 를 `loading` 으로).

## 좁은 화면 — 1100px 이하

- 한 칸씩 보인다 — `data-pane="list"` 또는 `"view"`. behaviors 가 처음에 `list` 로 둔다.
- 목록에서 항목을 누르면(`data-ggc-split-show="view"`) 보기 칸으로, 「목록으로」(`data-ggc-split-show="list"`)로 돌아온다.
- 칸을 바꾸면 **그 칸의 첫 제목(h1~h3)으로 초점**을 옮긴다. 제목이 없으면 칸 자체로.
- 목록으로 돌아오면 **목록의 스크롤 위치를 되살린다** — 숨겼다 보이면 스크롤이 지워지기 때문이다.
- 스크립트에서 칸을 바꿀 때: `GGC.splitShow(sp, 'view')` — 예: 주소로 특정 항목을 열 때.
- 경계와 「목록 접기」 는 숨는다.
- 스크립트가 없으면 두 칸이 위아래로 쌓인다. 깨지지 않는다.

## 높이 — 쓰는 쪽이 준다

`.ggc-split` 은 높이를 정하지 않는다. 두 칸이 따로 스크롤하려면 쓰는 쪽이 높이를 준다(예: 본문 안에서 `calc(100dvh - 머리 높이)`).
높이가 없으면 두 칸이 내용만큼 늘어나 페이지 전체가 스크롤된다.

## 첫 렌더 — 기억한 폭

기억한 폭은 behaviors 가 실행될 때 CSSOM 으로 넣는다. 그 전에는 기본 폭으로 그려진다.
그래서 `<script src="ggc-behaviors.js" defer>` 를 **`<head>` 에** 두기를 권한다.
첫 화면에서 목록 폭이 한 번 바뀌어 보이면 그 때문이다.

## 다른 두 칸과의 경계

| 무엇 | 언제 |
|---|---|
| `.ggc-split` | 목록에서 고르고 오른쪽에서 문서를 보는 작업대. 폭을 사용자가 바꾸고 기억한다(R9) |
| `.ggc-shell-main--split` | Converse(대화 + 출처 레일) 전용 본문 격자. 레일 폭은 고정 범위이고 끌기 · 기억이 없다([archetypes](../../skills/ggc-design/references/archetypes.md) Converse) |
| `.ggc-work-grid` | 업무 입력 + 참고 자료 두 영역. 좁은 화면에서 `.ggc-work-switch` 로 전환한다([work-layout.md](work-layout.md)) |

## 키보드 · ARIA

- 경계: `role="separator"` · `aria-orientation="vertical"` · `aria-controls`(목록 칸 id) · `aria-label="목록 폭"`. `tabindex="0"` 과 `aria-valuenow/min/max` 는 behaviors 가 붙인다 — 스크립트가 없으면 아무 일도 안 하는 탭 정지가 남지 않게. W3C APG window splitter 패턴.
- 「목록 접기」 는 `aria-expanded` · `aria-controls`.
- 고른 행은 `aria-current="true"`.
- 두 칸은 `<section>` + 제목(`aria-labelledby`).
- 고대비(`forced-colors`)에서 경계 선은 `CanvasText`, 초점 때 `Highlight`(§44). `prefers-contrast: more` 에서 선을 굵게 그린다.

## 프로필

업무 전용(tsv 프로필 열 `work`). 대민 화면에는 쓰지 않는다.

## 규칙

- 넓은 화면에서 목록과 문서를 함께 대조하는 일에 쓴다(R9).
- 오른쪽 제목은 왼쪽에서 고른 것이다.
- 폭은 기억하고 접힘은 기억하지 않는다.
- 끌기 대안 단추(「목록 좁게 · 넓게」)를 둔다.
- 좁은 화면에서 고른 항목과 읽던 위치를 지킨다.
- 높이는 쓰는 쪽이 준다.
- 큰 모니터의 남는 폭은 보기 칸에 준다.

## Tier 2

아직 없다 — React 판은 다음 PR([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md) 결정 3).

## 근거

- 두 곳이 각자 만들었다(tsv 근거 열): ttime `split-pane` · `compile-split`. 그리고 [덜어내기 R9](../guides/less.md). 정본 §43.
- 사용자 결정 — 주간보고 서무 · 총괄 취합 화면 「한 화면 좌우 두 칸」 승인(10-21).
- W3C APG [Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)(Enter = 접기) · WCAG 2.5.7 [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)(끌기 대안).
