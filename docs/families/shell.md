# 패밀리 — 셸

**권위: current.** 형제: 업무 셸 `.ggc-shell`(`.ggc-utility-bar` · `.ggc-gnb` · `.ggc-lnb` · `.ggc-shell-main` · `.ggc-footer`) · 대민 셸(`.ggc-masthead` · `.ggc-header` · `.ggc-main-menu` · `.ggc-footer--public` · `.ggc-identifier`) · 휴대폰 1인 링크 `.ggc-solo` · 페이지 머리 `.ggc-page-head`. 치수는 계약 §2, 부품별 마크업은 [components/shell.md](../components/shell.md) · [guides/public-shell.md](../guides/public-shell.md) · [components/solo.md](../components/solo.md).

## 함께 지키는 것

| 계약 | 판정법 |
|---|---|
| **화면의 h1 은 본문 첫 줄 하나** — `.ggc-page-head` 의 `.ggc-page-title`(`--ggc-h1-size`). 헤더에는 브레드크럼만(ADR 0010). 간결형은 `.ggc-sr` 로 남긴다(ADR 0012) | `h1` 개수 = 1 · 헤더 안 h1 = 0 (vibe 채점 · 스킬 완료 목록) |
| **스킵 링크가 첫 초점** — `.ggc-skip-link` → `<main id>` | Tab 한 번에 「본문으로」 |
| **CI(브랜드) 왼쪽 · 「전체메뉴」 오른쪽** — 업무 · 대민 · 1인 링크가 같은 자리 · 같은 말. 서랍은 오른쪽에서, 머리는 「전체메뉴」 + 닫기(ADR 0014) | ≤900 에서 세 셸의 단추 위치가 같다 |
| **바닥 탭 바 없음** — 바닥은 스티키 액션바(`.ggc-actionbar` · `.ggc-solo-bar` · `.ggc-work-actions`) 자리. 안전 영역만큼 여백 | 탭 바 마크업 0건 |
| **한글 낱말을 끊지 않는다** — 셸 뿌리에 `word-break: keep-all` + `overflow-wrap: break-word`. 넓은 표는 `.ggc-table-wrap` 안에서 가로로 | 「기획재 / 정위원회」 식 줄바꿈 0건 |
| **화면 틀은 흔들리지 않는다** — 검색 · 조건 변경에 메뉴 · 검색창 · 단추 자리가 그대로 | README 다섯 가지 ④ |
| **프로필을 섞지 않는다** — 대민 페이지에 업무 GNB/LNB 없음, 업무 화면에 마스트헤드 없음. 1인 링크 화면은 대민 셸 생략(사용자 승인, 계약 §9) | D3 |
| **유틸리티 바는 기본 숨김**(v3.2.1) — 마크업은 둔다. 문서 허브만 서비스 CSS 에서 되돌린다 | D3 가 존재를, 기본 CSS 가 숨김을 본다 |
| **LNB 접힘은 그 화면이 열려 있는 동안 기억** — 토글은 GNB 맨 앞 아이콘 단추(`aria-expanded`) | 새로고침 전까지 유지 |
| **GNB 에는 자리가 같은 것만** — 브레드크럼 · 검색 · 알림. 제목 · 날짜 · 건수 · 인사말은 헤더에 두지 않는다 | less.md 군더더기 목록 |

## 선택 기준

| 화면 | 셸 |
|---|---|
| 로그인한 직원 · 의원의 업무 | `.ggc-shell` — 화면이 5개를 넘으면 풀셸(GNB + LNB), 단폭 PoC 는 유틸리티 바(숨김) + 본문 |
| 로그인 없이 도민이 보는 화면 | 대민 셸 전체(마스트헤드 → 헤더 → 본문 → 공개 푸터 → 아이덴티파이어) |
| 로그인 없는 개인 링크(서명 · 설문 한 문항 · 출석) | `.ggc-solo` — 100svh · 글자 크게 · 바닥 막대 |

## Tier 2

`ggc-shell`(`AppSidebar` `ShellHeader` `ShellMain`) + `sidebar` · `ggc-page-head` · 대민은 `ggc-masthead` `ggc-public-header` `ggc-public-footer` `ggc-identifier` `ggc-public-layout`. 계약은 Tier 1 과 같다 — 제목은 `PageHead`, 브레드크럼은 `ShellHeader`.
