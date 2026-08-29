# Changelog

소비자(11개 서비스)에게 영향이 있는 변경을 적는다.
**토큰 파일 바이트가 바뀌는 변경은 D1 재복사가 필요하다** — 그런 항목은 ⚠ D1 로 표시한다.

## [Unreleased] — v2 재구성

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
