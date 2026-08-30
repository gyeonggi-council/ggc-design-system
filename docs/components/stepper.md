# 스텝퍼 · 위저드 — `.ggc-wizard` · `--vertical` · `.ggc-wizard-mini`

단계형 작성(Configure)의 진행 표시. 완료 = success ✓ · 현재 = primary + 포커스 링 · 대기 = 중립. **현재 단계는 색과 형태 둘 다**로.
세 형태가 같은 상태 어휘(`.is-done` · `.is-current` · 기본)를 쓴다.

## 마크업

```html
<div class="ggc-wizard">
  <div class="ggc-wizard-step is-done">
    <div class="track"><span class="line"></span><button class="dot" type="button">✓</button><span class="line"></span></div>
    <div class="meta"><div class="label">개요 설정</div><div class="sub">소크라테스식 문답</div></div>
  </div>
  <div class="ggc-wizard-step is-current" aria-current="step">
    <div class="track"><span class="line"></span><button class="dot" type="button">2</button><span class="line"></span></div>
    <div class="meta"><div class="label">조문 작성</div><div class="sub">본칙 8조 · 부칙 2조</div></div>
  </div>
  <div class="ggc-wizard-step">
    <div class="track"><span class="line"></span><button class="dot" type="button">3</button><span class="line"></span></div>
    <div class="meta"><div class="label">검토 · 제출</div></div>
  </div>
</div>

<!-- 카드 안 소형 (결재 이력 · 모바일) -->
<div class="ggc-wizard-mini">
  <span class="step is-done"><span class="dot"></span><span class="line"></span></span>
  <span class="step is-current"><span class="dot"></span><span class="line"></span></span>
  <span class="step"><span class="dot"></span><span class="line"></span></span>
  <span class="stage">2 / 3 · 조문 작성</span>
</div>
```

## 변형

| 클래스 | 언제 |
|---|---|
| (가로) | Configure 화면 상단. 단계 3~5 |
| `--vertical` | 결재 이력 · 좌측 레일 |
| `.ggc-wizard-mini` | 카드 안 · 모바일 — 도트 + "n / N · 단계명" |

## 규칙

- 완료한 단계의 `.dot` 은 버튼이다 — 돌아갈 수 있다. 대기 단계는 건너뛸 수 없으면 `disabled`.
- 단계 이동으로 입력을 잃게 하지 않는다 — 임시저장(`.ggc-actionbar`)이 있는 이유다.
- `aria-current="step"` 을 현재 단계에. 스텝퍼는 장식이 아니다.
- 대민 서식은 3단계(작성 → 확인 → 완료)가 기본. `.sub` 는 생략할 수 있다.

## Tier 2

`ggc-stepper` — `<Stepper><Step index state="done|current|todo" label sub /></Stepper>`.

## 근거

ggc-components.css §4 · 조례초안 작성 위저드.dc.html STEP PROGRESS 실측 · KRDS step_indicator.
