# Changelog

소비자(11개 서비스)에게 영향이 있는 변경을 적는다.
**토큰 파일 바이트가 바뀌는 변경은 D1 재복사가 필요하다** — 그런 항목은 ⚠ D1 로 표시한다.

## [Unreleased] — v2 재구성

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
