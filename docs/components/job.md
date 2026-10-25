# 긴 작업 진행 — `.ggc-job`

시스템이 **이 화면에서 3초 넘게 돌리는 작업 하나**를 보인다 — 합본 만들기 · 문서 변환 · 자막 추출 · AI 검토.
지금 단계 이름 · 경과 시간 · 진행 막대(센 값이 있을 때) · 중지(할 수 있을 때) · 끝 상태를 한 상자에 담는다.
상태(`data-state`)는 서비스가 바꾼다. `ggc-behaviors.js` ⑪ 은 경과 시간 글자와 「오래 걸림」 표시만 맡는다.
실물: 갤러리 [workbench](../../design/examples/workbench.html) 「긴 작업 진행」.

## 먼저 — 쓰는 곳과 쓰지 않는 곳

| 보이려는 것 | 쓰는 것 |
|---|---|
| 사용자가 단계를 직접 오가는 입력 | `.ggc-wizard`([stepper.md](stepper.md)) |
| 레코드의 처리 상태(접수 → 심사 → 가결) | 배지 하나 `.ggc-badge` — 단계 막대 금지([덜어내기 R4](../guides/less.md)) |
| 1~3초 대기 | `.ggc-spinner`([spinner.md](spinner.md)) |
| 목록·표 자리를 불러오는 중 | `.ggc-skeleton`([skeleton.md](skeleton.md)) |
| 시스템이 3초 넘게 돌리는 작업 | **`.ggc-job`** |

## 시간 기준 — 기본값이다

실제 처리량과 서버가 일을 이어갈 수 있는지가 먼저다. 아래는 강제가 아니다([guides/states.md](../guides/states.md) §1).

| 걸리는 시간 | 보이는 것 |
|---|---|
| 1초 미만 | 그리지 않는다. 단, **누른 것은 바로 받고 단추를 잠가** 두 번 실행을 막는다 |
| 1~3초 | 스피너 |
| 3~10초 | `.ggc-job` — 지금 단계 · 경과 · 센 값이면 막대 |
| 10초 넘음 | 위 + 「창을 닫아도 작업은 계속됩니다」 — **서버가 실제로 이어갈 때만** |

## 마크업

```html
<div class="ggc-job" data-ggc-job data-state="running"
     data-ggc-job-start="2026-10-24T22:10:00+09:00" data-ggc-job-slow="60">
  <div class="head">
    <span class="ggc-spinner ggc-spinner--sm when-busy" aria-hidden="true"></span>
    <strong class="now" role="status">합본 한글 파일을 만드는 중</strong>
    <span class="step">6건 중 4건</span>
    <span class="elapsed">경과 <time>0초</time></span>
    <span class="actions when-running"><button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button">중지</button></span>
    <span class="ggc-badge ggc-badge--approved when-ended"><svg class="ggc-icon" aria-hidden="true"><use href="#i-circle-check"/></svg>완료</span>
  </div>
  <progress class="ggc-progress" max="6" value="4" aria-label="합본에 넣은 보고"></progress>
  <p class="slow">평소보다 오래 걸리고 있습니다. 창을 닫아도 작업은 계속됩니다.</p>
  <p class="msg"></p>
  <details class="steps"><summary>과정 보기</summary>
    <ol>
      <li data-state="done"><svg class="ggc-icon" aria-hidden="true"><use href="#i-circle-check"/></svg>보고 6건 모으기<time>4초</time></li>
      <li data-state="running" aria-current="step"><svg class="ggc-icon" aria-hidden="true"><use href="#i-loader-circle"/></svg>한글 서식에 채우기</li>
      <li data-state="pending"><svg class="ggc-icon" aria-hidden="true"><use href="#i-circle"/></svg>합본 미리보기 만들기</li>
    </ol>
  </details>
</div>
```

| 슬롯 | 무엇 | 필수 |
|---|---|---|
| `.now` | 지금 단계 이름(「…하는 중」). 끝나면 결과 한 줄 | 필수 |
| `.step` | 센 값(「6건 중 4건」) · 단계(「2/4단계」) · 대기 순서(「앞에 2건」) | 선택 |
| `.elapsed time` | 경과 시간 — behaviors 가 1초마다 고친다 | 선택 |
| `.ggc-progress` | 센 값이 있을 때만([progress.md](progress.md)) | 선택 |
| `.slow` | 오래 걸릴 때만 보인다(`data-slow`) | 선택 |
| `.msg` | 결과 · 실패 사유 · 다음에 할 일. 비면 숨는다 | 선택 |
| `.steps` | 접힌 과정(`<details>`). 단계마다 `data-state`, 지금 단계에 `aria-current="step"` | 선택 |

## 상태 — `data-state` 8종

서비스가 바꾼다. **연결이 끊겼다고 `failed` 로 두지 않고, 중지를 눌렀다고 `stopped` 로 두지 않는다.**

| 값 | 뜻 | 보이는 것 |
|---|---|---|
| `queued` | 차례를 기다린다 | 스피너 · 「앞에 2건」 · 중지 |
| `running` | 돌고 있다 | 스피너 · 경과 · 막대(센 값일 때) · 중지 |
| `stopping` | **중지 요청 중** — 중지 완료가 아니다 | 스피너 · 「지금 단계를 마치면 멈춥니다」 |
| `unknown` | **연결이 끊겨 확인할 수 없다** — 실패가 아니다 | 경고색 `.msg` 「작업은 서버에서 계속되고 있을 수 있습니다 — 다시 연결되면 상태를 다시 불러옵니다」 |
| `done` | 끝났다 | 끝 배지 · 결과 한 줄 |
| `failed` | 실패했다 | 끝 배지 · 위험색 `.msg`(사유 + 입력이 남았는지 + 다음에 할 일) |
| `partial` | 일부만 됐다 | 「12건 중 10건 완료 · 2건 실패」 + **실패분만 다시 하는 길** |
| `stopped` | 서버가 멈춤을 확인했다 | 끝 배지 |

상태에 따라 보이는 슬롯:

| 클래스 | 보이는 상태 | 쓰임 |
|---|---|---|
| `.when-busy` | `queued` · `running` · `stopping` | 스피너 |
| `.when-running` | `queued` · `running` | 중지 단추 — `stopping` 에서 숨어 두 번 누르지 않는다 |
| `.when-ended` | `done` · `failed` · `partial` · `stopped` | 끝 배지 — 글과 변형은 서비스가 바꿔 넣는다 |

`unknown` 에서는 셋 다 숨는다 — 돌고 있는지도, 끝났는지도 모르기 때문이다.
끝 배지 짝(갤러리 기준): 완료 `--approved` + `circle-check` · 실패 `--rejected` + `circle-x` · 일부 실패 `--pending` + `triangle-alert` · 중지됨 `--recess` + `circle-minus`.

## 변형

| 클래스 | 무엇 |
|---|---|
| (기본) | 테두리 상자 — 화면에 작업이 하나일 때 |
| `--compact` | 테두리·바탕 없이 위아래 여백만 — 목록 머리 · 작업대 칸 안(갤러리 workbench 왼쪽 칸) |

## 동작 (`ggc-behaviors.js` ⑪)

| 무엇 | 어떻게 |
|---|---|
| 경과 시간 | `queued` · `running` · `stopping` 인 `[data-ggc-job]` 의 `.elapsed time` 을 1초마다 「3분 12초」 꼴로 고친다 |
| 시작 시각 | `data-ggc-job-start`(ISO 시각, 서버가 준 값). 없으면 behaviors 가 처음 본 순간부터 센다 — 새로 고치면 0초부터 다시 센다 |
| 오래 걸림 | `data-ggc-job-slow`(초)를 넘으면 `data-slow` 를 붙인다 → `running` 일 때 `.slow` 가 보인다 |
| 상태 | 바꾸지 않는다. 서비스가 `data-state` 와 `.now` · `.msg` · 끝 배지 글을 바꾼다 |

동적으로 넣은 작업은 `GGC.initJobs(루트)` 또는 `GGC.init(루트)` 로 묶는다.

## 키보드 · ARIA

- **`.now` 하나만 `role="status"`** 다. 단계 이름이 바뀔 때 화면 낭독기가 한 번 읽는다.
- **경과 시간은 live 영역 밖**에 둔다 — 매초 읽히지 않게. `.elapsed` 를 `.now` 안에 넣지 않는다.
- 끝나면 `.now` 를 결과 한 줄(「합본을 만들었습니다」)로 바꾼다. 그것이 끝 알림이다.
- 스피너 · 단계 아이콘은 `aria-hidden`. 상태는 글이 말한다.
- 고대비(`forced-colors`)에서 `--compact` 는 아래 선(`CanvasText`)으로 가른다(§44).

## 프로필

자체 치수 차이 없음. 글자(`--ggc-text-*`)와 단추는 프로필을 따라 대민에서 커진다.

## 규칙

- **레코드 처리 단계에 쓰지 않는다.** 의안·보고가 어디까지 왔는지는 배지 하나다. 이것은 지금 돌고 있는 시스템 작업에만 쓴다.
- **진행률을 지어내지 않는다.** 막대는 센 값이 있을 때만. 「2/4단계」 를 %로 바꾸지 않는다. 셀 수 없는 마지막 단계에서는 막대를 거두고 「마무리하는 중 · 경과 3분 12초」.
- **중지 · 다시 시도 단추는 서비스가 실제로 할 수 있을 때만** 둔다. 중지를 누르면 `stopping` 을 거쳐, 서버가 멈춤을 확인한 뒤 `stopped`.
- **「창을 닫아도 계속됩니다」는 서버가 실제로 이어갈 때만** 쓴다.
- **끝을 토스트로만 알리지 않는다.** 결과는 이 상자(`.now` · `.msg` · 끝 배지)에 남긴다. 화면을 떠난 뒤 끝나면 레코드 배지와 알림함으로([guides/states.md](../guides/states.md) §7).
- **`partial` 은 숫자와 길을 함께** 준다 — 「12건 중 10건 완료 · 2건 실패」 + 실패분만 다시 하는 단추나 안내. 전부 다시 하게 하지 않는다.
- **`failed` 의 `.msg` 는 사유 + 입력이 남았는지 + 다음에 할 일** — 「문서 변환 서버가 응답하지 않았습니다. 입력한 내용은 그대로 있습니다 — 잠시 뒤 다시 시도하십시오.」
- **경과 시간은 소요 시간이다.** 상대 시각 금지(domain-language)와 부딪히지 않는다 — 「3시간 전」 같은 시점 표기가 아니다.
  다만 **시작 · 완료 시각(업무 근거)을 대신하지 않는다.** 근거가 필요한 작업은 끝난 뒤 절대 시각(「2026-10-24 22:41 완료」)을 남긴다.

## Tier 2

아직 없다 — React 판은 다음 PR([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md) 결정 3).

## 근거

- 서비스들이 각자 만들었다 — 지금 돌리는 작업의 진행 4곳: lira `ProgressCard` · 자막 `ClipJobsPanel` · elis · sign 완성본(ADR 0013 실측 — 처리 단계 배지까지 치면 6곳이지만 그것은 이 부품이 아니라 배지다). 정본 §39.
- 사용자 말 — "끝부분에서 계속 진행이 되지 않아서"(자막 추출, 10-23). 서버는 끝냈는데 화면이 「추출 중」 그대로였다.
- Primer UI patterns [loading](https://primer.style/product/ui-patterns/loading/) · [notification messaging](https://primer.style/product/ui-patterns/notification-messaging/) ·
  claude.ai 생각 중 표시 + 경과 시간 + 접힌 과정(2025-02) → `.elapsed` · `.steps`.
- Codex 교차 검토 — 중지 요청 중 · 상태 확인 불가를 실패와 가를 것 · 단계 수를 %로 바꾸지 말 것(ADR 0013).
