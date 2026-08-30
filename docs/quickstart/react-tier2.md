# React · Next · Vite + Tailwind v4 — Tier 2 레지스트리로 붙이기

`npx shadcn` 으로 **복사 설치**한다. npm 패키지가 아니다 — 컴포넌트 소스가 프로젝트 안에 들어오고,
색은 전부 `var(--ggc-*)` 라 토큰 파일 하나가 값의 원천이다. 검사기 D1(토큰 사본) · D7(테마 매핑)이 지킨다.

전제: Tailwind **v4** (`@import "tailwindcss"`), React 18 또는 19, shadcn CLI 4.x. Tailwind v3 는 [아래](#tailwind-v3) 참조.

## 1. 레지스트리 주소를 등록한다

`components.json` 이 없으면 먼저 만든다 — 새 프로젝트는 `npx shadcn init -t vite -b radix -p nova -y --no-monorepo`
(Next 는 `-t next`), 기존 프로젝트는 `npx shadcn init -b radix -p nova -y`. 그 다음 `registries` 를 넣는다.

```jsonc
// components.json
{
  "registries": {
    // 택1 — 내부망: 저장소를 clone 한 자리의 정적 서빙 (예: python -m http.server 8765 를 저장소 루트에서)
    "@ggc": "http://<내부호스트>:8765/public/r/{name}.json"
    // 택2 — 외부망: GitHub raw, 태그 고정 (main 을 가리키지 않는다)
    // "@ggc": "https://raw.githubusercontent.com/gyeonggi-council/ggc-design-system/v2.0.0/public/r/{name}.json"
  }
}
```

레지스트리는 `public/r/*.json` 정적 파일이다 — 어떤 정적 웹서버에 올려도 `{name}.json` 이 열리면 된다.
**`file://` 와 절대 경로는 shadcn CLI 4.19 가 지원하지 않는다**("not implemented yet", 2026-08-29 실측).
내부망에서는 clone 한 저장소 루트에서 `python -m http.server 8765` 같은 정적 서버를 띄우고 그 주소를 쓴다.

## 2. 한 번에 착지

```bash
npx shadcn add @ggc/ggc-style -y
```

들어오는 것: `styles/ggc-tokens.css`(정본 사본) · `src/index.css`(또는 `app/globals.css`)의 `:root` 에 shadcn 변수 →
`var(--ggc-*)` 매핑 · `components/ui/` 에 button · badge · card · input · label · textarea · select · checkbox ·
radio-group · dialog · tabs · alert · breadcrumb · pagination · table · skeleton · spinner.

블록은 따로: `npx shadcn add @ggc/ggc-shell @ggc/ggc-stat @ggc/ggc-stepper @ggc/ggc-actionbar @ggc/ggc-page-head`.

## 3. 손으로 하는 세 가지

CLI 가 못 하는 것이다. 빠뜨리면 검사기가 잡는다.

```css
/* ① src/index.css (app/globals.css) 첫 줄 — @import 는 파일 선두여야 한다 */
@import "../styles/ggc-tokens.css";
@import "tailwindcss";
```

```bash
# ② 폰트 — 자체 호스팅. 외부 CDN 을 링크하지 않는다(망분리, D4)
cp <저장소>/design/ggc-fonts.css <저장소>/design/fonts/PretendardGOVVariable.subset.woff2 public/fonts/
```
```html
<!-- index.html / layout.tsx: 토큰보다 먼저 -->
<link rel="stylesheet" href="/fonts/ggc-fonts.css">
```

③ 프리셋이 만든 **`.dark { … }` 블록을 지운다.** 계약 §3 이 다크모드를 비범위로 뒀고, 남겨 두면 D7 이 WARN 한다.
`@fontsource-variable/geist` import 도 지운다 — `--font-sans` 는 이미 `var(--ggc-font)` 다.

## 4. 대민(공개) 화면이면

`<html data-ggc-profile="public">` 한 줄. 버튼·입력·표가 KRDS 치수(48px · 17px)로 바뀌고 색은 그대로다.
대민 셸(마스트헤드 · 헤더 · 공개 푸터)은 Tier 1 `ggc-public.css` 를 그대로 링크해 쓴다 — Tier 2 블록은 Phase 9.

## 5. 검사

```bash
python <저장소>/design/check_design.py --gate .
```

| 검사 | 무엇을 본다 |
|---|---|
| D1 | `styles/ggc-tokens.css` 가 정본과 같은가 (LF 정규화) |
| D2 | 소스(tsx 포함)의 색 리터럴이 정본 허용집합 안인가 |
| D4 | 외부 폰트 CDN 0 |
| D7 | `components.json` 에 `@ggc` · index.css 가 토큰을 import · `--primary` 등이 `var(--ggc-*)` · 다크 팔레트 없음 |

## 쓰는 법 — 어디가 Tier 1 과 다른가

API 는 shadcn 과 같다(`Button` · `Dialog` · `Tabs` …). 다른 것은 셋이다.

| | |
|---|---|
| 배지 | `<Badge variant="approved">✓ 승인</Badge>` — 상태 7 + 역할 4. 텍스트·기호를 반드시 함께. `<Tag variant="primary">` 는 분류 |
| 폼 | `<Field><Label required>…</Label><Input /><FieldHint /><FieldError /></Field>` — `.ggc-field` 와 같은 구조 |
| 표 | `<TableHead num>` `<TableCell num>` — 우정렬 + tabular-nums. `<TableCaption>` 은 화면 밖 |
| 모달 | `<DialogContent alert>` — 확인형(배경 클릭 무시, `alertdialog`). `<DialogBody>` 가 스크롤 영역, `<DialogFooter note="…">` |
| 크기 | 버튼 `size="sm" | "lg"`, 셀렉트 `size="sm"`. 값은 토큰이라 프로필을 따른다 |

Tailwind 유틸에서 토큰을 직접 쓸 때: `rounded-(--ggc-radius)` · `bg-(--ggc-success-tint)` · `text-(--ggc-text-muted)` ·
`h-(--ggc-control-h)` · `text-(length:--ggc-control-font)`. **hex 를 적지 않는다** — D2 가 잡는다.

## Tailwind v3

v3 프로젝트는 `@theme inline` 이 없다. `tailwind.config` 의 색을 `hsl(var(--primary))` 래퍼 없이 **`var(--primary)`** 로 두고,
`:root` 매핑은 위 §2 가 넣어 준 것을 그대로 쓴다. 레지스트리 컴포넌트의 `bg-(--ggc-*)` 문법은 v3 에서 `bg-[var(--ggc-*)]` 로
바꿔야 한다 — 그 작업량이 크면 Tier 1 CSS(`ggc-components.css`)를 링크하고 클래스만 쓰는 편이 낫다.

## 실증 (2026-08-29)

Vite + Tailwind v4 + shadcn 4.19 에서 `init -t vite -b radix -p nova` → `add @ggc/ggc-style` → 빌드 → 계산 스타일 대조:
버튼 42px/#3C5D93/radius 10 · 입력 44px · 표 13px · 대민 토글 시 48/48/17 — Tier 1 갤러리와 같다.
