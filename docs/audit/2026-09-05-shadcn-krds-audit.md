# 진단 — v2.0 은 shadcn 기본에 충실한가, 업무 프로필에 KRDS 가 필요한가 (2026-09-05)

사용자 질문 셋에 답하려고 v2.0(2026-08-30 · 커밋 `ec7984a`)을 실측했다. 대상: README · `design/ggc-tokens.css` · `docs/contract.md` ·
ADR 0001~0008 · `registry.json` 47항목 · `registry/ggc/ui/*.tsx` · 갤러리 스크린샷 12장(`design/examples/shots/`) · shadcn/ui v4 기본값 ·
KRDS HTML Component Kit 1.1.0(`KRDS-uiux/krds-uiux`).

결정은 [ADR 0009](../decisions/0009-work-profile-shadcn-density.md) · [0010](../decisions/0010-page-title-in-content.md) ·
[0011](../decisions/0011-tier2-primary-for-react.md). 이 문서는 **근거**다.

## 1. shadcn 충실도 — 구조는 충실, 시각 언어와 구성은 아니다

### 충실한 것 (유지)
- 레지스트리: `registry.json` → `npx shadcn build` → `public/r/*.json`, 소비는 `npx shadcn add @ggc/…`. npm 패키지가 아니라 **복사**(ADR 0004).
- 컴포넌트 관례: `radix-ui` 통합 패키지 · `class-variance-authority` · `cn()` · `data-slot` · 함수 컴포넌트(forwardRef 없음) · new-york · lucide 선언.
- 테마: shadcn 변수(`--primary` `--background` `--sidebar-*` `--chart-*` …)를 **전부** `var(--ggc-*)` 로 매핑. hex 0. Tailwind v4 `@theme inline`.
- 검사: `check-registry.py` R1~R5 · `check_design.py` D7 이 소비 프로젝트의 매핑·다크 팔레트 유무까지 본다.

### 충실하지 않은 것

| 항목 | v2.0 실측 | shadcn v4 기본 | 무엇이 문제인가 |
|---|---|---|---|
| 정본의 위치 | Tier 1 BEM CSS 128KB(Claude Design 목업 실측)가 정본이고 Tier 2 는 그것을 tsx 로 **이식** | 컴포넌트 소스가 정본 | `button.tsx` 에 `px-[18px]` `rounded-[8px]` `text-[13px]`, `ggc-shell.tsx` 에 `text-[13px] text-[#c9d6ea] gap-[11px] px-[18px]` — shadcn 블록과 조립하면 치수가 어긋난다 |
| 컨트롤 밀도 | 버튼 34/42/46 · 입력 44 · 검색 40 · 글자 13.5 · 표 13 · 셀 11×10 · 행 15×22 · 카드 18×22 | 버튼 32/36/40 · 입력 36 · 글자 14 · 셀 8 | **업무 화면이 shadcn 보다 성기다.** 1440×900 대시보드 첫 화면에 목록 행 3개 |
| 타이포 스케일 | 토큰 없음. h1 18(GNB) · 카드 제목 16 · 본문 13~14 · 부제 12.5 | 24/18/14/12 계층 | 제목:본문 = 1.3. 위계가 없다 |
| 업무 셸 | 유틸리티 바 32 + GNB 64 + LNB 256(자체 구현 · 접기 없음 · 아이콘 없음) | `sidebar`(collapsible icon 48) + header 64 | 크롬 두 띠 + 넓은 LNB 가 본문을 잠식 |
| 아이콘 | `iconLibrary: lucide` 선언. 갤러리·Tier 1 은 📋 ✓ ◷ ✕ 📄 🗓 이모지·유니코드 | lucide 일관 | 글꼴 렌더러마다 모양이 다르고, 제품 인상이 가장 크게 갈린다 |
| 구성 | UI 23종 | ≈50종 | 없음: sidebar · data-table · command · combobox · calendar · date-picker · popover · sheet · form · chart · sonner · separator · avatar · scroll-area · progress · collapsible · toggle-group · hover-card |
| select · toast | 네이티브 `<select>` · 자체 store | Radix Select · Sonner | 생태계 블록(폼 · 필터)과 호환 안 됨 |
| 다크 모드 | 없음 | 있음 | **의도적**(ADR 0005 · 계약 §3) — 유지 |

### 판정
"shadcn 으로 붙는다" 는 조건은 충족했으나 "shadcn 처럼 보이고 shadcn 처럼 조립된다" 는 조건은 미충족. 원인은 하나 — **Tier 2 가 목업 CSS 의 이식본**이라는 것.

## 2. 업무 프로필에 KRDS 가 필요한가 — 치수·셸은 아니고, 접근성 바닥은 필요하다

v2.0 은 이미 프로필로 갈라 놓았다: 기본(속성 없음)=업무, `data-ggc-profile="public"`=KRDS 치수. 셸도 갈라져 있다(업무 GNB/LNB vs 대민 마스트헤드·헤더·푸터).
즉 "빼야 하나" 의 답은 **치수와 셸은 이미 빠져 있고, 업무 프로필의 문제는 KRDS 가 아니라 목업 CSS 다.** 다만 v2.0 컴포넌트 CSS 가 "마크업·ARIA 는 KRDS 컴포넌트 HTML 을 따랐다" 고 명시하고 있어(§0 주석 · `krds-alignment.md §8`) 업무 컴포넌트에도 KRDS 마크업 제약이 스며 있었다.

| KRDS 의 무엇 | 업무 프로필 | 대민 프로필 | 근거 |
|---|---|---|---|
| 색(#246BEB 등) | ✕ (기관 CI) | ✕ (기관 CI) | ADR 0001 · 계약 §9 |
| 치수(48/56 · 17/19 · 셀 12×16) | ✕ → shadcn 기본 | ✓ | ADR 0009 |
| 셸(마스트헤드 · 아이덴티파이어 · 공개 헤더/푸터) | ✕ | ✓ | 계약 §9 |
| 컴포넌트 마크업 참조 | ✕ → shadcn/Radix | ✓ (Tier 1 `ggc-public.css`) | ADR 0011 |
| 간격 스케일(4·8·12·16·20·24·32·40·48·64·80) | ✓ (Tailwind 스텝과 같다) | ✓ | `krds-alignment.md §3` |
| **접근성**: KWCAG 2.2 AA 4.5:1 · `:focus-visible` · forced-colors · ARIA · 키보드 | **✓** | ✓ | 「장애인차별금지법」 — 내부 시스템 포함 |
| 고대비 모드(KRDS 다크 팔레트) | ✕ | ✕ | ADR 0002 |

## 3. "한눈에 안 들어온다" — 스크린샷 실측 원인 6

`design/examples/shots/screen-dashboard.png`(1440×720 @2x) · `screen-wizard.png` · `table.png` · `cards.png` · `stats.png` 기준.

1. **h1 이 GNB 띠 안 18px** — 제목이 크롬처럼 읽히고 본문은 인사말로 시작한다. 시선의 닻이 없다. → ADR 0010
2. **상단 띠 2단(유틸리티 32 + GNB 64) + LNB 256** — LNB 항목은 15px · 상하 여백 큼 · 아이콘 없음 · 활성 표시는 옅은 틴트. 접히지 않는다. → `sidebar` collapsible
3. **동일 가중 흰 카드 격자** — KPI 4 · 큐 카드 · 표 카드 · 우측 레일 3 이 전부 같은 테두리·같은 제목 크기(16). 주 작업 영역이 없다. → 타이포 스케일 + `ggc-page-head`
4. **저채도 팔레트에 강조 수단이 색뿐** — 네이비 #3C5D93 은 채도가 낮고 AA 보정으로 상태색이 어두워졌다. 색은 바꾸지 않는다(ADR 0001). 강조는 **크기·굵기·간격**으로. → `--ggc-h*` · `--ggc-kpi-size`
5. **이모지·유니코드 아이콘**(📋 ✓ ◷ ✕ 📄 🗓 ● ◆ ○) — Pretendard 옆에서 이질적이고 Windows/맥 렌더가 다르다. → lucide 스프라이트
6. **큰 컨트롤 · 넓은 패딩** — 42px 버튼 · 15×22 행 패딩 · 18×22 카드 패딩. 담당자는 스크롤보다 대조를 한다(`domain-language.md` "15~20행"). → shadcn 밀도

색을 바꾸지 않고도 1·3·4·6 은 토큰 치수와 스케일로, 2 는 셸 블록으로, 5 는 아이콘 정본으로 해결된다.

## 4. 바꾸지 않는 것
- 색 토큰 전부(브랜드 · 상태 · 중립 · 역할) · 포커스 링 · 서체 · 간격 스케일 · radius · 그림자
- 대민 프로필의 치수와 셸(KRDS) · 대민 블록 8종
- 검사기의 원칙(값은 한 곳 · 락파일 없음 · 생성물 신선도) · 복사 배포 · 다크 없음
