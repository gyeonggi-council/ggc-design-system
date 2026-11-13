#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
grade.py — 에이전트가 만든 화면을 정본 규칙으로 채점한다 (vibe test, ADR 0015)

  python tools/vibe-test/grade.py <출력폴더>            # <출력폴더>/<과제id>/ 마다 채점
  python tools/vibe-test/grade.py <출력폴더> --json      # 기계용
  python tools/vibe-test/grade.py --self-check           # 갤러리 쪽으로 채점기 자체를 검증

과제와 기대는 prompts.tsv. 판정은 같은 검사기(design/check_design.py --gate)에 규칙 몇 개를 더한 것이다 —
새 규칙을 여기에만 두지 않는다: 규칙은 AGENTS.md · 스킬 · 패밀리 기록에 먼저 있어야 하고, 채점은 그것을 되묻는다.
"""
import json
import os
import re
import subprocess
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
PROMPTS = os.path.join(HERE, "prompts.tsv")
CHECK = os.path.join(ROOT, "design", "check_design.py")
CANON = ("ggc-tokens.css", "ggc-components.css")
# 이모지 · 그림 기호. ← → ＋ 같은 방향 · 연산 기호는 단추 라벨 규칙이 허용하므로 범위에 넣지 않는다.
# ✓(U+2713) 는 갤러리가 체크 표시 글자로 쓰므로 제외, ⚠(U+26A0) 은 설명 문장에서만 허용 — 아이콘 자리(단독 span)에 있으면 잡는다.
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-✒✔-➿⬀-⯿️]")


def load_prompts():
    out = []
    with open(PROMPTS, encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue
            c = line.rstrip("\n").split("\t")
            while len(c) < 4:
                c.append("")
            out.append({"id": c[0], "profile": c[1], "task": c[2], "expect": [e for e in c[3].split(";") if e]})
    return out


def html_files(d):
    return sorted(os.path.join(dp, f) for dp, dn, fn in os.walk(d) for f in fn if f.endswith(".html"))


def strip_code(html):
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    html = re.sub(r"<(script|style|pre|code)\b.*?</\1>", "", html, flags=re.S | re.I)
    return html


def judge(rule, d, htmls):
    """(통과, 메시지)"""
    body = "\n".join(strip_code(h) for h in htmls)
    if rule == "gate":
        r = subprocess.run([sys.executable, CHECK, "--gate", d, "--aa=observe"], capture_output=True, text=True, encoding="utf-8")
        last = [l for l in r.stdout.splitlines() if "G-DESIGN" in l]
        return r.returncode == 0, (last[-1].strip() if last else r.stdout.strip()[-200:])
    if rule == "copies":
        have = [c for c in CANON if any(f == c for dp, dn, fn in os.walk(d) for f in fn)]
        return len(have) == len(CANON), "사본: " + (", ".join(have) or "없음")
    if rule in ("h1=1", "h1"):
        # 계약 §2: h1 은 본문(<main>) 안, 헤더에는 브레드크럼만. h1 은 "하나 이상, 전부 main 안, header 안 0".
        n = len(re.findall(r"<h1\b", body, re.I))
        in_main = sum(len(re.findall(r"<h1\b", m, re.I)) for m in re.findall(r"<main\b.*?</main>", body, re.S | re.I))
        in_header = sum(len(re.findall(r"<h1\b", m, re.I)) for m in re.findall(r"<header\b.*?</header>", body, re.S | re.I))
        ok = n >= 1 and in_main == n and in_header == 0 and (n == 1 or rule == "h1")
        return ok, f"h1 {n}개 · main 안 {in_main} · header 안 {in_header}"
    if rule.startswith("any:"):
        names = [c.lstrip(".") for c in rule[4:].split("|")]
        hit = [c for c in names if re.search(r'class="[^"]*\b' + re.escape(c) + r'\b', body)]
        return bool(hit), "있음: " + (", ".join("." + c for c in hit) or "없음 (" + " | ".join("." + c for c in names) + " 중 하나)")
    if rule.startswith("has:"):
        cls = rule[4:].lstrip(".")
        ok = re.search(r'class="[^"]*\b' + re.escape(cls) + r'\b', body) is not None
        return ok, f".{cls} {'있음' if ok else '없음'}"
    if rule.startswith("no:"):
        cls = rule[3:].lstrip(".")
        ok = re.search(r'class="[^"]*\b' + re.escape(cls) + r'\b', body) is None
        return ok, f".{cls} {'없음' if ok else '있음(쓰면 안 된다)'}"
    if rule.startswith("profile:"):
        want = rule[8:]
        has_attr = re.search(r'<html\b[^>]*data-ggc-profile="public"', body, re.I) is not None
        ok = has_attr if want == "public" else not has_attr
        return ok, f'data-ggc-profile="public" {"있음" if has_attr else "없음"}'
    if rule == "no-emoji":
        text = re.sub(r"<[^>]+>", " ", body)
        hits = sorted(set(EMOJI.findall(text)))
        return not hits, "이모지 " + (" ".join(f"U+{ord(c):04X}" for c in hits) if hits else "0")
    if rule == "no-desc":
        # 페이지 머리 블록(시작 태그부터 첫 </h1> 뒤 400자) 안의 .desc 만 본다 — 문서 전체를 훑으면 다른 설명 줄에 걸린다
        m = re.search(r'class="[^"]*\bggc-page-head\b[^"]*"[^>]*>(.*?</h1>.{0,400})', body, re.S)
        ok = not (m and re.search(r'class="[^"]*\bdesc\b', m.group(1)))
        return ok, "설명 줄 " + ("없음" if ok else "있음 — 설명 줄은 기본 없음(ADR 0012) · 메타 한 줄이면 사유를 적는다")
    return False, f"모르는 규칙 {rule}"


def grade(outdir, as_json=False):
    prompts = load_prompts()
    results, total, passed = [], 0, 0
    for p in prompts:
        d = os.path.join(outdir, p["id"])
        row = {"id": p["id"], "found": os.path.isdir(d), "checks": []}
        if row["found"]:
            htmls = [open(f, encoding="utf-8", errors="replace").read() for f in html_files(d)]
            for rule in p["expect"]:
                ok, msg = judge(rule, d, htmls)
                row["checks"].append({"rule": rule, "ok": ok, "msg": msg})
                total += 1
                passed += ok
        results.append(row)
    if as_json:
        print(json.dumps({"total": total, "passed": passed, "results": results}, ensure_ascii=False, indent=1))
        return 0 if passed == total and total else 1
    for row in results:
        if not row["found"]:
            print(f"━━━ {row['id']}   (출력 없음 — {outdir}/{row['id']}/ 가 없다)")
            continue
        n_ok = sum(c["ok"] for c in row["checks"])
        print(f"━━━ {row['id']}   {n_ok}/{len(row['checks'])}")
        for c in row["checks"]:
            print(f"    {'✔' if c['ok'] else '✘'} {c['rule']:<24} {c['msg']}")
    print(f"\nvibe: {passed}/{total} 통과" + ("" if total else " — 채점할 출력이 없다 (run.sh 로 먼저 만든다)"))
    return 0 if passed == total and total else 1


def self_check():
    """갤러리 쪽을 과제 출력처럼 놓고 채점기가 기대대로 판정하는지 본다 (갤러리는 정본의 스모크 테스트다)."""
    import shutil
    import tempfile
    tmp = tempfile.mkdtemp(prefix="ggc-vibe-")
    ex = os.path.join(ROOT, "design", "examples")
    cases = {"explore-bills": ("explore.html", "work"), "monitor-today": ("dashboard.html", "work"),
             "configure-draft": ("wizard.html", "work"), "login-qr": ("login.html", "work"),
             "public-bills": ("public/list.html", "public"), "solo-sign": ("public/solo.html", "public"),
             "job-convert": ("workbench.html", "work")}
    for cid, (page, prof) in cases.items():
        d = os.path.join(tmp, cid)
        os.makedirs(d)
        html = open(os.path.join(ex, page), encoding="utf-8").read()
        # 갤러리는 정본을 상대경로로 링크한다 — 과제 출력처럼 사본을 옆에 두고 경로를 바꾼다
        html = re.sub(r'href="(\.\./)+(ggc-[\w-]+\.css)"', r'href="\2"', html)
        html = re.sub(r'src="(\.\./)+(ggc-behaviors\.js)"', r'src="\2"', html)
        html = re.sub(r'href="(\.\./)+fonts/ggc-fonts\.css"', 'href="ggc-fonts.css"', html)
        html = re.sub(r'href="(\.\./)+brand/dist/', 'href="', html)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html)
        for c in ("ggc-tokens.css", "ggc-components.css", "ggc-public.css", "ggc-behaviors.js", "ggc-fonts.css", "ggc-icons.svg"):
            shutil.copy(os.path.join(ROOT, "design", c), d)
        shutil.copy(os.path.join(ROOT, "design", "fonts", "PretendardGOVVariable.subset.woff2"), d)
        shutil.copy(os.path.join(ROOT, "design", "brand", "dist", "favicon-32.png"), d)
    print(f"self-check: 갤러리 7쪽을 {tmp} 에 과제 출력 꼴로 놓고 채점한다\n")
    # 갤러리가 과제를 전부 만족하지는 않는다 — 알려진 차이만 허용한다. 여기 늘어나면 갤러리를 고칠 일이다.
    KNOWN = {("explore-bills", "has:.ggc-empty")}   # explore.html 은 결과 없음 상태를 보여 주지 않는다 (components-overlay 가 보여 준다)
    import io, contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        grade(tmp, as_json=True)
    data = json.loads(buf.getvalue())
    shutil.rmtree(tmp, ignore_errors=True)
    bad = [(r["id"], c["rule"], c["msg"]) for r in data["results"] for c in r["checks"]
           if not c["ok"] and (r["id"], c["rule"]) not in KNOWN]
    for cid, rule, msg in bad:
        print(f"    ✘ {cid:<16} {rule:<24} {msg}")
    print(f"self-check: {data['passed']}/{data['total']} 통과 · 허용된 차이 {len(KNOWN)} · 예상 밖 실패 {len(bad)}")
    return 1 if bad else 0


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__.strip()); return 0
    if argv[0] == "--self-check":
        return self_check()
    return grade(argv[0], "--json" in argv)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
