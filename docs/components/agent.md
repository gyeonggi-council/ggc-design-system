# AI 작업 상태 — `.ggc-agent`

모델이 **지금 무엇을 하고 있고, 사람이 무엇을 해야 하나**를 한 상자로. Converse 화면([archetypes](../../skills/ggc-design/references/archetypes.md))과 AI 의정플랫폼의 기본 부품이다. 패밀리: [상태 보이기](../families/status.md). v4.0(ADR 0016).

## 마크업

```html
<div class="ggc-agent" data-state="tool" aria-live="polite">
  <div class="ggc-agent-head">
    <span class="icon"><span class="ggc-spinner ggc-spinner--sm" aria-hidden="true"></span></span>
    <span class="status">관련 조례를 찾고 있습니다</span>
    <span class="elapsed">7초</span>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button">중단</button>
  </div>
  <ul class="ggc-agent-steps">
    <li class="is-done">질문을 「주차장 설치 기준」으로 정리</li>
    <li class="is-current">경기도 조례 12건 · 상위법 2건 대조 중</li>
    <li>검토 의견 작성</li>
  </ul>
</div>
<div class="ggc-agent" data-state="waiting">
  <div class="ggc-agent-head"><span class="icon"><svg class="ggc-icon" aria-hidden="true"><use href="#i-circle-help"/></svg></span><span class="status">외부로 보내기 전에 확인이 필요합니다</span></div>
  <div class="ggc-agent-body"><p>검토보고서 초안을 <b>기획재정위원회 전문위원실</b>로 보냅니다. 보낸 뒤에는 되돌릴 수 없습니다.</p></div>
  <div class="ggc-agent-actions"><button class="ggc-btn ggc-btn--primary" type="button">보내기</button><button class="ggc-btn ggc-btn--secondary" type="button">미리보기</button><button class="ggc-btn ggc-btn--ghost" type="button">취소</button></div>
</div>
<div class="ggc-agent" data-state="done">
  <div class="ggc-agent-head"><span class="icon"><svg class="ggc-icon" aria-hidden="true"><use href="#i-circle-check"/></svg></span><span class="status">검토 의견을 작성했습니다</span><span class="elapsed">41초</span></div>
  <div class="ggc-agent-body"><p>…</p></div>
  <ul class="ggc-agent-sources" aria-label="출처"><li><a href="#"><svg aria-hidden="true"><use href="#i-file-text"/></svg>주차장 설치 및 관리 조례 제6조</a></li></ul>
</div>
```

## 상태 — `data-state`

| 값 | 언제 | 머리 아이콘 | 무엇이 보이나 |
|---|---|---|---|
| `thinking` | 질문을 읽고 계획하는 중 | `.ggc-spinner--sm` | 상태 문장 · (3초 넘으면) 경과 시간 · 중단 |
| `tool` | 자료 · 문서 · 시스템을 찾는 중 | 스피너 또는 `search` | + `.ggc-agent-steps`(한 일 · 지금 · 남은 일, 셋 안팎) |
| `streaming` | 답을 쓰는 중 | `sparkles` 또는 AI 아바타 | 본문이 자라고 끝에 커서. 중단 단추 |
| `waiting` | **사람이 눌러야 다음으로** — 외부 발송 · 결재 · 삭제 전 | `circle-help` | 잉크 테두리 + 낮은 그림자. 무엇이 일어나는지 한 문단 + 단추(주 1 · 보조 · 취소) |
| `done` | 끝 | `circle-check`(success) | 본문 · **출처 칩**(없으면 「출처 없음」) · 다음 행동 단추. 과정(`steps`)은 접힌다 |
| `error` | 못 함 | `circle-alert`(danger) | **사유 + 할 수 있는 일**(다시 시도 · 찾은 것으로 계속) |
| `stopped` | 사람이 중단 | `circle-x` | 지금까지 한 것 · 이어서 하기 |

`--inline` 은 대화 말풍선 안(테두리 · 여백 없음). 머리 아이콘 자리에 `.ggc-avatar--ai` 를 둘 수 있다.

## 키보드 · ARIA

- 진행 중인 상자는 `aria-live="polite"` — 상태 문장이 바뀌면 읽힌다. `error` 는 `role="alert"`.
- `waiting` 의 단추 묶음은 Tab 순서가 주 → 보조 → 취소. 주 단추는 화면에 하나(`.ggc-btn--primary`).
- 커서(`::after`)는 장식이라 읽히지 않는다. 경과 시간 · 중단 동작은 서비스 스크립트가 넣는다([job](job.md)의 ⑪ 과 같은 방식). 없어도 깨지지 않는다.

## 프로필

업무 전용(work). 대민 화면의 AI 답은 [prose](prose.md) 안에 출처 칩만 쓴다.

## 규칙

- **상태 문장은 사람이 읽는 말**로 — 「조례 12건을 찾고 있습니다」. 함수명 · 토큰 수 · 모델 이름은 적지 않는다.
- 3초를 넘으면 경과 시간, 30초를 넘으면 「오래 걸립니다 — 기다리지 않아도 됩니다」(=[job](job.md) 규칙). 1초 미만은 아무것도 보이지 않는다.
- **출처는 답 아래 칩**. 출처 없는 단정은 「출처 없음」을 적는다 — 덜어내기의 예외 대상(계약 §11).
- `waiting` 은 한 화면에 하나. 둘이 쌓이면 모달이 아니라 **순서대로** 보인다.
- 끝난 상자의 과정은 접는다. 다시 보려면 「과정 보기」 단추(서비스).
- 하지 말 것: 색만으로 상태 말하기 · 「생각 중…」 점 세 개만 띄우기 · 오류를 토스트로만 알리기 · 답 위에 상태 띠를 겹치기.

## Tier 2

없음(v4.0). Tier 1 마크업을 `ggc-prose` 와 조립하거나 Tier 1 클래스를 그대로 쓴다. `sonner` 로 상태를 알리지 않는다.

## 근거

Astryx `docs/design/agentic-states` · `system-states` · [states.md](../guides/states.md) 1·6 · 회의 실시간 자막 「연결 끊김」 상태 전환(operate.html) · ggc-components.css §47.
