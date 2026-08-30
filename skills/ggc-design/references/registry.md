# Tier 2 착지 — shadcn 레지스트리 (React · Next · Vite + Tailwind v4)

스택이 React 계열이고 Tailwind v4 면 Tier 1(CSS 복사) 대신 이것을 쓴다. 절차는 `docs/quickstart/react-tier2.md`,
여기는 스킬이 지킬 순서와 함정이다. Tailwind 가 없으면 Tier 1 로 간다(`porting.md`).

## 순서

1. `components.json` 확인 — 없으면 `npx shadcn init -b radix -p nova -y` (새 프로젝트: `-t vite|next`, `--no-monorepo`).
2. `registries` 에 `@ggc` 를 넣는다 — 내부망은 clone 한 저장소의 `public/r/{name}.json` 을 정적 서빙, 외부망은 GitHub raw **태그** URL.
3. `npx shadcn add @ggc/ggc-style -y` — 토큰 파일 · 테마 매핑 · P0 UI 17종.
4. 손으로 셋: ① `index.css`/`globals.css` **첫 줄**에 `@import "../styles/ggc-tokens.css";` ② 폰트 2파일을 `public/fonts/` 로 복사 + `<link>` ③ 프리셋의 `.dark {}` 블록과 Geist 폰트 import 삭제.
5. 블록은 필요한 것만: `@ggc/ggc-shell` `ggc-stat` `ggc-stepper` `ggc-actionbar` `ggc-page-head`.
6. `python <저장소>/design/check_design.py --gate .` — D1 · D2 · D4 · D7 이 전부 PASS 여야 한다.

## 정본과의 관계

| 무엇 | 어디서 오나 | 값이 갈리면 |
|---|---|---|
| 색·치수 | `styles/ggc-tokens.css` (정본 사본, D1) | 정본을 고치고 재복사 |
| shadcn 변수(`--primary` …) | `@ggc/ggc-theme` 가 `:root` 에 `var(--ggc-*)` 로 넣는다 (D7) | 값을 적지 않는다 |
| 컴포넌트 소스 | `registry/ggc/**` → `public/r/*.json` (빌드는 `npx shadcn build`, 검사는 `tools/check-registry.py`) | 정본 소스를 고치고 재빌드 → 소비자는 `add -o` 로 갱신 |
| 마크업·ARIA | Tier 1 과 같은 구조(`docs/components/*.md`) | |

## 함정

- **`@import` 는 파일 선두** — CLI 가 토큰 import 를 넣지 못한다. 빠뜨리면 모든 `var(--ggc-*)` 가 비어 화면이 무색이 된다. D7 이 잡는다.
- **프리셋의 `.dark` 블록** — 남겨 두면 `.dark` 클래스 한 번에 oklch 회색 팔레트로 뒤집힌다. 지운다(D7 WARN).
- **hex 를 Tailwind 클래스에 적지 않는다** (`bg-[#3c5d93]`) — D2 FAIL. `bg-primary` 또는 `bg-(--ggc-primary)`.
- **shadcn 기본 레지스트리의 같은 이름 항목**(`button`)을 섞지 않는다 — 무색 버튼이 들어온다. 항상 `@ggc/` 접두.
- **Tailwind v3** 는 `bg-(--x)` 문법이 없다 — `bg-[var(--x)]` 로 바꾸거나 Tier 1 을 쓴다.
- 대민 화면: `<html data-ggc-profile="public">` 만 붙이면 치수가 바뀐다. 대민 셸은 Tier 1 `ggc-public.css` 를 링크한다(Tier 2 블록은 Phase 9).
- React 18/19 겸용 — 컴포넌트는 `forwardRef` 없이 함수 컴포넌트(shadcn v4 관례). 18 에서도 동작한다.

## 레지스트리 자체를 고칠 때

```bash
# 소스 수정 → 빌드 → 검사 → 커밋 (public/r 은 커밋한다 — 그것이 서빙 대상이다)
npx shadcn build registry.json -o public/r
python tools/check-registry.py          # R1 산출물 · R2 신선도 · R3 색 리터럴 · R4 테마 매핑 · R5 인벤토리
python design/check_design.py --canon   # D6 gen 이 check-registry 를 부른다
```

새 항목은 `registry.json` 에 넣고 `design/components.tsv` 의 Tier2 열과 이름을 맞춘다(R5).
