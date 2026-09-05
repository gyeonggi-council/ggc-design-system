# 토큰 — 이름 색인과 역할

**값은 여기 없다.** 값은 `design/ggc-tokens.css` 한 곳에만 있고, 이 문서는 이름이 무슨 뜻이며 언제 쓰는지만 적는다.
값이 필요하면 파일을 열거나 갤러리 `design/examples/tokens.html`(브라우저가 실측해 채운다)을 본다.

## 이름 규칙

`--ggc-<역할>[-<변형>]`. 역할 이름은 **무엇에 쓰는가**이지 무슨 색인가가 아니다(`--ggc-navy` 가 아니라 `--ggc-primary`).
그래서 값이 바뀌어도 이름은 그대로고, 이름이 그대로라 서비스 코드가 안 바뀐다.

## 색

| 역할 | 이름 | 언제 |
|---|---|---|
| 브랜드 | `--ggc-primary` / `-dark` / `-deep` / `-light` / `-light-strong` | 주요 버튼·활성·링크 / hover / pressed·유틸리티바·표 헤더선 / 선택 배경 / 강조 배경 |
| 상태 | `--ggc-success` `--ggc-warning` `--ggc-danger` `--ggc-info` (+ `-tint`) | 승인·확정 / 대기·주의 / 반려·오류 / 정보·회기 중. 틴트는 배지·알림 배경 |
| 텍스트 | `--ggc-text-strong` `--ggc-text` `--ggc-text-body` `--ggc-text-muted` `--ggc-text-subtle` | 제목·수치 / 본문 / 긴 단락·표 td / 보조·라벨·표 헤더 / 메타·힌트 |
| ⚠ 텍스트 아님 | `--ggc-text-faint` | 아이콘 stroke · 구분 · 장식 (3:1 대상). **글자에 쓰면 AA 미달** |
| 면 | `--ggc-bg` `--ggc-surface` `--ggc-surface-inset` `--ggc-control-bg` `--ggc-row-hover` | 페이지 / 카드·패널 / 인셋·합계행 / 검색·입력·아이콘 박스 / 행 hover |
| 선 | `--ggc-border` `--ggc-border-strong` `--ggc-shell-border` `--ggc-hairline` | 카드 / 버튼·입력 / GNB·LNB 경계 / 표 행 구분 |
| 역할(신원) | `--ggc-role-member` `-staff` `-policy` `-other` (+ `-tint`) | 의원 / 사무처 / 정책지원관 / 기타 — **상태와 다른 축**, 배지에서만 |

## 서체 · 간격 · 형태 · 포커스 · 셸

| 역할 | 이름 |
|---|---|
| 서체 | `--ggc-font` `--ggc-font-mono` |
| 간격 | `--ggc-space-1` ~ `-11` (4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80) — KRDS gap 부분집합. 사이 값을 발명하지 않는다 |
| 형태 | `--ggc-radius-sm` `--ggc-radius` `--ggc-radius-lg` · `--ggc-shadow` `--ggc-shadow-primary` |
| 포커스 | `--ggc-focus-ring` (계약 §3 알파 .20) |
| 셸 | `--ggc-gnb-h` `--ggc-lnb-w` `--ggc-lnb-w-icon` `--ggc-main-max` `--ggc-main-max-wide` (업무) |
| 아이콘 (v3.0) | `--ggc-icon` `--ggc-icon-lg` `--ggc-icon-stroke` — lucide 전용, [icons.md](icons.md) |

## 타이포 스케일 (v3.0)

`--ggc-text-xs` `-sm` `-base` `-md` `-lg` `-xl` `-2xl` `-3xl` · `--ggc-leading-tight` `-normal` · 제목 `--ggc-h1-size` `-h2-` `-h3-` · `--ggc-kpi-size`.
위계는 색이 아니라 크기·굵기로 — [typography.md](typography.md). 치수이므로 대민 프로필이 KRDS 스텝으로 덮어쓴다.

## 컨트롤 · 밀도 · 폭 — 프로필이 바꾸는 층 (v2.0 → v3.0)

| 이름 | 무엇 |
|---|---|
| `--ggc-control-h-sm` `--ggc-control-h` `--ggc-control-h-lg` | 버튼 sm / 기본 / lg 높이 |
| `--ggc-input-h` `--ggc-search-h` | 입력·셀렉트 / 검색창 높이 |
| `--ggc-control-font` `-sm` `-lg` · `--ggc-label-font` · `--ggc-table-font` | 버튼·입력 / 라벨 / 표 글자 |
| `--ggc-cell-pad` `--ggc-row-pad` `--ggc-card-pad` | 표 셀 / 행 리스트 / 자유 본문 카드 패딩 |
| `--ggc-container-max` | 유틸리티 바·푸터·대민 본문 폭 |

`<html data-ggc-profile="public">` 이면 이 이름들(+ 타이포 스케일 · 아이콘 치수)만 KRDS 치수로 바뀐다. 업무 기본값은 v3.0 부터 shadcn 기본 밀도(버튼 36 · 입력 36 · 14px · 셀 8×12)다. 색·서체·포커스는 프로필이 건드리지 못한다(검사기 D6).

## 확장 규칙

- **새 색을 만들지 않는다.** 필요하면 정본에 먼저 넣고(`design/ggc-tokens.css`), 승격 대기표(`skills/ggc-design/references/contract.md`)에서 지운다.
- 새 이름은 역할로 짓는다. 서비스 자체 CSS 에서 `--ggc-*` 를 **정의하지 않는다**(참조만).
- Tailwind 는 `@theme { --color-brand: var(--ggc-primary); }` 처럼 **참조**한다. 값을 옮기면 정본이 둘이 된다.
- 토큰 파일을 고치면 모든 사본의 D1 이 깨진다 — 변경은 릴리스 하나에 모으고 `CHANGELOG.md` 에 ⚠ D1 로 적는다.
