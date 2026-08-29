# Changelog

소비자(11개 서비스)에게 영향이 있는 변경을 적는다.
**토큰 파일 바이트가 바뀌는 변경은 D1 재복사가 필요하다** — 그런 항목은 ⚠ D1 로 표시한다.

## [Unreleased] — v2 재구성

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
