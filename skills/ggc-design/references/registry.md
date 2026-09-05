# Tier 2 착지 — shadcn 레지스트리 (React · Next · Vite + Tailwind v4)

스택이 React 계열이고 Tailwind v4 면 Tier 1(CSS 복사) 대신 이것을 쓴다. 절차는 `docs/quickstart/react-tier2.md`,
여기는 스킬이 지킬 순서와 함정이다. Tailwind 가 없으면 Tier 1 로 간다(`porting.md`).

## 순서

1. `components.json` 확인 — 없으면 `npx shadcn init -b radix -p nova -y` (새 프로젝트: `-t vite|next`, `--no-monorepo`).
2. `registries` 에 `@ggc` 를 넣는다 — 내부망은 clone 한 저장소의 `public/r/{name}.json` 을 **정적 HTTP 로 서빙**(`python -m http.server 8765` 등), 외부망은 GitHub raw **태그** URL. `file://`·절대 경로는 CLI 4.19 미지원(실측).
3. `npx shadcn add @ggc/ggc-style -y` — 토큰 파일 · 테마 매핑 · P0 UI 35종(shadcn 공식 소스 + 토큰, v3). 무거운 것(sidebar · command · calendar · chart · hover-card · input-group · item · button-group · progress · listbox)은 필요할 때.
4. 손으로 셋: ① `index.css`/`globals.css` **첫 줄**에 `@import "../styles/ggc-tokens.css";` 이어 `@import "tailwindcss"; @import "shadcn/tailwind.css"; @import "tw-animate-css";` ② 폰트 2파일을 `public/fonts/` 로 복사 + `<link>` ③ 프리셋의 `.dark {}` 블록 · `@custom-variant dark` · Geist 폰트 import 삭제.
5. 블록은 필요한 것만: 업무 `@ggc/ggc-shell`(사이드바 셸 v3) `ggc-page-head`(h1) `ggc-data-table`(TanStack) `ggc-filter-bar` `ggc-detail-layout` `ggc-wizard-layout` `ggc-stat` `ggc-stepper` `ggc-actionbar` `ggc-list-row` `ggc-search` `ggc-utility-bar` `ggc-footer` `ggc-qr-login` `ggc-file-upload` `ggc-empty` `ggc-prose` · 대민 `ggc-masthead` `ggc-public-header` `ggc-public-layout` `ggc-hero` `ggc-side-nav` `ggc-structured-list` `ggc-public-footer` `ggc-identifier`. 문서: `docs/components/sidebar.md` `data-table.md` `filter-bar.md` `detail-layout.md` `wizard-layout.md`.
6. `python <저장소>/design/check_design.py --gate .` — D1 · D2 · D4 · D7 이 전부 PASS 여야 한다.

## 정본과의 관계

| 무엇 | 어디서 오나 | 값이 갈리면 |
|---|---|---|
| 색·치수 | `styles/ggc-tokens.css` (정본 사본, D1) | 정본을 고치고 재복사 |
| shadcn 변수(`--primary` …) | `@ggc/ggc-theme` 가 `:root` 에 `var(--ggc-*)` 로 넣는다 (D7) | 값을 적지 않는다 |
| 컴포넌트 소스 | `registry/ggc/**`(shadcn 공식 소스 + 토큰 — `cn` 은 `@/lib/utils` · `dark:` 없음 · 링 알파 .20) → `registry.json`(생성, `tools/build-registry-json.py`) → `public/r/*.json`(빌드 `npx shadcn build`, 검사 `tools/check-registry.py`) | 정본 소스를 고치고 생성·재빌드 → 소비자는 `add -o` 로 갱신 |
| 마크업·ARIA | Tier 1 과 같은 구조(`docs/components/*.md`) | |

## 함정

- **`@import` 는 파일 선두** — CLI 가 토큰 import 를 넣지 못한다. 빠뜨리면 모든 `var(--ggc-*)` 가 비어 화면이 무색이 된다. D7 이 잡는다.
- **프리셋의 `.dark` 블록** — 남겨 두면 `.dark` 클래스 한 번에 oklch 회색 팔레트로 뒤집힌다. 지운다(D7 WARN).
- **hex 를 Tailwind 클래스에 적지 않는다** (`bg-[#3c5d93]`) — D2 FAIL. `bg-primary` 또는 `bg-(--ggc-primary)`.
- **shadcn 기본 레지스트리의 같은 이름 항목**(`button`)을 섞지 않는다 — 치수가 토큰이 아니라 프로필이 안 먹는다. 항상 `@ggc/` 접두.
- **`@import "shadcn/tailwind.css"` 를 빠뜨리면** 공식 소스의 `data-open:` `data-checked:` `data-active:` 변형이 컴파일되지 않아 열림·선택 상태가 그려지지 않는다.
- **`@tanstack/react-table` 은 v8** — v9 는 API 가 다르다. 레지스트리가 `^8` 을 박는다.
- **Tailwind v3** 는 `bg-(--x)` 문법이 없다 — `bg-[var(--x)]` 로 바꾸거나 Tier 1 을 쓴다.
- 대민 화면: `<html data-ggc-profile="public">` 만 붙이면 치수가 바뀐다. 대민 셸 블록은 `@ggc/ggc-masthead` `ggc-public-header` `ggc-public-layout` `ggc-hero` `ggc-side-nav` `ggc-structured-list` `ggc-public-footer` `ggc-identifier` — 정적 페이지 위주면 Tier 1 `ggc-public.css` 링크가 더 싸다.
- React 18/19 겸용 — 컴포넌트는 `forwardRef` 없이 함수 컴포넌트(shadcn v4 관례). 18 에서도 동작한다.

## 레지스트리 자체를 고칠 때

```bash
# 소스 수정 → META(제목·설명) → 생성 → 빌드 → 검사 → 커밋 (registry.json · public/r 은 커밋한다 — 그것이 서빙 대상이다)
python tools/build-registry-json.py      # registry.json 생성 — import 에서 의존성을 읽는다
npx shadcn@4.19.0 build registry.json -o public/r
python tools/check-registry.py          # R1 산출물 · R2 신선도 · R3 색 리터럴 · R4 테마 매핑 · R5 인벤토리
python design/check_design.py --canon   # D6 gen 이 check-registry 를 부른다
```

새 항목은 `registry/ggc/` 에 파일을 두고 `tools/build-registry-json.py` 의 `META` 에 제목·설명을 넣는다. `design/components.tsv` 의 Tier2 열과 이름을 맞춘다(R5).
공식 소스를 가져올 때: `import { cn } from "@/lib/utils"` · `dark:` 클래스 제거 · `ring-ring/50` → `/20` · 치수만 토큰(`h-(--ggc-control-h)`).
