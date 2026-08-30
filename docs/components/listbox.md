# 커스텀 리스트박스 — `.ggc-listbox`

네이티브 `<select>` 로 안 되는 것에만 쓴다 — 항목에 **부제**가 있거나, **검색 필터**가 필요하거나, 항상 펼쳐 보여야 하거나,
**다중 선택**일 때. 항목 20개 이하 · 한 줄이면 [select.md](select.md) 다. 입력창 + 팝업(콤보박스)은 예정 항목(`combobox`)이다 —
여기는 **항상 보이는 목록**이다.

## 마크업

```html
<div class="ggc-field">
  <label id="lb-l" for="lb-f">소관위원회 <span class="req">*</span></label>
  <div class="ggc-listbox" data-ggc-listbox>
    <input class="filter" id="lb-f" type="search" placeholder="위원회 검색" aria-controls="lb" autocomplete="off">  <!-- 선택 -->
    <ul id="lb" role="listbox" aria-labelledby="lb-l" tabindex="0">
      <li role="option" aria-selected="true" data-value="planning"><span class="text">기획재정위원회</span><span class="sub">위원 13명</span></li>
      <li role="option" aria-selected="false" data-value="economy"><span class="text">경제노동위원회</span></li>
      <li role="option" aria-selected="false" data-value="steering" aria-disabled="true"><span class="text">의회운영위원회</span><span class="sub">회부 대상 아님</span></li>
    </ul>
    <p class="none" hidden>일치하는 위원회가 없다</p>
    <input type="hidden" name="committee" value="planning">
  </div>
</div>
```

다중 선택은 `<ul … aria-multiselectable="true">`. 선택값은 `hidden` 입력에 쉼표로 이어진다(`data-value` 없으면 텍스트).

## 키보드 · ARIA (`data-ggc-listbox`)

목록이 포커스 하나(`tabindex="0"`)를 갖고 `aria-activedescendant` 로 현재 항목을 가리킨다.

| 키 | 동작 |
|---|---|
| `↑` `↓` `Home` `End` | 현재 항목 이동. **단일 선택은 선택이 따라온다**(네이티브 select 와 같다) |
| `Enter` `Space` | 선택 (다중은 토글) |
| 글자 | 앞글자 찾기 (600ms 안에 이어 치면 여러 글자). **한글은 IME 조합 중 `key` 가 "Process" 라 브라우저에 따라 안 될 수 있다** — 한글 목록에는 `.filter` 를 함께 둔다 |
| 필터에서 `↓` | 목록으로 포커스 |

이벤트: `ggc:change`(`detail.values` · `detail.option`) · `ggc:filter`(`detail.query` · `detail.count`).

## 규칙

- 선택은 배경 + 왼쪽 띠 + ✓ 셋으로 표시한다. 현재 항목(`.is-active`)은 outline — 선택과 다른 것이다.
- 비활성 항목은 **이유를 `.sub` 에** 적는다.
- 필터로 0건이면 `.none` 문구를 보인다 — 빈 목록만 남기지 않는다.
- 목록 최대 높이 264px(약 7행) — 그 이상은 스크롤. 100개를 넘으면 서버 검색으로 바꾼다.
- 라벨은 `aria-labelledby` 로 목록에 붙인다. `<label for>` 는 `ul` 에 붙지 않는다.

## 프로필

항목 높이 `--ggc-control-h-sm`(34 / 40), 글자 `--ggc-control-font-sm`(13 / 15).

## Tier 2

`listbox`. 콤보박스는 `combobox`(예정).

## 근거

KRDS `select`(custom) 목록부 · WAI-ARIA APG listbox · §32.
