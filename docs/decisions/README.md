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
| [0010](0010-page-title-in-content.md) | 브레드크럼은 헤더에, 페이지 제목(h1)은 본문 첫 줄 24px 에 (0008 대체) — 설명 줄·상시 큰 제목은 **0012 가 일부 대체** | 2026-09-05 |
| [0011](0011-tier2-primary-for-react.md) | React 계열은 Tier 2 가 정본 — shadcn 공식 소스 + 토큰, 신설 16종 · 셸 재작성 | 2026-09-05 |
| [0012](0012-show-what-is-needed.md) | **필요한 정보부터 보이게 한다** — 덜어내기를 기본으로 · 제목 기본형/간결형 · Operate 정본 (0010 일부 대체) | 2026-10-18 |
| [0013](0013-github-tidy-and-shared-parts.md) | **GitHub 식 정돈 · 서비스 부품 승격 · 판 갈라짐 바로잡기** — 흰 바탕+테두리 · 상태 보이기 가이드 · 부품 5종 · 검사기 판 표시·재복사 도구 | 2026-10-24 |
| [0014](0014-mobile-menu-right-and-shared-rules.md) | **휴대폰 메뉴는 오른쪽 · 모든 쪽이 같은 부품 규칙** — CI 왼쪽·전체메뉴 오른쪽(업무=대민) · 바닥 탭바 없음 · 모서리 토큰화 · 행(상태 위·단추 아래) · 한글 낱말 줄바꿈 | 2026-10-25 |
| [0015](0015-key-info-on-screen-details-on-demand.md) | **핵심만 화면에, 보조 정보는 한 번 눌러서** — 정보 배치표 · 토글팁 · 오른쪽 정보 서랍 · 왼쪽 메뉴 완전 숨김(기억) · 처방형 문장을 조건형으로 | 2026-10-26 |
