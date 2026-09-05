# 컴포넌트 색인 — 과업에서 클래스로

"이 화면에 무엇을 쓰나"를 과업 순서로 찾는다. 마크업은 `$ROOT/design/examples/*.html` 의 "마크업" 을 펼쳐 복사하고,
세부는 `$ROOT/docs/components/<name>.md`. Tier 2 이름은 `@ggc/<항목>`.

## 화면 뼈대

| 과업 | Tier 1 | Tier 2 | 문서 · 갤러리 |
|---|---|---|---|
| 업무 셸 (유틸리티바 · 헤더 경로부 · 사이드바(아이콘 · 접힘) · 본문) | `.ggc-utility-bar` `.ggc-gnb` `.ggc-gnb-page` `.ggc-lnb(--icon)` `.ggc-shell-main(--wide)` | `ggc-shell` (`AppSidebar` `ShellHeader` `ShellMain`) + `sidebar` | components/shell.md · sidebar.md · dashboard.html · explore.html |
| 대민 셸 (마스트헤드 · 헤더 · 주 메뉴 · 공개 푸터 · 아이덴티파이어) | `.ggc-masthead` `.ggc-header` `.ggc-main-menu` `.ggc-footer--public` `.ggc-identifier` | `ggc-masthead` `ggc-public-header` `ggc-public-footer` `ggc-identifier` | guides/public-shell.md · public/index.html |
| 페이지 헤더 (**h1 24** · 설명 · 주 액션 — 브레드크럼은 헤더) | `.ggc-page-head` `.ggc-page-title` | `ggc-page-head` (`PageHead` `SectionTitle`) | components/page-head.md |
| 대민 페이지 타이틀 · 히어로 | `.ggc-page-title` `.ggc-hero` | `ggc-public-layout` `ggc-hero` | guides/public-shell.md |
| 현재 경로 (업무 셸은 헤더 경로부 안이 기본) | `.ggc-breadcrumb` | `breadcrumb` | components/breadcrumb.md |
| 제목 스케일 · 아이콘 | `.ggc-h1/.ggc-h2/.ggc-h3` · `.ggc-icon(--lg)` + 스프라이트 | `SectionTitle` · `lucide-react` | guides/typography.md · icons.md |
| 사이드 내비 (대민) | `.ggc-side-nav` | `ggc-side-nav` | components/side-nav.md |
| 로그인 | `.ggc-qr` `.ggc-login` | `ggc-qr-login` | login.html |

## 보여 주기

| 과업 | Tier 1 | Tier 2 | 문서 · 갤러리 |
|---|---|---|---|
| 건수 · KPI | `.ggc-stat-grid` `.ggc-stat` (정확히 4) | `ggc-stat` | components.html |
| 목록 (표) | `.ggc-table-wrap` `.ggc-table` (`--kv` `--flat` `.num` `tr.total`) | `table` · **`ggc-data-table`**(정렬 · 검색 · 열 · 쪽) | components.html · explore.html · components/data-table.md |
| 목록 (행) | `.ggc-card` + `.ggc-list-row` | `ggc-list-row` | components.html |
| 목록 (대민 카드 격자) | `.ggc-structured-list` | `ggc-structured-list` | components/structured-list.md |
| 상태 표시 | `.ggc-badge--approved/pending/rejected/session/meeting/recess/paid` · `--role-*` | `badge` | components.html |
| 분류 · 출처 | `.ggc-tag` | `badge` 의 `Tag` | components.html |
| 카드 | `.ggc-card` `.ggc-card-head` `.ggc-card-foot` `--pad` | `card` | components.html |
| 긴 글 (조문 · 보고서 · 안내) | `.ggc-prose` | `ggc-prose` | components/prose.md |
| 탭 전환 | `.ggc-tabs` | `tabs` | components/tabs.md |
| 페이지 나누기 | `.ggc-pagination` | `pagination` | components/pagination.md |
| 알림 · 콜아웃 · 긴급 띠 | `.ggc-alert(--info/success/warning/danger/--banner)` | `alert` | components/alert.md |
| 짧은 확인 (저장됨 · 복사됨) | `GGC.toast()` → `.ggc-toast` | `sonner` (`toast()` + `<Toaster/>`) | components/toast.md |
| 근거 조문 인용 | `.ggc-prose blockquote` | — | components/prose.md |
| 접는 내용 (FAQ · 고급 조건) | `.ggc-accordion` `.ggc-accordion-group` (`<details>`) | `accordion` | components/accordion.md |
| 본문 링크 · 새 창 · 내려받기 | `.ggc-link(--external/--download/--quiet)` | — | components/link.md |
| 안내 · 유의사항 · 제출 서류 목록 | `.ggc-text-list(--check/--dash)` | — | components/text-list.md |
| 긴 문서의 절 목차 | `.ggc-in-page-nav` + `data-ggc-in-page-nav` | — | components/in-page-nav.md |
| 아이콘 · 약어 보조 설명 | `.ggc-tooltip-wrap` + `.ggc-tooltip` | `tooltip` | components/tooltip.md |

## 입력받기

| 과업 | Tier 1 | Tier 2 | 문서 |
|---|---|---|---|
| 텍스트 · 숫자 | `.ggc-field` + `<input>` | `input` + `field`(`Field` `FieldLabel` `FieldDescription` `FieldError`, react-hook-form) | components.html |
| 날짜 · 기간 | `.ggc-date` · `.ggc-date-range` (`<input type="date">`) | `input type="date"` | components/date.md |
| 긴 글 입력 | `.ggc-field` + `<textarea>` | `textarea` | components.html |
| 선택 (≤20 · 한 줄) | `.ggc-select` | `native-select` (네이티브) · `select` (Radix) | components/select.md |
| 선택 (검색 · >20) | `.ggc-listbox` | `command` + `popover` (콤보박스) | shadcn combobox 문서 |
| 날짜 (달력) | `.ggc-date` | `calendar` + `popover` (date-picker) | shadcn date-picker 문서 |
| 선택 (부제 · 필터 · 다중 · 항상 펼침) | `.ggc-listbox` + `data-ggc-listbox` | `listbox` | components/listbox.md |
| 포함 여부 (제출 시 반영) | `.ggc-check` · `.ggc-check-group` | `checkbox` | components/check-radio.md |
| 켬/끔 (즉시 반영) | `.ggc-switch` (`role="switch"`) | `switch` | components/switch.md |
| 택일 | `.ggc-radio` · `.ggc-check-group` | `radio-group` | components/check-radio.md |
| 파일 첨부 | `.ggc-file` + `data-ggc-file` · `.ggc-file-list` | `ggc-file-upload` | components/file-upload.md |
| 필터 스트립 | `.ggc-chip` + `.ggc-search` + `.ggc-select--sm` | `ggc-filter-bar` + `toggle-group` | explore.html · components/filter-bar.md |
| 단계형 작성 | `.ggc-wizard` + `.ggc-actionbar` | `ggc-wizard-layout` + `ggc-stepper` + `ggc-actionbar` | wizard.html · components/wizard-layout.md |
| 상세 + 결재 레일 | `.ggc-card` 2열(flex) | `ggc-detail-layout` (`MetaList`) | components/detail-layout.md |
| 수치 시각화 | — | `chart` (Recharts, chart-1..5) | shadcn chart 문서 |
| 확인 · 대화 | `.ggc-modal` (`--alert` = 파괴적) | `dialog` | components/modal.md |
| 동작 묶음 ("더보기") | `.ggc-menu` (`<details>` + `role="menu"`) | `dropdown-menu` | components/menu.md |
| 검색창 (GNB) | `.ggc-search` | `ggc-search` | dashboard.html |

## 상태 3종

| 상태 | 어떻게 |
|---|---|
| 로딩 | `.ggc-skeleton`(행 높이 유지) · `.ggc-spinner`(짧은 대기) · 버튼 안 `.ggc-spinner--sm` + disabled |
| 빈 | `.ggc-empty`(제목 = 무엇이 없는지 · 설명 = 왜 없는지 · 행동) — components/empty.md. 필터 때문인지 데이터가 없는지 가른다 |
| 오류 | 인라인은 `.ggc-alert--danger`(사유 + 근거), 영역 전체는 `.ggc-empty--error` + 다시 시도. 코드·시각을 남긴다 |

## 아직 없는 것

Tier 1(CSS) 의 콤보박스 · 커스텀 달력. Tier 2 는 있다(`command`+`popover` · `calendar`). Tier 1 이 필요하면 **정본에 먼저 넣는다** — 서비스에서 발명하지 않는다.
그 전까지는 `.ggc-listbox`(항상 보이는 목록) 와 네이티브 날짜 입력으로 만든다.

## 하지 말 것 (v3.0)

이모지·유니코드 기호 아이콘(📋 ◷ ✕ ● ▲ ＋ ← →) — `.ggc-icon` + 스프라이트(guides/icons.md). h1 을 헤더에 — 본문 첫 줄 `.ggc-page-head`.
