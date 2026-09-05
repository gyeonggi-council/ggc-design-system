# 0011 — React 계열은 Tier 2(shadcn 레지스트리)가 정본, shadcn 관례를 그대로 따른다 (2026-09-05)

## 상황
v2.0 에서 Tier 2 는 Tier 1 CSS(`ggc-components.css`, Claude Design 목업 실측)를 tsx 로 **이식한 것**이었다. 그래서
`px-[18px]` `text-[13px]` `rounded-[8px]` 같은 리터럴이 컴포넌트마다 박혔고, `select` 는 네이티브, `toast` 는 자체 스토어였으며,
업무 시스템에 필수인 `sidebar` · `data-table` · `command`/`combobox` · `calendar`/`date-picker` · `popover` · `sheet` · `form` · `chart` 가 없었다(23/≈50).
사용자 요청은 "shadcn 디자인 가이드 기본으로 충실하게" 였다. 진단: **구조(레지스트리 · radix · cva · data-slot)는 충실, 시각 언어와 구성은 아니다.**

## 결정
- **React/Next/Vite + Tailwind v4 서비스는 Tier 2 가 정본이다.** Tier 1 CSS 는 비-React 스택(JSP · Jinja2 · FastAPI · 정적 HTML)용으로 유지한다.
  둘의 값은 여전히 토큰 파일 하나에서 온다(D1 · D7).
- **shadcn v4 관례를 그대로 쓴다** — 공식 컴포넌트 소스를 가져와 색·치수만 토큰으로 바꾼다. 변형 이름은 shadcn 과 같다
  (`Button variant="default|secondary|outline|ghost|link|destructive"` + 이 저장소 고유 `dashed`). 치수는 Tailwind 스케일 대신
  토큰(`h-(--ggc-control-h)`)을 써서 대민 프로필이 Tier 2 에도 먹게 한다(ADR 0005 유지).
- **교체**: `select` → Radix Select(`native-select` 는 별도 항목으로 유지) · `toast` → `sonner` 래퍼(토큰 매핑).
- **신설 UI**: `sidebar` · `sheet` · `popover` · `command` · `combobox` · `calendar` · `date-picker` · `form`(react-hook-form + zod) ·
  `chart`(Recharts, `chart-1..5` 는 이미 토큰 매핑) · `sonner` · `separator` · `avatar` · `scroll-area` · `progress` · `collapsible` · `toggle-group`.
- **블록**: `ggc-shell` 을 같은 이름으로 **재작성**(v3 major) — `SidebarProvider` + 사이드바(브랜드 · 시스템 스위처 · lucide 아이콘 메뉴 ·
  `collapsible="icon"`) + 헤더 64(SidebarTrigger · 브레드크럼 · 검색 · 알림 · 사용자) + `SidebarInset`. `ggc-page-head` 가 h1 을 그린다(ADR 0010).
  신설 `ggc-data-table`(TanStack) · `ggc-filter-bar` · `ggc-detail-layout` · `ggc-wizard-layout`. 대민 블록 8종은 무변경.
- **다크 없음 · 새 색 없음**은 그대로다. Sonner · Recharts · Calendar 가 요구하는 색은 전부 기존 토큰 별칭으로 댄다.

## 근거
- shadcn 의 가치는 "소스를 소유한다" 와 "생태계 블록을 그대로 조립한다" 둘이다. 이식본은 전자만 얻고 후자를 잃는다.
- 업무 시스템 화면의 대부분은 목록(표)·상세·폼이다. `data-table` · `form` · `combobox` · `date-picker` 없이는 서비스마다 다시 발명한다 — 그것이 드리프트다.
- 공식 소스를 쓰면 shadcn 이 고치는 접근성 결함이 그대로 따라온다. 자체 구현은 그 흐름에서 끊긴다.

## 결과
- `registry/ggc/ui/*`(39종) · `registry/ggc/blocks/*` · `registry.json` · `public/r/`(재빌드) · `tools/check-registry.py` R3~R5 통과
- `docs/quickstart/react-tier2.md` v3 · `skills/ggc-design/references/registry.md` · `components.md`
- 소비자 실증: `docs/design-evidence/v3-tier2-consumer.md`
