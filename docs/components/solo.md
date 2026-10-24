# 휴대폰 1인 링크 화면 — `.ggc-solo`

문자·카톡으로 받은 **개인 링크**를 휴대폰에서 열어 한 가지 일(서명 · 설문 · 신청 확인)을 하는 화면의 틀이다.
쓰는 사람은 로그인 없이 들어오는 외부위원 · 의원 · 서명 받는 분이다.
틀은 머리(기관명 · 글자 크게) · 본문(상태마다 한 구역) · 바닥 띠(진행 · 상태 · 주 단추) 셋이다. **흐름은 서비스가 정한다.**
실물: 갤러리 [public/solo](../../design/examples/public/solo.html).

## 셸 — 대민 프로필, 대민 셸은 생략

`<html data-ggc-profile="public">` 로 치수는 대민을 따른다. 마스트헤드 · 아이덴티파이어 · 공개 푸터는 두지 않는다 — [계약](../contract.md) §9 의 예외다.
링크 하나로 한 가지 일을 하러 온 화면에서 셸이 그 일을 밀어내기 때문이다.
근거는 의원 설문 의원 화면(2026-10-06 사용자 결정)과 서명 받는 분 화면이다. 기관명은 `.ggc-solo-head` 에 남긴다.

## 머리(`<head>`)

```html
<html lang="ko" data-ggc-profile="public">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="robots" content="noindex">
<meta name="referrer" content="no-referrer">
<title>서명 요청 — 경기도의회</title>
<link rel="stylesheet" href="ggc-tokens.css">
<link rel="stylesheet" href="ggc-components.css">
<link rel="stylesheet" href="ggc-public.css">
<script src="ggc-behaviors.js" defer></script>
```

| 무엇 | 왜 |
|---|---|
| `viewport-fit=cover` | 노치 · 홈 막대 자리까지 쓴다. 머리와 바닥 띠가 `env(safe-area-inset-*)` 만큼 비킨다 |
| `interactive-widget=resizes-content` | 키보드가 뜨면 레이아웃 높이가 줄어 바닥 띠가 키보드 위에 선다(이 값을 따르는 브라우저 — 안드로이드) |
| 확대를 막지 않는다 | `maximum-scale` · `user-scalable=no` 를 넣지 않는다(WCAG 1.4.4) |
| `noindex` | 검색에 개인 링크가 잡히지 않게 |
| `no-referrer` | 링크 주소가 다른 사이트로 새지 않게 |
| 토큰은 `#` 뒤 | `…/s#토큰` — 조각(fragment)은 서버 로그 · Referer 에 남지 않는다. 화면 스크립트가 읽어 API 에 보낸다 |
| 미리보기(OG) 문구 | 카톡이 링크 미리보기를 만든다. **이름 · 토큰을 넣지 않는다** — 「경기도의회 서명 요청」 정도 |

## 본문 마크업

```html
<div class="ggc-solo">
  <header class="ggc-solo-head">
    <span class="org">경기도의회</span>
    <button class="ggc-btn ggc-btn--ghost ggc-btn--sm" type="button" data-ggc-text-toggle aria-pressed="false" hidden>글자 크게</button>
  </header>

  <main class="ggc-solo-main" id="main">
    <!-- 열 수 없는 링크 -->
    <section hidden>
      <div class="ggc-empty ggc-empty--error">
        <span class="icon"><svg class="ggc-icon ggc-icon--lg" aria-hidden="true"><use href="#i-link"/></svg></span>
        <h1 class="title" tabindex="-1">이 링크를 열 수 없습니다</h1>
        <p class="desc">기한이 지났거나 주소가 잘렸습니다. 문자를 보낸 담당자(의정담당관 ○○○ · 031-000-0000)에게 새 링크를 요청하십시오.</p>
      </div>
    </section>
    <!-- 확인 + 작성 (한 화면) -->
    <section>
      <h1 tabindex="-1">위원회 자문 수당 지급 확인서</h1>
      …보낸 곳 · 기한 · 확인할 문서 · 입력 칸 · 서명하기…
    </section>
    <!-- 완료 -->
    <section hidden>…<h1 class="title" tabindex="-1">제출했습니다</h1>…</section>
  </main>

  <footer class="ggc-solo-bar">
    <div class="prog"><span>1 / 3 작성</span><progress class="ggc-progress" max="3" value="1" aria-label="작성한 칸"></progress></div>
    <p class="status" role="status"></p>
    <button class="ggc-btn ggc-btn--primary ggc-btn--lg ggc-btn--block" type="button">다음 칸<small>연락처</small></button>
  </footer>
</div>
```

## 상태 — 구역 하나씩

| 상태 | 보이는 것 |
|---|---|
| 불러오는 중 | `.ggc-spinner-block` 「링크를 확인하고 있습니다」 |
| 열 수 없는 링크 | `.ggc-empty--error` — 왜 못 여는지 + 누구에게 새 링크를 받는지 |
| 확인 | 보낸 곳 · 기한 · 입력할 것 · 확인할 문서 |
| 작성 | 입력 칸 · 서명 |
| 제출 중 | 주 단추를 잠그고 단추 안 스피너 + 「제출하는 중」 |
| 전송 실패 | 상태 칸에 「보내지 못했습니다 · 입력은 그대로 있습니다」 + 다시 보내기. **입력을 지우지 않는다** |
| 이미 제출함 | 언제 냈는지 · 고치려면 누구에게 연락하는지 |
| 완료 | 「제출했습니다」 + 시각 · 받은 곳 · 「이 창을 닫아도 됩니다」 |

- 상태마다 `<section hidden>` 하나. 한 번에 하나만 보인다. 확인과 작성은 한 구역이어도 된다.
- 상태가 바뀌면 **그 구역의 `h1`(`tabindex="-1"`)로 초점을 옮긴다** — 화면 낭독기가 새 상태를 읽고, 키보드가 위에서 다시 시작한다.
- 바닥 띠는 할 일이 있는 상태(확인 · 작성 · 제출 중 · 전송 실패)에만 둔다.
- 구역을 고르는 속성 이름은 서비스가 정한다(갤러리는 `data-sl`). 상태는 서버가 정한다.

## 높이 — `100svh`

`.ggc-solo` 는 `min-height: 100svh` 다. `100dvh` 는 주소창이 오르내릴 때마다 높이가 바뀌어 화면이 흔들린다.
`svh` 는 주소창이 보일 때의 높이(가장 작은 높이)라 흔들리지 않는다. 전체 화면 창도 같다([modal.md](modal.md) `--full`).

## 바닥 띠 — `.ggc-solo-bar`

| 칸 | 무엇 | 필수 |
|---|---|---|
| `.prog` | 진행 「1 / 3 작성」 + `.ggc-progress`. 칸이 여럿일 때만 | 선택 |
| `.status`(`role="status"`) | 저장 · 서명 · 전송 상태. **토스트 대신 여기**. 비면 숨는다 | 필수 |
| 주 단추 | 다음에 할 일. 남은 칸이 있으면 「다음 칸」 + `<small>` 에 그 칸 이름(연락처), 다 채우면 「제출하기」 | 필수 |

- 띠는 화면 아래에 붙어 있고(`position: sticky`) 아래 안전 영역만큼 비킨다.
- 「다음 칸」 을 누르면 빈 칸으로 초점을 옮긴다. 다 채우면 같은 자리 단추가 「제출하기」 가 된다 — 주 단추는 하나다.
- 초점을 받은 입력칸이 띠 뒤에 숨지 않게 `scroll-padding-bottom` 을 준다(CSS 가 한다).
- **키보드가 화면을 덮는 브라우저(iOS)** 에서는 입력 중에 `html[data-ggc-typing]` 이 붙고, 띠가 **문서 끝으로 내려간다**(`position: static`).
  띠를 숨기지 않는다 — 다음 행동과 상태는 스크롤하면 늘 닿는다. 칸 이동은 키보드의 「다음」(`enterkeyhint="next"`).
- 안드로이드는 `interactive-widget=resizes-content` 로 레이아웃이 줄어 띠가 키보드 위에 선다. `data-ggc-typing` 이 붙지 않는다.
- 높이가 낮은 가로 화면에서는 진행 · 상태 칸을 접고 주 단추만 남긴다.

## 글자 크게

- 머리의 `[data-ggc-text-toggle]` 단추. 누르면 `.ggc-solo[data-ggc-text="lg"]` 가 되어 본문 · 컨트롤 · 라벨 글자가 ×1.25 로 커진다.
- 눌림은 `aria-pressed` 로 알린다. `localStorage`(`ggc-text`)에 기억해 같은 주소(오리진)의 다른 링크 화면에서도 크게 보인다.
- 단추는 마크업에서 `hidden` 으로 시작한다 — 스크립트가 없을 때 누를 수 없는 단추가 남지 않게. behaviors 가 켠다.
- 브라우저 확대(두 손가락)를 막지 않는다. 글자 크게는 확대를 대신하지 않고 더한다.

## 동작 (`ggc-behaviors.js` ⑫)

| 무엇 | 어떻게 |
|---|---|
| 글자 크게 | 위 절 |
| 키보드 덮임 | 입력칸에 초점이 있고, 보이는 높이(`visualViewport`)가 레이아웃 높이보다 크게 작으면 `html[data-ggc-typing]` |
| 전체 화면 창 | `.ggc-modal--full` 을 열면 뒤 문서를 고정한다([modal.md](modal.md)) |

## 키보드 · ARIA

- h1 은 구역마다 하나. 머리의 기관명은 제목이 아니다.
- 상태가 바뀌면 새 구역 h1 로 초점(위).
- 바닥 띠 `.status` 는 `role="status"` — 「서명을 넣었습니다」 가 한 번 읽힌다.
- 입력칸에 `autocomplete`(name · tel) · `inputmode` · `enterkeyhint="next"` 를 준다.

## 프로필

대민 프로필 — 컨트롤 · 글자 치수가 대민 값이다. 본문 폭은 `--ggc-space-11` × 8 로 묶여 큰 화면에서도 휴대폰 폭처럼 읽힌다.

## 규칙

- **틀이 흐름을 강요하지 않는다.** 이미 승인된 서비스 흐름 — 서명 「한 화면 + 바닥 3/6 작성」 · 설문 「한 화면 한 문항」 — 은 이 틀 위에서 각자 유지한다.
- 토스트를 쓰지 않는다. 상태는 바닥 띠 `.status` 에.
- 전송이 실패해도 입력을 지우지 않는다. 다시 보내기를 같은 자리에 둔다.
- 서명은 전체 화면 창 안의 `.ggc-signature`([signature.md](signature.md)).
- 확대를 막는 viewport 를 쓰지 않는다.
- 이름 · 토큰을 주소 경로 · 쿼리 · OG 문구에 넣지 않는다. 토큰은 `#` 뒤.
- 사람 이름 · 연락처는 담당 연락처에만 보인다.

## 실기기에서 확인할 것

카톡 인앱의 실제 동작은 헤드리스 브라우저로 검증할 수 없다. 사람이 실기기로 본다([verify.md](../../skills/ggc-design/references/verify.md) 「사람 눈이 필요한 것」).

- 카톡 인앱(안드로이드 · iOS)에서 주소창이 오르내리고, 키보드가 뜨고, 화면을 돌린 뒤에도 입력과 서명 획이 남는가
- 바닥 띠가 입력칸을 가리지 않는가

## Tier 2

아직 없다 — React 판은 다음 PR([ADR 0013](../decisions/0013-github-tidy-and-shared-parts.md) 결정 3).

## 근거

- 네 서비스가 각자 만들었다(tsv 근거 열): sign `s.html` · survey `r.html` · bookRoom `/m` · award manage. 정본 §40.
- 계약 §9 예외 — 의원 설문 의원 화면(10-06 사용자 결정) · 서명 받는 분 화면.
- 사용자 말 — "몇 개까지 입력을 했다던가 확인도"(서명, 10-01) → 바닥 띠 진행 ·
  "모바일에서…화면이 계속 흔들려 서명을 정상적으로 하기가 어렵네"(10-24) → `100svh` · 획 보존.
- Codex 교차 검토 — 키보드가 덮을 때 바닥 띠를 숨기지 말 것 · `100dvh` 대신 `100svh`(ADR 0013).
