# 동작 — `design/ggc-behaviors.js`

Tier 1 컴포넌트의 상호작용 전부가 이 파일 하나다. 하는 일은 **마크업의 ARIA 상태를 옮기는 것**뿐이고 CSS 가 그 상태를 보고 그린다 —
그래서 이 파일이 없어도 화면은 깨지지 않는다(동작만 없다). 외부 파일 1개 · 인라인 0 · 의존성 0 · eGovFrame CSP 에서도 붙는다.
Tier 2(React)는 이 파일 대신 Radix 가 같은 동작을 준다.

## 넣는 법

```html
<script src="ggc-behaviors.js" defer></script>
```

`defer` 라 DOM 이 준비되면 스스로 묶는다. **동적으로 삽입한 마크업**(SPA 라우팅 · AJAX 조각)은 `window.GGC.init(루트요소)` 로 다시 묶는다.
같은 요소를 두 번 묶지 않는다(내부 표식으로 막는다).

## 무엇을 하나

| 컴포넌트 | 마크업 훅 | 동작 |
|---|---|---|
| 탭 `.ggc-tabs` | `role="tablist"` / `role="tab"` `aria-controls` | 클릭·`←` `→` `Home` `End` 로 선택, `aria-selected` · `tabindex`(roving) · 패널 `hidden` 갱신, `ggc:tabchange` 이벤트 |
| 모달 `dialog.ggc-modal` | `data-ggc-modal-open="#id"` · `data-ggc-modal-close[="값"]` | `showModal()` · 첫 포커스(autofocus → 첫 입력 → 주 버튼 → 닫기) · 배경 클릭(확인형 제외) · 닫히면 오프너로 포커스 복귀 · `<html data-ggc-modal-active>` 스크롤 잠금 |
| LNB drawer (≤900) | `data-ggc-drawer-toggle` | `.ggc-lnb[data-open]` · `aria-expanded` · `Esc` · 바깥 클릭 |
| 대민 주 메뉴 (≤900) | `data-ggc-menu-toggle` · `data-ggc-submenu` | `.ggc-main-menu[data-open]` 패널 · 첫 요소 포커스 · `Esc`/닫기 → 토글로 복귀 · 2단 `aria-expanded`(한 번에 하나) |
| 대민 통합검색 | `data-ggc-search-toggle` | `.site-search[data-open]` + 입력 포커스 |

## 공개 API (`window.GGC`)

```js
GGC.init(root?)            // 탭·모달 다시 묶기
GGC.openModal("#id", opener?)  GGC.closeModal("#id", value?)
GGC.toggleDrawer()         GGC.toggleMenu()
```

## 규칙

- 트리거 속성과 상태 속성의 **이름을 나눈다** — `data-ggc-modal-open`(트리거) vs `data-ggc-modal-active`(`<html>` 상태). 같으면 `closest()` 가
  `<html>` 을 오프너로 잡는다(실제로 그랬다).
- 상태는 항상 ARIA 로 표현한다(`aria-selected` · `aria-expanded` · `hidden`). 클래스 토글(`is-open`)로만 표현하지 않는다 — 스크린리더가 못 읽는다.
- 확인형 모달(`.ggc-modal--alert` + `role="alertdialog"`)은 배경 클릭으로 닫지 않는다. 명시적 선택만 받는다.
- `prefers-reduced-motion` 은 CSS 가 처리한다. JS 는 애니메이션을 만들지 않는다.

## 검사

`check_design.py` D1 이 이 파일의 사본도 정본과 대조한다. 동작 검증은 스킬의 Phase 5 — 키보드 순회 · 포커스 복귀 · `Esc` · 390px 패널.
