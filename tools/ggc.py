#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ggc.py — 경기도의회 공통 디자인 시스템 CLI (v3.3, ADR 0015)

사람과 에이전트가 **같은 명령으로** 문서 · 토큰 · 부품 · 화면 틀 · 검사기를 꺼내 쓴다.
외부 패키지 없음(Python 3.10+ 표준 라이브러리만) — 망분리 PC 에서도 돈다. 값은 어디에도 복제하지 않는다:
토큰은 실행 때 design/ggc-tokens.css 를 읽고, 문서는 그 파일을 그대로 보여 준다.

  python tools/ggc.py help
  python tools/ggc.py docs                     # 문서 지도 + 에이전트 부트스트랩 순서
  python tools/ggc.py docs principles --dense  # 원칙 · 철칙만
  python tools/ggc.py docs tokens --dense      # 토큰 이름 = 값 (정본에서 실시간)
  python tools/ggc.py docs profile --dense     # 대민 프로필이 덮어쓰는 토큰
  python tools/ggc.py docs less | states | contract | a11y | icons | shell | public | records
  python tools/ggc.py component --list [--profile work|public] [--tier 1|2]
  python tools/ggc.py component button [--dense] [--markup]
  python tools/ggc.py template --list
  python tools/ggc.py template explore [--markup]
  python tools/ggc.py icon --list
  python tools/ggc.py specs --for <경로>…      # 이 경로를 지배하는 current 기록
  python tools/ggc.py specs --diff origin/main # 바뀐 파일(과 바뀐 .ggc-* 선택자)을 지배하는 기록
  python tools/ggc.py check [<서비스경로>]      # 없으면 저장소 전수(check-all.sh)
  python tools/ggc.py upgrade <서비스경로> [--apply]   # 사본 재복사 미리보기/적용 (sync-canon.py)
  python tools/ggc.py knowledge --check
  python tools/ggc.py vibe --grade <출력폴더>

--dense 는 제목 · 목록 · 표 · 코드만 남기고 설명 단락을 뺀다 — 에이전트가 맥락에 싣기 위한 판이다.
"""
import importlib.util
import os
import re
import signal
import subprocess
import sys

try:
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)   # `| head` 로 잘라도 역추적을 찍지 않는다
except (AttributeError, ValueError):
    pass

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
DESIGN = os.path.join(ROOT, "design")
TOKENS = os.path.join(DESIGN, "ggc-tokens.css")
INVENTORY = os.path.join(DESIGN, "components.tsv")
TEMPLATES = os.path.join(DESIGN, "templates.tsv")
PY = sys.executable


def _load(name, rel):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, rel))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def knowledge():
    return _load("check_knowledge", "tools/check-knowledge.py")


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, "/")


# ------------------------------------------------------------------ 렌더
def dense(md):
    """제목 · 목록 · 표 · 코드 블록만. 설명 단락 · 인용은 뺀다."""
    out, in_code = [], False
    for line in md.splitlines():
        s = line.strip()
        if s.startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue
        if s.startswith("#") or s.startswith(("- ", "* ", "|")) or re.match(r"^\d+\.\s", s) or re.match(r"^- \[", s):
            out.append(line)
    # 빈 줄 없이 붙은 제목 앞에 한 줄
    res = []
    for line in out:
        if line.startswith("#") and res and res[-1] != "":
            res.append("")
        res.append(line)
    return "\n".join(res)


def show(relpath, want_dense=False, section=None):
    md = read(relpath)
    if section:
        md = extract_section(md, section) or md
    print(f"[{relpath}]" + (f"  § {section}" if section else ""))
    print(dense(md) if want_dense else md)


def extract_section(md, heading):
    """`## heading` 부터 같은 깊이의 다음 제목 전까지."""
    lines = md.splitlines()
    start, depth = None, 0
    for i, line in enumerate(lines):
        m = re.match(r"^(#{1,6})\s+(.*)$", line)
        if not m:
            continue
        if start is None and heading.strip().lower() in m.group(2).strip().lower():
            start, depth = i, len(m.group(1))
            continue
        if start is not None and len(m.group(1)) <= depth:
            return "\n".join(lines[start:i])
    return "\n".join(lines[start:]) if start is not None else None


# ------------------------------------------------------------------ 토큰
def root_block(css, selector):
    """최상위 selector { … } 본문 (첫 블록)."""
    css = re.sub(r"/\*(?!\s*---)(.*?)\*/", lambda m: "/*" + m.group(1) + "*/", css, flags=re.S)
    i = css.find(selector + " {")
    if i < 0:
        i = css.find(selector + "{")
    if i < 0:
        return ""
    j = css.find("{", i)
    k, d = j, 0
    while k < len(css):
        if css[k] == "{":
            d += 1
        elif css[k] == "}":
            d -= 1
            if d == 0:
                break
        k += 1
    return css[j + 1:k]


def token_lines(block, want_dense):
    out = []
    for line in block.splitlines():
        s = line.strip()
        if not s:
            continue
        m = re.match(r"(--ggc-[\w-]+)\s*:\s*([^;]+);\s*(?:/\*\s*(.*?)\s*\*/)?", s)
        if m:
            name, val, cmt = m.group(1), m.group(2).strip(), (m.group(3) or "")
            out.append(f"{name} = {val}" if want_dense else f"{name:<28} {val:<34} {cmt}".rstrip())
        elif s.startswith("/*") and not want_dense:
            out.append("")
            out.append(re.sub(r"^/\*\s*-*\s*|\s*-*\s*\*/$", "", s))
    return "\n".join(out)


def cmd_tokens(want_dense):
    css = read("design/ggc-tokens.css")
    print("[design/ggc-tokens.css]  :root  — 값의 유일한 원천. 여기서 읽은 값을 다른 파일에 옮겨 적지 않는다(이름만 쓴다).")
    print(token_lines(root_block(css, ":root"), want_dense))


def cmd_profile(want_dense):
    css = read("design/ggc-tokens.css")
    blk = root_block(css, '[data-ggc-profile="public"]')
    print('[design/ggc-tokens.css]  [data-ggc-profile="public"]  — 대민 프로필이 덮어쓰는 토큰 (치수만 · 색·포커스·서체는 못 바꾼다, D6)')
    print(token_lines(blk, want_dense))
    print("\n판정과 차이: docs/guides/profiles.md · 켜는 법: <html data-ggc-profile=\"public\">")


# ------------------------------------------------------------------ 인벤토리
def load_tsv(path, ncols):
    rows = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue
            c = line.rstrip("\n").split("\t")
            while len(c) < ncols:
                c.append("")
            rows.append(c)
    return rows


def inventory():
    # id 이름 Tier1 Tier2 근거 프로필 우선순위 상태 단계
    return load_tsv(INVENTORY, 9)


def component_record(row, recs, K):
    """인벤토리 행 → 그 Tier1 첫 클래스를 지배하는 current 기록."""
    classes = re.findall(r"\.ggc-[\w-]+", row[2])
    for cls in classes:
        hits = [r for r, g in K.records_for("design/ggc-components.css", {cls}, recs) if r.kind in ("component", "guide")]
        if hits:
            return hits[0]
    return None


def cmd_component(args):
    K = knowledge()
    recs = K.load_records()
    rows = inventory()
    if "--list" in args or not [a for a in args if not a.startswith("--")]:
        prof = _opt(args, "--profile")
        tier = _opt(args, "--tier")
        print(f"{'id':<16} {'이름':<34} {'프로필':<7} {'상태':<4} {'Tier 1':<40} {'Tier 2':<28} 문서")
        for r in rows:
            if prof and r[5] not in (prof, "both"):
                continue
            if tier == "1" and not r[2].strip("—- "):
                continue
            if tier == "2" and r[3].strip("—- ()") in ("", "—"):
                continue
            rec = component_record(r, recs, K)
            doc = rec.path if rec else "(문서 없음 — 갤러리)"
            print(f"{r[0]:<16} {r[1][:34]:<34} {r[5]:<7} {r[7]:<4} {r[2][:40]:<40} {r[3][:28]:<28} {doc}")
        print(f"\n{len(rows)}항목 · 정본: design/components.tsv · 자세히: component <id> [--dense] [--markup]")
        return 0
    cid = [a for a in args if not a.startswith("--")][0]
    row = next((r for r in rows if r[0] == cid), None)
    if row is None:
        # 클래스나 문서 이름으로도 찾는다
        row = next((r for r in rows if ("." + cid) in r[2].split() or cid in r[1]), None)
    if row is None:
        rec = next((r for r in recs if r.path == f"docs/components/{cid}.md"), None)
        if rec is None:
            print(f"모르는 컴포넌트: {cid}  — component --list 로 id 를 본다")
            return 2
        show(rec.path, "--dense" in args)
        return 0
    rec = component_record(row, recs, K)
    print(f"id {row[0]} · {row[1]} · 프로필 {row[5]} · 우선순위 {row[6]} · 상태 {row[7]}")
    print(f"Tier 1  {row[2]}")
    print(f"Tier 2  {row[3]}")
    print(f"근거    {row[4]}")
    if rec is None:
        print("문서    없음 — 마크업은 갤러리 design/examples/ 의 「마크업」을 펼쳐 복사한다")
        return 0
    print(f"문서    {rec.path}")
    if "--markup" in args:
        md = read(rec.path)
        m = re.search(r"```html\n(.*?)```", md, re.S)
        print("\n" + (m.group(1).rstrip() if m else "(문서에 html 블록이 없다 — 갤러리 DOM 에서 복사한다)"))
        return 0
    print()
    show(rec.path, "--dense" in args)
    return 0


# ------------------------------------------------------------------ 템플릿
def cmd_template(args):
    rows = load_tsv(TEMPLATES, 7)   # id 이름 프로필 패턴 갤러리 처방문서 절
    ids = [a for a in args if not a.startswith("--")]
    if "--list" in args or not ids:
        print(f"{'id':<14} {'프로필':<7} {'패턴':<13} {'이름':<36} 갤러리")
        for r in rows:
            print(f"{r[0]:<14} {r[2]:<7} {r[3]:<13} {r[1][:36]:<36} {r[4]}")
        print("\n자세히: template <id> (처방 절) · template <id> --markup (그 쪽의 <main>) · 정본: design/templates.tsv")
        return 0
    row = next((r for r in rows if r[0] == ids[0]), None)
    if row is None:
        print(f"모르는 틀: {ids[0]}  — template --list")
        return 2
    print(f"{row[0]} · {row[1]} · 프로필 {row[2]} · 패턴 {row[3]}")
    print(f"갤러리  {row[4]}  (브라우저로 연다 — 빌드 없음)")
    print(f"처방    {row[5]}" + (f"  § {row[6]}" if row[6] else ""))
    if "--markup" in args:
        html = read(row[4])
        m = re.search(r"<main\b.*?</main>", html, re.S)
        print("\n" + (m.group(0) if m else html))
        return 0
    print()
    show(row[5], "--dense" in args, row[6] or None)
    print("\n덜어내기 판정은 늘 함께: docs/guides/less.md (군더더기 열 가지)")
    return 0


# ------------------------------------------------------------------ 아이콘
def cmd_icon(args):
    d = os.path.join(DESIGN, "icons", "lucide")
    names = sorted(f[:-4] for f in os.listdir(d) if f.endswith(".svg"))
    print(f"lucide 부분집합 {len(names)}종 — Tier 1: <svg class=\"ggc-icon\"><use href=\"ggc-icons.svg#<이름>\"/></svg> · Tier 2: lucide-react")
    print("이모지 · 유니코드 기호는 아이콘이 아니다(ADR 0009). 없는 아이콘은 design/icons/lucide/ 에 넣고 python design/build-icons.py")
    col = 6
    for i in range(0, len(names), col):
        print("  " + "".join(f"{n:<22}" for n in names[i:i + col]))
    return 0


# ------------------------------------------------------------------ specs
def _classes_in(text):
    return set(re.findall(r"\.ggc-[\w-]+", text))


def _print_hits(path, hits, note=""):
    print(f"▶ {path}" + (f"  {note}" if note else ""))
    if not hits:
        print("    (지배하는 current 기록 없음 — 새 영역이면 docs/records.tsv 에 기록을 더한다)")
    for r, g in hits:
        why = g if g.startswith("class:") else f"glob {g}"
        print(f"    {r.kind:<12} {r.path:<58} ← {why}")


def cmd_specs(args):
    K = knowledge()
    recs = K.load_records()
    if "--diff" in args:
        ref = _opt(args, "--diff") or "origin/main"
        r = subprocess.run(["git", "diff", "--name-only", ref], cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stderr.strip()); return 1
        files = [f for f in r.stdout.split() if f]
        if not files:
            print(f"{ref} 와 다른 파일이 없다"); return 0
        seen = {}
        for f in files:
            classes = set()
            if f.endswith((".css", ".html", ".tsx", ".jsx", ".js")):
                d = subprocess.run(["git", "diff", ref, "--", f], cwd=ROOT, capture_output=True, text=True).stdout
                changed = "\n".join(l[1:] for l in d.splitlines() if l[:1] in "+-" and not l.startswith(("+++", "---")))
                classes = _classes_in(changed)
            hits = K.records_for(f, classes, recs)
            _print_hits(f, hits, f"(바뀐 선택자 {len(classes)})" if classes else "")
            for rec, _ in hits:
                seen[rec.path] = rec
        print(f"\n읽을 기록 {len(seen)}: " + " · ".join(sorted(seen)))
        print("기록이 바뀌어야 하는 변경이면 같은 PR 에서 고친다 — docs/contributing/pull-requests.md")
        return 0
    paths = [a for a in args if not a.startswith("--") and a != "--for"]
    if not paths:
        print("specs --for <경로>…  또는  specs --diff <ref>"); return 2
    for p in paths:
        full = os.path.join(ROOT, p)
        classes, note = set(), ""
        if os.path.isfile(full) and p.endswith((".html", ".tsx", ".jsx")) and "/examples/" not in p + "/":
            classes = _classes_in(read(p))
        elif p.replace("\\", "/") in ("design/ggc-components.css", "design/ggc-public.css", "design/ggc-tokens.css"):
            note = "(정본 CSS 는 선택자 단위로 본다 — specs --diff <ref> 가 바뀐 선택자의 컴포넌트 기록을 찾는다)"
        _print_hits(p, K.records_for(p, classes, recs), note)
    return 0


# ------------------------------------------------------------------ 위임
def run(cmd):
    print("$ " + " ".join(cmd))
    return subprocess.call(cmd, cwd=ROOT)


def cmd_check(args):
    paths = [a for a in args if not a.startswith("--")]
    if not paths:
        return run(["bash", "tools/check-all.sh"])
    extra = [a for a in args if a.startswith("--")]
    return run([PY, "design/check_design.py", "--gate", paths[0]] + extra)


def cmd_upgrade(args):
    paths = [a for a in args if not a.startswith("--")]
    if not paths:
        print("upgrade <서비스경로> [--apply]"); return 2
    return run([PY, "tools/sync-canon.py"] + args)


def cmd_docs(args):
    topic = next((a for a in args if not a.startswith("--")), "index")
    d = "--dense" in args
    topics = {
        "principles": ("AGENTS.md", "원칙"),
        "rules": ("AGENTS.md", "철칙"),
        "architecture": ("docs/architecture/system.md", None),
        "contract": ("docs/contract.md", None),
        "less": ("docs/guides/less.md", None),
        "states": ("docs/guides/states.md", None),
        "a11y": ("docs/guides/accessibility.md", None),
        "icons": ("docs/guides/icons.md", None),
        "shell": ("docs/guides/layout-shell.md", None),
        "public": ("docs/guides/public-shell.md", None),
        "typography": ("docs/guides/typography.md", None),
        "families": ("docs/families/README.md", None),
        "lifecycle": ("docs/contributing/component-lifecycle.md", None),
        "pr": ("docs/contributing/pull-requests.md", None),
        "records": None,
    }
    if topic == "tokens":
        cmd_tokens(d); return 0
    if topic == "profile":
        cmd_profile(d); return 0
    if topic == "records":
        K = knowledge()
        recs = K.load_records()
        kind = _opt(args, "--kind")
        print(f"{'authority':<9} {'kind':<13} path")
        for r in recs:
            if kind and r.kind != kind:
                continue
            print(f"{r.authority:<9} {r.kind:<13} {r.path}   — {r.title}")
        return 0
    if topic == "index":
        print(read("AGENTS.md") if not d else dense(read("AGENTS.md")))
        print("\n주제: " + " · ".join(["tokens", "profile"] + sorted(topics)))
        return 0
    if topic not in topics:
        print(f"모르는 주제: {topic}  — docs 만 치면 지도가 나온다"); return 2
    path, section = topics[topic]
    show(path, d, section)
    return 0


def _opt(args, flag):
    if flag in args:
        i = args.index(flag)
        if i + 1 < len(args) and not args[i + 1].startswith("--"):
            return args[i + 1]
    return None


def main(argv):
    if not argv or argv[0] in ("help", "-h", "--help"):
        print(__doc__.strip()); return 0
    cmd, args = argv[0], argv[1:]
    table = {
        "docs": cmd_docs, "component": cmd_component, "components": cmd_component,
        "template": cmd_template, "templates": cmd_template, "icon": cmd_icon, "icons": cmd_icon,
        "specs": cmd_specs, "check": cmd_check, "upgrade": cmd_upgrade,
        "tokens": lambda a: (cmd_tokens("--dense" in a), 0)[1],
        "knowledge": lambda a: run([PY, "tools/check-knowledge.py"] + [x for x in a if x != "--check"]),
        "vibe": lambda a: run([PY, "tools/vibe-test/grade.py"] + [x for x in a if x != "--grade"]),
    }
    if cmd not in table:
        print(f"모르는 명령: {cmd}\n"); print(__doc__.strip()); return 2
    return table[cmd](args) or 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
