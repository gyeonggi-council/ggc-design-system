# v2.0 → v3.0 — 업무 프로필이 shadcn 기본 밀도로, 제목은 본문으로, 아이콘은 lucide 로

⚠ **D1** — 정본 파일의 바이트가 바뀌었다: `ggc-tokens.css` · `ggc-components.css` · 신설 `ggc-icons.svg`. 사본을 **재복사**한다.
색은 하나도 바뀌지 않았다. 바뀐 것은 **치수 · 제목 위치 · 아이콘 · Tier 2 구성**이다.
결정: [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) · [0010](../decisions/0010-page-title-in-content.md) · [0011](../decisions/0011-tier2-primary-for-react.md).

## 렌더가 어떻게 달라지나 (업무 프로필)

| | v2.0 | v3.0 |
|---|---|---|
| 버튼 sm / 기본 / lg | 34 / 42 / 46 | 32 / 36 / 40 |
| 입력 · 검색 · 아이콘 버튼 | 44 · 40 · 40 | 36 · 36 · 36 |
| 컨트롤 · 라벨 · 표 글자 | 13.5 · 13 · 13 | 14 · 14 · 14 |
| 표 셀 · 행 · 카드 패딩 | 11×10 · 15×22 · 18×22 | 8×12 · 12×16 · 16×20 |
| 페이지 제목 | GNB 안 18px | 본문 첫 줄 24px |
| 카드 제목 · KPI 숫자 | 16/800 · 30 | 16/700 · 30 (토큰) |
| LNB 항목 | 13.5px · 상하 10 | 14px · 높이 32 · 아이콘 슬롯 · 접힘 변형 |

**리플로우가 있다.** 컨트롤이 6~8px 낮아지고 표 행이 촘촘해진다. 1440×900 기준 목록 화면 첫 화면 행수가 대략 1.5배가 된다.
대민 프로필(`data-ggc-profile="public"`)은 **무변경** — KRDS 치수 그대로.

## Tier 1 (CSS 복사) — 할 일

1. 정본 6파일을 **재복사**한다: `ggc-fonts.css` · `ggc-tokens.css` · `ggc-components.css` · `ggc-public.css`(대민) · `ggc-behaviors.js` · **`ggc-icons.svg`**(신설).
2. **제목을 본문으로 옮긴다.** GNB 의 `<h1 class="ggc-gnb-page-title">` 을 지우고, 본문 첫 줄 `.ggc-page-head` 에
   `<h1 class="ggc-page-title" id="page-title">` + `<p class="desc">` 를 둔다. `.ggc-gnb-page` 에는 브레드크럼만 남긴다.
   `.ggc-gnb-page-title` 은 v3.0 에서 한 판 더 살아 있다(폐기 예정, v3.1 삭제). `<main aria-labelledby="page-title">` 은 그대로.
3. **이모지 · 기호를 아이콘으로.** `<span class="icon">📋</span>` → `<span class="icon"><svg class="ggc-icon ggc-icon--lg" aria-hidden="true"><use href="#i-clipboard-list"/></svg></span>`.
   배지의 `● ◷ ✓ ✕ ◆ ○`, 버튼의 `＋ ← →`, 추이의 `▲ ▼` 도 같다 — 어휘표는 [guides/icons.md](../guides/icons.md).
   스프라이트는 같은 오리진에서 `ggc-icons.svg#i-…` 로 참조하거나(서빙되는 앱) `<body>` 첫 줄에 인라인한다(정적 HTML · file://).
4. 리터럴 글자 크기가 있으면 토큰으로: 13.5px → `var(--ggc-text-base)` · 12.5px → `var(--ggc-text-sm)` · 제목은 `.ggc-h1/.ggc-h2/.ggc-h3`.
5. `python design/check_design.py --gate <서비스>` — D1 이 6파일 사본을 대조한다.

## Tier 2 (shadcn 레지스트리) — 할 일

Tier 2 는 **공식 shadcn 소스 + 토큰**으로 다시 만들어졌다(ADR 0011). 같은 이름으로 다시 `add` 하면 덮어써진다.

```bash
npx shadcn add @ggc/ggc-style -y --overwrite          # 토큰 · 테마 · P0 35종
npx shadcn add @ggc/ggc-shell @ggc/ggc-page-head @ggc/ggc-data-table -y --overwrite
```

손으로 하는 것 (v2 의 셋 + 하나):

```css
/* globals.css 첫 줄부터 — 순서 고정 */
@import "../styles/ggc-tokens.css";
@import "tailwindcss";
@import "shadcn/tailwind.css";      /* ← 신설. 공식 소스가 쓰는 data-open · data-checked · data-active 변형 */
@import "tw-animate-css";           /* ← 신설. 열림/닫힘 애니메이션 */
```

`shadcn` · `tw-animate-css` 패키지는 `@ggc/ggc-theme` 이 의존성으로 끌어온다. `.dark` 블록은 여전히 지운다.

### API 가 바뀐 것

| v2.0 | v3.0 | 비고 |
|---|---|---|
| `Button variant="secondary"` (테두리) | `variant="outline"` | 공식 이름. `secondary` 는 인셋 배경 |
| `Button variant="ghost" \| "dashed"` | 그대로 | `dashed` 는 이 저장소 고유 |
| `Select`(네이티브) | `Select` = Radix, 네이티브는 `NativeSelect` | `native-select` 항목 |
| `Field · FieldHint · FieldError` (input.tsx) | `Field · FieldLabel · FieldDescription · FieldError` (`field` 항목) | 공식 필드. react-hook-form 과 조립 |
| `toast()` (toast.tsx) | `toast()` from `sonner` + `<Toaster />` | `sonner` 항목 |
| `Badge variant="approved" …` | 그대로 + 공식 변형(default · secondary · outline …) | |
| `<DialogContent alert size="lg">` | `<DialogContent alert className="sm:max-w-3xl">` | size 는 className |
| `ggc-shell`: `Shell · UtilityBar · Gnb · GnbBrand · GnbPage · Lnb · ShellMain` | `Shell · ShellFrame · AppSidebar · ShellInset · ShellHeader · ShellMain · SkipLink` | 사이드바 기반. 유틸리티 바는 `@ggc/ggc-utility-bar` |
| `PageHead meta greeting` | `PageHead title desc actions` — h1 을 그린다 | ADR 0010 |
| `TableHead num · TableCell num` | 그대로 | |

### 신설

`sidebar` · `sheet` · `popover` · `command` · `calendar` · `chart` · `sonner` · `form(field)` · `separator` · `avatar` · `scroll-area` · `progress` ·
`collapsible` · `toggle` · `toggle-group` · `hover-card` · `kbd` · `empty` · `item` · `input-group` · `button-group` · `alert-dialog` · `native-select`,
블록 `ggc-data-table` · `ggc-filter-bar` · `ggc-detail-layout` · `ggc-wizard-layout`, 훅 `use-mobile`. 목록: `registry.json`(생성물 — `tools/build-registry-json.py`).

## 검사기 · 생성물

- `check_design.py`: D1 정본 6파일 · D6 프로필 허용 목록에 타이포 스케일 · D6 gen 에 `build-icons.py` · `build-registry-json.py`
- `tools/check-registry.py`: R3 에 chart 의 Recharts 속성 선택자(`[stroke='#ccc']`) 예외
- 생성물: `design/ggc-icons.svg` · `registry.json` · `design/examples/examples-standalone.html` · `shots/` · `DESIGN.md` · `public/r/`
