# 모달 · 다이얼로그 — `.ggc-modal` (`<dialog>`)

네이티브 `<dialog>` 다. 포커스 가두기 · `Esc` · 배경 inert · 최상위 레이어를 브라우저가 준다.
KRDS `modal` 구조(제목 · 본문 · 버튼 행 · 닫기 · 배경)를 따랐다.

## 마크업

```html
<button class="ggc-btn ggc-btn--primary" type="button" data-ggc-modal-open="#m1">위원회 회부</button>

<dialog class="ggc-modal" id="m1" aria-labelledby="m1-t">
  <div class="head">
    <h2 class="title" id="m1-t">위원회 회부</h2>
    <button class="close" type="button" data-ggc-modal-close aria-label="닫기">✕</button>
  </div>
  <div class="body">
    <p>BILL-2026-0417 을 소관위원회에 회부한다.</p>
    <div class="ggc-field">…</div>
  </div>
  <div class="foot">
    <span class="left">회부 후 30일 심사 기한이 시작된다</span>
    <button class="ggc-btn ggc-btn--secondary" type="button" data-ggc-modal-close>취소</button>
    <button class="ggc-btn ggc-btn--primary" type="button" data-ggc-modal-close="refer">회부</button>
  </div>
</dialog>
```

## 변형

| 클래스 | 무엇 |
|---|---|
| `--sm` / `--lg` | 폭 420 / 800 (기본 560). ≤480px 는 전부 화면 가득 |
| `--alert` + `role="alertdialog"` | **확인형** — 반려·회수·삭제 같은 파괴적 동작. 배경 클릭으로 닫히지 않는다. `aria-describedby` 로 본문을 잇는다 |

## 동작 (`ggc-behaviors.js`)

| 무엇 | 어떻게 |
|---|---|
| 열기 | `data-ggc-modal-open="#id"` 클릭, 또는 `GGC.openModal("#id", 오프너)` |
| 닫기 | `data-ggc-modal-close[="값"]` 클릭 · `Esc` · 배경 클릭(확인형 제외) · `GGC.closeModal("#id")` |
| 첫 포커스 | `[autofocus]` → 본문 첫 입력 → 주 버튼 → 닫기 순 |
| 닫힌 뒤 | **열었던 버튼으로 포커스 복귀.** `dialog.returnValue` 에 닫기 값이 남는다 |
| 스크롤 잠금 | 열려 있는 동안 `<html data-ggc-modal-active>` → `overflow:hidden` |

스크립트 없이 쓰려면 `dialog.showModal()` / `dialog.close()` 를 직접 부른다. 마크업은 같다.

## 전체 화면 `--full` (v3.2)

휴대폰에서 한 가지 일에 화면 전체가 필요할 때 쓴다 — **서명 · 제출 전 확인 · 문서 크게 보기.**

```html
<dialog class="ggc-modal ggc-modal--full" id="sign-m" aria-labelledby="sign-t">
  <div class="head"><h2 class="title" id="sign-t">서명</h2>
    <button class="close" type="button" data-ggc-modal-close aria-label="닫기"><svg class="ggc-icon" aria-hidden="true"><use href="#i-x"/></svg></button></div>
  <div class="body"> …서명 패드 · 문서 보기… </div>
  <div class="foot"><button class="ggc-btn ggc-btn--primary ggc-btn--lg ggc-btn--block" type="button">서명 넣기</button></div>
</dialog>
```

- 높이는 `100svh`(주소창이 보일 때의 높이)다. `100dvh` 는 주소창이 오르내릴 때마다 바뀌어 카톡 인앱에서 흔들린다. 머리 · 바닥은 안전 영역(`env(safe-area-inset-*)`)만큼 비킨다.
- `.body` 가 남는 높이를 채운다. 안의 서명 패드([signature.md](signature.md)) · 문서 보기([viewer.md](viewer.md))가 그 높이를 쓴다.
- **뒤 문서를 고정한다.** `overflow:hidden` 만으로는 iOS · 카톡이 뒤 문서를 끌어 올린다. 그래서 behaviors 가 열 때 `<html data-ggc-modal-lock>` 을 붙이고 스크롤 위치를 `body` 의 `top` 으로 옮겨(CSSOM) 고정하고, 닫으면 풀고 그 위치로 되돌린다.
- 크게 보기는 창 안에 **두 번째 viewer** 를 둔다. 모달 안에 모달을 열지 않는 규칙은 같다.

## 규칙

- 제목은 `<h2>` + `aria-labelledby`. 제목 없는 모달을 만들지 않는다.
- 버튼 순서는 **취소(secondary) → 실행(primary)**. 파괴적 실행 버튼은 위험색 배경을 인라인으로 주지 말고
  확인형 모달 자체로 위험을 알린다(제목이 질문형: "…반려하는가").
- 모달 안에 모달을 열지 않는다. 긴 문서는 `--lg` 로 스크롤(본문만 스크롤된다).
- 모바일(≤480)에서는 화면 가득 + 버튼 세로 배치가 자동이다.

## 프로필

버튼·입력은 각자 프로필을 따른다. 모달 자체 치수는 같다.

## Tier 2

`dialog` · `alert-dialog` (Radix).

## 근거

KRDS `modal.html` · WAI-ARIA Dialog(Modal) 패턴 · archetypes Operate "파괴적 동작은 확인 단계".
