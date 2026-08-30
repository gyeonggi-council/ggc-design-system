# 셀렉트 — `.ggc-select`

네이티브 `<select>` 에 화살표와 높이를 얹는다. 항목이 20개 이하면 이것으로 충분하다 —
검색·다중 선택이 필요한 커스텀 리스트박스는 별도 컴포넌트(`.ggc-listbox`, P2)다.

## 마크업

```html
<!-- 폼 필드 안 -->
<div class="ggc-field">
  <label for="c">소관위원회 <span class="req">*</span></label>
  <div class="ggc-select">
    <select id="c">
      <option>기획재정위원회</option>
      <option>경제노동위원회</option>
    </select>
  </div>
  <span class="hint">회부 시 소관위원회는 의장이 결정한다</span>
</div>

<!-- 단독 · 소형 · 인라인 (표 상단 정렬 선택 등) -->
<div class="ggc-select ggc-select--sm ggc-select--inline">
  <label for="sort" class="ggc-sr">정렬</label>
  <select id="sort"><option>최근 접수순</option><option>의안번호순</option></select>
</div>
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 오류 | 감싼 `.ggc-field` 에 `.is-error` + `.error` 문구 + `aria-describedby` |
| 비활성 | `<select disabled>` — 회색 배경 |
| 소형 | `--sm` (높이 `--ggc-control-h-sm`) |
| 인라인 | `--inline` (폭이 내용만큼) |

## 규칙

- 라벨은 항상 있다. 화면에 못 두면 `.ggc-sr` 로 숨긴다 — 지우지 않는다.
- 첫 항목을 "선택" 같은 빈 값으로 두면 필수 검증이 가능하다. 기본값이 명백하면 그것을 선택해 둔다.
- 이미지 자산 없음 — 화살표는 CSS `::after` 다. `appearance:none` 이라 OS 화살표는 안 보인다.

## 프로필

높이 `--ggc-input-h`(업무 44 / 대민 48), 글자 `--ggc-control-font`(13.5 / 17).

## Tier 2

`select` (native). Radix Select 는 `listbox` 항목(P2).

## 근거

KRDS `html/code/select.html` · 기존 `.ggc-field select`(§7).
