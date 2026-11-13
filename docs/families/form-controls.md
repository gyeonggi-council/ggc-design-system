# 패밀리 — 입력 컨트롤

**권위: current.** 형제: `.ggc-field`(텍스트 · 텍스트영역) · `.ggc-select` · `.ggc-check` · `.ggc-radio` · `.ggc-chip` · `.ggc-switch` · `.ggc-date` · `.ggc-file` · `.ggc-listbox` · `.ggc-search` · `.ggc-segmented`(v4.0). 부품마다의 마크업은 [components/](../components/README.md).

## 함께 지키는 것

| 계약 | 판정법 |
|---|---|
| **높이와 글자는 토큰이 정한다** — `--ggc-input-h` · `--ggc-control-h(-sm/-lg)` · `--ggc-control-font` · `--ggc-label-font`. 프로필이 이 토큰을 덮어 대민(KRDS 48/17)이 된다 | 부품 CSS 에 높이 · 글자 리터럴이 없다(D6). 대민 프로필을 켜면 모든 형제가 함께 커진다(`tokens.html` 토글) |
| **라벨 → 입력 → 힌트 → 오류** 순서. 라벨은 `<label for>` 로 묶고, placeholder 를 유일한 라벨로 쓰지 않는다 | 라벨 없는 입력 0건. 오류는 `aria-describedby` 로 묶이고 `.is-error` 와 **문장**이 함께 있다(색만 바뀌지 않는다) |
| **포커스 링은 토큰 공통 규칙**(`:focus-visible`). 부품이 `outline` 을 지우지 않는다 | D5 |
| **비활성(disabled)과 읽기 전용(readonly)을 가른다** — 못 쓰는 이유가 있으면 [states.md](../guides/states.md) 「못 쓰는 이유」대로 문장을 둔다 | 비활성 단추 · 입력 옆에 이유 또는 툴팁 |
| **휴대폰 입력 글자는 16 이상** — `max(--ggc-control-font, --ggc-text-md)` | iOS 가 확대하지 않는다(계약 §2) |
| **네이티브 우선** — 셀렉트 · 날짜 · 체크 · 라디오는 브라우저 기본 요소에 클래스만. 커스텀(리스트박스 · 콤보박스)은 항상 보이는 목록 · 필터 · 다중처럼 네이티브로 안 되는 일에만 | 새 커스텀 컨트롤 제안에 "네이티브로 왜 안 되나" 한 줄 |
| **키보드** — Tab 으로 닿고, 화살표는 그룹 안(라디오 · 리스트박스), Space 로 토글, Enter 로 제출 | 마우스 없이 서식을 끝까지 낸다 |
| **고대비** — 상자 테두리는 `--ggc-text-faint` 이상(WCAG 1.4.11) · `forced-colors` 에서 테두리 유지 | D6 §36 |
| **선택 · 체크는 잉크**(`--ggc-accent`, v4.0) — 체크박스 · 라디오 · 스위치 · 세그먼트 선택 · 칩 선택 테두리. 남색 포커스 링과 구분된다 | 선택 상태에 `--ggc-primary` 없음(링 제외) |

## 선택 기준 — 어느 형제를 쓰나

| 상황 | 형제 |
|---|---|
| 하나 고르기, 항목 ≤ 6 · 다 보여도 됨 | `.ggc-radio` |
| 하나 고르기, 항목 많음 | `.ggc-select` (네이티브) |
| 여러 개 고르기 · 항상 보이는 목록 · 필터 | `.ggc-check-group` 또는 `.ggc-listbox` |
| 켜고 끄기(즉시 반영) | `.ggc-switch` — 저장 단추가 따로 있으면 체크박스 |
| 조건 칩(Explore 필터 스트립) | `.ggc-chip` |
| 같은 판의 표현 바꾸기 (목록/카드 · 주/월), 2~5개 배타 | `.ggc-segmented` — 판이 바뀌면 탭 |
| 날짜 · 기간 | `.ggc-date` · `.ggc-date-range` |
| 파일 | `.ggc-file` + `.ggc-file-list`(목록은 상태 부품 계약을 따른다) |

## Tier 2

`input` `textarea` `label` `select` `checkbox` `radio-group` `switch` `form-field` — shadcn 공식에 높이 · 글자만 토큰. 날짜는 `input type=date` 가 기본, `calendar` 는 범위 · 회기 표시가 필요할 때만.
