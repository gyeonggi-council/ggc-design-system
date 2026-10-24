# 서명 패드 — `.ggc-signature`

손가락이나 마우스로 서명을 받는 칸이다. 그리기 · 다시 쓰기 · 크기가 바뀌어도 획 보존까지가 정본이다.
내보내기(PNG 자르기 · 크기 상한 · 저장)는 서비스 몫이다. 휴대폰에서는 전체 화면 창([modal.md](modal.md) `--full`) 안에 둔다.
실물: 갤러리 [public/solo](../../design/examples/public/solo.html) 「서명하기」.

## 마크업

```html
<div class="ggc-signature" data-ggc-signature>
  <p class="alt" id="sg-alt">직접 서명하기 어려우신가요? 담당자(031-000-0000)에게 알려 주시면 다른 방법을 안내해 드립니다.</p>
  <div class="ggc-signature-pad">
    <canvas aria-label="서명 칸 — 손가락이나 마우스로 서명" aria-describedby="sg-alt"></canvas>
    <span class="ph" aria-hidden="true">여기에 서명해 주십시오</span>
  </div>
  <div class="tools">
    <span class="status" aria-live="polite"></span>
    <button class="ggc-btn ggc-btn--secondary ggc-btn--sm" type="button" data-ggc-signature-clear>
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-refresh-cw"/></svg>다시 쓰기</button>
  </div>
</div>
```

휴대폰 — 전체 화면 창 안에 둔다. 창 안에서는 패드가 남는 높이를 채운다(고정 비율을 푼다).

```html
<dialog class="ggc-modal ggc-modal--full" id="sign-m" aria-labelledby="sign-t">
  <div class="head"><h2 class="title" id="sign-t">서명</h2>
    <button class="close" type="button" data-ggc-modal-close aria-label="닫기"><svg class="ggc-icon" aria-hidden="true"><use href="#i-x"/></svg></button></div>
  <div class="body"> …위 .ggc-signature… </div>
  <div class="foot"><button class="ggc-btn ggc-btn--primary ggc-btn--lg ggc-btn--block" type="button" id="sign-ok" disabled>서명 넣기</button></div>
</dialog>
```

## 상태

behaviors 가 `data-state` 를 붙인다.

| `data-state` | 뜻 | 보이는 것 |
|---|---|---|
| `empty` | 아직 안 그렸다 | 점선 테두리 · 「여기에 서명해 주십시오」 |
| `inked` | 그렸다 | 실선 테두리 · 안내 글 숨김 · 상태 「서명을 입력했습니다 — 아직 제출되지 않았습니다」 |

- 점 하나(톡 누르기)로는 `inked` 가 되지 않는다. 선을 그어야 한다.
- 「아직 제출되지 않았습니다」 를 빼지 않는다. 그린 것과 보낸 것은 다른 사건이다.

## 동작 (`ggc-behaviors.js` ⑬)

| 무엇 | 어떻게 |
|---|---|
| 한 손가락 | 첫 포인터만 받는다. **두 번째 손가락은 무시한다.** 마우스는 왼쪽 단추만 |
| 획 끝 | `pointerup` · `pointercancel` · `lostpointercapture` 모두 획을 끝낸다 — 전화 · 알림이 끼어들어도 획이 매달리지 않는다 |
| 스크롤 | **패드 안 터치는 스크롤로 넘기지 않는다**(`touch-action: none` + 터치 기본 동작 막음) — 카톡이 위아래 끌기를 가져가지 않게. 페이지 전체의 확대 · 스크롤은 막지 않는다 |
| 크기 바뀜 | 주소창 · 키보드 · 회전으로 패드 크기가 바뀌면 획을 **같은 비율로 다시 그린다 — 지우지 않는다.** 가로 · 세로 중 작은 배율로 맞춰 찌그러뜨리지 않는다 |
| 잉크 색 | `canvas` 의 계산된 `color`(`--ggc-text-strong`). 스크립트에 색 리터럴이 없다 |
| 이벤트 | 획을 마칠 때와 다시 쓸 때 `ggc:signature` — `detail.canvas`(그 `<canvas>`) · `detail.empty`(`true` = 비었음) |
| 다시 쓰기 | `[data-ggc-signature-clear]` 단추, 또는 `GGC.signatureClear(el)` |

```js
sign.addEventListener('ggc:signature', function (e) {
  ok.disabled = e.detail.empty;   // 비었으면 「서명 넣기」 를 잠근다
});
```

## 내보내기 — 서비스 몫

PNG 로 자르기 · 크기 상한 · 서버 저장은 서비스가 `detail.canvas` 로 한다. 이때 **잉크 색을 고정해서 내보낸다.**

- 화면의 잉크 색은 계산된 색이다. 고대비 설정 · 브라우저 설정에 따라 바뀔 수 있다.
- 화면 색을 그대로 저장하면 흰 잉크(흰 종이에서 안 보이는 서명)가 될 수 있다.
- 내보낼 때 새 캔버스에 옮기고, 획의 모양(알파)만 살려 서비스가 정한 고정 색으로 다시 칠한다(`globalCompositeOperation = "source-in"` 뒤 채우기).

## 고대비

- `forced-color-adjust: none` 은 **`canvas` 에만** 건다(§44). 잉크가 검은 바탕에서 사라지거나 흰 잉크로 저장되지 않게 한다.
- 이 속성은 상속된다. 바깥(안내 글 · 단추)에 걸지 않는다 — 그것들은 고대비 설정을 따른다.
- `prefers-contrast: more` 에서는 패드 테두리를 진하게 그린다.

## 키보드 · ARIA

- 서명 자체는 키보드로 할 수 없다. 그래서 대안 안내가 필수다.
- 대안 안내(`.alt`)를 **패드 앞**에 늘 보이게 둔다. `canvas` 는 `aria-describedby` 로 그 안내를 잇는다 — 화면 낭독기 사용자가 패드에 닿기 전에 다른 길을 듣는다.
- `canvas` 에 `aria-label`(「서명 칸 — 손가락이나 마우스로 서명」).
- 상태 글 `.status` 는 `aria-live="polite"`.
- 다시 쓰기는 일반 단추라 키보드로 닿는다.

## 대안 안내 — 실제 있는 절차로

- 문구는 「직접 서명하기 어려우신가요? …」 로 시작하고 **실제로 있는 절차**(담당자 연락 · 방문 · 서면 제출 등)로 잇는다. 없는 절차를 적지 않는다.
- **이름 입력이 서명과 같다고 정본이 정하지 않는다.** 이름 입력으로 서명을 대신할 수 있는지(법적 효력)는 서비스와 담당 부서가 판단한다.

## 프로필

패드는 가로로 긴 고정 비율이고, 높이 하한은 `--ggc-space-11` × 2 다. 대민에서 글자 · 단추는 커지고 패드 비율은 같다.

## 규칙

- 대안 안내를 패드 **앞**에, 늘 보이게 둔다. 접거나 패드 뒤에 두지 않는다.
- 크기가 바뀌었다고 지우지 않는다. 서비스 코드에서 `resize` 때 캔버스를 다시 만들지 않는다 — 정본이 다시 그린다.
- 「서명 넣기」 같은 확정 단추는 `ggc:signature` 의 `empty` 로 잠그고 푼다.
- **되돌리기(undo)는 없다.** 실측한 서비스 중 쓰는 곳이 0곳이다. 다시 쓰기 하나다.
- 잉크 색을 고정해서 내보낸다(위).

## Tier 2

아직 없다 — React 판은 다음 PR([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md) 결정 3).

## 근거

- 세 서비스가 각자 만들었다(tsv 근거 열): award `SignaturePad` · attendance `signature-pad` · sign `s.js`. 정본 §41.
- 사용자 말 — "모바일에서…화면이 계속 흔들려 서명을 정상적으로 하기가 어렵네"(10-24, 10-01 에 고친 것이 재발)
  → 크기가 바뀌어도 획 보존 · 패드 안 터치를 스크롤로 넘기지 않음 · `100svh` 창.
- Codex 교차 검토 — 서명 획 보존(ADR 0013).
