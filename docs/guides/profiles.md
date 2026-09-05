# 업무용과 대민용 — 프로필 판정과 차이

한 토큰 파일이 두 프로필을 담는다(계약 §9). **기본(속성 없음)이 업무 프로필**이고, 대민 화면은
`<html data-ggc-profile="public">` 한 줄로 켠다. 이 문서는 "내 화면은 어느 쪽인가"를 판정하고,
두 프로필이 무엇이 같고 무엇이 다른지를 한 곳에 모은다.

## 판정 — 사용자가 누구인가

| 질문 | 예 → | 아니오 → |
|---|---|---|
| 화면을 보는 사람이 **도민·외부인**인가 (로그인 없이 열리는가) | **대민(public)** | 다음 질문 |
| 의원·사무처 직원·정책지원관이 **업무를 처리**하는 화면인가 | **업무(work)** | 다음 질문 |
| 둘 다인가 (예: 도민 안내 페이지 안의 관리자 미리보기) | 기본은 대민. 관리자 구역만 `data-ggc-profile="work"` 서브트리 — **드물어야 한다** | 담당자에게 묻는다 |

한 화면에 두 프로필을 섞지 않는다. 대민 페이지에 업무 GNB/LNB 셸을 쓰면 검사기 D3 가 FAIL 로 잡는다.

## 무엇이 같은가 (프로필이 건드릴 수 없는 것)

- **색** — 브랜드 네이비 · 상태색 4종 · 중립 램프 · 역할 색쌍. 대민도 기관 CI 다.
- **서체** — Pretendard GOV 자체 호스팅.
- **포커스 링 · 고대비 대응 · 색 단독 의미 전달 금지**.
- **간격 스케일** `--ggc-space-1~11`, radius, 그림자.
- **컴포넌트 마크업** — 버튼 · 배지 · 표 · 폼 · 탭 · 모달 · 알림 … 전부 같은 클래스다.
- **아이콘** — lucide 스프라이트 하나(`design/ggc-icons.svg`). 대민은 `--ggc-icon` 이 20 으로 커질 뿐이다.

## 무엇이 다른가

| | 업무 (기본) | 대민 (`public`) |
|---|---|---|
| **사용자** | 의원 · 사무처 · 정책지원관 (로그인) | 도민 · 외부인 (로그인 없음이 기본) |
| **셸** | 유틸리티 바 + 헤더 64(브레드크럼 · 검색 · 알림) + 사이드바 256/48 (`ggc-components.css` §9 · Tier 2 `ggc-shell`) — h1 은 본문 첫 줄 24px | 스킵 링크 + 마스트헤드 + 헤더(유틸리티·브랜딩·주 메뉴) + 공개 푸터 + 아이덴티파이어 (`ggc-public.css`) |
| **본문 폭** | 1320 (대시보드) / 1360 | 1248 (KRDS contents 1200 + 24×2) |
| **컨트롤 높이** | 버튼 32/36/40 · 입력 36 (shadcn 기본, v3.0) | 버튼 40/48/56 · 입력 48 (KRDS size-height 6/7/8) |
| **글자** | 버튼·입력 14 · 라벨 14 · 표 14 · 본문 14 · h1 24 | 17 · 17 · 17 · 17 · h1 32 (KRDS body/title) |
| **밀도** | 행 12×16 · 셀 8×12 · 카드 16×20 — 한 화면 15~20행 | 행 20×24 · 셀 12×16 · 카드 24 — 한 화면 8~12행 |
| **화면 패턴** | Surface Archetype 6종 (Monitor · Explore · Learn/Decide · Configure · Converse · Operate) | 대민 패턴 6종 (메인 · 목록 · 상세 · 서식 · 검색 · 안내) — `skills/ggc-design/references/public-patterns.md` |
| **어휘·문장** | 평서형(–다) · 결재 어휘 · 실명·역할·부서 | 존댓말(–합니다) · 쉬운 공공언어 · 담당부서·연락처 · 개인정보 고지 |
| **첫 화면** | 목록 (처리할 건수) | 안내 + 검색 + 바로가기 (히어로) |
| **인쇄** | 명단·심사표 | 안내문·신청서 — `@media print` 가 셸을 걷어낸다 |

값은 전부 `design/ggc-tokens.css` 의 프로필 블록에 있다. 이 표는 색인이다.

## 켜는 법

```html
<!doctype html>
<html lang="ko" data-ggc-profile="public">
<head>
  <link rel="stylesheet" href="ggc-fonts.css">
  <link rel="stylesheet" href="ggc-tokens.css">
  <link rel="stylesheet" href="ggc-components.css">
  <link rel="stylesheet" href="ggc-public.css">      <!-- 대민만 -->
</head>
<body class="ggc-public"> … <script src="ggc-behaviors.js" defer></script>
```

업무 화면은 `data-ggc-profile` 없이 `ggc-public.css` 도 빼면 된다. 검사는 같다 —
`python design/check_design.py --gate <서비스경로>` (프로필은 마크업에서 자동 판정, `--profile` 로 강제 가능).

## 실물

- 업무: `design/examples/dashboard.html` · `explore.html` · `wizard.html` · `login.html`
- 대민: `design/examples/public/index.html`(메인) · `list.html`(목록) · `detail.html`(상세) · `form.html`(서식)
- 같은 컴포넌트가 프로필에 따라 어떻게 달라지는지: `design/examples/tokens.html#profile` 의 토글
