# 결정 기록 (ADR)

"왜 그렇게 정했나"를 남긴다. 한 결정에 한 파일, 번호순. 뒤집을 때는 새 파일을 만들고 옛 파일에 "대체됨"을 적는다.

| # | 결정 | 날짜 |
|---|---|---|
| [0001](0001-status-colors-keep-ci.md) | 상태색을 KRDS 로 수렴하지 않는다 — 기관 CI 유지 | 2026-08-22 |
| [0002](0002-high-contrast-without-dark.md) | 고대비는 다크 팔레트 없이 `forced-colors` · `prefers-contrast` 로 | 2026-08-22 |
| [0003](0003-single-token-file-profiles.md) | 업무/대민 프로필은 토큰 파일 하나 + `data-ggc-profile` 속성 | 2026-08-29 |
| [0004](0004-copy-not-package-and-tier2.md) | 배포는 패키지가 아니라 복사 — Tier 2 도 shadcn 복사 레지스트리 | 2026-08-29 |
| [0005](0005-radix-and-tailwind-v4.md) | Tier 2 는 Radix + Tailwind v4 · 다크 없음 · React 18/19 겸용 | 2026-08-29 |
| [0006](0006-empty-state-assembled.md) | 빈 상태는 클래스가 아니라 조립 — `.ggc-empty` 는 레이아웃만(Phase 9) | 2026-08-29 |
| [0007](0007-brand-identity-separate-repo.md) | 브랜드 아이덴티티는 별도 저장소 `ggc-design-guide` | 2026-08-30 |
| [0008](0008-page-title-in-gnb.md) | ~~페이지 제목과 브레드크럼은 GNB 제목부에~~ — **0010 으로 대체됨** | 2026-09-04 |
| [0009](0009-work-profile-shadcn-density.md) | 업무 프로필은 shadcn 기본 밀도 · 타이포 스케일 · lucide 아이콘 · KRDS 는 접근성 바닥만 | 2026-09-05 |
| [0010](0010-page-title-in-content.md) | 브레드크럼은 헤더에, 페이지 제목(h1)은 본문 첫 줄 24px 에 (0008 대체) | 2026-09-05 |
| [0011](0011-tier2-primary-for-react.md) | React 계열은 Tier 2 가 정본 — shadcn 공식 소스 + 토큰, 신설 16종 · 셸 재작성 | 2026-09-05 |
