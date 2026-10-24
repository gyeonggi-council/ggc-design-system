# 진행 막대 — `.ggc-progress`

**센 값이 있을 때만** 쓰는 막대다 — 「6건 중 4건」 「12쪽 중 5쪽」 「3 / 6 작성」. 네이티브 `<progress>` 를 그린다.
값을 모르면 막대를 두지 않고 스피너([spinner.md](spinner.md))를 쓴다.
혼자보다 긴 작업([job.md](job.md)) · 1인 링크 바닥 띠([solo.md](solo.md)) · 문서 보기 불러오는 중([viewer.md](viewer.md)) 안에서 쓴다.
언제 무엇을 쓰는지는 [guides/states.md](../guides/states.md) §1.

## 마크업

```html
<!-- 같은 값을 글자로 곁에 둔다 — 막대만으로 양을 전하지 않는다 -->
<span class="step">6건 중 4건</span>
<progress class="ggc-progress" max="6" value="4" aria-label="합본에 넣은 보고"></progress>
```

값이 바뀌면 `value` 속성(또는 `el.value = 5`)만 바꾼다. 폭을 `style` 로 넣지 않는다.

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 값 | `max` = 전체 개수 · `value` = 끝낸 개수. 서비스가 센 값을 그대로 넣는다 |
| 값을 모른다 | 막대를 두지 않는다(`value` 없는 `<progress>` 도) — `.ggc-spinner` |
| 셀 수 없는 구간에 들어갔다 | 막대를 거두고 글자로 — 「마무리하는 중 · 경과 3분 12초」(갤러리 workbench) |
| 모양 | 변형 없음. 높이 `--ggc-space-2` · 모서리 `--ggc-radius-sm` · 바탕 `--ggc-primary-light-strong` · 채움 `--ggc-primary` |

## 키보드 · ARIA

- `<progress>` 는 브라우저가 진행 막대 역할(progressbar)과 현재 값을 준다.
- `aria-label` 로 **무엇을 세는지** 이름을 붙인다. 「진행」 이 아니라 「합본에 넣은 보고」 「작성한 칸」.
- 초점을 받지 않는다. 단계가 바뀐 것은 긴 작업의 `.now`(`role="status"`)가 알린다.
- 같은 값을 글자로 곁에 둔다. 색 막대만으로 양을 전하지 않는다.
- 고대비(`forced-colors`)에서는 테두리 `CanvasText` · 채움 `Highlight`(§44).

## 왜 `<progress>` 인가

`<div role="progressbar" style="width:…">` 를 쓰지 않는다. 폭을 `style` 속성으로 넣어야 하는데,
eGovFrame CSP(unsafe-inline 금지)가 `style` 속성을 막는다.
`<progress>` 는 `value` 속성만으로 그려진다. CSP 에 걸리지 않고, 역할과 값도 브라우저가 준다.

## 프로필

치수 차이 없음 — 높이가 간격 토큰(`--ggc-space-2`)이라 프로필이 바꾸지 않는다.

## 규칙

- **센 값이 있을 때만.** 끝낸 개수와 전체 개수를 서비스가 알 때 쓴다.
- **단계 수를 %로 바꾸지 않는다.** 「2/4단계」 를 반쯤 찬 막대로 그리지 않는다. 단계마다 걸리는 시간이 달라 막대가 실제와 어긋난다. 단계는 글자(`.ggc-job .step`)로 쓴다.
- **값을 모르면 스피너.** 시간으로 지어낸 진행률은 끝 근처에서 멈춰 "멈췄다" · "깨졌다"는 오해를 만든다.
- **레코드 처리 상태(접수 → 심사)를 막대로 그리지 않는다** — 배지 하나([덜어내기 R4](../guides/less.md)).

## Tier 2

`progress`(shadcn). 규칙은 같다 — 센 값일 때만.

## 근거

- 네 서비스가 각자 막대를 그렸다(tsv 근거 열): sign · survey · lira · 자막 추출. 정본 §38.
- 사용자 말 — "한참 후에 보이다 보니까 깨진 듯한 느낌…프로그레스 바"(서명, 10-24) · "몇 개까지 입력을 했다던가 확인도"(서명, 10-01).
- Primer UI patterns [loading](https://primer.style/product/ui-patterns/loading/) · Codex 교차 검토 "단계 수를 %로 바꾸지 말 것"([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md)).
