# 세그먼트 컨트롤 — `.ggc-segmented`

같은 판의 **표현**을 바꾸는 2~5개의 서로 배타적 선택(목록/카드 · 주/월 · 전체/내 소관). 판 자체를 바꾸면 [탭](tabs.md), 필터 조건을 켜고 끄면 [칩](check-radio.md)이다. 패밀리: [입력 컨트롤](../families/form-controls.md). v4.0(ADR 0016).

## 마크업

```html
<div class="ggc-segmented" role="group" aria-label="보기 방식">
  <button type="button" aria-pressed="true"><svg class="ggc-icon" aria-hidden="true"><use href="#i-list"/></svg>목록</button>
  <button type="button" aria-pressed="false"><svg class="ggc-icon" aria-hidden="true"><use href="#i-layout-dashboard"/></svg>카드</button>
</div>
<fieldset class="ggc-segmented ggc-segmented--sm">
  <legend class="ggc-sr">기간</legend>
  <label><input type="radio" name="period" value="week" checked>이번 주</label>
  <label><input type="radio" name="period" value="month">이번 달</label>
  <label><input type="radio" name="period" value="session">이번 회기 <span class="count">12</span></label>
</fieldset>
```

두 꼴 중 하나를 고른다. **값이 서식에 들어가면 라디오**(`<label><input type="radio">`), **화면 표현만 바꾸면 단추**(`<button aria-pressed>`). `aria-pressed` 는 서비스 스크립트가 바꾼다.

## 변형 · 상태

| 클래스 | 언제 |
|---|---|
| `--block` | 가로 가득 — 카드 머리 아래 · 휴대폰(≤600 은 자동) |
| `--sm` | 표 위 · 카드 머리 안 (높이 `--ggc-control-h-sm` − 8) |
| `[aria-pressed="true"]` · `input:checked` | 선택 — 흰 면 + `--ggc-border-strong` 테두리. 트랙 안에서 뜨지 않는다(그림자 없음) |
| `disabled` | 못 고르는 항목 — 이유는 툴팁 또는 옆 문장([states.md](../guides/states.md) 4) |
| `.count` | 항목 건수 — 결과 요약이 다른 곳에 없을 때만([less.md](../guides/less.md) R2) |

## 키보드 · ARIA

- 라디오 꼴: Tab 으로 묶음에 들어오고 **화살표**로 항목 이동, Space 로 선택. `<fieldset>` + `<legend class="ggc-sr">` 가 묶음 이름이다.
- 단추 꼴: Tab 으로 항목마다 이동, Enter/Space 로 누름. `role="group" aria-label` 로 묶음 이름을 준다.
- 포커스 링은 공통 규칙(`:focus-visible`). 동작 스크립트 없이도 모양은 완성된다.

## 프로필

높이 = `--ggc-control-h` − 8 · 글자 `--ggc-control-font-sm`. 대민 프로필은 토큰이 커지므로 그대로 따라온다.

## 규칙

- 항목은 2~5개. 넘으면 셀렉트(`.ggc-select`) 다. 항목 이름은 두 글자~여섯 글자 명사.
- 한 화면에 세그먼트가 둘을 넘으면 정보 종류가 많다는 신호 — 덜어내기 판정([less.md](../guides/less.md)).
- 선택이 바뀌어도 화면 틀(메뉴 · 검색창 · 단추 자리)은 그대로다(README 다섯 가지 ④).
- 하지 말 것: 탭 대신 쓰기(내용 영역이 바뀌면 탭) · 세그먼트 안에 아이콘만 두기(라벨 필수, 아이콘은 보조).

## Tier 2

`toggle-group`(`type="single"`) — shadcn 공식 + 토큰. 선택 항목은 `data-state=on` 이 `bg-background border-input` 로 같은 모양.

## 근거

Astryx SegmentedControl(선택 항목 그림자 없음 · 높이 = 컨트롤 − 8) · shadcn toggle-group · ggc-components.css §45.
