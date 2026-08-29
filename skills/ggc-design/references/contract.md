# 바꾸면 안 되는 것 · 정본은 어디에 있는가

> **이 문서는 색인이다. 값을 담지 않는다.**
> 토큰 이름은 소비자와의 인터페이스라 여기 적어도 안전하지만, 값은 구현이라
> 정본 CSS 한 곳에만 산다. 여기 값을 적는 순간 그 줄은 낡기 시작한다 —
> 계약 문서가 선언한 `success` 값이 실물 파일과 두 달간 어긋나 있던 것이 그 증거다.
> 유일한 예외는 아래 **승격 대기표**이며, 그것은 팔레트가 아니라 작업 목록이다.

## 정본 위치

경로는 전부 **이 저장소 루트 기준**이다.

| 무엇 | 어디 |
|---|---|
| **토큰 정본** | `design\ggc-tokens.css` (v1.2) |
| **컴포넌트 정본** | `design\ggc-components.css` (v1.1) |
| **폰트 정본** | `design\ggc-fonts.css` (v1.0) + `design\fonts\` — @font-face 하나와 woff2 하나. **두 파일을 같은 폴더에 나란히** 복사하고 토큰보다 먼저 링크한다. 재생성은 `fonts\build-font.py` |
| **브랜드 자산 정본** | `design\brand\dist\` + `design\brand\ASSET-MAP.tsv` |
| **검사기** | `design\check_design.py` (`check-design.sh` 는 래퍼) |
| **예제 갤러리** | `design\examples\index.html` — 빌드 없이 열린다. 토큰 전수·컴포넌트 카탈로그·실물 화면 2종 |
| **단일디자인 계약** | `docs\contract.md` — **AUTHORITATIVE** |
| 공통 가이드 (구판) | `archive\03-공통디자인가이드.md` |
| 505줄 실측 문서 · 디자인 원본 8개(`*.dc.html`) · KRDS 원본(토큰 JSON·컴포넌트 HTML 22개) | 플랫폼 저장소(비공개) 자산 — **이 저장소에는 없다.** 필요하면 담당자에게 요청 |

## 토큰 이름 색인 (값은 정본 파일에)

| 역할 | 토큰 이름 | 언제 쓰나 |
|---|---|---|
| 브랜드 | `--ggc-primary` / `-dark` / `-deep` / `-light` / `-light-strong` | 주요 버튼·활성·링크 / hover / pressed·유틸리티바 / 선택 배경 |
| 상태 | `--ggc-success` `--ggc-warning` `--ggc-danger` `--ggc-info` (+ `-tint`) | 승인·확정 / 대기·주의 / 반려·오류 / 정보·회기중 |
| 텍스트 | `--ggc-text-strong` `--ggc-text` `--ggc-text-muted` `--ggc-text-subtle` | 제목 / 본문 / 보조 / 메타 |
| ⚠ 텍스트 아님 | **`--ggc-text-faint`** | **아이콘 stroke·구분·장식 전용. 텍스트에 쓰면 AA 미달이다** |
| 면·선 | `--ggc-bg` `--ggc-surface` `--ggc-surface-inset` `--ggc-control-bg` `--ggc-row-hover` | 페이지 / 카드 / 인셋·합계행 / 검색·입력 / 행 hover |
| 테두리 | `--ggc-border` `--ggc-border-strong` `--ggc-shell-border` `--ggc-hairline` | 카드 / 버튼 / GNB·LNB 경계 / 표 행 구분 |
| 역할(신원) | `--ggc-role-member` `-staff` `-policy` `-other` (+ `-tint`) | 의원 / 사무처 / 정책지원관 / 기타 |
| 타이포 | `--ggc-font` `--ggc-font-mono` | |
| 간격 | `--ggc-space-1` ~ `-7` | 4/8/12/16/20/24/32 |
| 형태 | `--ggc-radius` `-sm` `-lg` `--ggc-shadow` `--ggc-shadow-primary` | 버튼 / 배지 / 카드 / 기본 / primary 버튼 |
| 포커스 | `--ggc-focus-ring` | 계약 §3 |
| 셸 치수 | `--ggc-gnb-h` `--ggc-lnb-w` `--ggc-main-max` `--ggc-main-max-wide` | 64 / 256 / 1320 / 1360 |

**상태 배지는 색 단독에 의존하지 않는다** — 항상 텍스트나 아이콘을 함께 둔다.
배지 7종 전부가 AA 미달이던 시기가 있었고(2026-08-22 v1.2 로 해소), 그때 병기 규칙이
유일한 완화책이었다. 지금도 유지한다 — 색각 이상 사용자에게는 대비만으로 부족하다.

## 왜 "CSS 변수 파일 하나 + 클래스 몇 종" 인가

이 플랫폼의 프런트엔드는 **7종**이다 — Next 14/15/16 · React 18/19 · Vite ·
JSP/Tiles · Jinja2 · FastAPI+StaticFiles(마운트 2형) · 정적 HTML.
공유 단위를 낮출수록 더 많은 곳이 먹을 수 있다.

- **CSS 커스텀 프로퍼티**는 일곱 종 전부가 `<link>` 한 줄로 소비한다. 최소공배수다.
- **React 컴포넌트는 공유하지 않는다.** React 18/19 · Next 14/15/16 이 섞여 peer 의존이
  지옥이고, 애초에 절반은 React 가 아니다. 마크업은 사본 유지가 싸다.
- npm 워크스페이스·사설 스코프 패키지는 **0건**이고, 사설 레지스트리도 막혀 있다.

배포 방식도 정해져 있다 — 정본 파일 머리말이 **"각 앱이 이 파일을 복사해 자체 스타일
최상단에 둔다"** 고 못박는다. **패키지가 아니라 복사다.**

## 절대 하지 말 것

- ⛔ **`_vercel-snapshot-krds\` 에서 색을 가져오지 않는다.** 이름과 달리 KRDS 자산이 아니라
  실시간 자막 프런트엔드의 Vercel 배포 스냅샷이고, 그 `#256ef4` 는 **계약이 v1.0 에서
  명시적으로 폐기한 값**이다. 검사기가 즉시 FAIL 로 잡는다(`#246BEB` 도 같다).
- ⛔ **외부 폰트 CDN.** 망분리 환경에서 깨진다. `Pretendard GOV` 자체 호스팅이다.
  `.dc.html` 원본이 jsDelivr 를 쓰지만 **그 지점은 따르지 않는다.**
  **가져오는 곳은 정본 `design\ggc-fonts.css` + `design\fonts\` 하나다**(2026-08-25 신설).
  ⛔ 다른 서비스의 `PretendardGOV-*.subset.woff2` 를 복사하지 말 것 — 그것은 정적 3벌이고,
  `font-weight: 700 800` 을 Bold 한 파일에 묶어 **800 이 700 과 똑같이 그려진다.**
  정본 CSS 는 제목·KPI 에 800 을 22곳에서 요구하므로 그 굵기 단계가 통째로 죽는다.
- ⛔ **`.dc.html` 을 그대로 iframe/HTML 로 삽입** (계약 §7)
- ⛔ **mock 링크·localhost·Vercel URL** 을 화면에 남기기 (계약 §7)
- ⛔ **시스템별로 다른 색·셸·반응형 규칙을 발명** (계약 §7). 필요하면 **정본에 먼저 넣는다.**
- ⛔ **`outline:none` 을 대체 없이 이식.** 원본에 28건 있고, 그대로 베끼면 KWCAG 2.2 /
  WCAG 2.4.7 위반을 전 시스템에 복제한다.
- ⛔ **다크모드를 자기 서비스에만 만들기.** 계약에 다크 토큰이 없다. 만들면 또 갈라진다.

## 명시적 예외 두 곳

**① 문서 허브의 도면** — `ggc-poc-web\webapp\styles\document.css` 의 색은 **의미 전달 수단**이다
(공개 영역 / 사설 영역 / 차단을 색으로 가른다). 브랜드색을 밀어 넣으면 범례가 깨진다.
**셸만 수렴하고 도면 본문은 예외**이며, `ggc-design-allow` 로 등록한다.

**② `bill-system\src\main\webapp\rhwp\`** — HWP/HWPX 뷰어 벤더 번들이다. 자체 `<head>` 와
매니페스트를 갖고, `theme_color: #2b6cb0` 로 **플랫폼에 아홉 번째 주 색상을 보태고** 있으며
아이콘 5개와 `sw.js` 가 전부 404 다. **손대지 않는다** — 재빌드하면 덮어써진다.
검사기도 스캔에서 제외한다. 별건 이슈로만 남긴다.

## 승격 대기표 — 정본에 아직 없는 값

> ⛔ **정본 반영 전에는 쓰지 않는다.** 이 표는 팔레트가 아니라 작업 목록이다.
> 쓸 일이 생기면 먼저 `ggc-tokens.css` 에 넣고, 그다음 이 행을 지운다.

| 값 | 원본에서의 용도 | 상태 |
|---|---|---|
| `#F6F8FB` 계열 미세 서피스 4종 (`#f9fafc`·`#f7f9fb`·`#f4f6f9`·`#fafbfd`) | 카드 인셋·행 hover 변형 | `--ggc-surface-inset`·`--ggc-row-hover` 로 **2종만 승격**. 나머지는 불필요 |
| `#B9C6DA` `#CDD5DF` `#DDE3EA` | 테두리 변형 | `--ggc-border-strong` 로 수렴. 승격하지 않는다 |
| `#EAD9A6` `#A98D4F` `#9A7A2E` `#FDF8EF` | 앰버 강조 패널 | 역할 배지 밖으로 **확산 금지**. 필요해지면 그때 승격 |
| `#1A6647` | success 진한 변형 | 현재 용도 없음 |
| `#3A4150` → **`--ggc-text-body`** | 카드 안 긴 본문 단락(흰 위 10.23:1) | Claude Design 정본에는 있고 `ggc-tokens.css` 에는 없다. **토큰 파일을 고치면 D1(바이트 동일)이 10개 서비스에서 FAIL 하므로** 복사가 한 번에 돌 때 함께 넣는다. 그때까지는 `--ggc-text-muted` 를 쓴다 |
| `#4A6BA5` `#24395F` | 아바타 그라데이션 | 그라데이션은 컴포넌트 레이어에서 처리. 토큰화하지 않는다 |

## AA 이중 모드

토큰 v1.2 자체는 AA 를 통과한다. `--aa` 스위치는 **서비스 자체 CSS** 에 적용된다.

- **`observe`(기본)** — 기존 미달 조합을 **늘리지 않는다**. 새 미달이 생기면 FAIL.
  "고치지는 않되 늘리지도 않는다."
- **`enforce`** — 4.5:1 미만 전량 FAIL.

모드는 `state.json.design.aa_mode` 에 남고 검사기 출력에도 찍힌다.
**부분 준수를 완전 준수로 적지 않기 위한 장치다.**

## 고대비

토큰이 `forced-colors: active`(Windows 고대비)와 `prefers-contrast: more` 를 처리한다.
**서비스가 따로 만들 것이 없다** — 토큰을 복사하면 따라온다.

다만 자기 CSS 에서 **배경색만으로 의미를 전달하는 것을 새로 만들면** 거기에도 테두리를
보장해야 한다. `forced-colors` 는 배경을 평탄화한다.

⚠ **`box-shadow` 로만 만든 표시는 `forced-colors` 에서 사라진다.** 포커스·선택·현재 단계를
그림자로만 나타내지 말 것. 토큰이 `outline` 으로 복원하는 이유가 그것이다.

⛔ **다크 팔레트를 고대비라는 이름으로 만들지 않는다.** KRDS 고대비가 그런 형태지만,
계약이 다크모드를 비범위로 뒀다. 우회 도입이 된다(계약 §3-2).

## 가로 오버플로 — 셸이 막아 주지 않는 자리

`.ggc-shell-main` 은 최대폭만 정하고 **자식의 넘침을 막지 않는다.** 페이지 전체에
가로 스크롤이 생기면 모바일에서 즉시 드러나고, 이 정본은 실제로 두 번 겪었다 —
①좁은 폭에서 256px LNB 가 고정이라 390px 에서 606~818px 초과(→ 900px drawer 로 해소)
②`.ggc-wizard-mini` 의 `.stage` 가 `nowrap` 인데 줄바꿈도 축소도 못 해 카드 밖으로 밀림
(2026-08-22 예제 갤러리에서 발견, 정본 수정).

새로 짤 때 지킬 것 —

- **2단 배치는 `grid-template-columns: A B` 대신 `flex-wrap` + `flex-basis`.**
  `flex: 1 1 560px` 는 "560px 아래로는 접는다" 는 뜻이라 **미디어 쿼리 없이** 반응한다.
  격자로 짜려면 `minmax(min(100%, 320px), 1fr)` 로 하한을 100% 로 묶는다.
- **`nowrap` 텍스트에는 `min-width: 0` 을 함께 준다.** flex 항목 기본값 `auto` 는
  축소를 막아, 넘칠 때 줄어드는 대신 부모를 밀어낸다.
- 넓은 표·코드는 **자기 컨테이너 안에서** 스크롤시킨다(`.ggc-table-wrap`).
  본문이 스크롤되게 두지 않는다.
- 검증은 **390 / 768 / 1024 / 1440 / 1920** 다섯 폭에서
  `document.documentElement.scrollWidth - clientWidth === 0` 으로 확인한다.
  갤러리는 5쪽 × 5폭 = 25조합을 이 방식으로 통과한다.

값과 무관하게 **지금 강제되는 것** (계약 §3, 토큰 값을 안 바꾼다):
색 단독 의존 금지(배지에 텍스트·아이콘 병기) · `--ggc-text-faint` 를 텍스트에 쓰지 않기 ·
링크에 밑줄 · `:focus-visible` 가시 링 필수 · placeholder 를 유일한 라벨로 쓰지 않기.
