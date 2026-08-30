# 빈 상태 — `.ggc-empty`

레이아웃만 정본이다([ADR 0006](../decisions/0006-empty-state-assembled.md)). 문구와 다음 행동은 화면이 정한다.
카드 · 표 본문 · 탭 패널 어디에나 들어가고 자기 테두리가 없다.

## 마크업

```html
<div class="ggc-empty">
  <span class="icon" aria-hidden="true">☰</span>
  <p class="title">처리 대기 의안이 없다</p>
  <p class="desc">필터 "내 소관 · 처리 대기" 에 해당하는 의안이 없다. 필터를 풀면 147건이다.</p>
  <div class="actions"><button class="ggc-btn ggc-btn--secondary ggc-btn--sm" type="button">필터 초기화</button></div>
</div>

<!-- 불러오지 못함 -->
<div class="ggc-empty ggc-empty--error">
  <span class="icon" aria-hidden="true">✕</span>
  <p class="title">일정을 불러오지 못했다</p>
  <p class="desc">의사일정 연계 응답 없음 (HTTP 504) · 2026-08-29 14:32</p>
  <div class="actions"><button class="ggc-btn ggc-btn--primary ggc-btn--sm" type="button">다시 시도</button></div>
</div>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 오류 | `--error` — 기호·제목이 danger. 오류 코드와 시각을 `.desc` 에 남기고 "다시 시도" 를 둔다 |
| 짧게 | `--compact` — 카드 안 작은 영역(첨부 문서 없음) |
| 슬롯 | `.icon`(선택) · `.title`(필수) · `.desc`(선택) · `.actions`(선택) |

## 문구 규칙

- **제목 = 무엇이 없는지** ("처리 대기 의안이 없다"). "데이터가 없습니다" 가 아니다.
- **설명 = 왜 없는지** — 필터 때문인지, 아직 접수되지 않았는지, 권한이 없는지를 가른다. 필터 때문이면 전체 건수를 적는다.
- **행동 = 다음에 할 일** — 필터 초기화, 등록, 목록 열기. 없으면 `.actions` 를 두지 않는다.
- 평서형 · 마침표 없음(domain-language.md).

## 세 상태를 함께

빈 · 오류 · 로딩은 처음부터 함께 만든다. 로딩은 [skeleton.md](skeleton.md)(행 높이 유지), 인라인 오류는 [alert.md](alert.md).
갤러리 components.html "빈 상태 · 오류 · 로딩" 이 셋을 나란히 보여 준다.

## 프로필

패딩 `--ggc-space-8`. 대민에서도 같다.

## Tier 2

`ggc-empty` (Phase 9b).

## 근거

components.html 조립 예시를 클래스로 · ADR 0006 · §31.
