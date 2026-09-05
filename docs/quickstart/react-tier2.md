# React · Next · Vite + Tailwind v4 — Tier 2 레지스트리로 붙이기 (v3.0)

`npx shadcn` 으로 **복사 설치**한다. npm 패키지가 아니다 — 컴포넌트 소스가 프로젝트 안에 들어오고,
색은 전부 `var(--ggc-*)` 라 토큰 파일 하나가 값의 원천이다. 검사기 D1(토큰 사본) · D7(테마 매핑)이 지킨다.
v3.0 부터 컴포넌트는 **shadcn 공식 소스 + 토큰**이다(ADR 0011) — 이름 · 변형 · 조립법이 shadcn 문서와 같다.

전제: Tailwind **v4** (`@import "tailwindcss"`), React 18 또는 19, shadcn CLI 4.x. Tailwind v3 는 [아래](#tailwind-v3) 참조.

## 1. 레지스트리 주소를 등록한다

`components.json` 이 없으면 먼저 만든다 — 새 프로젝트는 `npx shadcn init -t vite -n <앱이름> -b radix -p nova -y --no-monorepo`
(Next 는 `-t next`), 기존 프로젝트는 `npx shadcn init -b radix -p nova -y`. 그 다음 `registries` 를 넣는다.

```jsonc
// components.json
{
  "registries": {
    // 택1 — 내부망: 저장소를 clone 한 자리의 정적 서빙 (예: python -m http.server 8765 를 저장소 루트에서)
    "@ggc": "http://<내부호스트>:8765/public/r/{name}.json"
    // 택2 — 외부망: GitHub raw, 태그 고정 (main 을 가리키지 않는다)
    // "@ggc": "https://raw.githubusercontent.com/gyeonggi-council/ggc-design-system/v3.0.0/public/r/{name}.json"
  }
}
```

레지스트리는 `public/r/*.json` 정적 파일이다. **`file://` 와 절대 경로는 shadcn CLI 4.19 가 지원하지 않는다.**

## 2. 한 번에 착지

```bash
npx shadcn add @ggc/ggc-style -y
```

들어오는 것: `styles/ggc-tokens.css`(정본 사본) · `:root` 에 shadcn 변수 → `var(--ggc-*)` 매핑 · `components/ui/` 에 P0 35종
(button · badge · card · input · label · textarea · select · native-select · checkbox · radio-group · switch · dialog · alert-dialog · tabs · alert ·
breadcrumb · pagination · table · skeleton · spinner · accordion · dropdown-menu · tooltip · popover · sheet · separator · avatar · scroll-area ·
collapsible · toggle · toggle-group · sonner · kbd · field · empty).

무거운 것은 필요할 때: `npx shadcn add @ggc/sidebar @ggc/command @ggc/calendar @ggc/chart @ggc/hover-card @ggc/input-group @ggc/item @ggc/button-group @ggc/progress @ggc/listbox`.

블록: 업무 `npx shadcn add @ggc/ggc-shell @ggc/ggc-page-head @ggc/ggc-data-table @ggc/ggc-filter-bar @ggc/ggc-detail-layout @ggc/ggc-wizard-layout @ggc/ggc-stat @ggc/ggc-stepper @ggc/ggc-actionbar @ggc/ggc-search @ggc/ggc-list-row @ggc/ggc-empty @ggc/ggc-prose @ggc/ggc-file-upload @ggc/ggc-utility-bar @ggc/ggc-footer @ggc/ggc-qr-login`.

## 3. 손으로 하는 세 가지

CLI 가 못 하는 것이다. 빠뜨리면 검사기가 잡는다.

```css
/* ① src/index.css (app/globals.css) 첫 줄부터 — 순서 고정 */
@import "../styles/ggc-tokens.css";   /* @import 는 파일 선두여야 한다 */
@import "tailwindcss";
@import "shadcn/tailwind.css";        /* 공식 컴포넌트가 쓰는 data-open · data-checked · data-active 변형 */
@import "tw-animate-css";             /* 열림/닫힘 애니메이션 */
```

```bash
# ② 폰트 — 자체 호스팅. 외부 CDN 을 링크하지 않는다(망분리, D4)
cp <저장소>/design/ggc-fonts.css <저장소>/design/fonts/PretendardGOVVariable.subset.woff2 public/fonts/
```
```html
<!-- index.html / layout.tsx: 토큰보다 먼저 -->
<link rel="stylesheet" href="/fonts/ggc-fonts.css">
```

③ 프리셋이 만든 **`.dark { … }` 블록과 `@custom-variant dark` · `@fontsource-variable/geist` import 를 지운다.** 계약 §3 이 다크모드를 비범위로 뒀고,
남겨 두면 D7 이 WARN 한다. 공식 소스의 `dark:` 변형은 이식 때 이미 제거했다.

## 4. 첫 화면 — 셸 + 제목 + 표

```tsx
// app.tsx — 셸(사이드바 · 헤더) 안에 본문. 제목 h1 은 헤더가 아니라 본문 첫 줄(ADR 0010)
import { Shell, ShellFrame, AppSidebar, ShellInset, ShellHeader, ShellMain, SkipLink } from "@/components/ggc-shell"
import { PageHead } from "@/components/ggc-page-head"
import { DataTable } from "@/components/ggc-data-table"
import { Toaster } from "@/components/ui/sonner"

<Shell>
  <SkipLink />
  <ShellFrame>
    <AppSidebar brand={…} groups={…} user={…} />
    <ShellInset>
      <ShellHeader breadcrumb={…} search={…} notifications={3} />
      <ShellMain wide>
        <PageHead title="의안 목록" desc="제12대 · 제380회 정례회 · 접수 147건" actions={<Button><PlusIcon />의안 등록</Button>} />
        <DataTable columns={columns} data={rows} searchKey="title" pageSize={20} />
      </ShellMain>
    </ShellInset>
  </ShellFrame>
  <Toaster />
</Shell>
```

자세한 조립은 `docs/components/sidebar.md` · `data-table.md` · `filter-bar.md` · `detail-layout.md` · `wizard-layout.md`.

## 5. 대민(공개) 화면이면

`<html data-ggc-profile="public">` 한 줄. 토큰을 참조하는 컨트롤(버튼 · 입력 · 표 · 라벨 · 제목)이 KRDS 치수(48px · 17px · h1 32)로 바뀌고 색은 그대로다.
공식 소스의 리터럴 `text-sm` 본문은 커지지 않는다 — 대민은 정적 페이지 위주라 Tier 1 `ggc-public.css` 링크를 권장한다.
대민 셸 블록: `@ggc/ggc-masthead` `ggc-public-header` `ggc-public-layout` `ggc-hero` `ggc-side-nav` `ggc-structured-list` `ggc-public-footer` `ggc-identifier`.

## 6. 검사

```bash
python <저장소>/design/check_design.py --gate .
```

| 검사 | 무엇을 본다 |
|---|---|
| D1 | `styles/ggc-tokens.css` 가 정본과 같은가 (LF 정규화) |
| D2 | 소스(tsx 포함)의 색 리터럴이 정본 허용집합 안인가 |
| D4 | 외부 폰트 CDN 0 |
| D7 | `components.json` 에 `@ggc` · index.css 가 토큰을 import · `--primary` 등이 `var(--ggc-*)` · 다크 팔레트 없음 |

## 쓰는 법 — 어디가 shadcn 과 다른가

API 는 shadcn 문서 그대로다(`Button` · `Dialog` · `Tabs` · `Sidebar` · `Form(field)` …). 다른 것은 이것뿐이다.

| | |
|---|---|
| 버튼 | 공식 변형 + `variant="dashed"`(점선 추가). 높이는 토큰(`--ggc-control-h*`)이라 프로필을 따른다 |
| 배지 | 공식 변형 + 상태 7종 `variant="session|meeting|recess|approved|pending|rejected|paid"` + 역할 4종 `role-*`. 항상 텍스트·lucide 아이콘과 함께. `<Tag>` 는 분류 |
| 표 | `<TableHead num>` `<TableCell num>` — 우정렬 + tabular-nums. thead 상단 2px primary-deep |
| 라벨 | `<Label required>` |
| 모달 | `<DialogContent alert>` — 파괴적 동작 확인(배경 클릭 무시 · alertdialog). `<DialogBody>` 스크롤 본문 |
| 알림 | `<Alert variant="info|success|warning|danger">` 틴트 + 좌측 띠 |
| 토스트 | `sonner` — `<Toaster />` 한 번, `toast.success("저장됨")`. 3개 상한 · 5초 |
| 테마 radius | `rounded-lg` = 컨트롤 10 · `rounded-xl` = 카드 14 · `rounded-md` = 6 — 테마가 토큰을 댄다 |

Tailwind 유틸에서 토큰을 직접 쓸 때: `h-(--ggc-control-h)` · `text-(length:--ggc-text-sm)` · `bg-(--ggc-success-tint)` · `text-(--ggc-text-muted)`.
**hex 를 적지 않는다** — D2 가 잡는다. 아이콘은 `lucide-react` 만.

## Tailwind v3

v3 프로젝트는 `@theme inline` 이 없다. `tailwind.config` 의 색을 `var(--primary)` 로 두고, 레지스트리 컴포넌트의 `bg-(--ggc-*)` 문법은 v3 에서
`bg-[var(--ggc-*)]` 로 바꿔야 한다. 공식 소스가 v4 문법(`data-open:` 등)에 깊이 의존하므로 **v3 는 Tier 1 CSS 를 링크하고 클래스만 쓰는 편이 낫다.**

## 실증

- 2026-08-29 (v2.0): Vite + Tailwind v4 + shadcn 4.19 — `add @ggc/ggc-style` → 빌드 → 계산 스타일 27/27 일치.
- 2026-09-05 (v3.0): `docs/design-evidence/v3-tier2-consumer.md` — 레지스트리 74항목 `tsc` 통과 · 소비자 `add` · 빌드 · 계산 스타일(버튼 36 · 입력 36 · 표 14 · 대민 48/17).
