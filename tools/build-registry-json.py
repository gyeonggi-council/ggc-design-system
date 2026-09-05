#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build-registry-json.py — registry.json 을 소스(registry/ggc/**)에서 **생성**한다 (v3.0, ADR 0011)

registry/ggc/ui/*.tsx · blocks/*/*.tsx · hooks/*.ts 를 훑어 항목을 만들고, import 문에서 의존성을 읽는다:
  · npm 패키지(radix-ui · lucide-react · cmdk · sonner · recharts · @tanstack/react-table …) → dependencies
  · @/components/ui/<x> · @/hooks/<x>                                                   → registryDependencies("@ggc/<x>")
제목·설명은 아래 META 에서 온다(한국어). 새 컴포넌트를 넣으면 META 에 한 줄 추가하고 이 스크립트를 돌린다.
값(hex)은 여기 없다 — ggc-theme 의 cssVars 는 전부 var(--ggc-*) 다(R4).

    python tools/build-registry-json.py            생성 → registry.json
    python tools/build-registry-json.py --check    낡았는지만 (다르면 exit 1)
그 다음: npx shadcn@4.19.0 build registry.json -o public/r   ·   python tools/check-registry.py
"""
import io
import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
REG = os.path.join(ROOT, "registry", "ggc")
OUT = os.path.join(ROOT, "registry.json")

IMPORT_RE = re.compile(r'^\s*(?:import|export)\s[^;]*?\sfrom\s+"([^"]+)"', re.M)
PKG_ALLOW = {"radix-ui", "lucide-react", "class-variance-authority", "cmdk", "sonner", "recharts", "react-day-picker",
             "date-fns", "@tanstack/react-table", "react-hook-form", "zod", "@hookform/resolvers", "clsx", "tailwind-merge"}
# 메이저가 갈리는 패키지는 버전을 박는다 — TanStack Table 9 는 API 가 다르다(getCoreRowModel → createCoreRowModel). ggc-data-table 은 v8.
PKG_VERSION = {"@tanstack/react-table": "@tanstack/react-table@^8.21.0"}

# name → (title, description). 설명은 "무엇 · 규칙" 한 줄.
META = {
    # ---- UI (shadcn 공식 + 토큰) ----
    "accordion": ("아코디언", "카드형 묶음 — 정말 접어도 되는 내용에만."),
    "alert": ("알림 · 콜아웃", "공식 default/destructive + info · success · warning · danger(틴트 + 좌측 띠). 아이콘은 lucide 를 자식으로."),
    "alert-dialog": ("확인 다이얼로그", "파괴적 동작(반려 · 회수 · 삭제) 확인. 배경 클릭으로 닫히지 않는다."),
    "avatar": ("아바타", "사용자 표시 — 실명 · 역할 · 부서 옆. 사진이 없으면 머리글자."),
    "badge": ("배지 · 태그", "공식 변형 + 상태 7종(회기 · 결재) + 역할 4종. 색 단독 금지 — 텍스트와 lucide 아이콘을 함께. Tag 는 분류·출처."),
    "breadcrumb": ("브레드크럼", "현재 경로. 업무 셸에서는 헤더(ggc-shell ShellHeader.breadcrumb)에 둔다 — 제목은 본문(ADR 0010)."),
    "button": ("버튼", "default · secondary · outline · ghost · link · destructive + dashed(점선 추가). 높이는 --ggc-control-h*(프로필을 따른다). primary 만 그림자."),
    "button-group": ("버튼 그룹", "붙은 버튼 묶음 — 보기 전환 · 분할 버튼."),
    "calendar": ("달력", "react-day-picker. 회기·회의일 표시는 modifiers 로. date-picker 와 함께."),
    "card": ("카드", "흰 면 · 1px 테두리 · radius 14 · 그림자 없음(계약 §2). CardTitle 은 --ggc-h3-size."),
    "chart": ("차트", "Recharts 래퍼. 색은 chart-1..5(= primary · info · success · warning · danger). 데이터 색 이외의 장식색 금지."),
    "checkbox": ("체크박스", "선택은 네이비 채움 + 흰 체크."),
    "collapsible": ("접기/펼치기", "필터 상세 · 고급 옵션."),
    "command": ("커맨드 팔레트", "cmdk. 통합검색(⌘K) · 콤보박스의 목록부. 20개 넘는 항목은 이것으로."),
    "dialog": ("모달 · 다이얼로그", "제목 · 본문(DialogBody 스크롤) · 버튼 행. 파괴적 동작은 <DialogContent alert>."),
    "dropdown-menu": ("드롭다운 메뉴", "더보기류 동작 묶음. 파괴적 항목은 danger + 말줄임 — 확인 모달이 뒤따른다."),
    "empty": ("빈 상태", "무엇이 없는지 · 왜 없는지 · 다음 행동. 필터 때문인지 데이터가 없는지 구분한다."),
    "field": ("폼 필드", "Field · FieldLabel · FieldDescription · FieldError — react-hook-form 과 조립. 오류는 문구로(색 단독 금지)."),
    "hover-card": ("호버 카드", "의원 · 의안 미리보기. 키보드 포커스에서도 열린다."),
    "input": ("입력", "높이 --ggc-input-h · 흰 면 · 공통 포커스 링. placeholder 를 유일한 라벨로 쓰지 않는다."),
    "input-group": ("입력 그룹", "입력 + 아이콘/버튼 부착 — 검색 · 단위 · 지우기."),
    "item": ("항목", "아이콘 · 제목 · 설명 · 액션 한 행 — 목록형 카드 안."),
    "kbd": ("단축키 표시", "검색 상자의 ⌘K 같은 키 힌트."),
    "label": ("라벨", "폼 라벨 --ggc-label-font. 필수 표시는 <Label required>."),
    "listbox": ("커스텀 리스트박스", "부제 · 검색 필터 · 다중 선택이 필요한 항상 보이는 목록 — aria-activedescendant 키보드 탐색."),
    "native-select": ("셀렉트 (네이티브)", "항목 20개 이하 · 폼 제출형. 높이 --ggc-input-h."),
    "pagination": ("페이지네이션", "이전 · 쪽 번호 · 다음. 전량 렌더 금지 — 목록에는 항상 붙인다."),
    "popover": ("팝오버", "날짜 선택 · 콤보박스 · 필터 상세의 떠 있는 판."),
    "progress": ("진행률", "업로드 · 처리 진행. 숫자를 함께 적는다."),
    "radio-group": ("라디오", "택일. 3개 이하는 라디오, 그 이상은 셀렉트."),
    "scroll-area": ("스크롤 영역", "고정 높이 목록 — 커스텀 스크롤바."),
    "select": ("셀렉트", "Radix Select. 높이 --ggc-input-h. 항목 20개 넘으면 command/combobox."),
    "separator": ("구분선", "hairline. 구획은 여백으로, 선은 최소로."),
    "sheet": ("시트", "옆에서 나오는 판 — 모바일 사이드바 · 상세 미리보기 · 필터."),
    "sidebar": ("사이드바", "shadcn 공식. 폭 --ggc-lnb-w(256) · 접힘 --ggc-lnb-w-icon(48) · ≤768 Sheet. ggc-shell 이 조립한다."),
    "skeleton": ("스켈레톤", "로딩 중 자리 유지 — 행 높이를 그대로."),
    "sonner": ("토스트", "Sonner. 짧은 확인(저장됨 · 복사됨) — 오른쪽 아래 · 3개 상한 · 5초. 다크 없음."),
    "spinner": ("스피너", "role=status + 이름. 버튼 안 · 카드 안."),
    "switch": ("토글 스위치", "즉시 적용되는 켬/끔."),
    "table": ("표", "thead 상단 2px primary-deep · 행 구분 hairline · 셀 --ggc-cell-pad. <TableHead num> <TableCell num> 우정렬 tabular-nums."),
    "tabs": ("탭", "높이 --ggc-control-h. 업무 화면은 variant=\"line\"(밑줄형)."),
    "textarea": ("텍스트 영역", "입력과 같은 규칙. 조문 · 의견."),
    "toggle": ("토글 버튼", "눌림 상태가 있는 버튼 — 보기 전환."),
    "toggle-group": ("토글 그룹", "칩형 필터(내 소관 · 처리 대기) · 보기 전환."),
    "tooltip": ("툴팁", "보조 설명 전용 — 지연 0. 필수 정보를 툴팁에만 두지 않는다."),
    # ---- hooks ----
    "use-mobile": ("useIsMobile", "≤768 판정 — sidebar 가 Sheet 로 바뀌는 기준."),
    # ---- blocks (업무) ----
    "ggc-shell": ("업무 셸 v3", "SidebarProvider + AppSidebar(브랜드 · 시스템 스위처 · lucide 메뉴 · 접힘) + ShellHeader 64(토글 · 브레드크럼 · 검색 · 알림) + ShellMain 1320/1360. 제목은 ggc-page-head(ADR 0010). 대민 화면에는 쓰지 않는다."),
    "ggc-page-head": ("페이지 헤더", "본문 첫 줄 — <h1>(--ggc-h1-size 24) + 설명 + 주 액션 하나. SectionTitle(18)도 여기."),
    "ggc-data-table": ("데이터 표", "TanStack Table — 정렬 · 검색 · 열 표시 · 쪽 이동 · 행 선택. 밀도 --ggc-cell-pad 로 첫 화면 15~20행. 빈 상태는 필터/데이터 구분."),
    "ggc-filter-bar": ("필터 스트립", "Explore 슬롯 2 — 검색 · 셀렉트 · 칩 + 적용/초기화(기본 필터 '내 소관 · 처리 대기' 로). ResultSummary 포함."),
    "ggc-detail-layout": ("상세 배치", "Learn/Decide 격자 — 본문 1fr + 우측 레일 320(sticky). MetaList(키-값 dl)."),
    "ggc-wizard-layout": ("위저드 배치", "Configure — 스텝퍼 카드 → 본문 + 보조 패널 → 스티키 액션바(슬롯)."),
    "ggc-stat": ("통계 타일 (KPI)", "Monitor 첫 행 정확히 4개. 숫자 --ggc-kpi-size · 아이콘 lucide · 추이는 tone 이 아이콘까지."),
    "ggc-stepper": ("스텝퍼", "완료(체크) · 현재(링) · 대기. 색과 형태 둘 다."),
    "ggc-actionbar": ("하단 스티키 액션바", "Configure 슬롯 5. 임시저장 → 상신 순서 고정."),
    "ggc-empty": ("빈 상태 (블록)", "레이아웃만 정본(ADR 0006) — 문구 · 행동은 화면이 정한다."),
    "ggc-file-upload": ("파일 업로드", "선택 버튼 + 끌어놓기 + 파일 목록(이름 · 크기 · 삭제)."),
    "ggc-footer": ("업무 푸터", "업무 화면 하단 한 줄 푸터. 대민 푸터와 다르다."),
    "ggc-list-row": ("행 리스트", "카드 안 큐 · 최근 항목 · 결재 흐름 행. 열이 셋을 넘으면 표(ggc-data-table)."),
    "ggc-prose": ("문서 본문 조판", "조례 조문 · 검토보고서 같은 긴 글."),
    "ggc-qr-login": ("QR 로그인 블록", "경기도의정포털 앱 QR 로그인 — 9개 시스템 공통 입구."),
    "ggc-search": ("헤더 검색", "300×36(--ggc-search-h) 검색 상자 — aria-label 필수."),
    "ggc-utility-bar": ("유틸리티 바", "모든 시스템 최상단 진네이비 띠 + 통합서비스 스위처(switcher=\"bar\"). 사이드바 스위처와 둘 다 두지 않는다."),
    # ---- blocks (대민 — 무변경) ----
    "ggc-hero": ("히어로 (대민 메인)", "안내 문구 + 통합검색 + 바로가기 칩."),
    "ggc-identifier": ("아이덴티파이어 (대민)", "\"이 누리집은 {기관명} 누리집입니다.\""),
    "ggc-masthead": ("마스트헤드 (대민)", "공식 누리집 띠 — 문구 고정."),
    "ggc-public-footer": ("공개 푸터 (대민)", "관련 누리집 · 기관 정보 · 하단 메뉴 · 아이덴티파이어 슬롯."),
    "ggc-public-header": ("대민 헤더 · 주 메뉴", "유틸리티 · 브랜딩 · 통합검색 · 주 메뉴. 업무 셸과 섞지 않는다."),
    "ggc-public-layout": ("대민 본문 배치", "PublicPage · Inner(1248) · PublicMain · PageTitle · SectionTitle."),
    "ggc-side-nav": ("사이드 내비게이션 (대민)", "<details> 2단 — JS 0."),
    "ggc-structured-list": ("구조화 목록 (대민)", "공모 · 접수 · 방청 카드 격자."),
}

# ggc-style 이 한 번에 설치하는 P0 — 무거운 것(command · calendar · chart · sidebar …)은 블록이 필요할 때 끌어온다
STYLE_UI = ["button", "badge", "card", "input", "label", "textarea", "select", "native-select", "checkbox", "radio-group",
            "switch", "dialog", "alert-dialog", "tabs", "alert", "breadcrumb", "pagination", "table", "skeleton", "spinner",
            "accordion", "dropdown-menu", "tooltip", "popover", "sheet", "separator", "avatar", "scroll-area", "collapsible",
            "toggle", "toggle-group", "sonner", "kbd", "field", "empty"]

THEME_LIGHT = {
    "background": "var(--ggc-bg)", "foreground": "var(--ggc-text)",
    "card": "var(--ggc-surface)", "card-foreground": "var(--ggc-text)",
    "popover": "var(--ggc-surface)", "popover-foreground": "var(--ggc-text)",
    "primary": "var(--ggc-primary)", "primary-foreground": "#ffffff",
    "secondary": "var(--ggc-surface-inset)", "secondary-foreground": "var(--ggc-primary-deep)",
    "muted": "var(--ggc-control-bg)", "muted-foreground": "var(--ggc-text-muted)",
    "accent": "var(--ggc-primary-light)", "accent-foreground": "var(--ggc-primary-deep)",
    "destructive": "var(--ggc-danger)", "destructive-foreground": "#ffffff",
    "border": "var(--ggc-border)", "input": "var(--ggc-border-strong)", "ring": "var(--ggc-primary)",
    "radius": "var(--ggc-radius)",
    "chart-1": "var(--ggc-primary)", "chart-2": "var(--ggc-info)", "chart-3": "var(--ggc-success)",
    "chart-4": "var(--ggc-warning)", "chart-5": "var(--ggc-danger)",
    "sidebar": "var(--ggc-surface)", "sidebar-foreground": "var(--ggc-text)",
    "sidebar-primary": "var(--ggc-primary)", "sidebar-primary-foreground": "#ffffff",
    "sidebar-accent": "var(--ggc-primary-light)", "sidebar-accent-foreground": "var(--ggc-primary-deep)",
    "sidebar-border": "var(--ggc-shell-border)", "sidebar-ring": "var(--ggc-primary)",
}
THEME_THEME = {
    "font-sans": "var(--ggc-font)", "font-heading": "var(--ggc-font)", "font-mono": "var(--ggc-font-mono)",
    # 공식 소스의 rounded-lg(컨트롤) · rounded-xl(카드) · rounded-md(메뉴 항목)에 계약 §2 형태를 댄다
    "radius-sm": "var(--ggc-radius-sm)", "radius-md": "var(--ggc-radius-sm)",
    "radius-lg": "var(--ggc-radius)", "radius-xl": "var(--ggc-radius-lg)", "radius-2xl": "var(--ggc-radius-lg)",
}


def read(p):
    with io.open(p, encoding="utf-8") as fh:
        return fh.read()


def deps_of(src):
    pkgs, regs = set(), set()
    for spec in IMPORT_RE.findall(src):
        if spec.startswith("@/components/ui/"):
            regs.add("@ggc/" + spec.rsplit("/", 1)[1])
        elif spec.startswith("@/hooks/"):
            regs.add("@ggc/" + spec.rsplit("/", 1)[1])
        elif spec.startswith("@/") or spec.startswith("."):
            continue
        else:
            root = spec if spec.startswith("@") else spec.split("/")[0]
            if root in PKG_ALLOW:
                pkgs.add(PKG_VERSION.get(root, root))
    return sorted(pkgs), sorted(regs)


def item(name, typ, files, src, extra_regs=(), extra_pkgs=()):
    title, desc = META.get(name, (name, ""))
    pkgs, regs = deps_of(src)
    pkgs = sorted(set(pkgs) | set(extra_pkgs))
    regs = sorted(set(regs) | set(extra_regs))
    it = {"name": name, "type": typ, "title": title}
    if desc:
        it["description"] = desc
    if pkgs:
        it["dependencies"] = pkgs
    if regs:
        it["registryDependencies"] = regs
    it["files"] = files
    return it


def build():
    items = [
        {
            "name": "ggc-tokens", "type": "registry:file", "title": "GGC 디자인 토큰 (정본 사본)",
            "description": "design/ggc-tokens.css 를 그대로 복사한다. 값의 유일한 원천이며 check_design.py D1 이 바이트 대조한다. globals.css 첫 줄에 @import 로 불러온다.",
            "files": [{"path": "design/ggc-tokens.css", "type": "registry:file", "target": "~/styles/ggc-tokens.css"}],
            "docs": "globals.css(또는 index.css) 첫 줄에  @import \"../styles/ggc-tokens.css\";  를 넣는다(@import 는 파일 선두여야 해서 CLI 가 넣지 못한다). 이어서  @import \"tailwindcss\"; @import \"shadcn/tailwind.css\"; @import \"tw-animate-css\";  — 공식 컴포넌트가 쓰는 data-open · data-checked 변형이 shadcn/tailwind.css 에 있다. 폰트는 저장소의 design/ggc-fonts.css + design/fonts/PretendardGOVVariable.subset.woff2 를 public/fonts/ 로 복사하고 토큰보다 먼저 링크한다. 검사: python <저장소>/design/check_design.py --gate .",
        },
        {
            "name": "ggc-theme", "type": "registry:theme", "title": "GGC 테마 — shadcn 변수를 --ggc-* 토큰으로 매핑",
            "description": "shadcn 의 --primary · --background · --radius · --sidebar-* · --chart-* 를 전부 var(--ggc-*) 로 돌린다. 값(hex)은 하나도 없다. 다크 팔레트는 없다(계약 §3). radius 스텝(sm/md/lg/xl)에 토큰을 대 주어 공식 소스의 rounded-lg · rounded-xl 이 계약 §2 형태가 된다.",
            "dependencies": ["shadcn", "tw-animate-css"],
            "registryDependencies": ["@ggc/ggc-tokens"],
            "cssVars": {"theme": THEME_THEME, "light": THEME_LIGHT},
            "css": {"@layer base": {"body": {"font-family": "var(--ggc-font)", "background-color": "var(--ggc-bg)", "color": "var(--ggc-text)", "-webkit-font-smoothing": "antialiased"}, "a": {"text-underline-offset": "2px"}}},
            "docs": "다크 모드 변수를 만들지 않는다(계약 §3-2) — 프리셋이 만든 .dark 블록은 지운다. 공식 소스의 dark: 변형은 이식 때 제거했다. Tailwind 유틸에서 토큰을 직접 쓸 때: h-(--ggc-control-h) · text-(length:--ggc-text-sm) · bg-(--ggc-success-tint).",
        },
    ]
    # ui
    ui_dir = os.path.join(REG, "ui")
    ui_names = sorted(f[:-4] for f in os.listdir(ui_dir) if f.endswith(".tsx"))
    for n in ui_names:
        p = "registry/ggc/ui/%s.tsx" % n
        items.append(item(n, "registry:ui", [{"path": p, "type": "registry:ui"}], read(os.path.join(ROOT, p))))
    # hooks
    hooks_dir = os.path.join(REG, "hooks")
    for f in sorted(os.listdir(hooks_dir)):
        if f.endswith(".ts"):
            n = f[:-3]
            p = "registry/ggc/hooks/%s" % f
            items.append(item(n, "registry:hook", [{"path": p, "type": "registry:hook"}], read(os.path.join(ROOT, p))))
    # style — 한 번에 착지
    items.append({
        "name": "ggc-style", "type": "registry:style", "title": "GGC 스타일 — 한 번에 착지",
        "description": "npx shadcn add @ggc/ggc-style 한 번으로 토큰 파일 · 테마 · P0 컴포넌트 %d종이 들어온다. 무거운 것(sidebar · command · calendar · chart · data-table)은 블록이 필요할 때 끌어온다." % len(STYLE_UI),
        "registryDependencies": ["utils", "@ggc/ggc-tokens", "@ggc/ggc-theme"] + ["@ggc/" + n for n in STYLE_UI],
        "dependencies": ["radix-ui", "class-variance-authority", "lucide-react", "sonner"],
    })
    # blocks
    blocks_dir = os.path.join(REG, "blocks")
    for n in sorted(os.listdir(blocks_dir)):
        d = os.path.join(blocks_dir, n)
        if not os.path.isdir(d):
            continue
        files = sorted(f for f in os.listdir(d) if f.endswith(".tsx"))
        src = "\n".join(read(os.path.join(d, f)) for f in files)
        extra = ["@ggc/ggc-tokens"] if n in ("ggc-shell", "ggc-utility-bar", "ggc-footer", "ggc-hero", "ggc-identifier", "ggc-masthead",
                                              "ggc-public-footer", "ggc-public-header", "ggc-public-layout", "ggc-side-nav", "ggc-structured-list") else []
        items.append(item(n, "registry:block", [{"path": "registry/ggc/blocks/%s/%s" % (n, f), "type": "registry:component"} for f in files], src, extra_regs=extra))
    reg = {"$schema": "https://ui.shadcn.com/schema/registry.json", "name": "ggc",
           "homepage": "https://github.com/gyeonggi-council/ggc-design-system", "items": items}
    missing = [i["name"] for i in items if i["name"] not in META and i["type"] in ("registry:ui", "registry:block", "registry:hook")]
    if missing:
        print("WARN  META 에 설명이 없는 항목: " + ", ".join(missing))
    return json.dumps(reg, ensure_ascii=False, indent=2) + "\n"


def main():
    text = build()
    if "--check" in sys.argv:
        cur = read(OUT) if os.path.exists(OUT) else ""
        if cur.replace("\r\n", "\n") != text:
            print("FAIL  registry.json 이 소스보다 낡았다 — python tools/build-registry-json.py")
            return 1
        print("OK    registry.json 이 소스와 일치한다")
        return 0
    with io.open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)
    n = len(json.loads(text)["items"])
    print("생성  registry.json  항목 %d" % n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
