# Claude Design 전 시스템 단일 디자인 계약

**상태:** AUTHORITATIVE · 사용자 지시 2026-07-18

## 1. 원본과 우선순위

공식 `claude_design` MCP에서 무손실 반입한 다음 원본을 사용한다.

1. `docs/design-reference/claude-design/platform-0b392186/의정지원 플랫폼.dc.html` — 공통 셸·화면 전이 마스터
2. `docs/design-reference/claude-design/platform-0b392186/대시보드.dc.html` — Monitor 화면 기준
3. `docs/design-reference/claude-design/platform-0b392186/조례초안 작성 위저드.dc.html` — Configure/단계형 업무 기준
4. `docs/design-reference/claude-design/schedule-0d1de6ca/시스템소개.dc.html` — 일정·목록·상세·작성·결재 정보구조 기준
5. 같은 platform 프로젝트의 나머지 개별 화면 — Learn/Decide, Explore, Converse 화면 기준
6. `DESIGN.md`와 `MANIFEST.json` — 실측 토큰·무결성·알려진 결함

원본이 충돌하면 **계열 N(의정지원 플랫폼)의 네이비 시각 언어와 GNB+LNB 셸**을 전 시스템 공통으로 사용한다. `시스템소개.dc.html`의 인디고 색·풀하이트 사이드바는 복제하지 않고, 그 파일의 업무 정보구조·결재 흐름·달력·목록·상세·작성 패턴만 네이비 셸 안에 적용한다.

## 2. 공통 셸

- 상단 GNB(헤더): 64px, 흰색, 하단 `#E2E7EE` 1px — 화면마다 자리가 같은 것만: 브레드크럼(경로부) · 검색 · 알림. **제목은 헤더에 두지 않는다**
- 페이지 제목(2026-09-05, ADR 0010 — 0008 대체): 본문 첫 줄 `.ggc-page-head` 의 `<h1 class="ggc-page-title">`, 크기 `--ggc-h1-size`(24) · 700. 화면의 h1 은 이것 하나이고 `<main aria-labelledby="page-title">`. 설명 한 줄(`.desc`) + 주 액션 하나. 900px 이하 브레드크럼 숨김(경로는 LNB drawer 의 현재 항목)
- 로고 슬롯/LNB(사이드바): 256px · 접힘 48px(`--ggc-lnb-w-icon`, Tier 2 sidebar collapsible=icon). 항목은 lucide 아이콘 + 라벨, 높이 32
- 페이지 배경: `#EEF1F5`
- 본문: 대시보드 최대 1320px, 기타 업무 화면 최대 1360px
- 카드: 흰색, 1px `#E6EBF1`, radius 14~16px, 카드 그림자 없음
- 검색: 300×`--ggc-search-h`(업무 36 · 대민 48), `#F3F5F9`, radius 10px
- 사용자: 실명·역할·부서, UUID 금지
- 모바일: 900px 이하 GNB 압축 + LNB drawer, 390px 가로 스크롤 0, 주요 업무 동선 도달 가능
- 글꼴: 자체 호스팅 `Pretendard GOV`; 외부 CDN 금지
- 아이콘: lucide 전용 — Tier 1 은 `design/ggc-icons.svg` 스프라이트, Tier 2 는 `lucide-react`. 이모지 · 유니코드 기호 아이콘 금지(ADR 0009)
- 밀도(업무, v3.0): 버튼 32/36/40 · 입력 36 · 글자 14 · 표 셀 8×12 — shadcn 기본과 같다(ADR 0009). 값은 토큰

### 2-1. 와이드 모니터 확폭 (≥1680px — 2026-07-31 신설, 사용자 결정)

업무 환경 대부분이 24인치 이상(FHD 1920+)임을 반영해, 다음 조건으로만 본문 확폭을 허용한다.

- `@media (min-width: 1680px)`에서 본문 최대 폭을 1320→**1560px**, `--wide` 계열은 1360→**1600px**로 확장할 수 있다.
- **1679px 이하 렌더는 위 기본 폭(1320/1360)을 수치상 그대로 보존해야 한다** — 기존 1440×900 검증 증적과 Windows 125% 배율 FHD(뷰포트 1536px)는 확폭의 영향을 받지 않는다(의도된 동작).
- 긴 문서 본문 텍스트의 측정 폭은 가독 한계 **920px로 캡**한다(카드·표는 풀폭 확장 가능). 캡은 확폭 블록 안에만 두어 1679px 이하에서 발동하지 않아야 한다.
- 우측 레일(372px/336px)·KPI 열 수·대민(공개) 셸 폭은 실측 계약값을 유지한다 — 확폭은 콘텐츠 컬럼에만 적용한다.
- 확폭을 채택한 시스템은 §8-5 스크린샷에 **1920×1080을 추가**하고, 확폭 발동·기본 폭 보존을 회귀 테스트(css-contract 등)로 고정한다.
- 선행 구현: BIMS W4(XL-20260731-0003, `ggc_ai_bims` 커밋 `41b0ef1`) — 브레이크포인트·값을 변경할 때는 이 선행 구현과 함께 개정한다.

## 3. 공통 토큰 v1.2

**정본은 `design/ggc-tokens.css` 다.** 아래는 그 파일의 색인이며, 값이 갈리면 파일이 옳다.
(2026-08-22 실물 반영 완료 — 그 전까지 이 문서의 v1.2 는 선언만 있고 파일은 v1.1 이었다.)

- primary `#3C5D93` · primary-deep `#2E4A78` · primary-dark `#345080` · primary-light `#EEF3FA`
- text-strong `#131722`
- text `#1A1F29`
- text-muted `#4A5566`
- text-subtle `#5A6577`
- text-faint `#8A94A3` — **비텍스트 전용**(아이콘·구분·장식). 텍스트에 쓰지 않는다
- text-body `#3A4150` — 카드 안 긴 본문 단락(흰 위 10.23:1). v2.0 에서 컴포넌트 레이어로부터 승격
- 타이포 스케일(v3.0, 값은 토큰 파일): `--ggc-text-xs` ~ `-3xl`(12/13/14/16/18/20/24/30) · `--ggc-h1-size` = 2xl · `--ggc-h2-size` = lg · `--ggc-h3-size` = md · `--ggc-kpi-size` = 3xl · `--ggc-leading-tight/normal`. 대민 프로필은 KRDS 스텝(17 · 20/24/32)으로 덮어쓴다
- 아이콘 치수(v3.0): `--ggc-icon` 16 · `--ggc-icon-lg` 20 (대민 20/24) · `--ggc-icon-stroke` 2
- border `#E6EBF1` · border-strong `#D5DCE5`
- shell-border `#E2E7EE`
- bg `#EEF1F5`
- surface `#FFFFFF`
- success `#0A7B4E` · warning `#9D5E00` · danger `#CD2D2D` · info `#1F6A97`

### 3-1. AA 보정 근거 (2026-08-22)

v1.1 은 **자기 자신이 AA 미달**이었다. 경기도의회는 공공기관이라 KWCAG 2.2(4.5:1)가 법적 준수 대상인데, 상태색 4종이 자기 틴트 위에서 3.65~3.83:1 이었고 §3 의 `.ggc-badge` 7종이 전부 미달이었다. 중립도 text-muted 4.11 · text-subtle 2.71(페이지 배경 `#EEF1F5` 위)이었다.

보정값은 가급적 **디자인 원본(`.dc.html`)이 이미 쓰는 색**에서 골랐다 — "새 값을 발명하지 않는다" 규약을 지키기 위해서다.

| 토큰 | v1.1 | v1.2 | 틴트/배경 위 | 흰 위 | 출처 |
|---|---|---|---|---|---|
| success | `#1F8A5B` 3.83 | **`#0A7B4E`** | 4.69 | 5.31 | 이 문서가 이미 선언한 값 · 원본 ×16 |
| info | `#2882B5` 3.65 | **`#1F6A97`** | 5.06 | 5.89 | 원본의 링크 hover 색 |
| warning | `#B26B00` 3.66 | **`#9D5E00`** | 4.53 | 5.20 | 색상각 유지, 명도만 보정 |
| danger | `#D64545` 3.78 | **`#CD2D2D`** | 4.52 | 5.24 | 색상각 유지, 명도만 보정 |
| text-muted | `#6B7585` 4.11 | **`#4A5566`** | 6.66 | 7.55 | 원본 ×10 |
| text-subtle | `#8A94A3` 2.71 | **`#5A6577`** | 5.20 | 5.89 | 원본 ×4 |

`#8A94A3` 은 정본 최다 사용색이라 **삭제하지 않고 `--ggc-text-faint` 로 역할을 강등**했다. 램프 단조성은 유지된다(15.80 > 14.57 > 6.66 > 5.20).

틴트(`#E6F4EE`·`#FBEED2`·`#FDEAEA`·`#E2F0F8`)와 primary 계열은 **불변**이고, 레이아웃·간격·radius 도 불변이라 리플로우가 없다.

배지 조합은 일반 텍스트 4.5:1 이상이어야 한다. 원본의 AA 미달 색 조합과 `outline:none`(원본 28건)은 복제하지 않는다. **색 단독에 의존하지 않는다** — 상태 배지에는 항상 텍스트 또는 아이콘을 함께 둔다.

### 3-2. 고대비 — 팔레트를 하나 더 만들지 않는다 (2026-08-22 결정)

KRDS 의 `mode-high-contrast` 는 밝은 글자(`text.bolder #E6E8EA` 등)를 쓰는 **사실상 다크 테마**다. 채택하면 §3 이 비범위로 둔 다크모드를 고대비라는 이름으로 우회 도입하게 되고 토큰 표면이 2배가 된다. **따르지 않는다.**

대신 **실제 사용자가 켜는 것**에 대응한다. 사내 PC 는 Windows 고대비 테마이고, 브라우저는 이것을 `forced-colors: active` 로 노출하며 OS 가 색을 통째로 갈아끼운다. 여기서 할 일은 팔레트 정의가 아니라 **깨지지 않게 하는 것**이다.

- ⚠ **`forced-colors` 에서 `box-shadow` 는 렌더되지 않는다.** §3 의 포커스 링이 box-shadow 라 Windows 고대비 모드에서 **포커스 표시가 통째로 사라진다**(WCAG 2.4.7 위반). `outline: 3px solid Highlight` 로 복원한다.
- 배경색만으로 의미를 전달하던 것(배지 7종·활성 내비·합계행·위저드 현재단계)에 **테두리를 보장**한다. 평탄화되면 전부 같아 보인다.
- `prefers-contrast: more` 는 색 반전 없이 중립을 한 단계 진하게(`text-muted` 7.55→10.23, `text-subtle` 5.89→7.55) 하고 링을 두껍게 한다. **새 토큰 이름을 만들지 않는다** — 기존 이름의 미디어 오버라이드다.

구현은 `design/ggc-tokens.css` 와 `design/ggc-components.css` 의 미디어 블록에 있다.

검사: `python design/check_design.py --canon`

공통 포커스:

```css
:focus-visible {
  border-color: #3C5D93;
  box-shadow: 0 0 0 3px rgba(60, 93, 147, .20);
  outline: none;
}
```

## 4. Surface Archetype

- Monitor: KPI 4열 + 업무 큐 + 상태/결재 흐름 + 최근 항목
- Explore: 검색·필터·테이블·상태 칩·페이지네이션
- Learn/Decide: 제목·메타·문서 본문·검토/결재·감사 이력
- Configure: 단계 표시·폼·검증·임시저장·상신/완료 스티키 액션바
- Converse: 대화·출처·스트리밍·오류/재시도·입력 액션
- Operate: 실시간 상태·명령·로그·복구·권한 상태

## 5. 시스템별 필수 착지

| 시스템 | 필수 화면 |
|---|---|
| 통합포털·SSO | 로그인, 홈, 시스템 전환, 검색, AI assistant |
| BIMS 의안관리 | 대시보드, 의안 목록/상세, 등록·접수·회부·심사·의결, 조례초안/발의 위저드, 문서·첨부, 알림·감사, 관리자 |
| 의사일정 | 대시보드, 연간회기, 일정 목록/상세/작성, 결재함 |
| 도의원 인사 | 대시보드, 의원 목록/상세, 위원회, 인사·이력, 관리자 |
| 의정현안 | 대시보드, 분석 목록/상세, 보고서, 검색 |
| 하이패스 | 대시보드, 신청 위저드, 증빙, 결재·정산, 관리자 |
| 입법지원 | 대시보드, 조례초안 5단계, 검토보고서, 비용추계, 필수조례정비, 정책챗 |
| AI gateway/UI | Converse·작업 큐·출처·SSE·오류·권한 |
| 실시간자막 | Operate 대시보드, 세션, 실시간 편집, 상태·오류·복구, 회의록 |

## 6. BIMS 특별 규칙

- 현재 `ggc_ai_bims` React를 실제 서비스 정본으로 유지하되, `작성중_260208-의안처리시스템/bims/bims-web` JSP 100여 화면을 기능 근거로 사용한다.
- JSP를 버리거나 단순 링크로 남기지 않는다. JSP의 화면·역할·상태전이·문서·알림·관리 기능을 React 라우트와 1:1 매핑하고, 누락은 명시적 구현 태스크로 만든다.
- JSP stale main을 운영 정본으로 승격하지 않는다. 기능은 보존·이관하되 시각 계약은 본 문서로 통일한다.
- 의안 데이터·상태·이력·파일 API 계약은 변경하지 않는다. 신규 중복 API를 만들지 않는다.

## 7. 구현 금지

- `.dc.html`을 그대로 iframe/HTML로 삽입
- mock 링크·localhost·Vercel URL
- 장식용 데이터로 실제 업무 대체
- 시스템별 다른 색·셸·반응형 규칙 발명
- 같은 파일을 Claude/Codex가 동시 수정
- 기존 JSP 기능을 근거 없이 삭제
- DB·SSO·공통 API 계약의 임의 변경

## 8. 완료 정의

각 화면은 다음을 모두 만족해야 완료다.

1. 원본 디자인과 route/component 매핑 존재
2. 기존 업무 기능·권한·상태전이 보존
3. 테스트와 production build 통과
4. 실제 실행 서비스에 최신 산출물 배포
5. 1440×900와 390×844 스크린샷 (§2-1 확폭 채택 시 1920×1080 추가)
6. 키보드·skip-link·focus-visible·4.5:1 대비
7. SSO, SPA 새로고침, 정적자산, gateway·외부 E2E
8. 디자인 원본 대비 독립 Claude review
9. Excel에 변경 파일·테스트·스크린샷·잔여 위험 기록

소스 존재, 빌드 성공, `worker_done`, 조건부 적합만으로 완료 처리하지 않는다.

## 9. 프로필 — 업무용과 대민용 (v2.0, 2026-08-29)

한 토큰 파일이 두 프로필을 담는다. **기본(속성 없음)이 업무 프로필**이라 이 계약의 §2~§8 은
그대로 업무 프로필의 규칙이다.

- **대민(공개) 화면**은 `<html data-ggc-profile="public">` 으로 켠다. 서브트리에도 붙는다.
- 프로필이 덮어쓸 수 있는 것은 **치수뿐**이다 — 컨트롤 높이(`--ggc-control-h*` ·
  `--ggc-input-h` · `--ggc-search-h`), 컨트롤·라벨·표 글자 크기(`--ggc-*-font`),
  셀·행·카드 패딩(`--ggc-cell-pad` · `--ggc-row-pad` · `--ggc-card-pad`), 컨테이너 폭
  (`--ggc-container-max`), **타이포 스케일과 아이콘 치수**(v3.0 — `--ggc-text-*` · `--ggc-leading-*` · `--ggc-icon*`). 검사기 D6 가 이 허용 목록으로 강제한다.
- **색·포커스·서체·간격 스케일·상태색은 프로필이 건드리지 못한다.** 대민도 기관 CI 네이비이며
  (2026-08-29 사용자 결정), 상태색은 §3-1 과 `docs/krds-alignment.md §2` 의 결정을 그대로 따른다.
- 대민 프로필의 값은 **KRDS 토큰에서 기계적으로 옮긴다**(`html{font-size:62.5%}` 기준
  1rem=10px). 손으로 적은 값은 없다. 출처는 `design/ggc-tokens.css` 의 프로필 블록 주석.
- 대민 셸(masthead · identifier · 공개 헤더/주 메뉴 · 공개 푸터 · skip-link)은 KRDS 마크업·ARIA
  구조를 따르고 `design/ggc-public.css` 가 담당한다. 업무 셸(§2 GNB/LNB)은 대민에 쓰지 않는다.
- 두 프로필을 **한 화면에 섞지 않는다.** 예외는 업무 화면 안의 도민 안내 구역처럼 명확히
  경계 지어진 서브트리뿐이다.

## 10. 업무 프로필 v3 — shadcn 기본 밀도 · 제목은 본문 · 아이콘은 lucide (2026-09-05)

사용자 지적("내부 업무지원용으로는 아쉽다 · 디자인이 한눈에 안 들어온다")을 실측 진단한 결과(`docs/audit/2026-09-05-shadcn-krds-audit.md`),
색이 아니라 **위계 · 밀도 · 아이콘**이 원인이었다. 결정 셋([ADR 0009](decisions/0009-work-profile-shadcn-density.md) ·
[0010](decisions/0010-page-title-in-content.md) · [0011](decisions/0011-tier2-primary-for-react.md)):

- **업무 프로필 치수 = shadcn 기본**(버튼 36 · 입력 36 · 14px · 셀 8×12). 대민 프로필(KRDS 치수)은 무변경. 색은 불변.
- **타이포 스케일 토큰**으로 위계를 만든다(h1 24 · h2 18 · h3 16 · 본문 14 · 메타 13 · KPI 30). 색은 강조 수단이 아니다.
- **h1 은 본문 첫 줄**, 브레드크럼은 헤더. §2 개정.
- **아이콘은 lucide 전용** — 이모지 · 유니코드 기호 금지. 정본 스프라이트 `design/ggc-icons.svg`(정본 6번째 파일, D1 대조).
- **업무 프로필에서 KRDS 는 접근성 바닥만**(AA · `:focus-visible` · forced-colors · ARIA). 치수 · 셸 · 컴포넌트 마크업 참조는 제외. 표는 `docs/krds-alignment.md §9`.
- **React 계열은 Tier 2 가 정본** — shadcn 공식 소스 + 토큰(Radix Select · Sonner · TanStack Table · react-hook-form · Recharts · sidebar). Tier 1 CSS 는 비-React 스택용.
- **대외 발표용 PPT 템플릿**은 토큰의 생성물(`design/ppt/`, `docs/guides/ppt.md`).

완료 정의 §8 에 추가: ⑩ 이모지 · 유니코드 기호 아이콘 0건 ⑪ 화면의 h1 이 본문 첫 줄 24px 에 하나.
