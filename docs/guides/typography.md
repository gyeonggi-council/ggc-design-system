# 타이포 스케일 — 위계는 색이 아니라 크기·굵기·간격으로 (v3.0)

**값은 여기 없다.** 이름과 역할만 적는다. 값은 `design/ggc-tokens.css` 한 곳(업무 :root · 대민 프로필 블록)에 있고,
갤러리 `design/examples/tokens.html` 이 실측해 보여 준다. 결정 근거는 [ADR 0009](../decisions/0009-work-profile-shadcn-density.md).

## 왜 생겼나

v2.0 까지 제목 토큰이 없었다. h1 은 GNB 안 18px, 카드 제목 16px, 본문 13.5px — 제목과 본문의 비율이 1.3 이라
화면을 열었을 때 무엇이 제목이고 무엇이 본문인지 한눈에 갈리지 않았다. 색은 기관 CI 라 바꿀 수 없다(ADR 0001).
그래서 위계를 **크기 · 굵기 · 간격**으로 만든다. 값은 Tailwind 기본 스텝(12/14/16/18/20/24/30)에서 가져왔다 — 사이 값을 발명하지 않는다.

## 스케일

| 이름 | 역할 | 업무 | 대민 (`data-ggc-profile="public"`) |
|---|---|---|---|
| `--ggc-text-xs` | 캡션 · 표 보조 · 배지 | 12 | 12 |
| `--ggc-text-sm` | 메타 · 부제 · 라벨 | 13 | 15 |
| `--ggc-text-base` | 본문 기본 · 표 셀 · 컨트롤 | 14 | 17 (KRDS body.medium) |
| `--ggc-text-md` | 카드 제목 · 강조 본문 | 16 | 19 |
| `--ggc-text-lg` | 섹션 제목 | 18 | 20 |
| `--ggc-text-xl` | 모달 제목 | 20 | 24 |
| `--ggc-text-2xl` | 페이지 제목 | 24 | 32 |
| `--ggc-text-3xl` | KPI 숫자 | 30 | 40 |

제목 토큰은 스케일을 **참조**한다 — `--ggc-h1-size` = 2xl · `--ggc-h2-size` = lg · `--ggc-h3-size` = md · `--ggc-kpi-size` = 3xl.
행높이는 `--ggc-leading-tight`(제목) · `--ggc-leading-normal`(본문). 숫자는 표에 적었지만 **값의 원천은 토큰 파일**이다.

## 어디에 무엇을

| 자리 | 크기 | 굵기 | 클래스 (Tier 1) | 컴포넌트 (Tier 2) |
|---|---|---|---|---|
| 페이지 제목 `<h1>` — 화면당 하나, 본문 첫 줄 | h1 (24) | 700 · -0.02em | `.ggc-page-head .ggc-page-title` · `.ggc-h1` | `@ggc/ggc-page-head` |
| 섹션 제목 — 카드 밖 구획 | h2 (18) | 700 | `.ggc-h2` | `SectionTitle` |
| 카드 제목 | h3 (16) | 700 | `.ggc-card-head .title` · `.ggc-h3` | `CardTitle` |
| 본문 · 표 셀 · 버튼 · 입력 | base (14) | 400~600 | 기본 | 기본 |
| 메타 · 설명 · 부제 | sm (13) | 400 | `.ggc-text-sm` · `.desc` · `.sub` | `CardDescription` · `desc` |
| 캡션 · 표 보조 · 배지 | xs (12) | 400~600 | `.ggc-text-xs` | `Badge` |
| KPI 숫자 | kpi (30) | 800 · -0.03em | `.ggc-stat .value` | `Stat` |

## 규칙

- **페이지 제목은 그 화면에서 가장 큰 글자다.** 64px 헤더 띠 안에 넣지 않는다(ADR 0010) — 크롬처럼 읽힌다.
- **한 화면에 세 단계까지.** h1 · 카드 제목 · 본문. 네 번째 단계가 필요하면 굵기(600)나 색(`--ggc-text-muted`)으로 푼다.
- **굵기는 400 · 600 · 700 · 800 넷만.** Pretendard GOV 가변이라 어떤 값도 되지만 단계가 늘면 위계가 흐려진다. 500 은 사이드바 항목에만.
- **자간은 제목에만** -0.02em(KPI -0.03em). 본문에 자간을 넣지 않는다.
- **숫자는 `tabular-nums`** — 표 · KPI · 건수. 자릿수가 흔들리면 대조가 안 된다.
- **대민은 KRDS 스텝**으로 커진다 — 프로필 블록이 스케일을 덮어쓴다. 컴포넌트가 토큰을 참조하면 자동이고, 리터럴(`text-sm`)은 커지지 않는다.
  Tier 2 공식 소스의 `text-sm` 본문은 대민에서 14 그대로다 — 대민 정적 페이지는 Tier 1 CSS 를 권장하는 이유다.

## 검사

`check_design.py --canon` D6 가 프로필 블록의 허용 목록(`PROFILE_VARS`)에 타이포 스케일이 있는지 본다. 새 크기 토큰을 만들면 거기에도 넣는다.
