# 드롭다운 메뉴 — `.ggc-menu`

"더보기" 처럼 **동작 묶음**에 쓴다. 페이지 이동 묶음이면 그냥 링크 목록이다 — `role="menu"` 를 붙이지 않는다
(스크린리더가 "메뉴" 라 부르며 화살표 조작을 기대한다).

## 마크업

```html
<details class="ggc-menu">
  <summary class="ggc-btn ggc-btn--secondary ggc-btn--sm">더보기</summary>
  <ul class="list" role="menu" aria-label="의안 동작">
    <li role="none"><button role="menuitem" type="button">복사해 새 의안 작성 <span class="kbd">Ctrl+D</span></button></li>
    <li role="none"><button role="menuitem" type="button" disabled>회수 (권한 없음)</button></li>
    <li class="divider" role="separator"></li>
    <li role="none"><button role="menuitem" type="button" class="danger">삭제…</button></li>
  </ul>
</details>
```

`<details>` 라 JS 없이도 열리고 닫힌다. `summary` 에는 버튼 클래스를 그대로 쓴다 — 화살표는 CSS 가 붙인다.

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 정렬 | `--end` (오른쪽 정렬, 표 행 끝) · `--up` (위로 펼침, 하단 액션바 안) |
| 링크 항목 | `<a role="menuitem" href>` — 실행 뒤 이동 |
| 비활성 | `disabled` 또는 `aria-disabled="true"` — **이유를 텍스트에** |
| 묶음 제목 | `li.heading` (`role="none"`) |
| 파괴적 | `.danger` + 말줄임(…) — 확인 모달이 뒤따른다 |

## 키보드 · ARIA (`ggc-behaviors.js`)

열리면 첫 항목으로 포커스. `↑` `↓` 순환, `Home` `End`, `Esc` 와 바깥 클릭은 닫고 summary 로 복귀, `Tab` 은 닫고 다음으로.
항목을 실행하면 닫는다. `summary` 에 `aria-haspopup="menu"` · `aria-expanded` 를 JS 가 붙인다. 한 번에 하나만 열린다.

## 규칙

- 항목 7개를 넘기면 나눈다(`.divider`) — 넘으면 메뉴가 아니라 화면이다.
- 메뉴에서 **바로 삭제하지 않는다**. `.danger` 항목은 확인 모달([modal.md](modal.md) `--alert`)로 간다.
- 주 동작은 메뉴에 숨기지 않는다 — 버튼으로 둔다. 메뉴는 2차 동작이다.
- `overflow:auto` 컨테이너(`.ggc-table-wrap`) 안에서는 잘린다 — 마지막 열 메뉴는 `--end`, 행이 적으면 `--up`.

## 프로필

항목 글자 `--ggc-control-font-sm`, 높이 `--ggc-control-h-sm`.

## Tier 2

`dropdown-menu` — Radix DropdownMenu.

## 근거

shadcn `dropdown-menu` 의 역할 구조 · WAI-ARIA APG menu button · §29. KRDS 에는 없다.
