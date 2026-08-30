#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-design-md.py — 루트 DESIGN.md 생성기 (Claude Design 「디자인 시스템 가져오기」용)

DESIGN.md 는 **생성물**이다. 값은 전부 design/ggc-tokens.css 에서, 컴포넌트 목록은
design/components.tsv 에서 읽는다. 손으로 고치지 않는다 — 고치면 다음 생성에서 덮인다.

Claude Design 이 읽는 9절 구조(Visual Theme · Color · Typography · Components · Layout ·
Depth · Do's and Don'ts · Responsive · Agent Prompt Guide)를 따르되 내용은 한국어다.

사용법:
  python tools/build-design-md.py           # DESIGN.md 생성
  python tools/build-design-md.py --check   # 낡았으면 exit 1 (check_design.py D6 가 부른다)
"""
import csv
import hashlib
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
DESIGN = os.path.join(ROOT, "design")
sys.path.insert(0, DESIGN)
import check_design as cd  # noqa: E402  — 파서·대비 계산을 복제하지 않는다

TOKENS = os.path.join(DESIGN, "ggc-tokens.css")
COMPONENTS_CSS = os.path.join(DESIGN, "ggc-components.css")
INVENTORY = os.path.join(DESIGN, "components.tsv")
OUT = os.path.join(ROOT, "DESIGN.md")


# ------------------------------------------------------------------ 입력
def root_vars_all(css):
    """최상위 :root 의 --ggc-* 전부(값 그대로). base_root_vars 는 hex 만 돌려주므로 따로 둔다."""
    css = "\n".join(cd.strip_comments(css))
    out, i, n, depth = {}, 0, len(css), 0
    while i < n:
        ch = css[i]
        if ch == "{":
            depth += 1; i += 1; continue
        if ch == "}":
            depth = max(0, depth - 1); i += 1; continue
        if depth == 0 and css.startswith(":root", i):
            j = css.find("{", i)
            k, d = j, 0
            while k < n:
                if css[k] == "{": d += 1
                elif css[k] == "}":
                    d -= 1
                    if d == 0: break
                k += 1
            for m in re.finditer(r"--ggc-([\w-]+):\s*([^;]+);", css[j:k]):
                out.setdefault(m.group(1), re.sub(r"\s+", " ", m.group(2).strip()))
            i = k + 1; continue
        i += 1
    return out


def read_inventory():
    rows = []
    with open(INVENTORY, encoding="utf-8") as f:
        for line in f:
            if not line.strip() or line.startswith("#"):
                continue
            p = line.rstrip("\n").split("\t")
            if len(p) < 9:
                continue
            rows.append(dict(zip(
                ("id", "name", "tier1", "tier2", "basis", "profile", "priority", "status", "phase"), p)))
    return rows


def short_hash(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read().replace(b"\r\n", b"\n")).hexdigest()[:8]


# ------------------------------------------------------------------ 생성
def build():
    css = cd.read(TOKENS)
    hexv = cd.base_root_vars(css)          # 이름 -> #hex (소문자)
    allv = root_vars_all(css)              # 이름 -> 값
    pub = cd.profile_vars(css, "public")
    inv = read_inventory()
    W, BG = cd.WHITE, cd.PAGE_BG

    def c(name, on=W):
        v = hexv.get(name)
        return f"{cd.contrast(v, on):.2f}:1" if v else "—"

    def hx(name):
        return hexv.get(name, "—").upper()

    L = []
    a = L.append
    a("<!-- 생성물 — 손으로 고치지 말 것. python tools/build-design-md.py -->")
    a(f"<!-- 원천: design/ggc-tokens.css ({short_hash(TOKENS)}) · design/components.tsv ({short_hash(INVENTORY)}) -->")
    a("")
    a("# 경기도의회 공통 디자인 시스템 — DESIGN.md")
    a("")
    a("경기도의회 의정정보시스템 전 서비스가 공유하는 디자인 언어다. **업무용**(의원·사무처 직원이 쓰는")
    a("고밀도 업무 화면)과 **대민용**(도민이 보는 공개 화면) 두 프로필이 **같은 토큰 하나** 위에 있다.")
    a("값의 유일한 원천은 `design/ggc-tokens.css` 이며 이 문서는 그 파일에서 생성됐다.")
    a("")
    a("- 정본 저장소: https://github.com/gyeonggi-council/ggc-design-system")
    a("- 실물 갤러리: `design/examples/index.html` (빌드 없이 열린다)")
    a("- 규칙 계약: `docs/contract.md` · 스킬: `skills/ggc-design/SKILL.md`")
    a("")

    # 1
    a("## 1. Visual Theme & Atmosphere (시각 테마)")
    a("")
    a("- **기관 CI 네이비**(`--ggc-primary`)가 유일한 브랜드 색이다. KRDS(정부 디자인 시스템)를 기반으로")
    a("  브랜드 색만 기관 CI 로 오버라이드했다 — KRDS 기본 파랑(`#246BEB`·`#256EF4`)은 폐기값이다.")
    a("- 업무 프로필: **고밀도·표 중심·평서형 문장**. 한 화면에 15~20행이 들어오고, 첫 화면은 목록이다.")
    a("  히어로·큰 카드 그리드·환영 문구로 시작하지 않는다.")
    a("- 대민 프로필: **KRDS 패턴 충실**(마스트헤드 · 아이덴티파이어 · 공개 헤더/푸터 · 스킵 링크) +")
    a("  KRDS 치수(컨트롤 48px, 본문 17px). 색은 업무와 같은 네이비다.")
    a("- 카드는 흰 면 + 1px 테두리 + radius 14~16px, **그림자 없음**. 페이지 배경은 옅은 회청(`--ggc-bg`).")
    a("- 다크 모드는 없다. 고대비는 별도 팔레트가 아니라 `forced-colors`·`prefers-contrast` 대응이다.")
    a("- 서체는 **Pretendard GOV** 자체 호스팅 단일. 외부 CDN 을 링크하지 않는다(망분리).")
    a("")

    # 2
    a("## 2. Color Palette & Roles (색과 역할)")
    a("")
    a("전부 WCAG AA(4.5:1) 를 통과한다. 대비비는 생성 시 계산한 값이다.")
    a("")
    a("### 브랜드")
    a("")
    a("| 토큰 | Hex | 역할 | 흰 위 |")
    a("|---|---|---|---|")
    for n, role in (("primary", "주요 버튼 · 활성 상태 · 링크"), ("primary-dark", "hover"),
                    ("primary-deep", "pressed · 유틸리티 바 배경 · 표 헤더 상단선"),
                    ("primary-light", "선택 배경 · 활성 LNB (배경 전용)"),
                    ("primary-light-strong", "강조 배경 (배경 전용)")):
        a(f"| `--ggc-{n}` | {hx(n)} | {role} | {c(n)} |")
    a("")
    a("### 상태 (자기 틴트 위 · 흰 위 양쪽 AA)")
    a("")
    a("| 토큰 | Hex | 틴트 | 역할 | 틴트 위 | 흰 위 |")
    a("|---|---|---|---|---|---|")
    for n, role in (("success", "승인 · 확정 · 완료 · 회의일"), ("warning", "대기 · 주의 · 검토 필요"),
                    ("danger", "반려 · 오류 · 기한 초과"), ("info", "정보 · 회기 중 · 진행")):
        t = hexv.get(n + "-tint")
        a(f"| `--ggc-{n}` | {hx(n)} | `--ggc-{n}-tint` {hx(n + '-tint')} | {role} | "
          f"{cd.contrast(hexv[n], t):.2f}:1 | {c(n)} |")
    a("")
    a("상태색은 KRDS 값으로 수렴하지 않았다 — 디자인 원본 색상각을 유지한 채 AA 를 넘긴 값이다")
    a("(`docs/krds-alignment.md §2`). **색 단독으로 의미를 전달하지 않는다** — 배지에는 텍스트·기호를 병기한다.")
    a("")
    a("### 중립 텍스트 램프")
    a("")
    a("| 토큰 | Hex | 역할 | 흰 위 | 페이지 배경 위 |")
    a("|---|---|---|---|---|")
    for n, role in (("text-strong", "제목 · 강조 수치"), ("text", "본문"), ("text-body", "카드 안 긴 본문 단락 · 표 td"),
                    ("text-muted", "보조 · 라벨 · 표 헤더"), ("text-subtle", "메타 · 시각 · 힌트")):
        a(f"| `--ggc-{n}` | {hx(n)} | {role} | {c(n)} | {c(n, BG)} |")
    a(f"| `--ggc-text-faint` | {hx('text-faint')} | **텍스트 금지** — 아이콘 stroke · 구분 · 장식 (3:1 대상) | {c('text-faint')} | — |")
    a("")
    a("### 면 · 선")
    a("")
    a("| 토큰 | Hex | 역할 |")
    a("|---|---|---|")
    for n, role in (("bg", "페이지 배경"), ("surface", "카드 · 패널 · GNB · LNB"), ("surface-inset", "인셋 영역 · 표 합계행"),
                    ("control-bg", "검색창 · 입력 컨트롤 · 아이콘 박스"), ("row-hover", "목록 행 hover"),
                    ("border", "카드 테두리"), ("border-strong", "버튼 · 입력 테두리"),
                    ("shell-border", "GNB 하단선 · LNB 우측선"), ("hairline", "표 행 구분선")):
        a(f"| `--ggc-{n}` | {hx(n)} | {role} |")
    a("")
    a("### 역할 색쌍 (신원 — 상태와 다른 축)")
    a("")
    a("| 토큰 | Hex | 틴트 | 누구 |")
    a("|---|---|---|---|")
    for n, who in (("role-member", "의원"), ("role-staff", "사무처"), ("role-policy", "정책지원관"), ("role-other", "기타")):
        a(f"| `--ggc-{n}` | {hx(n)} | {hx(n + '-tint')} | {who} |")
    a("")
    a("금/앰버(정책지원관 쌍)를 역할 배지 밖으로 확산시키지 않는다 — 확산하면 주 색상이 하나 더 는다.")
    a("")

    # 3
    a("## 3. Typography Rules (타이포그래피)")
    a("")
    a(f"- 서체: `--ggc-font` = `{allv.get('font', '—')}`")
    a(f"- 등폭: `--ggc-font-mono` = `{allv.get('font-mono', '—')}`")
    a("- 가변 woff2 한 벌(45~930)을 자체 호스팅한다. 제목·KPI 는 800, 본문은 400, 라벨은 600~700.")
    a("- 숫자는 `font-variant-numeric: tabular-nums` + 천단위 콤마 + 오른쪽 정렬. 날짜는 `YYYY-MM-DD`.")
    a("")
    a("| 역할 | 업무 프로필 | 대민 프로필 |")
    a("|---|---|---|")
    for n, role in (("control-font", "버튼 · 입력 글자"), ("control-font-sm", "버튼 sm"), ("control-font-lg", "버튼 lg"),
                    ("label-font", "폼 라벨"), ("table-font", "표")):
        a(f"| {role} `--ggc-{n}` | {allv.get(n, '—')} | {pub.get(n, '—')} |")
    a("")
    a("업무 화면의 실측 스케일: 제목 16~17px/800 · 카드 제목 15px/700 · 행 제목 14px/700 · 본문 13.5px ·")
    a("라벨 13px/700 · 메타 12px · 태그 10.5px/700 · KPI 수치 30px/800. 대민은 KRDS body 15/17/19px.")
    a("")

    # 4
    a("## 4. Component Stylings (컴포넌트)")
    a("")
    a("Tier 1 = CSS 클래스(`design/ggc-components.css`, 전 스택 공용) · Tier 2 = shadcn 레지스트리 항목(React).")
    a("마크업은 갤러리 `design/examples/components.html` 이 렌더된 DOM 그대로 보여 준다 — 짐작해 짜지 말고 거기서 가져온다.")
    a("")
    a("| 컴포넌트 | Tier 1 클래스 | Tier 2 | 프로필 | 우선순위 | 상태 |")
    a("|---|---|---|---|---|---|")
    for r in inv:
        a(f"| {r['name']} | `{r['tier1']}` | `{r['tier2']}` | {r['profile']} | {r['priority']} | {r['status']} |")
    a("")
    a("핵심 규칙:")
    a("")
    a(f"- 버튼: 기본 높이 `--ggc-control-h` {allv.get('control-h')} · radius 10px · primary 만 그림자")
    a(f"  (`--ggc-shadow-primary`). sm {allv.get('control-h-sm')} / lg {allv.get('control-h-lg')}. 대민은 {pub.get('control-h-sm')}/{pub.get('control-h')}/{pub.get('control-h-lg')}.")
    a(f"- 입력: 높이 `--ggc-input-h` {allv.get('input-h')} · 1px `--ggc-border-strong` · radius 10px · 포커스는 공통 링.")
    a("  placeholder 를 유일한 라벨로 쓰지 않는다. 오류는 색 + 문구 + 아이콘.")
    a("- 배지: 알약형, 텍스트·기호 병기(✓ 승인 · ◷ 대기 · ✕ 반려 · ● 회기 중 · ◆ 회의일 · ○ 비회기).")
    a("- 카드: 흰 면 · 1px `--ggc-border` · radius 16px · 그림자 없음. 헤더는 제목 + 우측 액션 슬롯.")
    a(f"- 표: 얇은 보더, thead 상단 2px `--ggc-primary-deep`, 셀 패딩 `--ggc-cell-pad` {allv.get('cell-pad')}, 합계행 인셋 배경.")
    a("- 셸(업무): GNB 64px 흰색 + LNB 256px + 본문 최대 1320/1360px. ≤900px 에서 LNB 는 drawer.")
    a("- 셸(대민): KRDS masthead → header/주 메뉴 → 본문(최대 1248px) → footer → identifier.")
    a("- 상태 3종(빈 상태 · 오류 · 로딩)을 화면마다 함께 만든다. 빈 상태 문구는 다음 행동을 말한다.")
    a("")

    # 5
    a("## 5. Layout Principles (레이아웃)")
    a("")
    a("| 토큰 | 값 | 무엇 |")
    a("|---|---|---|")
    for n in ("space-1", "space-2", "space-3", "space-4", "space-5", "space-6", "space-7",
              "space-8", "space-9", "space-10", "space-11"):
        a(f"| `--ggc-{n}` | {allv.get(n, '—')} | 간격 스케일 (KRDS gap 부분집합) |")
    for n, what in (("gnb-h", "GNB 높이"), ("lnb-w", "LNB 폭"), ("main-max", "대시보드 본문 최대폭"),
                    ("main-max-wide", "기타 업무 화면 최대폭"), ("container-max", "유틸리티 바 · 푸터 inner 폭 (대민 " + pub.get("container-max", "—") + ")")):
        a(f"| `--ggc-{n}` | {allv.get(n, '—')} | {what} |")
    a("")
    a("- 2단 배치는 고정 격자 대신 `flex-wrap` + `flex-basis`(예: `flex: 1 1 560px`)로 짠다 — 미디어 쿼리 없이 접힌다.")
    a("- 넓은 표·코드는 자기 컨테이너 안에서 스크롤(`.ggc-table-wrap`). 본문이 가로 스크롤되게 두지 않는다.")
    a(f"- 밀도: 행 리스트 `--ggc-row-pad` {allv.get('row-pad')} · 카드 `--ggc-card-pad` {allv.get('card-pad')}. 대민은 {pub.get('row-pad')} · {pub.get('card-pad')}.")
    a("- Surface Archetype(업무 화면 6종): Monitor(KPI 4열 + 큐) · Explore(필터 + 표) · Learn/Decide(상세 + 결재)")
    a("  · Configure(스텝퍼 + 스티키 액션바) · Converse(대화 + 출처) · Operate(실시간 상태 + 로그).")
    a("")

    # 6
    a("## 6. Depth & Elevation (깊이)")
    a("")
    a(f"- `--ggc-shadow` = `{allv.get('shadow', '—')}` — 기본, 거의 보이지 않는다.")
    a(f"- `--ggc-shadow-primary` = `{allv.get('shadow-primary', '—')}` — primary 버튼 전용.")
    a("- 카드·패널은 그림자 없이 1px 테두리로 면을 가른다. 겹침은 색 면(인셋 배경)과 테두리로 표현한다.")
    a(f"- radius: `--ggc-radius-sm` {allv.get('radius-sm')} (배지·칩) · `--ggc-radius` {allv.get('radius')} (버튼·입력) · `--ggc-radius-lg` {allv.get('radius-lg')} (카드 14~16).")
    a(f"- 포커스 링: `--ggc-focus-ring` = `{allv.get('focus-ring', '—')}`. `forced-colors` 에서는 `outline: 3px solid Highlight` 로 복원된다.")
    a("")

    # 7
    a("## 7. Do's and Don'ts (규칙)")
    a("")
    a("**Do**")
    a("")
    a("- 토큰 이름(`var(--ggc-*)`)만 쓴다. 값은 `ggc-tokens.css` 한 곳에만 산다.")
    a("- 상태 라벨은 결재·문서 흐름 어휘(접수 · 검토 · 결재 · 시행 · 완료 · 반려). 영문 UI 라벨을 남기지 않는다.")
    a("- 사용자 표기는 실명·역할·부서. UUID 를 보여주지 않는다. 공개 화면의 이름은 `이○○` 마스킹.")
    a("- 법령은 「낫표」+ 공포 명칭 그대로. 오류 문구는 사유와 근거를 함께 준다. AI 산출물에는 출처를 병기한다.")
    a("- 링크에 밑줄, `:focus-visible` 가시 링, 색 단독 의미 전달 금지, 키보드로 전 동선 도달.")
    a("")
    a("**Don't**")
    a("")
    a("- 새 색을 만들지 않는다(주 색상이 9종이 됐던 기제). 필요하면 정본에 먼저 넣는다.")
    a("- `#246BEB` · `#256EF4`(KRDS 기본 파랑) · 다크 팔레트 · 외부 폰트 CDN · `outline:none` 단독.")
    a("- `--ggc-text-faint` 를 텍스트에 쓰지 않는다(AA 미달). 금/앰버를 역할 배지 밖으로 확산시키지 않는다.")
    a("- 업무 화면에 히어로·마케팅 카피·이모지 상태 표시·상대시간(\"3시간 전\")을 쓰지 않는다.")
    a("- 업무 프로필과 대민 프로필을 한 화면에 섞지 않는다. 대민에 업무 GNB/LNB 셸을 쓰지 않는다.")
    a("")

    # 8
    a("## 8. Responsive Behavior (반응형)")
    a("")
    a("- 기준 폭: 1440×900(업무 기본) · 390×844(모바일) · ≥1680px 확폭(1560/1600, 옵션). 다섯 폭")
    a("  390 / 768 / 1024 / 1440 / 1920 에서 가로 오버플로 0 을 확인한다.")
    a("- ≤900px: 업무 LNB 가 drawer 로 접히고 GNB 가 압축된다. 대민 주 메뉴는 KRDS 모바일 메뉴 패턴.")
    a("- KPI 4열은 ≤1024px 에서 2열, ≤560px 에서 1열. 표는 래퍼 안에서만 가로 스크롤.")
    a("- 터치 대상은 대민 프로필에서 44px 이상(컨트롤 48px). `prefers-reduced-motion` 을 존중한다.")
    a("")

    # 9
    a("## 9. Agent Prompt Guide (에이전트 프롬프트 지침)")
    a("")
    a("Claude Design · Claude Code 에서 화면을 요청할 때 아래를 첫 메시지에 붙인다.")
    a("")
    a("```")
    a("경기도의회 공통 디자인 시스템(DESIGN.md)을 그대로 따른다.")
    a("- 프로필: [업무 | 대민] — 업무면 GNB 64 + LNB 256 셸, 고밀도 표 중심. 대민이면 KRDS masthead/identifier 셸, 컨트롤 48px.")
    a("- 색은 --ggc-* 토큰만. 새 색 금지. 상태 배지는 텍스트·기호 병기.")
    a("- 화면 유형: [Monitor | Explore | Learn/Decide | Configure | Converse | Operate] 의 슬롯 구성을 따른다.")
    a("- 빈 상태·오류·로딩 3종을 함께 만든다. 문장은 평서형(–다), 빈 상태·오류 문구만 존댓말.")
    a("- 사용자 표기는 실명·역할·부서, 날짜는 YYYY-MM-DD, 숫자는 단위·천단위 콤마·오른쪽 정렬.")
    a("- 외부 CDN·outline:none·다크 팔레트를 쓰지 않는다. :focus-visible 링을 유지한다.")
    a("```")
    a("")
    a("시안을 코드로 옮길 때는 인라인 `style=` 을 `.ggc-*` 클래스로 흡수하고, `style-hover` 같은")
    a("Claude Design 런타임 속성은 `:hover` 규칙으로 손으로 옮긴다(`skills/ggc-design/references/porting.md`).")
    a("검증은 `python design/check_design.py --gate <서비스경로>`.")
    a("")
    return "\n".join(L)


def main():
    text = build()
    if "--check" in sys.argv:
        cur = cd.read(OUT).replace("\r\n", "\n")
        if cur == text:
            print("OK    DESIGN.md 가 정본과 일치한다.")
            return 0
        print("STALE DESIGN.md 가 정본보다 낡았다 — python tools/build-design-md.py")
        return 1
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("생성  DESIGN.md  (%d 줄)" % text.count("\n"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
