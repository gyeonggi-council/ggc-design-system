# 문서 미리보기 틀 — `.ggc-viewer`

한글(HWP · HWPX) · PDF 문서를 **원본 모양으로** 보여 주는 틀이다.
틀은 도구 묶음 · 쪽 이동 · 배율 · 상태 · 안내를 맡는다. 쪽을 그리는 **렌더러는 서비스 몫**이다 — rhwp(SVG · 이미지) · `iframe` · pdf.js(`canvas`).
실물: 갤러리 [workbench](../../design/examples/workbench.html) 오른쪽 칸.

## 마크업

```html
<figure class="ggc-viewer" data-ggc-viewer data-state="ready">
  <div class="ggc-viewer-tools" role="group" aria-label="문서 도구">
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-viewer-page="prev"><svg class="ggc-icon" aria-hidden="true"><use href="#i-chevron-left"/></svg>이전 쪽</button>
    <span class="page"><output>1</output> / 12쪽</span>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-viewer-page="next">다음 쪽<svg class="ggc-icon" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-viewer-zoom="out" aria-label="작게"><svg class="ggc-icon" aria-hidden="true"><use href="#i-minus"/></svg></button>
    <output class="zoom" aria-live="polite">100%</output>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-viewer-zoom="in" aria-label="크게"><svg class="ggc-icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-viewer-zoom="fit" aria-pressed="true">폭 맞춤</button>
    <a class="ggc-btn ggc-btn--secondary ggc-btn--sm download" href="…/원본.hwpx" download><svg class="ggc-icon" aria-hidden="true"><use href="#i-download"/></svg>내려받기</a>
  </div>
  <div class="ggc-viewer-body" tabindex="0" role="region" aria-label="문서 쪽">
    <div class="ggc-viewer-pages">
      <div class="ggc-viewer-page"><!-- 렌더러가 넣는다: <img> · <svg> · <canvas> --></div>
      <div class="ggc-viewer-page"></div>   <!-- 아직 안 그린 쪽 — 자리만 잡는다 -->
    </div>
    <div class="ggc-viewer-state"><!-- 불러오는 중 · 일부만 · 실패 — 서비스가 채운다 --></div>
  </div>
  <figcaption class="ggc-viewer-note">글꼴이 달라 줄바꿈이 원본과 조금 다를 수 있습니다 · 정확한 모양은 내려받아 한글에서 확인하십시오.</figcaption>
</figure>
```

## 변형 — iframe 렌더러 `--frame`

```html
<figure class="ggc-viewer ggc-viewer--frame" data-ggc-viewer data-state="ready">
  <div class="ggc-viewer-tools" role="group" aria-label="문서 도구">
    <a class="ggc-btn ggc-btn--secondary ggc-btn--sm download" href="…" download><svg class="ggc-icon" aria-hidden="true"><use href="#i-download"/></svg>내려받기</a>
  </div>
  <div class="ggc-viewer-body">
    <iframe src="…" title="2025년 하반기 만족도 조사 결과 — 미리보기"></iframe>
  </div>
</figure>
```

- `iframe` 에 `title`(무슨 문서인지)을 단다.
- **바깥에서 `iframe` 안 렌더러에 명령(쪽 이동 · 배율)을 보낼 수 없으면 바깥 쪽 이동 · 배율 단추를 두지 않는다.** 눌러도 아무 일이 없는 단추가 된다. 내려받기는 둔다.
- 쪽 영역의 안쪽 여백이 없어 `iframe` 이 칸을 채운다.

## 틀이 하는 일 · 렌더러가 넘길 것

틀(`ggc-behaviors.js` ⑭)이 하는 일:

| 무엇 | 어떻게 |
|---|---|
| 도구 묶음 | 쪽 · 배율 · 폭 맞춤 · 내려받기를 한 줄에. 좁으면 줄을 나눈다 |
| 쪽 이동 | 「이전 쪽 · 다음 쪽」 이 쪽 영역을 그 쪽 머리로 스크롤한다 |
| 배율 | 50~300%, 25%씩. 바뀐 값을 `output.zoom` 에 쓴다 |
| 폭 맞춤 | 100% 로 돌린다. 100% 일 때 `aria-pressed="true"` |
| 지금 쪽 | 스크롤할 때 쪽 영역 위쪽 4분의 1 선을 지난 마지막 쪽을 `<output>` 에 쓴다. 끝까지 내리면 마지막 쪽 |
| 상태 | `ready` · `partial` 이 아니면 쪽 · 배율 단추를 끈다. **내려받기는 늘 살아 있다** |

렌더러(서비스)가 넘길 것:

| 무엇 | 어디로 |
|---|---|
| 전체 쪽 | `.page` 의 「/ 12쪽」 글자. 쪽마다 빈 `.ggc-viewer-page` 를 먼저 만들어 자리를 잡는다 |
| 현재 쪽 | 틀 안에 그리면 틀이 센다. `iframe` 처럼 틀이 볼 수 없으면 렌더러가 `<output>` 에 넣는다 |
| 쪽 비율 | `--ggc-viewer-page-ratio`(가로 문서 등) — 아직 안 그린 쪽의 자리 크기. 없으면 A4 세로. CSSOM 으로 넣는다(`style.setProperty`) |
| 경고 | 원본과 다를 수 있는 까닭 → `.ggc-viewer-note`(아래 「안내 조건」) |
| 원본 식별자 | 내려받기 `href` · 파일 이름. 미리보기가 어느 원본(어느 판)으로 만든 것인지 |
| 배율 반영 | `ggc:viewer-zoom` 이벤트(`detail.zoom`)를 받아 `canvas` 렌더러는 다시 그린다. 이미지 · SVG 는 `--ggc-viewer-zoom` 으로 폭만 바뀐다 |

## 상태 — `data-state`

| 값 | 뜻 | `.ggc-viewer-state` 에 넣을 것 |
|---|---|---|
| `loading` | 불러오는 중. 쪽 영역은 숨는다 | 단계 글(「쪽을 그리는 중 · 1 / 3」) + 센 값이면 `.ggc-progress`, 모르면 스피너 |
| `ready` | 다 보인다 | (숨는다) |
| `partial` | 일부만 보인다. 쪽 아래에 안내 | **까닭을 가른다** — 아래 표 |
| `failed` | 못 그렸다. 쪽 영역은 숨는다 | 오류 빈 화면 `.ggc-empty--error` + 다시 시도 + 내려받기 |

`partial` 의 두 경우:

| 까닭 | 안내 |
|---|---|
| 의도한 앞쪽 미리보기 | `.ggc-alert--info` 「앞 2쪽만 보입니다 — 나머지는 내려받아 확인하십시오」 |
| 렌더 실패 | 「12쪽 중 5쪽 표시됨」 + 나머지 다시 시도 |

실패 예: 「문서를 그리지 못했습니다 — 내려받아 한글에서 열 수 있습니다」 + [다시 시도] [내려받기].

## 「원본과 다를 수 있음」 안내 — 조건이 있을 때만

`.ggc-viewer-note` 는 아래 조건일 때만 둔다. **감지한 문제를 구체적으로** 쓴다 — 「표시가 다를 수 있습니다」 한 줄로 뭉뚱그리지 않는다.

| 조건 | 문구 예 |
|---|---|
| 글꼴 대체 | 「글꼴이 달라 줄바꿈이 원본과 조금 다를 수 있습니다」 |
| 표 · 도형 · 필드 · 쪽나눔 미지원 | 「글상자 2개를 표시하지 못했습니다」 |
| 일부 쪽 실패 | 「12쪽 중 5쪽만 표시했습니다」 |
| 이전 원본으로 만든 미리보기 | 「10-22 16:40 판으로 만든 미리보기입니다 — 그 뒤 고친 내용은 내려받아 확인하십시오」 |

- 끝에 확인 방법을 붙인다 — 「정확한 모양은 내려받아 한글에서 확인하십시오」.
- **보이는 그림이 곧 제출되는 결과물이면 두지 않는다**(예: 서비스가 만든 PDF 를 그대로 보여 주고 그 PDF 를 제출할 때).
- 문제가 없는데 늘 띄우지 않는다([덜어내기 R2](../guides/less.md)).

## 크게 보기

목록 옆 칸에서 작게 보다가 크게 볼 때는 `.ggc-modal--full`([modal.md](modal.md)) 안에 **두 번째 viewer** 를 둔다.
창 안에서 viewer 는 남는 높이를 채우고 테두리를 없앤다.
창 안 쪽 영역은 `touch-action: pan-x pan-y` 다 — 두 손가락 확대가 「닫기」 를 화면 밖으로 밀지 않게. 배율은 도구 단추로 바꾼다.

## 모양

- 종이(`.ggc-viewer-page`)에 **그림자가 없다.** 작업면(`--ggc-surface-inset`) 위에 테두리로 가른다.
- 쪽 영역은 자기 안에서만 스크롤한다(`overscroll-behavior: contain` — 끝에서 바깥 페이지를 끌지 않는다).

## 키보드 · ARIA

- 도구 묶음은 `role="group"` + `aria-label="문서 도구"`.
- 쪽 영역은 `tabindex="0"` · `role="region"` · `aria-label` — 키보드로 초점을 두고 화살표 · PageDown 으로 스크롤한다.
- 배율 글자 `output.zoom` 은 `aria-live="polite"` 로 바뀐 배율을 읽는다. 아이콘만 있는 작게 · 크게 단추는 `aria-label`.
- 폭 맞춤은 `aria-pressed`.
- `iframe` 에 `title`.
- 고대비(`forced-colors`)에서 쪽 그림(`img` · `svg` · `canvas`)은 `forced-color-adjust: none` — 원본 색 그대로 보인다(§44).

## 프로필

치수 차이 없음. 도구 단추 · 글자는 각자 프로필을 따른다.

## 규칙

- 렌더러를 정본에 넣지 않는다. 서비스마다 다르다.
- 내려받기를 늘 둔다. 실패 · 일부만일 때의 대안이다.
- 바깥 단추가 `iframe` 렌더러에 닿지 않으면 그 단추를 두지 않는다.
- 일부만 보일 때 의도한 미리보기인지 실패인지 가른다.
- 「원본과 다를 수 있음」 은 조건이 있을 때만, 감지한 문제를 구체적으로.
- 문서 서식이 판단 대상이면 글자만 뽑아 보여 주지 않는다 — 실제 문서 모양([덜어내기 R9](../guides/less.md)).

## Tier 2

아직 없다 — React 판은 다음 PR([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md) 결정 3).

## 근거

- 여섯 서비스가 각자 만들었다(tsv 근거 열): lira · ttime · award · sign · attendance · bims2 미리보기. 정본 §42.
- 사용자 말 — "hwpx 문서에서 보여지는 것처럼 보여줘".
- Primer UI patterns [degraded experiences](https://primer.style/product/ui-patterns/degraded-experiences/) — 되는 부분은 그리고, 안 되는 부분을 지워진 것처럼 보이지 않는다(`partial`).
