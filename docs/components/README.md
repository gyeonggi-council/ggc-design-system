# 컴포넌트 문서

한 컴포넌트에 한 쪽. **용도 → 마크업 → 변형·상태 → 키보드·ARIA → 프로필 → 하지 말 것** 순서로
같은 틀이다. 마크업은 갤러리가 렌더한 DOM 과 같다 — 갤러리(`design/examples/`)의 "마크업" 을
펼치면 그대로 복사할 수 있다.

인벤토리 정본은 [`design/components.tsv`](../../design/components.tsv) 다. 이 표와 CSS 가
어긋나면 `check_design.py --canon` 이 잡는다.

## Tier 1 — CSS 클래스 (전 스택 공용)

| 컴포넌트 | 문서 | 갤러리 | 상태 |
|---|---|---|---|
| 페이지 헤더 (h1 24 · 설명 · 주 액션) `.ggc-page-head` `.ggc-page-title` | [page-head.md](page-head.md) | [components-nav](../../design/examples/components-nav.html) | 있음 (v3) |
| 브레드크럼 `.ggc-breadcrumb` | [breadcrumb.md](breadcrumb.md) | components-nav | 있음 |
| 탭 `.ggc-tabs` | [tabs.md](tabs.md) | components-nav | 있음 |
| 페이지네이션 `.ggc-pagination` | [pagination.md](pagination.md) | components-nav | 있음 |
| 셀렉트 `.ggc-select` | [select.md](select.md) | [components-forms](../../design/examples/components-forms.html) | 있음 |
| 체크박스 · 라디오 · 칩 `.ggc-check` `.ggc-radio` `.ggc-chip` | [check-radio.md](check-radio.md) | components-forms | 있음 |
| 알림 `.ggc-alert` | [alert.md](alert.md) | [components-overlay](../../design/examples/components-overlay.html) | 있음 |
| 모달 `.ggc-modal` | [modal.md](modal.md) | components-overlay | 있음 |
| 하단 액션바 `.ggc-actionbar` | [actionbar.md](actionbar.md) | components-overlay | 있음 |
| 스피너 `.ggc-spinner` | [spinner.md](spinner.md) | components-overlay | 있음 |
| 스켈레톤 `.ggc-skeleton` | [skeleton.md](skeleton.md) | components-overlay | 있음 |
| 문서 본문 `.ggc-prose` | [prose.md](prose.md) | components-overlay | 있음 |
| 토글 스위치 `.ggc-switch` | [switch.md](switch.md) | components-forms | 있음 |
| 날짜 입력 `.ggc-date` | [date.md](date.md) | components-forms | 있음 |
| 파일 업로드 `.ggc-file` | [file-upload.md](file-upload.md) | components-forms | 있음 |
| 커스텀 리스트박스 `.ggc-listbox` | [listbox.md](listbox.md) | components-forms | 있음 |
| 아코디언 `.ggc-accordion` | [accordion.md](accordion.md) | components-nav | 있음 |
| 드롭다운 메뉴 `.ggc-menu` | [menu.md](menu.md) | components-nav | 있음 |
| 링크 `.ggc-link` | [link.md](link.md) | components-nav | 있음 |
| 텍스트 목록 `.ggc-text-list` | [text-list.md](text-list.md) | components-nav | 있음 |
| 페이지 내 내비 `.ggc-in-page-nav` | [in-page-nav.md](in-page-nav.md) | components-nav | 있음 |
| 토스트 `.ggc-toast` | [toast.md](toast.md) | components-overlay | 있음 |
| 툴팁 `.ggc-tooltip` | [tooltip.md](tooltip.md) | components-overlay | 있음 |
| 빈 상태 `.ggc-empty` | [empty.md](empty.md) | components-overlay | 있음 |
| 버튼 `.ggc-btn` | [button.md](button.md) | [components](../../design/examples/components.html) | 있음 |
| 배지 · 태그 `.ggc-badge` `.ggc-tag` | [badge.md](badge.md) | components | 있음 |
| 카드 `.ggc-card` | [card.md](card.md) | components | 있음 |
| 통계 타일 `.ggc-stat` | [stat.md](stat.md) | components · dashboard | 있음 |
| 행 리스트 `.ggc-list-row` | [list-row.md](list-row.md) | components · dashboard | 있음 |
| 표 `.ggc-table` | [table.md](table.md) | components | 있음 |
| 폼 필드 `.ggc-field` | [field.md](field.md) | components · components-forms | 있음 |
| 스텝퍼 · 위저드 `.ggc-wizard` | [stepper.md](stepper.md) | components · wizard | 있음 |
| 업무 셸 (유틸리티 바 · 헤더 경로부 · 사이드바(아이콘 · 접힘) · 검색 · 푸터) | [shell.md](shell.md) | dashboard · explore | 있음 (v3) |
| 타이포 스케일 · 아이콘 `.ggc-h1/h2/h3` `.ggc-icon` | [../guides/typography.md](../guides/typography.md) · [../guides/icons.md](../guides/icons.md) | tokens · 전 쪽 | 있음 (v3) |
| QR 로그인 `.ggc-qr` | [qr-login.md](qr-login.md) | login | 있음 |

## 대민 셸 — `design/ggc-public.css` (대민 전용)

| 컴포넌트 | 문서 | 갤러리 | 상태 |
|---|---|---|---|
| 마스트헤드 `.ggc-masthead` | [masthead.md](masthead.md) | [public/index](../../design/examples/public/index.html) | 있음 |
| 헤더 · 주 메뉴 · 통합검색 `.ggc-header` `.ggc-main-menu` | [public-header.md](public-header.md) | public/index | 있음 |
| 공개 푸터 `.ggc-footer--public` | [public-footer.md](public-footer.md) | public/index | 있음 |
| 아이덴티파이어 `.ggc-identifier` | [identifier.md](identifier.md) | public/index | 있음 |
| 사이드 내비 `.ggc-side-nav` | [side-nav.md](side-nav.md) | [public/list](../../design/examples/public/list.html) | 있음 |
| 구조화 목록 `.ggc-structured-list` | [structured-list.md](structured-list.md) | public/index | 있음 |
| 페이지 타이틀 · 히어로 · 본문 컨테이너 | [guides/public-shell.md](../guides/public-shell.md) | public/* | 있음 |

업무/대민 판정과 차이는 [guides/profiles.md](../guides/profiles.md), 대민 화면 6종의 슬롯 처방은
[skills/ggc-design/references/public-patterns.md](../../skills/ggc-design/references/public-patterns.md).

## 동작 — `design/ggc-behaviors.js`

탭 키보드 · 모달 여닫기 · LNB drawer · 토스트 · 드롭다운 메뉴 · 파일 목록 · 툴팁 Esc · 리스트박스 ·
페이지 내 내비는 이 파일 하나가 준다([guides/behaviors-js.md](../guides/behaviors-js.md)). 없어도 화면은 깨지지 않고
동작만 없다. `<script src="ggc-behaviors.js" defer>` 로 넣고, 동적으로 삽입한 마크업은
`GGC.init(루트요소)` 로 다시 묶는다. 자세한 것은 각 컴포넌트 문서의 "키보드 · ARIA".

## 공통 규칙 (모든 컴포넌트)

- 값은 `var(--ggc-*)` 만 쓴다. 새 색을 만들지 않는다.
- 색 단독으로 의미를 전달하지 않는다 — 기호·텍스트·테두리를 함께 둔다.
- `:focus-visible` 링을 없애지 않는다. 고대비(`forced-colors`)에서 배경만으로 구분되는 것이 없어야 한다.
- 대민 프로필(`<html data-ggc-profile="public">`)에서는 치수만 커진다. 마크업은 같다.

## Tier 2 전용 — shadcn 레지스트리 블록 (React, v3.0)

Tier 1 대응이 없는 것. UI 45종은 shadcn 문서 그대로이고(`registry.json` 의 title · description 이 색인), 블록만 여기 문서가 있다.

| 블록 | 문서 | 무엇 |
|---|---|---|
| `@ggc/ggc-shell` + `sidebar` | [sidebar.md](sidebar.md) | 사이드바 셸 v3 — AppSidebar · ShellHeader · ShellMain |
| `@ggc/ggc-data-table` | [data-table.md](data-table.md) | TanStack 표 — 정렬 · 검색 · 열 · 쪽 · 빈 상태 구분 |
| `@ggc/ggc-filter-bar` | [filter-bar.md](filter-bar.md) | Explore 필터 스트립 + 결과 요약 |
| `@ggc/ggc-detail-layout` | [detail-layout.md](detail-layout.md) | 본문 + 결재 레일 · MetaList |
| `@ggc/ggc-wizard-layout` | [wizard-layout.md](wizard-layout.md) | 스텝퍼 → 본문 · 보조 → 액션바 |
