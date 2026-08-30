# 날짜 입력 — `.ggc-date` · `.ggc-date-range`

네이티브 `<input type="date">` 에 높이·테두리를 얹는다. 달력 UI · 키보드(화살표로 년/월/일) · 스크린리더를
브라우저가 준다. 커스텀 달력(범위 하이라이트 · 회기 표시)은 예정 항목(`calendar`)이다 — 그때도 정본에 먼저 넣는다.

## 마크업

```html
<div class="ggc-field">
  <label for="d1">접수일 <span class="req">*</span></label>
  <div class="ggc-date"><input id="d1" type="date" min="2026-08-01" max="2026-09-12"></div>
  <span class="hint">회기 안의 날짜만 (YYYY-MM-DD)</span>
</div>

<!-- 기간 -->
<fieldset class="ggc-date-range">
  <legend>회기 기간</legend>
  <div class="ggc-date"><label class="ggc-sr" for="from">시작일</label><input id="from" type="date"></div>
  <span class="sep" aria-hidden="true">~</span>
  <div class="ggc-date"><label class="ggc-sr" for="to">종료일</label><input id="to" type="date"></div>
</fieldset>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 오류 | 감싼 `.ggc-field` 에 `.is-error` + `.error` + `aria-describedby` |
| 비활성 | `disabled` |
| 범위 제한 | `min` / `max` — 회기 · 접수일 이후 등. 브라우저가 달력에서 막고 검증한다 |
| 인라인 | `--inline` (폭이 내용만큼, 표 상단 필터) |

## 규칙

- 힌트에 **서버 형식**(YYYY-MM-DD)을 적는다. 브라우저 표시(2026. 08. 25.)와 전송 값(2026-08-25)이 다르다.
- 기간은 `fieldset` + `legend` 로 묶고 각 입력에 화면 밖 라벨(시작일 · 종료일)을 둔다. "~" 는 `aria-hidden`.
- 시작 > 종료 검증은 서버와 클라이언트 둘 다. 오류는 종료일 필드에 붙인다.
- `type="date"` 를 `type="text"` + 마스크로 바꾸지 않는다 — 키보드 · 스크린리더 · 모바일 달력을 전부 잃는다.

## 프로필

높이 `--ggc-input-h`(44 / 48), 글자 `--ggc-control-font`.

## Tier 2

`input` 의 `type="date"`. 커스텀 달력은 `calendar`(예정).

## 근거

KRDS `date_input` · §27.
