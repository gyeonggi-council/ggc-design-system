# 체크박스 · 라디오 · 칩 — `.ggc-check` · `.ggc-radio` · `.ggc-chip` · `.ggc-check-group`

네이티브 input 을 시각적으로만 숨기고 CSS 가 상자·점·칩을 그린다. 키보드(Space · 화살표)·폼 전송·
스크린리더는 브라우저 그대로다. 이미지 자산 없음.

## 마크업

```html
<!-- 묶음: fieldset + legend (스크린리더가 그룹 이름을 읽는다) -->
<fieldset class="ggc-check-group">
  <legend>표시할 상태</legend>
  <label class="ggc-check"><input type="checkbox" checked><span class="box"></span><span class="text">접수</span></label>
  <label class="ggc-check"><input type="checkbox"><span class="box"></span><span class="text">의결</span></label>
  <label class="ggc-check"><input type="checkbox" disabled><span class="box"></span><span class="text">폐기 (권한 없음)</span></label>
</fieldset>

<!-- 세로 + 부가 설명 -->
<fieldset class="ggc-check-group ggc-check-group--column">
  <legend>심사 결과</legend>
  <label class="ggc-radio"><input type="radio" name="r" checked><span class="box"></span>
    <span class="text">원안가결<span class="sub">제안된 내용 그대로 가결한다</span></span></label>
  <label class="ggc-radio"><input type="radio" name="r"><span class="box"></span><span class="text">수정가결</span></label>
</fieldset>

<!-- 칩: 필터 스트립. checkbox 면 다중, radio 면 단일 -->
<fieldset class="ggc-check-group">
  <legend class="ggc-sr">소관위원회</legend>
  <label class="ggc-chip"><input type="checkbox" checked><span class="text">기획재정</span></label>
  <label class="ggc-chip"><input type="checkbox"><span class="text">경제노동</span></label>
</fieldset>
```

`<label>` 이 input 을 감싸므로 `for/id` 짝이 없어도 이름과 클릭 영역이 붙는다. `span.box` 는 반드시
input **바로 다음**이어야 한다(`input:checked + .box`).

## 상태

| 상태 | 표시 |
|---|---|
| 선택 | 네이비 채움 + 흰 체크(라디오는 흰 점). 칩은 틴트 배경 + 테두리 + `✓` |
| 포커스 | 공통 포커스 링 (`input:focus-visible + .box`) |
| 비활성 | 회색 상자·글자. **이유를 `.sub` 에 적는다** — "왜 못 고르는가" 가 없으면 오류로 보인다 |
| 고대비 | 시스템 `Highlight`/`GrayText` 로 복원. 비활성+선택도 보인다 |

## 규칙

- 묶음은 항상 `fieldset` + `legend`. legend 를 화면에서 숨기려면 `class="ggc-sr"` (지우지 않는다).
- 라디오는 기본값 하나를 선택해 둔다. "선택 안 함" 이 의미 있으면 그것도 항목으로 만든다.
- 칩은 **결과 요약("총 N건")과 함께** 둔다 — 무엇을 걸렀는지 보여야 한다.
- 단일 on/off 설정에는 토글 스위치(`.ggc-switch`, P1)를 쓴다. 체크박스는 "포함 여부" 다.

## 프로필

칩 높이 `--ggc-control-h-sm`, 글자 `--ggc-control-font`. 상자 20px 는 고정.

## Tier 2

`checkbox` · `radio-group` (Radix). 칩은 `toggle-group` 변형.

## 근거

KRDS `checkbox.html` · `radio_button.html` · `checkbox_chip.html` · `radio_chip.html`.
