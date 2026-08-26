#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_design.py — 경기도의회 공통 디자인 드리프트 검사기

`diff -q` 를 대체한다. 기존 게이트는 파일 사본만 판정할 수 있어서,
값을 인라인으로 이식한 서비스(hipass·hr)를 원리상 검사 대상으로 삼지 못했다.

  D1 TOKENS-COPY  ggc-tokens.css 가 있으면 정본과 바이트 동일한가
  D2 PALETTE      소스의 색 리터럴이 정본에서 파생한 허용집합 안인가   <- 본체
  D3 SHELL        토큰을 자기 스타일보다 먼저 로드하는가 · 공통 셸 · 파비콘
  D4 FONT         외부 폰트 CDN 0 · --ggc-font 우회 font-family 0 (망분리)
                  ⚠ @font-face 안의 font-family 는 세지 않는다 — 그것은 서체 **선언**이지
                    토큰 우회가 아니다. 세면 자체 호스팅을 요구해 놓고 그 선언을 벌하게 된다.
  D5 A11Y         대체 없는 outline:none 0 · :focus-visible 존재 · 대비
  D6 CANON        정본 자체 검사 — 계약 문서 <-> 토큰 CSS <-> 컴포넌트 CSS

락파일을 만들지 않는다. 허용집합은 매 실행 시 정본 CSS 에서 파생한다 —
락파일은 "정본과 같아야 하는 파일" 을 하나 더 만드는 것이고, 그게 지금 문제의 형태다.

사용법:
  python check_design.py --canon
  python check_design.py --report <서비스경로>
  python check_design.py --gate   <서비스경로> [--aa=observe|enforce]
  python check_design.py --all    [ggc-services 경로]
"""
import os
import re
import subprocess
import sys
import argparse
import hashlib

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
CANON_TOKENS = os.path.join(HERE, "ggc-tokens.css")
CANON_COMPONENTS = os.path.join(HERE, "ggc-components.css")
CANON_BRAND = os.path.join(HERE, "brand")
CONTRACT_DOC = os.path.normpath(os.path.join(
    HERE, "..", "docs", "23-Claude-Design-전시스템-단일디자인-계약.md"))

SCAN_EXT = {".css", ".scss", ".sass", ".less", ".tsx", ".jsx", ".ts", ".js",
            ".html", ".htm", ".jsp", ".vue", ".svelte"}
# 빌드 산출물을 절대 스캔하지 않는다 — 소스맵에 박힌 남의 색이 잡힌다(실측 확인).
SKIP_DIRS = {"node_modules", ".next", ".nuxt", "dist", "build", "out", ".venv",
             "venv", "__pycache__", "target", ".git", ".turbo", ".cache",
             "coverage", ".pytest_cache", "site-packages", ".svelte-kit",
             "_retired", ".orca",
             # 우리 코드가 아닌 것 — 빼지 않으면 남의 사이트 캡처를 결함으로 보고한다
             "tmp",            # bill-system/tmp/ 는 ggc.go.kr·교육청 외부 사이트 캡처
             "rhwp",           # bill-system 안의 벤더 번들(rhwp-studio). 손대지 않는다
             "lcov-report",    # 테스트 커버리지 HTML
             "scrape", "demo-screens"}
SKIP_SUFFIX = (".map", ".min.css", ".min.js", ".lock")

# 계약이 명시적으로 폐기한 값 — 발견 즉시 FAIL
RETIRED = {"#256ef4": "계약 v1.0 에서 폐기된 KRDS 기본 파랑",
           "#246beb": "계약 v1.0 에서 폐기된 KRDS 기본 파랑"}

UNIVERSAL = {"#fff", "#ffffff", "#000", "#000000",
             "transparent", "currentcolor", "inherit"}

HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
RGBA_RE = re.compile(r"rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)", re.I)
ICON_DECL_RE = re.compile(r'rel=["\'](?:shortcut )?icon')
ALLOW_RE = re.compile(r"ggc-design-allow:\s*(#?[0-9a-zA-Z]+)\s*[-—]+\s*([^*\n]+)")

PAGE_BG = "#eef1f5"
WHITE = "#ffffff"


# ------------------------------------------------------------------ 색 유틸
def norm_hex(h):
    h = h.lower().lstrip("#")
    if len(h) in (3, 4):
        h = "".join(c * 2 for c in h[:3])
    return "#" + h[:6]


def lum(h):
    h = norm_hex(h).lstrip("#")

    def ch(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * ch(h[0:2]) + 0.7152 * ch(h[2:4]) + 0.0722 * ch(h[4:6])


def contrast(a, b):
    l1, l2 = lum(a), lum(b)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


# ---------------------------------------------------------------- 파일 수집
def iter_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(SKIP_SUFFIX):
                continue
            if os.path.splitext(fn)[1].lower() not in SCAN_EXT:
                continue
            yield os.path.join(dirpath, fn)


def _all_files(root):
    """확장자 무관 전체 파일 (자산 존재 확인용)."""
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            yield os.path.join(dirpath, fn)


def read(path):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    except OSError:
        return ""


def md5(path):
    try:
        with open(path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except OSError:
        return None


# ------------------------------------------------------------------ 허용집합
def build_allowset():
    """정본 CSS 2개에서 매 실행 시 파생한다. 사본을 만들지 않는다."""
    allow, rgba_bases = set(UNIVERSAL), set()
    for p in (CANON_TOKENS, CANON_COMPONENTS):
        text = read(p)
        for h in HEX_RE.findall(text):
            allow.add(norm_hex(h))
        for m in RGBA_RE.finditer(text):
            rgba_bases.add(tuple(int(float(x)) for x in m.groups()))
    return allow, rgba_bases


CODE_TAG_RE = re.compile(r"(<(code|pre)\b[^>]*>)(.*?)(</\2\s*>)",
                         re.S | re.I)


def strip_doc_text(text):
    """HTML 의 <code>/<pre> **본문**을 공백으로 지운다. 줄 수와 열 위치는 보존한다.

    이 안의 색값은 스타일이 아니라 **설명**이다. 문서가 "#256ef4 는 폐기값" 이라고
    적으면 검사기가 그 문장을 위반으로 세는데, 그러면 **규칙을 문서화할수록
    FAIL 이 늘어난다.** 주석에 대해 이미 같은 결론을 냈다(strip_comments 참조).

    여는 태그는 남긴다 — 거기 붙은 style="..." 은 진짜 스타일이라 검사 대상이다.
    (2026-08-22 예제 갤러리에서 확인: 폐기값을 "쓰지 말라" 고 설명한 문장 자체가
     D2 retired FAIL 로, outline:none 을 설명한 문장이 D5 FAIL 로 잡혔다)"""
    def blank(m):
        return m.group(1) + re.sub(r"[^\n]", " ", m.group(3)) + m.group(4)
    return CODE_TAG_RE.sub(blank, text)


def strip_comments(text):
    """주석 내용을 공백으로 지운다. 줄 수와 열 위치는 보존한다 —
    주석 안의 색 언급을 위반으로 세지 않기 위해서다.
    (정본 토큰 파일이 "#246BEB 는 폐기" 라고 설명하는 줄이 FAIL 로 잡혔다)"""
    out = []
    block = False          # /* ... */
    html = False           # <!-- ... -->
    for line in text.splitlines():
        buf = []
        i = 0
        n = len(line)
        while i < n:
            if block:
                if line.startswith("*/", i):
                    block = False
                    buf.append("  ")
                    i += 2
                else:
                    buf.append(" ")
                    i += 1
            elif html:
                if line.startswith("-->", i):
                    html = False
                    buf.append("   ")
                    i += 3
                else:
                    buf.append(" ")
                    i += 1
            elif line.startswith("/*", i):
                block = True
                buf.append("  ")
                i += 2
            elif line.startswith("<!--", i):
                html = True
                buf.append("    ")
                i += 4
            elif line.startswith("//", i) and not line.startswith("://", i - 1):
                buf.append(" " * (n - i))
                break
            else:
                buf.append(line[i])
                i += 1
        out.append("".join(buf))
    return out


def base_root_vars(css):
    """기본 :root 블록의 --ggc-* 만 돌려준다.

    @media 안의 오버라이드(prefers-contrast·forced-colors)는 기본값이 아니다.
    중첩 깊이를 세어 최상위 :root 만 고른다."""
    out, i, n = {}, 0, len(css)
    depth = 0
    while i < n:
        ch = css[i]
        if ch == "{":
            depth += 1
            i += 1
            continue
        if ch == "}":
            depth = max(0, depth - 1)
            i += 1
            continue
        if depth == 0 and css.startswith(":root", i):
            j = css.find("{", i)
            if j < 0:
                break
            k, d = j, 0
            while k < n:
                if css[k] == "{":
                    d += 1
                elif css[k] == "}":
                    d -= 1
                    if d == 0:
                        break
                k += 1
            for m in re.finditer(r"--ggc-([\w-]+):\s*(#[0-9a-fA-F]{3,8})",
                                 css[j:k]):
                out.setdefault(m.group(1).lower(), norm_hex(m.group(2)))
            i = k + 1
            continue
        i += 1
    return out


# ---------------------------------------------------------------- 결과 수집
class Report:
    # 다섯 항목을 미리 깔아 둔다 — 지적이 0건인 항목이 요약줄에서 통째로 사라지면
    # 「깨끗함」과 「검사하지 않음」을 가릴 수 없다. 2026-08-25 에 D4 가 처음 0건이
    # 되면서 요약줄에서 D4 가 없어졌고, 그때 드러난 결함이다.
    CHECKS = ("D1", "D2", "D3", "D4", "D5")

    def __init__(self, label):
        self.label = label
        self.lines = []
        self.counts = {k: {"FAIL": 0, "WARN": 0, "INFO": 0} for k in self.CHECKS}

    def add(self, check, level, kind, where, msg):
        self.lines.append((check, level, kind, where, msg))
        self.counts.setdefault(check, {"FAIL": 0, "WARN": 0, "INFO": 0})
        self.counts[check][level] += 1

    def fails(self):
        return sum(c["FAIL"] for c in self.counts.values())

    def warns(self):
        return sum(c["WARN"] for c in self.counts.values())

    def dump(self, limit=30):
        by_level = {"FAIL": [], "WARN": [], "INFO": []}
        for row in self.lines:
            by_level[row[1]].append(row)
        for level in ("FAIL", "WARN", "INFO"):
            rows = by_level[level]
            for check, lv, kind, where, msg in rows[:limit]:
                print(f"  {check} {lv:<4} {kind:<8} {where}  {msg}")
            if len(rows) > limit:
                print(f"  {rows[0][0]} ... {level} {len(rows) - limit}건 더 생략")


# ---------------------------------------------------------------- 서비스 검사
def find_token_copies(root):
    hits = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if "ggc-tokens.css" in filenames:
            hits.append(os.path.join(dirpath, "ggc-tokens.css"))
    return hits


def classify(root):
    """4형 판정 — 프런트 없음 / 사본형 / 인라인형 / 독자형"""
    files = list(iter_files(root))
    web = [f for f in files if os.path.splitext(f)[1].lower() in
           {".css", ".scss", ".tsx", ".jsx", ".html", ".htm", ".jsp", ".vue"}]
    if not web:
        return "1.프런트없음", files
    if find_token_copies(root):
        return "2.사본형", files
    blob = "".join(read(f) for f in web[:400])
    if "--ggc-" in blob:
        return "3.인라인형", files
    return "4.독자형", files


LINK_TAG_RE = re.compile(r"<link[^>]*>", re.I)
ATTR_RE = re.compile(r"""([a-zA-Z-]+)\s*=\s*["']([^"']*)["']""")


def linked_css_blob(files, root):
    """HTML 이 <link> 로 부르는 **로컬** CSS 를 읽어 합쳐 돌려준다.

    스캔 폴더 밖의 정본을 상대경로로 링크한 경우(예제 갤러리가 그렇다)
    폴더만 보면 규칙이 없는 것처럼 보이지만 실제로는 적용된다.
    파일로 존재하고 실제로 로드되는 것만 따라간다 — http(s)·프로토콜 상대 URL 은
    D4 가 따로 잡으므로 여기서는 건너뛴다."""
    seen, out = set(), []
    for f in files:
        if os.path.splitext(f)[1].lower() not in {".html", ".htm", ".jsp"}:
            continue
        base = os.path.dirname(f)
        for tag in LINK_TAG_RE.findall(read(f)):
            attrs = {k.lower(): v for k, v in ATTR_RE.findall(tag)}
            if "stylesheet" not in attrs.get("rel", "").lower():
                continue
            href = attrs.get("href", "").split("?")[0].split("#")[0]
            if not href or href.startswith(("http:", "https:", "//", "data:")):
                continue
            p = os.path.normpath(os.path.join(base, href.lstrip("/")))
            if p in seen or not os.path.isfile(p):
                continue
            seen.add(p)
            out.append(read(p))
    return "\n".join(out)


def check_service(root, aa_mode="observe", verbose=True):
    root = os.path.abspath(root)
    name = os.path.basename(root.rstrip(os.sep))
    rep = Report(name)
    allow, rgba_bases = build_allowset()
    kind, files = classify(root)

    if kind.startswith("1."):
        if verbose:
            print(f"\n=== [{name}] {kind} ===")
            print("  G-DESIGN 해당 없음 (프런트가 없는 서비스)")
        return rep, kind

    # 파일별 예외 등록
    allow_local = {}
    for f in files:
        for m in ALLOW_RE.finditer(read(f)):
            allow_local.setdefault(norm_hex(m.group(1)), []).append(
                (os.path.relpath(f, root), m.group(2).strip()))

    # --- D1 TOKENS-COPY --------------------------------------------------
    copies = find_token_copies(root)
    canon_md5 = md5(CANON_TOKENS)
    if copies:
        for c in copies:
            rel = os.path.relpath(c, root)
            if md5(c) == canon_md5:
                rep.add("D1", "INFO", "copy", rel, "정본과 바이트 동일")
            else:
                rep.add("D1", "FAIL", "copy", rel,
                        "정본과 다르다 — 정본에서 다시 복사할 것 "
                        "(값을 바꿔야 한다면 정본을 먼저 고친다)")
    else:
        rep.add("D1", "INFO", "copy", "-", "토큰 파일 없음 (인라인형/독자형)")

    # --- D2 PALETTE ------------------------------------------------------
    for f in files:
        rel = os.path.relpath(f, root)
        raw_lines = read(f).splitlines()
        for i, line in enumerate(
                strip_comments(strip_doc_text("\n".join(raw_lines))), 1):
            if "ggc-design-allow" in raw_lines[i - 1]:
                continue
            for h in HEX_RE.findall(line):
                n = norm_hex(h)
                if n in RETIRED:
                    rep.add("D2", "FAIL", "retired", f"{rel}:{i}",
                            f"{h}  {RETIRED[n]}")
                elif n in allow_local:
                    rep.add("D2", "INFO", "allowed", f"{rel}:{i}",
                            f"{h}  등록된 예외")
                elif n not in allow:
                    rep.add("D2", "FAIL", "palette", f"{rel}:{i}",
                            f"{h}  허용집합 밖 (정본에 없는 색)")
            for m in RGBA_RE.finditer(line):
                base = tuple(int(float(x)) for x in m.groups())
                if base in rgba_bases or base in {(0, 0, 0), (255, 255, 255)}:
                    continue
                rep.add("D2", "WARN", "palette", f"{rel}:{i}",
                        f"rgb{base}  정본 파생 아님")

    blob = "".join(read(f) for f in files)
    # 셸 검사는 **마크업**을 본다. 토큰/컴포넌트 CSS 는 클래스를 *정의*할 뿐이라
    # 여기 포함하면 파일을 복사한 것만으로 "셸이 있다" 는 오탐이 난다.
    markup = "".join(read(f) for f in files
                     if os.path.basename(f) not in ("ggc-tokens.css",
                                                    "ggc-components.css"))

    # --- D3 SHELL --------------------------------------------------------
    for cls, label in (("ggc-utility-bar", "유틸리티 바"),
                       ("ggc-footer", "공통 푸터")):
        if cls in markup:
            rep.add("D3", "INFO", "shell", "-", f"{label} 있음")
        else:
            rep.add("D3", "WARN", "shell", "-", f"{label} 없음 (공통 셸 3종)")

    entry = [f for f in files if os.path.splitext(f)[1].lower()
             in {".html", ".htm", ".jsp", ".tsx", ".jsx", ".vue"}]
    for f in entry:
        text = read(f)
        ti = text.find("ggc-tokens.css")
        if ti < 0:
            continue
        for other in re.finditer(r"""href=["'][^"']*?([\w.-]+\.css)""", text):
            if other.group(1) == "ggc-tokens.css":
                continue
            if other.start() < ti:
                rep.add("D3", "FAIL", "order", os.path.relpath(f, root),
                        f"{other.group(1)} 가 토큰보다 먼저 로드된다 "
                        f"— 순서가 곧 우선순위")

    # Next App Router 는 app/icon.png 파일 관례를 쓴다 — 마크업 선언이 없다.
    # basePath 가 빌드마다 다르고 href 에 내용 해시까지 자동으로 붙어 그쪽이 옳다.
    next_convention = any(
        os.path.basename(x) in ("icon.png", "apple-icon.png")
        for x in _all_files(root))
    has_favicon = bool(re.search(ICON_DECL_RE, blob)) or next_convention
    if has_favicon:
        rep.add("D3", "INFO", "favicon", "-", "파비콘 선언 있음")
    else:
        rep.add("D3", "WARN", "favicon", "-",
                "파비콘 없음 — ASSET-MAP.tsv 의 대상 경로로 복사하고 선언을 넣을 것")

    # --- D4 FONT ---------------------------------------------------------
    for f in files:
        rel = os.path.relpath(f, root)
        ext = os.path.splitext(f)[1].lower()
        # @font-face 안의 font-family 는 **서체 선언**이지 토큰 우회가 아니다.
        # 자체 호스팅을 요구해 놓고 그 선언을 위반으로 세면 규칙이 자기 자신과
        # 모순된다 — 정본 ggc-fonts.css 조차 WARN 이 났다(2026-08-25 수정).
        in_face = False
        for i, line in enumerate(strip_comments(strip_doc_text(read(f))), 1):
            if re.search(r"(fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr"
                         r"|unpkg\.com|cdnjs\.cloudflare)", line):
                rep.add("D4", "FAIL", "cdn", f"{rel}:{i}",
                        "외부 CDN — 망분리 환경에서 깨진다")
            if re.search(r"@font-face", line, re.I):
                in_face = True
            m = re.search(r"font-family:\s*([^;}\n]+)", line, re.I)
            if m and ext in {".css", ".scss"} and not in_face:
                v = m.group(1).strip()
                if "--ggc-font" not in v and "inherit" not in v:
                    rep.add("D4", "WARN", "font", f"{rel}:{i}",
                            f"--ggc-font 우회: {v[:60]}")
            if in_face and "}" in line:
                in_face = False

    # --- D5 A11Y ---------------------------------------------------------
    # <link> 로 부르는 로컬 CSS 까지 따라간다 — 폴더 밖 정본을 직접 링크해도
    # 규칙은 실제로 적용된다(사본 무결성은 D1 이 따로 본다)
    if ":focus-visible" in blob:
        rep.add("D5", "INFO", "focus", "-", ":focus-visible 있음")
    elif ":focus-visible" in linked_css_blob(files, root):
        rep.add("D5", "INFO", "focus", "-",
                ":focus-visible 있음 (링크된 CSS)")
    else:
        rep.add("D5", "FAIL", "focus", "-",
                ":focus-visible 없음 — 계약 §3 공통 포커스 규칙이 필요하다")

    for f in files:
        # 정본 사본은 건너뛴다 — 아래 AA 검사와 같은 이유다.
        # 서비스는 이 파일을 고칠 수 없고(D1 이 바이트 동일을 강제한다), 포커스 대체는
        # ggc-tokens.css 의 전역 :focus-visible 이 이미 모든 요소에 제공한다.
        # 파일 단위로만 보면 ggc-components.css 를 채택한 서비스가 전부 FAIL 이 된다
        # (2026-08-22 ggc_kb 가 첫 채택자로 드러났다). 정본 자체는 D6 가 본다.
        if os.path.basename(f) in ("ggc-tokens.css", "ggc-components.css"):
            continue
        rel = os.path.relpath(f, root)
        text = read(f)
        file_has_fv = ":focus-visible" in text
        for i, line in enumerate(strip_comments(strip_doc_text(text)), 1):
            if re.search(r"outline:\s*(none|0)\b", line, re.I) and not file_has_fv:
                rep.add("D5", "FAIL", "outline", f"{rel}:{i}",
                        "대체 없는 outline:none — 접근성 위반")

    level = "FAIL" if aa_mode == "enforce" else "INFO"
    seen = set()
    for f in files:
        if os.path.splitext(f)[1].lower() not in {".css", ".scss", ".html", ".htm"}:
            continue
        # 정본 사본은 건너뛴다 — D6 가 올바른 전경/배경 쌍으로 이미 검증한다.
        # 여기서 보면 유틸리티 바(어두운 배경 위 밝은 글자)를 흰 배경 기준으로
        # 잘못 재서 없는 위반을 만들어 낸다.
        if os.path.basename(f) in ("ggc-tokens.css", "ggc-components.css"):
            continue
        rel = os.path.relpath(f, root)
        for i, line in enumerate(strip_comments(strip_doc_text(read(f))), 1):
            m = re.search(r"(?<![-\w])color:\s*(#[0-9a-fA-F]{3,8})\b", line)
            if not m:
                continue
            n = norm_hex(m.group(1))
            if n in UNIVERSAL or (n, rel) in seen:
                continue
            seen.add((n, rel))
            cw, cb = contrast(n, WHITE), contrast(n, PAGE_BG)
            if min(cw, cb) < 4.5:
                rep.add("D5", level, "aa", f"{rel}:{i}",
                        f"{m.group(1)}  흰 {cw:.2f}:1 · 페이지bg {cb:.2f}:1  (AA 4.5 미만 — 배경을 흰색/페이지로 가정한 값이다)")

    if verbose:
        print(f"\n=== [{name}] {kind} ===")
        rep.dump()
        parts = []
        for k in sorted(rep.counts):
            v = rep.counts[k]
            if v["FAIL"]:
                parts.append(f"{k} FAIL({v['FAIL']})")
            elif v["WARN"]:
                parts.append(f"{k} WARN({v['WARN']})")
            else:
                parts.append(f"{k} PASS")
        verdict = "FAIL" if rep.fails() else "PASS"
        print(f"  --- {'  '.join(parts)}  -> G-DESIGN {verdict}")
    return rep, kind


# ------------------------------------------------------------- 자산 배포 검사
SERVICES_ROOT = os.environ.get("GGC_SERVICES", r"D:\2026-ggc-vibe\ggc-services")


def check_asset_map(services_root=None):
    """ASSET-MAP.tsv 를 읽어 행마다 정본↔사본 바이트 동일을 본다.

    이름이 아니라 표로 매핑을 고정한다 — Next App Router 가 파일명을
    icon.png / apple-icon.png 로 강제해 이름 통일이 애초에 불가능하기 때문이다.
    표에 없는 서비스는 '미적용' 으로 드러난다. 조용히 빠지지 않는다.
    """
    root = services_root or SERVICES_ROOT
    mp = os.path.join(CANON_BRAND, "ASSET-MAP.tsv")
    dist = os.path.join(CANON_BRAND, "dist")
    if not os.path.exists(mp):
        print("D6 WARN  assets    ASSET-MAP.tsv 가 없다")
        return 1
    rows = []
    for line in read(mp).splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) != 3:
            continue
        rows.append(parts)

    by_svc, warns = {}, 0
    for svc, canon_name, target in rows:
        src = os.path.join(dist, canon_name)
        dst = os.path.join(root, target.replace("/", os.sep))
        want = md5(src)
        got = md5(dst)
        state = "OK" if (want and want == got) else ("없음" if got is None else "다름")
        by_svc.setdefault(svc, []).append((state, target))
        if state != "OK":
            warns += 1
    for svc in sorted(by_svc):
        items = by_svc[svc]
        ok = sum(1 for s, _ in items if s == "OK")
        lvl = "INFO" if ok == len(items) else "WARN"
        print(f"D6 {lvl}  assets    {svc:<24} {ok}/{len(items)} 적용")
        for s, t in items:
            if s != "OK":
                print(f"                       - {t}  ({s})")
    return warns


# ---------------------------------------------------------------- 정본 검사
GENERATED = [
    # 생성 스크립트                산출물                        용도
    ("build-preview.py", "preview-palette.svg",
     "README 팔레트 미리보기 (GitHub 웹은 HTML 을 렌더하지 않는다)"),
    ("build-standalone.py", "examples-standalone.html",
     "링크 하나로 여는 갤러리 합본 (URL 로 공유되는 판)"),
]


def check_generated():
    """design/examples/ 의 생성물이 정본보다 낡았는지 본다.

    둘 다 정본에서 만들어지고, **낡으면 조용히 정본과 다른 것을 보여 준다.**
    특히 합본은 URL 로 공유되므로 낡은 채로 남에게 나갈 수 있다 —
    생성물이 조용히 낡는 것이 이 저장소가 통째로 막으려는 실패 그 자체다."""
    warns = 0
    for script, artifact, why in GENERATED:
        sp = os.path.join(HERE, "examples", script)
        ap = os.path.join(HERE, "examples", artifact)
        if not os.path.exists(sp):
            continue
        if not os.path.exists(ap):
            print("D6 WARN  gen       %s 가 없다 — "
                  "python design/examples/%s" % (artifact, script))
            warns += 1
            continue
        r = subprocess.run([sys.executable, sp, "--check"],
                           capture_output=True, text=True, encoding="utf-8")
        if r.returncode == 0:
            print("D6 INFO  gen       %-26s 정본과 일치" % artifact)
        else:
            print("D6 WARN  gen       %-26s 정본보다 낡았다 — "
                  "python design/examples/%s" % (artifact, script))
            print("                   용도: %s" % why)
            warns += 1
    return warns


def check_canon():
    print("=== D6 CANON — 정본 자체 검사 ===")
    tokens = read(CANON_TOKENS)
    comps = read(CANON_COMPONENTS)
    doc = read(CONTRACT_DOC)
    fails = warns = 0

    if not tokens:
        print("D6 FAIL  정본 토큰 CSS 를 읽을 수 없다:", CANON_TOKENS)
        return 1

    # 기본 :root 만 본다 — @media 오버라이드는 기본값이 아니다
    tok_vals = base_root_vars(tokens)

    print("\n--- 계약 문서 <-> 토큰 파일 ---")
    doc_vals = {}
    for m in re.finditer(r"^-\s*([\w-]+)\s+`(#[0-9a-fA-F]{6})`", doc, re.M):
        doc_vals[m.group(1).lower()] = norm_hex(m.group(2))
    if not doc_vals:
        print("D6 WARN  contract  계약 문서에서 토큰 값을 읽지 못했다:", CONTRACT_DOC)
        warns += 1
    for name in sorted(doc_vals):
        val = doc_vals[name]
        have = tok_vals.get(name)
        if have is None:
            print(f"D6 WARN  contract  {name:<14} 계약 {val}  <->  토큰 파일에 이름 없음")
            warns += 1
        elif have != val:
            print(f"D6 WARN  contract  {name:<14} 계약 {val}  <->  파일 {have}   불일치")
            warns += 1
    if doc_vals and warns == 0:
        print("D6 INFO  contract  계약 문서가 선언한 값이 전부 토큰 파일과 일치")

    ALPHA = r"rgba\(60,\s*93,\s*147,\s*(0?\.\d+)\s*\)"
    doc_alpha = re.search(ALPHA, doc)
    file_alpha = re.search(r"--ggc-focus-ring:[^;]*?" + ALPHA, tokens + comps)
    if doc_alpha and file_alpha:
        if abs(float(doc_alpha.group(1)) - float(file_alpha.group(1))) > 1e-9:
            print(f"D6 WARN  focus     포커스 링 알파  계약 {doc_alpha.group(1)}"
                  f"  <->  파일 {file_alpha.group(1)}")
            warns += 1
        else:
            print("D6 INFO  focus     포커스 링 알파가 계약과 일치")
    elif doc_alpha and not file_alpha:
        print("D6 WARN  focus     --ggc-focus-ring 이 정본 CSS 에 없다 (계약 §3 은 요구)")
        warns += 1

    print("\n--- 토큰 자체 AA (상태색: 자기 틴트 위 / 중립: 흰·페이지bg 위) ---")
    for base in ("success", "warning", "danger", "info"):
        fg, tint = tok_vals.get(base), tok_vals.get(base + "-tint")
        if not (fg and tint):
            continue
        c = contrast(fg, tint)
        ok = c >= 4.5
        fails += 0 if ok else 1
        print(f"D6 {'INFO' if ok else 'FAIL'}  aa        --ggc-{base:<8} "
              f"{fg} on {tint} = {c:5.2f}:1  {'OK' if ok else '미달'}")
    for base in ("text-strong", "text", "text-muted", "text-subtle"):
        v = tok_vals.get(base)
        if not v:
            continue
        cw, cb = contrast(v, WHITE), contrast(v, PAGE_BG)
        ok = min(cw, cb) >= 4.5
        fails += 0 if ok else 1
        print(f"D6 {'INFO' if ok else 'FAIL'}  aa        --ggc-{base:<11} {v}  "
              f"흰 {cw:5.2f} · bg {cb:5.2f}  {'OK' if ok else '미달'}")
    if "text-faint" in tok_vals:
        print(f"D6 INFO  aa        --ggc-text-faint  {tok_vals['text-faint']}"
              f"  비텍스트 전용(3:1 대상) — 텍스트에 쓰지 않는다")

    print("\n--- 브랜드 자산 정본 ---")
    dist = os.path.join(CANON_BRAND, "dist")
    need = ["favicon.ico", "favicon-32.png",
            "apple-touch-icon-180.png", "assembly-mark.png"]
    missing = [n for n in need if not os.path.exists(os.path.join(dist, n))]
    if missing:
        print(f"D6 WARN  brand     design/brand/dist/ 누락: {', '.join(missing)}")
        warns += 1
    else:
        print("D6 INFO  brand     정본 자산 4종 모두 있음")
        mf = os.path.join(dist, "MANIFEST.sha256")
        bad = []
        for line in read(mf).splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            want, nm = line.split(None, 1)
            p = os.path.join(dist, nm.strip())
            got = (hashlib.sha256(open(p, "rb").read()).hexdigest()
                   if os.path.exists(p) else "")
            if got != want:
                bad.append(nm.strip())
        if bad:
            print(f"D6 FAIL  brand     MANIFEST 불일치: {', '.join(bad)}"
                  f" — 정본이 손으로 수정됐다")
            fails += 1
        else:
            print("D6 INFO  brand     MANIFEST.sha256 일치")

    print("\n--- 예제 갤러리 생성물 ---")
    warns += check_generated()

    print("\n--- 브랜드 자산 배포 (ASSET-MAP.tsv) ---")
    warns += check_asset_map()

    print(f"\n--- D6 CANON  FAIL {fails} · WARN {warns}")
    if warns and not fails:
        print("    WARN 은 정본 개정으로만 해소된다(사용자 결정). 서비스가 할 일이 아니다.")
    return 1 if fails else 0


# ---------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(
        description="경기도의회 공통 디자인 드리프트 검사기")
    ap.add_argument("target", nargs="?", help="서비스 폴더 (--canon 이면 생략)")
    ap.add_argument("--report", action="store_true", help="판정만, 항상 exit 0")
    ap.add_argument("--gate", action="store_true", help="FAIL 이면 exit 1")
    ap.add_argument("--canon", action="store_true", help="정본 자체 검사")
    ap.add_argument("--all", action="store_true", help="ggc-services 전체")
    ap.add_argument("--aa", default="observe", choices=["observe", "enforce"])
    a = ap.parse_args()

    if a.canon:
        sys.exit(check_canon())

    if a.all:
        base = a.target or SERVICES_ROOT
        if not os.path.isdir(base):
            print("서비스 폴더를 찾을 수 없다:", base)
            sys.exit(2)
        rows, bad = [], 0
        for d in sorted(os.listdir(base)):
            p = os.path.join(base, d)
            if not os.path.isdir(p) or d.startswith("_") or d.startswith("."):
                continue
            rep, kind = check_service(p, a.aa)
            rows.append((d, kind, rep.fails(), rep.warns()))
            bad += rep.fails()
        print("\n=== 전수 요약 ===")
        print(f"  {'서비스':<26} {'형':<12} 판정")
        for d, kind, f, w in rows:
            v = f"FAIL({f})" if f else (f"PASS · WARN({w})" if w else "PASS")
            print(f"  {d:<26} {kind:<12} {v}")
        sys.exit(1 if (bad and a.gate) else 0)

    if not a.target:
        ap.error("서비스 경로가 필요하다 (또는 --canon / --all)")
    rep, _ = check_service(a.target, a.aa)
    sys.exit(1 if (rep.fails() and a.gate) else 0)


if __name__ == "__main__":
    main()
