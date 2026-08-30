# 프로필 판정 — 업무인가 대민인가 (Phase 1 의 0번 문항)

스킬이 화면을 만들기 전에 **가장 먼저** 정한다. 프로필이 셸 · 치수 · 화면 패턴 · 어휘를 한꺼번에 가른다.
사람용 설명은 `docs/guides/profiles.md`, 값은 `design/ggc-tokens.css` 의 프로필 블록. 여기는 스킬의 절차다.

## 판정

```
로그인 없이 도민·외부인이 여는 화면인가?
  예  → public   (<html data-ggc-profile="public"> + ggc-public.css)
  아니오 → 의원·사무처·정책지원관이 업무를 처리하는가?
            예  → work (기본 — 속성 없음)
            섞임 → 기본 public, 관리자 구역만 data-ggc-profile="work" 서브트리. 드물어야 하고 사용자에게 확인한다.
```

판정을 `<프로젝트>/docs/design-decisions.md` 첫 줄에 적는다: `프로필: work | public`.

## 프로필이 정하는 것

| | work | public |
|---|---|---|
| 착지 파일 | `ggc-fonts.css` · `ggc-tokens.css` · `ggc-components.css` (+ `ggc-behaviors.js`) | 같은 셋 + **`ggc-public.css`** |
| 셸 | `references/porting.md` — 유틸리티 바 + GNB/LNB (`ggc-components.css` §9) | `docs/guides/public-shell.md` — 스킵 링크 · 마스트헤드 · 헤더/주 메뉴 · 공개 푸터 · 아이덴티파이어 |
| 화면 패턴 | `references/archetypes.md` 6종 | `references/public-patterns.md` 6종 |
| 어휘 | `references/domain-language.md` 앞 다섯 절 | 같은 문서 "대민 화면은 어휘가 뒤집힌다" 절 |
| 검사 | `check_design.py --gate <경로>` (D3 가 work 셸 기대) | 같은 명령 (마크업의 속성으로 public 판정, `--profile public` 으로 강제 가능) |
| 실물 | `design/examples/dashboard.html` · `wizard.html` | `design/examples/public/*.html` |

## 하지 말 것

- 대민 화면에 업무 GNB/LNB 를 쓰기 — D3 FAIL.
- 프로필 값을 서비스 CSS 에서 덮어쓰기 — 치수가 갈린다. 값이 틀리면 정본의 프로필 블록을 고친다.
- 한 페이지 안에서 프로필을 여러 번 바꾸기.
- 대민에서 색을 바꾸기 — 대민도 기관 CI 네이비다(사용자 결정 2026-08-29).
