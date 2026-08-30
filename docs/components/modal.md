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
