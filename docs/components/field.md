# 폼 필드 — `.ggc-field`

라벨 · 컨트롤 · 힌트 · 오류 한 묶음. **라벨은 항상 있다** — placeholder 를 유일한 라벨로 쓰지 않는다(계약 §3).

## 마크업

```html
<div class="ggc-field">
  <label for="t1">의안명 <span class="req">*</span></label>
  <input id="t1" type="text" value="경기도 청년 기본조례 일부개정조례안">
  <span class="hint">공포된 조례명과 일치해야 한다</span>
</div>

<div class="ggc-field is-error">
  <label for="t3">제안일 <span class="req">*</span></label>
  <input id="t3" type="text" value="2026-13-45" aria-invalid="true" aria-describedby="t3e">
  <span class="error" id="t3e">날짜 형식이 아니다 — YYYY-MM-DD</span>
</div>

<div class="ggc-field">
  <label for="t5">제안이유</label>
  <textarea id="t5" rows="3"></textarea>
</div>
```

셀렉트는 `<div class="ggc-select"><select …></div>` 로 감싼다([select.md](select.md)). 체크·라디오는 [check-radio.md](check-radio.md).

## 부분 · 상태

| 무엇 | 어떻게 |
|---|---|
| 필수 | `<span class="req">*</span>` — 라벨 옆. 필수가 대부분이면 선택 항목에 "(선택)" 을 적는 편이 낫다 |
| 힌트 | `.hint` 11.5px subtle — 형식·예시·근거 |
| 오류 | `.is-error` + `.error` 문구 + `aria-invalid` + `aria-describedby`. 문구는 **사유 + 형식**("날짜 형식이 아니다 — YYYY-MM-DD") |
| 비활성 | `disabled` — 회색 배경. **이유를 힌트에** |
| 높이 · 글자 | `--ggc-input-h`(44 / 48) · `--ggc-control-font`(13.5 / 17) |

## 규칙

- 라벨은 명사구, 13px/700 muted. 화면에 못 두면 `class="ggc-sr"` 로 숨긴다(지우지 않는다).
- 검증 실패 시 **첫 오류 필드로 포커스**를 옮긴다 — 키보드 사용자에게 필수(archetypes Configure).
- 날짜는 `YYYY-MM-DD` 텍스트 입력 + 형식 힌트, 또는 `type="date"`. 숫자는 우정렬 + 단위 힌트.
- 한 카드에 필드 6개 이하. 넘으면 카드를 나누거나 단계(위저드)로.

## Tier 2

`input` — `Input` · `Field` · `FieldHint` · `FieldError`; `label` — `<Label required>`; `textarea`.

## 근거

ggc-components.css §7 · 조례초안 작성 위저드.dc.html 입력 실측 · KRDS text_input/textarea.
