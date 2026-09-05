# Changelog

소비자(11개 서비스)에게 영향이 있는 변경을 적는다.
**토큰 파일 바이트가 바뀌는 변경은 D1 재복사가 필요하다** — 그런 항목은 ⚠ D1 로 표시한다.

## [Unreleased] — v2 재구성

### README 컴포넌트 미리보기 (2026-09-04)

- `design/examples/build-shots.py` 신설 — 갤러리 실물 화면 3장 + 컴포넌트 13장을 헤드리스 Chrome 으로 찍어
  `design/examples/shots/*.png` 를 만든다. README 상단 "컴포넌트 미리보기" 절이 이걸로 보인다(GitHub 웹은 HTML 을
  렌더하지 않는다). 생성물이며 `manifest.json` 의 **입력 해시**로 신선도를 판정한다(픽셀은 환경마다 달라 바이트 비교 안 함).
  `check_design.py --canon` D6 `gen` 에 편입 — `--check` 는 표준 라이브러리만 써 CI 에서 그대로 돈다
- `.ggc-gnb-page` 브레드크럼 마지막 항목의 구분자 오른쪽 간격 보정(block 전환으로 빠진 gap) — ⚠ D1 `ggc-components.css`

### GNB 제목부 — 브레드크럼·페이지 제목을 GNB 로 (2026-09-04)

- `ggc-components.css` §9 `.ggc-gnb-page` + `.ggc-gnb-page-title` 신설 — 브레드크럼 + `<h1>` 이 본문 첫 줄이 아니라
  **GNB 안**(브랜드 슬롯과 검색 사이)에 산다. 업무 셸 기본 규칙([ADR 0008](docs/decisions/0008-page-title-in-gnb.md)).
  화면당 h1 은 GNB 에 하나, `<main aria-labelledby="page-title">`. 64px 고정이라 줄바꿈 없이 말줄임 —
  잘릴 수 있는 의안명은 본문에 전문. §10: ≤900 브레드크럼 숨김 · ≤480 제목 시각 숨김(접근성 트리 유지).
- `.ggc-page-head` 는 **메타 + 주 액션**으로 좁아졌다(선택자 불변 · `.meta:first-child` 마진 보정). Monitor 인사말은
  `<p class="title">`. 셸 ⓐ(GNB 없음)만 예전처럼 h1 을 여기 둔다.
- 갤러리 8쪽 GNB 에 제목부 적용(login 제외), dashboard·wizard 본문 헤더를 정본 `.ggc-page-head` 로 교체,
  components-nav 에 "GNB 제목부" 절 신설. 합본은 쪽 전환 시 제목부를 `<template>` 로 갈아 끼운다.
- Tier 2: `ggc-shell` 에 `GnbPage breadcrumb title titleId` · `ShellMain titleId`; `ggc-page-head` 는 `title` 선택,
  `greeting` 이면 `<p>`.
- 문서: 계약 §2 · layout-shell · shell · breadcrumb · page-head · archetypes · 스킬 components.md · ADR 0008
- 합본 결함 수정: `ggc-behaviors.js` 주석의 `</script>` 가 인라인 스크립트를 조기 종료시켜 합본에서 동작 스크립트 전체가
  SyntaxError 로 죽어 있었다(drawer · 탭 · 토스트 무반응). 생성기가 인라인 시에만 `<\/script` 로 이스케이프한다 — 정본 불변
- ⚠ D1 — `ggc-components.css` 바이트가 바뀌었다. 사본 재복사 필요(토큰 파일은 불변)

### Phase 9b — Tier 2 레지스트리 22항목 신설 (총 47) (2026-08-30)

- UI 6종: `switch` · `accordion` · `dropdown-menu` · `tooltip`(Radix + 토큰) · `toast`(GGC.toast 와 같은 규칙의
  React store — 3개 상한 · hover/focus 정지) · `listbox`(behaviors ⑨ 이식 — `aria-activedescendant` · 필터 · 다중)
- 블록 16종: `ggc-empty` · `ggc-file-upload`(`input.files` 역동기화) · `ggc-prose` · `ggc-list-row` · `ggc-search` ·
  `ggc-utility-bar` · `ggc-footer` · `ggc-qr-login` · **대민 셸 8종**(`ggc-masthead` · `ggc-identifier` ·
  `ggc-public-header`(PC 드롭다운 · 모바일 패널 · 통합검색) · `ggc-public-footer` · `ggc-public-layout` ·
  `ggc-hero` · `ggc-side-nav` · `ggc-structured-list`)
- `ggc-style` 이 UI 23종을 한 번에 설치. 색 리터럴 0(hex 대신 토큰·별칭) — R3 통과,
  **R5 WARN 0** — 인벤토리 '있음' 행 전부에 Tier 2 항목이 생겼다. check-registry 항목 47 · FAIL 0 · WARN 0
- 실증: Vite + Tailwind v4 소비자에 22항목 `shadcn add` → `tsc -b` · `vite build` 통과, 헤드리스 Chrome 26/26 —
  스위치 토글(40×22 · primary) · 토스트(polite · success 띠) · 메뉴 Esc · 툴팁 · 리스트박스 키보드/필터 ·
  파일 목록/삭제 · 대민 셸 렌더 · 대민 프로필 48px · 콘솔 오류 0
- 문서: 스킬 색인 · registry.md · react-tier2 의 "(Phase 9)" 예고를 실제 항목명으로 교체

### Phase 9a — Tier 1 P1·P2 컴포넌트 12종 (2026-08-30)

- `ggc-components.css` §24~§35 신설: `.ggc-switch`(`role="switch"`) · `.ggc-toast(-region)` · `.ggc-accordion`(`<details>`,
  `name` 배타) · `.ggc-date(-range)`(네이티브) · `.ggc-file` + `.ggc-file-list` · `.ggc-menu`(`<details>` + `role="menu"`) ·
  `.ggc-link` · `.ggc-empty`(ADR 0006 — 레이아웃만) · `.ggc-listbox`(`aria-activedescendant`) · `.ggc-tooltip` ·
  `.ggc-in-page-nav` · `.ggc-text-list`. §36 고대비 보강. **새 색 0 · 이미지 0** — 전부 토큰
- `ggc-behaviors.js` ⑤~⑩: `GGC.toast()`(3개 상한 · hover/focus 중 정지 · `[data-ggc-toast]` 선언형) · 메뉴 키보드
  (↑↓ Home End · ESC 복귀) · 파일 목록(삭제를 DataTransfer 로 `input.files` 에 되돌림) · 툴팁 ESC(WCAG 1.4.13) ·
  리스트박스(단일 선택은 포커스 따라감 · 앞글자 · 필터) · 페이지 내 내비(스크롤 기준선 25% + 바닥 규칙 —
  IntersectionObserver 띠 방식은 갱신을 건너뛰어 실측 후 폐기)
- 갤러리 3쪽(forms · nav · overlay)에 12절 추가, components.html "세 상태" 를 `.ggc-empty` · `.ggc-skeleton` 실물로 교체
- `docs/components/` 12쪽 신설(총 40종) · behaviors-js 가이드 · 스킬 `components.md` 색인 갱신 ·
  TSV 있음 48종(예정: combobox · calendar)
- 실증: 헤드리스 Chrome 48/48 PASS — 키보드(스위치 · 메뉴 · 리스트박스) · 토스트 상한/닫기/실행 취소 · 툴팁 ESC ·
  파일 `input.files` 동기화 · 스크롤스파이 중간/바닥 · 3쪽 × 3폭 오버플로 0 · 콘솔 오류 0 · 대민 프로필 치수
- ⚠ D1 — `ggc-components.css` · `ggc-behaviors.js` 바이트가 바뀌었다. 사본 재복사 필요(토큰 파일은 불변)

### Phase 8 — CI (2026-08-30)

- `tools/check-all.sh` — 정본(D6) · 갤러리 업무/대민(D1~D5) · 문서 링크 · Tier 2 레지스트리(R1~R5) 전수. Python 만 필요
- `.github/workflows/check.yml` — push · PR 마다 check-all + `npx shadcn build` 재빌드 diff(산출물 신선도)
- 실증: DESIGN.md 를 의도적으로 낡게 만들면 check-all 이 실패한다

### Phase 6 — 사람용 문서 (2026-08-30)

- `docs/README.md` 독자별 진입, `docs/quickstart/` 스택별 5단계 7종(정적 HTML · Jinja2 · FastAPI · JSP/Tiles · Vite React · Next · React Tier 2)
- `docs/guides/` tokens · accessibility · fonts · brand-assets · layout-shell · behaviors-js (+ profiles · public-shell)
- `docs/components/` 기존 컴포넌트 10종 문서(button · badge · card · stat · list-row · table · field · stepper · shell · qr-login) — 총 28종
- `docs/decisions/` ADR 7건(상태색 CI 유지 · 고대비 · 프로필 단일 파일 · 복사 배포/Tier 2 · Radix+Tailwind v4 · 빈 상태 조립 · 브랜드 별도 저장소)
- README 읽는 순서 갱신, 검사기 표에 D7

### Phase 5 — 스킬 v2 (2026-08-29)

- `skills/ggc-design/SKILL.md` 재작성 — 독립 실행(`$ROOT` 탐색 규칙), 결정 트리(프로필 → Tier → 셸 → 화면 → 컴포넌트 → 검증),
  7문항 결정 대화, 기록은 `<서비스>/docs/design-decisions.md` · 증거는 `docs/design-evidence/`.
  `/1ggc-deploy` · `state.json` · `G-DESIGN` 결합 제거
- 참조 신설 `components.md`(과업 → 클래스 색인) · `profiles.md` · `public-patterns.md` · `registry.md`, 개정 `contract.md`
  (정본 위치·토큰 색인 v2.0) · `verify.md`(검사 7종·증거 파일) · `porting.md`(폰트 정본·Tier 2) · `domain-language.md` · `archetypes.md`
- `tools/install-skill.sh`(링크 설치) · `.claude-plugin/plugin.json`(플러그인 매니페스트)

### Phase 7 — Tier 2 shadcn 레지스트리 (2026-08-29)

- `registry.json` + `registry/ggc/` 25항목: `ggc-tokens`(정본 사본, registry:file) · `ggc-theme`(shadcn 변수 → `var(--ggc-*)`,
  hex 0 · dark 없음) · `ggc-style`(한 번에 착지) · UI 17종(button · badge/tag · card · input/field · label · textarea ·
  select · checkbox · radio-group · dialog · tabs · alert · breadcrumb · pagination · table · skeleton · spinner) ·
  블록 5종(ggc-shell · ggc-stat · ggc-stepper · ggc-actionbar · ggc-page-head). shadcn v4 관례(`radix-ui` · `data-slot` ·
  함수 컴포넌트), 치수는 `--ggc-control-h*` 등 토큰이라 대민 프로필을 따른다
- `public/r/*.json` 빌드 산출물 커밋(서빙 대상). `npx shadcn build registry.json -o public/r`
- `tools/check-registry.py` 신설(R1 산출물 · R2 신선도 · R3 색 리터럴 · R4 테마 매핑 · R5 인벤토리), D6 gen 에 등록
- `check_design.py` **D7 REGISTRY** 신설 — `components.json` 이 있는 프로젝트에서 @ggc 등록 · 토큰 import · `:root` 매핑이
  전부 `var(--ggc-*)` 인지 · `.dark` 팔레트 유무
- 문서: `docs/quickstart/react-tier2.md`, 스킬 참조 `registry.md`, README
- 실증: Vite + Tailwind v4 + shadcn 4.19 소비자 프로젝트에서 `init -t vite -b radix -p nova` → `add @ggc/ggc-style` → 빌드 →
  계산 스타일 27/27 일치(버튼 42/#3C5D93/10px · 입력 44 · 표 13 · 대민 토글 48/17), `check_design --gate` D1·D7 PASS

### Phase 4 — 대민 프로필 + 공개 셸 (2026-08-29)

- `design/ggc-public.css` 신설 — 마스트헤드 · 헤더(유틸리티·브랜딩·통합검색) · 주 메뉴(PC 드롭다운/모바일 패널) ·
  본문 컨테이너·페이지 타이틀·히어로 · 사이드 내비(`<details>`) · 구조화 목록 · 공개 푸터 + 아이덴티파이어 ·
  반응형 · 고대비 · 인쇄. KRDS 마크업·ARIA, 색은 기관 CI. 이미지 자산 0(국가 상징은 서비스 슬롯)
- `ggc-behaviors.js` ④ 대민 메뉴 패널 · 2단 아코디언 · 통합검색 토글
- `ggc-components.css` §0 **box-sizing 잠금** — 정본이 서비스 리셋에 기대던 결함 수정(대민 갤러리에서 실측)
- `check_design.py`: D1 이 정본 5파일(tokens · components · public · fonts · behaviors) 사본을 LF 정규화 md5 로 대조,
  D3 프로필 분기(마크업 자동 판정 · `--profile`), 대민 화면의 업무 GNB/LNB 는 FAIL, 허용집합에 public css 포함
- 갤러리 `examples/public/` 4쪽(메인 · 의안 검색 · 의안 상세 · 의견 제출), 업무 갤러리 LNB 에 링크
- 문서: `docs/guides/profiles.md` · `public-shell.md`, `docs/components/` 대민 6종, 스킬 참조 `profiles.md` ·
  `public-patterns.md`, `domain-language.md` 대민 어휘 절
- 검증: 4쪽 접근성 린트(h1·alt·라벨·랜드마크·스킵·버튼 이름·id 중복) · 5폭 오버플로 0 · 모바일 메뉴/검색 동작 · 콘솔 오류 0

### Phase 3 — Tier 1 P0 컴포넌트 (2026-08-29)

- `ggc-components.css` §12~§24 신설: `.ggc-page-head` `.ggc-breadcrumb` `.ggc-tabs` `.ggc-pagination`
  `.ggc-select` `.ggc-check/.ggc-radio/.ggc-chip` `.ggc-alert` `.ggc-modal(<dialog>)` `.ggc-actionbar`
  `.ggc-spinner` `.ggc-skeleton` `.ggc-prose` `.ggc-sr` + 고대비 보강. 마크업·ARIA 는 KRDS 컴포넌트 HTML,
  CSS 는 토큰으로 재구현. 이미지 자산 0, 새 색 0
- `design/ggc-behaviors.js` 신설 — 탭(roving tabindex·화살표) · 모달(showModal·포커스 복귀·배경 클릭) ·
  LNB drawer. 외부 파일 1개, 인라인 0, 의존성 0
- 갤러리 3쪽 신설(`components-forms` · `components-nav` · `components-overlay`), 전 쪽 LNB 갱신,
  합본 생성기가 9쪽 + behaviors.js 를 담음
- `check_design.py` D6 inventory: `components.tsv` ↔ CSS 양방향 대조(있음 행 미정의 FAIL, 표 누락 계열 WARN)
- `components.tsv`: 12종 예정 → 있음

### Phase 2 — DESIGN.md 생성기 (2026-08-29)

- `design/components.tsv` 신설 — 컴포넌트 인벤토리 정본(현행 17 + 예정 30). 문서·DESIGN.md·
  레지스트리 lint 의 단일 원천
- `tools/build-design-md.py` 신설 — 루트 `DESIGN.md`(Claude Design 가져오기용 9절 구조)를
  토큰 CSS·인벤토리에서 생성. 대비비는 `check_design.contrast()` 재사용. `--check` 지원
- `check_design.py` D6 gen: `DESIGN.md` 신선도 검사 등록(경로 해석을 design/ 기준 상대로 일반화)
- README: 「Claude Design 에서 쓰기」 절

### Phase 1 — 토큰 v2.0 + 프로필 (2026-08-29) ⚠ D1

- `ggc-tokens.css` v2.0: 신설 `--ggc-space-8~11`, `--ggc-text-body` 승격, 컨트롤 치수·밀도·폭 토큰
  14종(`--ggc-control-h*` `--ggc-input-h` `--ggc-search-h` `--ggc-*-font` `--ggc-cell-pad`
  `--ggc-row-pad` `--ggc-card-pad` `--ggc-container-max`), **`[data-ggc-profile="public"]` 대민 블록**
  (값은 KRDS 토큰에서 기계적으로 옮김). **색은 하나도 바뀌지 않았다**
- `ggc-components.css` v2.0: 리터럴 → 토큰 값-불변 리팩터. 갤러리 6쪽 × 2폭 계산 스타일 해시
  리팩터 전후 12/12 일치 실측. `--ggc-text-body` 정의는 토큰으로 이동
- `check_design.py` D6: 프로필 블록 검사 — 허용 목록(치수 14종) 밖 토큰·색 값이 있으면 FAIL
- `docs/contract.md` §9 프로필 조항 신설, §3 에 `text-body` 색인 추가
- `.gitattributes` 로 줄끝 LF 고정 (OS 무관 D1)
- `docs/migration/v1.2-to-v2.md` 신설
- 갤러리 `tokens.html`: 신설 토큰 절 + 대민 프로필 미리보기 토글

### Phase 0 — 정본화 (2026-08-29)

- **이 저장소를 정본으로 승격.** 상위 플랫폼 저장소(`ggc_ai_platform`) 경로 의존을 전부 제거
- `skills/2ggc-design/` → `skills/ggc-design/` 개명 (파이프라인 번호 접두 제거)
- `docs/23-…-단일디자인-계약.md` → `docs/contract.md` 개명
- `tools/sync-from-platform.sh` · `redaction.local.sed.example` · `docs/03-공통디자인가이드.md`(구판)
  → `archive/` 로 이동
- `check_design.py`: 서비스 루트 하드코딩 기본값 제거 — `GGC_SERVICES` 환경변수 또는
  `--all <경로>` 로 지정한다. 미지정이면 자산 배포 검사는 "해당 없음" 으로 표기(SKIP ≠ PASS)
- `design/fonts/build-font.py`: 커버리지 기준 경로를 `GGC_FONT_BASELINE` 환경변수로 지정
- `tools/check-links.py` 신설 — 문서 상대링크 존재·절대경로(`D:\`·`/d/…`)·원문 IP 패턴 검사
- README: 「이 저장소의 지위」를 정본 선언으로 재작성, 「공개 전환 전 확인할 것」을
  「공개 이력과 남은 주의점」으로 정리. **검증 명령 예시에 정규식 이스케이프 형태로 남아
  있던 원문 IP 를 제거**

## [1.2.0] — 2026-08-22 (v2 이전 마지막 정본)

- 토큰 v1.2: WCAG AA 보정(상태색 4종·중립 램프 2단), `--ggc-text-faint` 를 비텍스트 전용으로 강등 ⚠ D1
- 컴포넌트 v1.2: `.ggc-qr` QR 로그인 블록 신설, `forced-colors`·`prefers-contrast` 미디어 블록
- 폰트 정본 v1.0: 가변 woff2 단일 파일 + `ggc-fonts.css`
