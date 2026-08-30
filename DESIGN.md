<!-- 생성물 — 손으로 고치지 말 것. python tools/build-design-md.py -->
<!-- 원천: design/ggc-tokens.css (557ebdbe) · design/components.tsv (97d40d06) -->

# 경기도의회 공통 디자인 시스템 — DESIGN.md

경기도의회 의정정보시스템 전 서비스가 공유하는 디자인 언어다. **업무용**(의원·사무처 직원이 쓰는
고밀도 업무 화면)과 **대민용**(도민이 보는 공개 화면) 두 프로필이 **같은 토큰 하나** 위에 있다.
값의 유일한 원천은 `design/ggc-tokens.css` 이며 이 문서는 그 파일에서 생성됐다.

- 정본 저장소: https://github.com/gyeonggi-council/ggc-design-system
- 실물 갤러리: `design/examples/index.html` (빌드 없이 열린다)
- 규칙 계약: `docs/contract.md` · 스킬: `skills/ggc-design/SKILL.md`

## 1. Visual Theme & Atmosphere (시각 테마)

- **기관 CI 네이비**(`--ggc-primary`)가 유일한 브랜드 색이다. KRDS(정부 디자인 시스템)를 기반으로
  브랜드 색만 기관 CI 로 오버라이드했다 — KRDS 기본 파랑(`#246BEB`·`#256EF4`)은 폐기값이다.
- 업무 프로필: **고밀도·표 중심·평서형 문장**. 한 화면에 15~20행이 들어오고, 첫 화면은 목록이다.
  히어로·큰 카드 그리드·환영 문구로 시작하지 않는다.
- 대민 프로필: **KRDS 패턴 충실**(마스트헤드 · 아이덴티파이어 · 공개 헤더/푸터 · 스킵 링크) +
  KRDS 치수(컨트롤 48px, 본문 17px). 색은 업무와 같은 네이비다.
- 카드는 흰 면 + 1px 테두리 + radius 14~16px, **그림자 없음**. 페이지 배경은 옅은 회청(`--ggc-bg`).
- 다크 모드는 없다. 고대비는 별도 팔레트가 아니라 `forced-colors`·`prefers-contrast` 대응이다.
- 서체는 **Pretendard GOV** 자체 호스팅 단일. 외부 CDN 을 링크하지 않는다(망분리).

## 2. Color Palette & Roles (색과 역할)

전부 WCAG AA(4.5:1) 를 통과한다. 대비비는 생성 시 계산한 값이다.

### 브랜드

| 토큰 | Hex | 역할 | 흰 위 |
|---|---|---|---|
| `--ggc-primary` | #3C5D93 | 주요 버튼 · 활성 상태 · 링크 | 6.61:1 |
| `--ggc-primary-dark` | #345080 | hover | 8.06:1 |
| `--ggc-primary-deep` | #2E4A78 | pressed · 유틸리티 바 배경 · 표 헤더 상단선 | 8.87:1 |
| `--ggc-primary-light` | #EEF3FA | 선택 배경 · 활성 LNB (배경 전용) | 1.11:1 |
| `--ggc-primary-light-strong` | #DBE6F5 | 강조 배경 (배경 전용) | 1.26:1 |

### 상태 (자기 틴트 위 · 흰 위 양쪽 AA)

| 토큰 | Hex | 틴트 | 역할 | 틴트 위 | 흰 위 |
|---|---|---|---|---|---|
| `--ggc-success` | #0A7B4E | `--ggc-success-tint` #E6F4EE | 승인 · 확정 · 완료 · 회의일 | 4.69:1 | 5.31:1 |
| `--ggc-warning` | #9D5E00 | `--ggc-warning-tint` #FBEED2 | 대기 · 주의 · 검토 필요 | 4.53:1 | 5.20:1 |
| `--ggc-danger` | #CD2D2D | `--ggc-danger-tint` #FDEAEA | 반려 · 오류 · 기한 초과 | 4.52:1 | 5.24:1 |
| `--ggc-info` | #1F6A97 | `--ggc-info-tint` #E2F0F8 | 정보 · 회기 중 · 진행 | 5.06:1 | 5.89:1 |

상태색은 KRDS 값으로 수렴하지 않았다 — 디자인 원본 색상각을 유지한 채 AA 를 넘긴 값이다
(`docs/krds-alignment.md §2`). **색 단독으로 의미를 전달하지 않는다** — 배지에는 텍스트·기호를 병기한다.

### 중립 텍스트 램프

| 토큰 | Hex | 역할 | 흰 위 | 페이지 배경 위 |
|---|---|---|---|---|
| `--ggc-text-strong` | #131722 | 제목 · 강조 수치 | 17.90:1 | 15.80:1 |
| `--ggc-text` | #1A1F29 | 본문 | 16.51:1 | 14.57:1 |
| `--ggc-text-body` | #3A4150 | 카드 안 긴 본문 단락 · 표 td | 10.23:1 | 9.03:1 |
| `--ggc-text-muted` | #4A5566 | 보조 · 라벨 · 표 헤더 | 7.55:1 | 6.66:1 |
| `--ggc-text-subtle` | #5A6577 | 메타 · 시각 · 힌트 | 5.89:1 | 5.20:1 |
| `--ggc-text-faint` | #8A94A3 | **텍스트 금지** — 아이콘 stroke · 구분 · 장식 (3:1 대상) | 3.07:1 | — |

### 면 · 선

| 토큰 | Hex | 역할 |
|---|---|---|
| `--ggc-bg` | #EEF1F5 | 페이지 배경 |
| `--ggc-surface` | #FFFFFF | 카드 · 패널 · GNB · LNB |
| `--ggc-surface-inset` | #F6F8FB | 인셋 영역 · 표 합계행 |
| `--ggc-control-bg` | #F3F5F9 | 검색창 · 입력 컨트롤 · 아이콘 박스 |
| `--ggc-row-hover` | #FAFBFD | 목록 행 hover |
| `--ggc-border` | #E6EBF1 | 카드 테두리 |
| `--ggc-border-strong` | #D5DCE5 | 버튼 · 입력 테두리 |
| `--ggc-shell-border` | #E2E7EE | GNB 하단선 · LNB 우측선 |
| `--ggc-hairline` | #F0F3F7 | 표 행 구분선 |

### 역할 색쌍 (신원 — 상태와 다른 축)

| 토큰 | Hex | 틴트 | 누구 |
|---|---|---|---|
| `--ggc-role-member` | #2E4A78 | #E6EDF7 | 의원 |
| `--ggc-role-staff` | #1F6A97 | #E2F0F8 | 사무처 |
| `--ggc-role-policy` | #7A5F1F | #F7EDD6 | 정책지원관 |
| `--ggc-role-other` | #5A6577 | #F0F3F7 | 기타 |

금/앰버(정책지원관 쌍)를 역할 배지 밖으로 확산시키지 않는다 — 확산하면 주 색상이 하나 더 는다.

## 3. Typography Rules (타이포그래피)

- 서체: `--ggc-font` = `"Pretendard GOV", Pretendard, "Noto Sans KR", "Malgun Gothic", system-ui, -apple-system, sans-serif`
- 등폭: `--ggc-font-mono` = `ui-monospace, "Cascadia Mono", Consolas, "D2Coding", Menlo, monospace`
- 가변 woff2 한 벌(45~930)을 자체 호스팅한다. 제목·KPI 는 800, 본문은 400, 라벨은 600~700.
- 숫자는 `font-variant-numeric: tabular-nums` + 천단위 콤마 + 오른쪽 정렬. 날짜는 `YYYY-MM-DD`.

| 역할 | 업무 프로필 | 대민 프로필 |
|---|---|---|
| 버튼 · 입력 글자 `--ggc-control-font` | 13.5px | 17px |
| 버튼 sm `--ggc-control-font-sm` | 13px | 15px |
| 버튼 lg `--ggc-control-font-lg` | 14px | 19px |
| 폼 라벨 `--ggc-label-font` | 13px | 17px |
| 표 `--ggc-table-font` | 13px | 17px |

업무 화면의 실측 스케일: 제목 16~17px/800 · 카드 제목 15px/700 · 행 제목 14px/700 · 본문 13.5px ·
라벨 13px/700 · 메타 12px · 태그 10.5px/700 · KPI 수치 30px/800. 대민은 KRDS body 15/17/19px.

## 4. Component Stylings (컴포넌트)

Tier 1 = CSS 클래스(`design/ggc-components.css`, 전 스택 공용) · Tier 2 = shadcn 레지스트리 항목(React).
마크업은 갤러리 `design/examples/components.html` 이 렌더된 DOM 그대로 보여 준다 — 짐작해 짜지 말고 거기서 가져온다.

| 컴포넌트 | Tier 1 클래스 | Tier 2 | 프로필 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 업무 셸 (GNB + LNB + 본문) | `.ggc-shell .ggc-gnb .ggc-lnb .ggc-shell-main(--wide/--split) .ggc-scroll` | `ggc-shell` | work | P0 | 있음 |
| 유틸리티 바 | `.ggc-utility-bar` | `ggc-utility-bar` | both | P0 | 있음 |
| 푸터 (업무) | `.ggc-footer` | `ggc-footer` | work | P0 | 있음 |
| 스킵 링크 | `.ggc-skip-link` | `(ggc-shell 포함)` | both | P0 | 있음 |
| 버튼 | `.ggc-btn (--primary --secondary --ghost --dashed --sm --lg --block)` | `button` | both | P0 | 있음 |
| 아이콘 버튼 | `.ggc-icon-btn` | `button (icon)` | both | P1 | 있음 |
| 배지 (상태 · 역할) | `.ggc-badge (--session --meeting --recess --approved --pending --rejected --paid · --role-member/-staff/-policy/-other)` | `badge` | both | P0 | 있음 |
| 태그 | `.ggc-tag (--primary --info --success --warning --danger)` | `badge (tag)` | both | P1 | 있음 |
| 카드 | `.ggc-card .ggc-card--pad .ggc-card-head(--band) .ggc-card-foot(--center --inset)` | `card` | both | P0 | 있음 |
| 통계 타일 (KPI) | `.ggc-stat-grid .ggc-stat` | `ggc-stat` | work | P0 | 있음 |
| 행 리스트 | `.ggc-list-row (.sev-bar)` | `ggc-list-row` | work | P1 | 있음 |
| 표 | `.ggc-table-wrap .ggc-table (--flat --kv .num tr.total)` | `table` | both | P0 | 있음 |
| 폼 필드 (라벨 · 입력 · 힌트 · 오류) | `.ggc-field (.hint .error .is-error)` | `input label textarea form-field` | both | P0 | 있음 |
| 검색창 | `.ggc-search` | `ggc-search` | work | P1 | 있음 |
| 스텝퍼 / 위저드 | `.ggc-wizard (--vertical) .ggc-wizard-mini` | `ggc-stepper` | both | P0 | 있음 |
| QR 로그인 블록 | `.ggc-qr .ggc-login` | `ggc-qr-login` | work | P1 | 있음 |
| 본문 조판 | `.ggc-prose` | `ggc-prose` | both | P1 | 있음 |
| 하단 스티키 액션바 | `.ggc-actionbar` | `ggc-actionbar` | work | P0 | 있음 |
| 모달 / 다이얼로그 | `.ggc-modal (<dialog>)` | `dialog alert-dialog` | both | P0 | 있음 |
| 탭 | `.ggc-tabs .ggc-tablist .ggc-tab .ggc-tabpanel` | `tabs` | both | P0 | 있음 |
| 셀렉트 (네이티브) | `.ggc-select` | `select` | both | P0 | 있음 |
| 체크박스 · 라디오 · 칩 | `.ggc-check .ggc-radio .ggc-check-group(--column) .ggc-chip` | `checkbox radio-group` | both | P0 | 있음 |
| 알림 / 콜아웃 | `.ggc-alert (--info --success --warning --danger)` | `alert` | both | P0 | 있음 |
| 페이지네이션 | `.ggc-pagination` | `pagination` | both | P0 | 있음 |
| 브레드크럼 | `.ggc-breadcrumb` | `breadcrumb` | both | P0 | 있음 |
| 페이지 헤더 (제목 · 메타 · 주 액션) | `.ggc-page-head` | `ggc-page-head` | work | P1 | 있음 |
| 스피너 | `.ggc-spinner .ggc-spinner-block` | `spinner` | both | P1 | 있음 |
| 스켈레톤 | `.ggc-skeleton` | `skeleton` | both | P1 | 있음 |
| 대민 페이지 컨테이너 · 페이지 타이틀 | `.ggc-public .ggc-public-main(--side) .ggc-page-title .ggc-h2` | `ggc-public-layout` | public | P0 | 있음 |
| 대민 메인 히어로 (안내 · 통합검색 · 바로가기) | `.ggc-hero` | `ggc-hero` | public | P1 | 있음 |
| 마스트헤드 (정부 공식 사이트 띠) | `.ggc-masthead` | `ggc-masthead` | public | P0 | 있음 |
| 아이덴티파이어 (기관 식별 띠) | `.ggc-identifier` | `ggc-identifier` | public | P0 | 있음 |
| 대민 헤더 + 주 메뉴 + 통합검색 | `.ggc-header .ggc-main-menu` | `ggc-public-header` | public | P0 | 있음 |
| 대민 푸터 | `.ggc-footer--public` | `ggc-public-footer` | public | P0 | 있음 |
| 사이드 내비게이션 (대민) | `.ggc-side-nav` | `ggc-side-nav` | public | P1 | 있음 |
| 구조화 목록 | `.ggc-structured-list` | `ggc-structured-list` | public | P1 | 있음 |
| 토글 스위치 | `.ggc-switch (--row)` | `switch` | both | P1 | 있음 |
| 토스트 | `.ggc-toast-region .ggc-toast (--success --warning --danger --info)` | `toast` | both | P1 | 있음 |
| 아코디언 / 디스클로저 | `.ggc-accordion .ggc-accordion-group (<details>, --flush)` | `accordion` | both | P1 | 있음 |
| 날짜 입력 (네이티브) | `.ggc-date .ggc-date-range (--inline)` | `input (date)` | both | P1 | 있음 |
| 파일 업로드 | `.ggc-file .ggc-file-list (--compact)` | `ggc-file-upload` | both | P1 | 있음 |
| 드롭다운 메뉴 | `.ggc-menu (<details>, --end --up)` | `dropdown-menu` | both | P1 | 있음 |
| 링크 | `.ggc-link (--external --download --quiet --strong)` | `—` | both | P1 | 있음 |
| 빈 상태 | `.ggc-empty (--error --compact)` | `ggc-empty` | both | P1 | 있음 |
| 커스텀 리스트박스 (항상 보이는 목록 · 필터 · 다중) | `.ggc-listbox` | `listbox` | both | P2 | 있음 |
| 툴팁 | `.ggc-tooltip-wrap .ggc-tooltip (--bottom --start --end)` | `tooltip` | both | P2 | 있음 |
| 페이지 내 내비게이션 | `.ggc-in-page-nav` | `—` | both | P2 | 있음 |
| 텍스트 목록 | `.ggc-text-list (--dash --check --none --tight)` | `—` | both | P2 | 있음 |
| 콤보박스 (입력 + 팝업 목록) | `.ggc-combobox` | `combobox` | both | P2 | 예정 |
| 커스텀 달력 (범위 · 회기 표시) | `.ggc-calendar` | `calendar` | both | P2 | 예정 |

핵심 규칙:

- 버튼: 기본 높이 `--ggc-control-h` 42px · radius 10px · primary 만 그림자
  (`--ggc-shadow-primary`). sm 34px / lg 46px. 대민은 40px/48px/56px.
- 입력: 높이 `--ggc-input-h` 44px · 1px `--ggc-border-strong` · radius 10px · 포커스는 공통 링.
  placeholder 를 유일한 라벨로 쓰지 않는다. 오류는 색 + 문구 + 아이콘.
- 배지: 알약형, 텍스트·기호 병기(✓ 승인 · ◷ 대기 · ✕ 반려 · ● 회기 중 · ◆ 회의일 · ○ 비회기).
- 카드: 흰 면 · 1px `--ggc-border` · radius 16px · 그림자 없음. 헤더는 제목 + 우측 액션 슬롯.
- 표: 얇은 보더, thead 상단 2px `--ggc-primary-deep`, 셀 패딩 `--ggc-cell-pad` 11px 10px, 합계행 인셋 배경.
- 셸(업무): GNB 64px 흰색 + LNB 256px + 본문 최대 1320/1360px. ≤900px 에서 LNB 는 drawer.
- 셸(대민): KRDS masthead → header/주 메뉴 → 본문(최대 1248px) → footer → identifier.
- 상태 3종(빈 상태 · 오류 · 로딩)을 화면마다 함께 만든다. 빈 상태 문구는 다음 행동을 말한다.

## 5. Layout Principles (레이아웃)

| 토큰 | 값 | 무엇 |
|---|---|---|
| `--ggc-space-1` | 4px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-2` | 8px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-3` | 12px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-4` | 16px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-5` | 20px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-6` | 24px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-7` | 32px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-8` | 40px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-9` | 48px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-10` | 64px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-space-11` | 80px | 간격 스케일 (KRDS gap 부분집합) |
| `--ggc-gnb-h` | 64px | GNB 높이 |
| `--ggc-lnb-w` | 256px | LNB 폭 |
| `--ggc-main-max` | 1320px | 대시보드 본문 최대폭 |
| `--ggc-main-max-wide` | 1360px | 기타 업무 화면 최대폭 |
| `--ggc-container-max` | 1280px | 유틸리티 바 · 푸터 inner 폭 (대민 1248px) |

- 2단 배치는 고정 격자 대신 `flex-wrap` + `flex-basis`(예: `flex: 1 1 560px`)로 짠다 — 미디어 쿼리 없이 접힌다.
- 넓은 표·코드는 자기 컨테이너 안에서 스크롤(`.ggc-table-wrap`). 본문이 가로 스크롤되게 두지 않는다.
- 밀도: 행 리스트 `--ggc-row-pad` 15px 22px · 카드 `--ggc-card-pad` 18px 22px. 대민은 20px 24px · 24px 24px.
- Surface Archetype(업무 화면 6종): Monitor(KPI 4열 + 큐) · Explore(필터 + 표) · Learn/Decide(상세 + 결재)
  · Configure(스텝퍼 + 스티키 액션바) · Converse(대화 + 출처) · Operate(실시간 상태 + 로그).

## 6. Depth & Elevation (깊이)

- `--ggc-shadow` = `0 1px 2px rgba(20, 30, 50, 0.04)` — 기본, 거의 보이지 않는다.
- `--ggc-shadow-primary` = `0 4px 12px rgba(60, 93, 147, 0.3)` — primary 버튼 전용.
- 카드·패널은 그림자 없이 1px 테두리로 면을 가른다. 겹침은 색 면(인셋 배경)과 테두리로 표현한다.
- radius: `--ggc-radius-sm` 6px (배지·칩) · `--ggc-radius` 10px (버튼·입력) · `--ggc-radius-lg` 14px (카드 14~16).
- 포커스 링: `--ggc-focus-ring` = `0 0 0 3px rgba(60, 93, 147, 0.20)`. `forced-colors` 에서는 `outline: 3px solid Highlight` 로 복원된다.

## 7. Do's and Don'ts (규칙)

**Do**

- 토큰 이름(`var(--ggc-*)`)만 쓴다. 값은 `ggc-tokens.css` 한 곳에만 산다.
- 상태 라벨은 결재·문서 흐름 어휘(접수 · 검토 · 결재 · 시행 · 완료 · 반려). 영문 UI 라벨을 남기지 않는다.
- 사용자 표기는 실명·역할·부서. UUID 를 보여주지 않는다. 공개 화면의 이름은 `이○○` 마스킹.
- 법령은 「낫표」+ 공포 명칭 그대로. 오류 문구는 사유와 근거를 함께 준다. AI 산출물에는 출처를 병기한다.
- 링크에 밑줄, `:focus-visible` 가시 링, 색 단독 의미 전달 금지, 키보드로 전 동선 도달.

**Don't**

- 새 색을 만들지 않는다(주 색상이 9종이 됐던 기제). 필요하면 정본에 먼저 넣는다.
- `#246BEB` · `#256EF4`(KRDS 기본 파랑) · 다크 팔레트 · 외부 폰트 CDN · `outline:none` 단독.
- `--ggc-text-faint` 를 텍스트에 쓰지 않는다(AA 미달). 금/앰버를 역할 배지 밖으로 확산시키지 않는다.
- 업무 화면에 히어로·마케팅 카피·이모지 상태 표시·상대시간("3시간 전")을 쓰지 않는다.
- 업무 프로필과 대민 프로필을 한 화면에 섞지 않는다. 대민에 업무 GNB/LNB 셸을 쓰지 않는다.

## 8. Responsive Behavior (반응형)

- 기준 폭: 1440×900(업무 기본) · 390×844(모바일) · ≥1680px 확폭(1560/1600, 옵션). 다섯 폭
  390 / 768 / 1024 / 1440 / 1920 에서 가로 오버플로 0 을 확인한다.
- ≤900px: 업무 LNB 가 drawer 로 접히고 GNB 가 압축된다. 대민 주 메뉴는 KRDS 모바일 메뉴 패턴.
- KPI 4열은 ≤1024px 에서 2열, ≤560px 에서 1열. 표는 래퍼 안에서만 가로 스크롤.
- 터치 대상은 대민 프로필에서 44px 이상(컨트롤 48px). `prefers-reduced-motion` 을 존중한다.

## 9. Agent Prompt Guide (에이전트 프롬프트 지침)

Claude Design · Claude Code 에서 화면을 요청할 때 아래를 첫 메시지에 붙인다.

```
경기도의회 공통 디자인 시스템(DESIGN.md)을 그대로 따른다.
- 프로필: [업무 | 대민] — 업무면 GNB 64 + LNB 256 셸, 고밀도 표 중심. 대민이면 KRDS masthead/identifier 셸, 컨트롤 48px.
- 색은 --ggc-* 토큰만. 새 색 금지. 상태 배지는 텍스트·기호 병기.
- 화면 유형: [Monitor | Explore | Learn/Decide | Configure | Converse | Operate] 의 슬롯 구성을 따른다.
- 빈 상태·오류·로딩 3종을 함께 만든다. 문장은 평서형(–다), 빈 상태·오류 문구만 존댓말.
- 사용자 표기는 실명·역할·부서, 날짜는 YYYY-MM-DD, 숫자는 단위·천단위 콤마·오른쪽 정렬.
- 외부 CDN·outline:none·다크 팔레트를 쓰지 않는다. :focus-visible 링을 유지한다.
```

시안을 코드로 옮길 때는 인라인 `style=` 을 `.ggc-*` 클래스로 흡수하고, `style-hover` 같은
Claude Design 런타임 속성은 `:hover` 규칙으로 손으로 옮긴다(`skills/ggc-design/references/porting.md`).
검증은 `python design/check_design.py --gate <서비스경로>`.
