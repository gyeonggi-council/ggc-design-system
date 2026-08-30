# 토스트 — `.ggc-toast-region` · `.ggc-toast`

**짧은 확인**에만 쓴다 — 저장됨, 복사됨, 발송됨, 보관함으로 옮김(+ 실행 취소). 읽고 판단해야 하는 내용
(오류 사유, 확인 질문)은 [alert.md](alert.md) 나 [modal.md](modal.md) 다. 토스트는 사라진다.

## 사용

```html
<!-- 문서에 하나, body 끝. 없으면 GGC.toast() 가 만든다 -->
<div class="ggc-toast-region" role="status" aria-live="polite" aria-label="알림"></div>

<!-- 선언형 — 버튼 하나면 충분할 때 -->
<button type="button" data-ggc-toast="임시저장됨" data-ggc-toast-desc="14:32 · 자동 저장" data-ggc-toast-variant="success">임시저장</button>
```

```js
GGC.toast({ title: "의안 3건을 보관함으로 옮겼다", action: { label: "실행 취소", onClick: restore } });
GGC.toast({ title: "발송하지 못했다", desc: "SMTP 421 · 14:35", variant: "danger", duration: 0 });   // 수동 닫기
```

만들어지는 DOM:

```html
<div class="ggc-toast ggc-toast--success">
  <span class="icon" aria-hidden="true">✓</span>
  <div class="body"><b class="title">임시저장됨</b><span class="desc">14:32 · 자동 저장</span></div>
  <button class="action" type="button">실행 취소</button>
  <button class="close" type="button" aria-label="닫기">✕</button>
</div>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 상태 | `variant`: `success` `warning` `danger` `info` — 왼쪽 띠 + 기호 + 아이콘 배경. 없으면 중립 |
| 시간 | 기본 5초 · `action` 이 있으면 8초 · `duration: 0` 은 수동 닫기 · 마우스/포커스가 있는 동안 정지 |
| 상한 | 3개 — 넘치면 가장 오래된 것을 닫는다 |
| 위치 | 오른쪽 아래 고정. ≤480px 은 가로 가득 |

## 키보드 · ARIA

영역이 `role="status" aria-live="polite"` 라 새 토스트를 스크린리더가 읽는다. 토스트 자체로 포커스를 옮기지 않는다 —
실행 취소는 `Tab` 으로 도달한다(그 동안 시계가 멈춘다). `Esc` 는 토스트를 닫지 않는다(모달과 구분).

## 규칙

- 오류를 토스트로만 알리지 않는다 — 5초 뒤 사라지면 사용자는 무엇이 실패했는지 모른다. 오류는 인라인 알림 + (선택) 토스트.
- 실행 취소가 가능한 파괴적 동작(보관 · 삭제)은 확인 모달 대신 **토스트 + 실행 취소**가 낫다 — 흐름을 끊지 않는다.
- 제목은 **완료형 사실**이다("저장됨"). 다음 행동을 지시하지 않는다.
- 하단 액션바가 있는 화면에서는 토스트가 액션바 위에 겹친다 — 액션바 버튼을 가리면 `desc` 를 줄인다.

## 프로필

글자 `--ggc-control-font`. 폭 400px 고정.

## Tier 2

`toast` — Radix Toast 대신 같은 DOM 을 만드는 훅.

## 근거

자체(KRDS 에 없다) · §25 · WCAG 2.2.1(시간 조절), 4.1.3(상태 메시지).
