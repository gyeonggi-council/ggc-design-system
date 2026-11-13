#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-knowledge.py — 지식 기록 검사 (K1~K6)

이 저장소의 문서는 전부 「지식 기록」이고(docs/records.tsv 가 정본, ADR 0015), 기록마다 권위가 있다.
권위가 current 인 기록만 구현과 검토를 지배한다. 이 검사기는 레지스트리와 트리가 어긋나지 않게 한다.

  K1  등록       docs/ · skills/ · 루트 안내의 모든 .md 가 records.tsv 에 있고, 등록된 경로가 실재한다
  K2  값         kind · authority 가 허용값 안이다 (authority = current | draft | archived)
  K3  governs    경로 글롭은 파일 하나 이상에 맞고, class:.ggc-* 는 정본 CSS 에 실제로 있는 선택자다
  K4  draft      draft 기록은 docs/specs/ 안에만 산다 · archived 결정(ADR)은 첫머리에 「대체」를 적는다
  K5  템플릿     docs/templates/ 의 파일은 kind=template 이다 — 템플릿은 기록 사이에 섞이지 않는다
  K6  범위       인벤토리(components.tsv)의 「있음」 항목이 current 기록 하나의 governs(class:) 에 잡힌다 (WARN)

사용법:  python tools/check-knowledge.py          # 위반이 있으면 exit 1
         python tools/check-knowledge.py --quiet  # 요약 한 줄만
라이브러리로: load_records() · canon_classes() · records_for(path, changed_classes) 를 tools/ggc.py 가 쓴다.
"""
import fnmatch
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
RECORDS = os.path.join(ROOT, "docs", "records.tsv")
INVENTORY = os.path.join(ROOT, "design", "components.tsv")
CANON_CSS = ["design/ggc-tokens.css", "design/ggc-components.css", "design/ggc-public.css"]

KINDS = {"instructions", "index", "changelog", "generated", "guide", "contract", "architecture",
         "contributing", "family", "template", "audit", "component", "decision", "evidence",
         "migration", "quickstart", "skill", "reference", "spec"}
AUTHORITY = {"current", "draft", "archived"}
# K1 이 등록을 요구하는 범위 — 여기 밖의 .md(archive/ · registry 소스 옆 설명 등)는 기록이 아니다
RECORD_DIRS = ("docs/", "skills/")
RECORD_ROOT_FILES = {"AGENTS.md", "CLAUDE.md", "README.md", "CHANGELOG.md", "DESIGN.md",
                     "design/brand/SOURCE.md", "design/examples/README.md", "design/ppt/README.md",
                     "tools/vibe-test/README.md"}


class Record:
    __slots__ = ("path", "kind", "authority", "governs", "owner", "line")

    def __init__(self, path, kind, authority, governs, owner, line):
        self.path, self.kind, self.authority, self.line = path, kind, authority, line
        self.governs = [] if governs.strip() in ("", "-") else [g.strip() for g in governs.split(";") if g.strip()]
        self.owner = [] if owner.strip() in ("", "-") else [o.strip() for o in owner.split(";") if o.strip()]

    @property
    def title(self):
        full = os.path.join(ROOT, self.path)
        try:
            with open(full, encoding="utf-8") as f:
                for ln in f:
                    if ln.startswith("# "):
                        return ln[2:].strip()
        except OSError:
            pass
        return os.path.basename(self.path)


def load_records(path=RECORDS):
    out = []
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            if not line.strip() or line.startswith("#"):
                continue
            cols = line.rstrip("\n").split("\t")
            while len(cols) < 5:
                cols.append("-")
            out.append(Record(cols[0].strip(), cols[1].strip(), cols[2].strip(), cols[3], cols[4], i))
    return out


def canon_classes():
    """정본 CSS 셋에 실제로 있는 .ggc-* 선택자 집합 (주석 제외)."""
    classes = set()
    for rel in CANON_CSS:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            continue
        with open(p, encoding="utf-8") as f:
            css = re.sub(r"/\*.*?\*/", "", f.read(), flags=re.S)
        classes.update(re.findall(r"\.ggc-[\w-]+", css))
    return classes


def all_md_in_scope():
    found = set()
    for d in RECORD_DIRS:
        for dp, dn, fn in os.walk(os.path.join(ROOT, d)):
            dn[:] = [x for x in dn if x not in (".git", "node_modules", "__pycache__")]
            for x in fn:
                if x.endswith(".md"):
                    found.add(os.path.relpath(os.path.join(dp, x), ROOT).replace(os.sep, "/"))
    for rf in RECORD_ROOT_FILES:
        if os.path.exists(os.path.join(ROOT, rf)):
            found.add(rf)
    return found


def glob_hits(pattern):
    """경로 글롭 하나에 맞는 파일이 트리에 하나라도 있는가 (`**` 는 하위 전부)."""
    pat = pattern.rstrip("/")
    base = pat.split("*")[0].rstrip("/")
    start = os.path.join(ROOT, base) if base else ROOT
    if not os.path.exists(start):
        return False
    if os.path.isfile(start):
        return fnmatch.fnmatch(base, pat.replace("**", "*")) or pat == base
    for dp, dn, fn in os.walk(start):
        dn[:] = [x for x in dn if x not in (".git", "node_modules", "__pycache__")]
        for x in fn:
            rel = os.path.relpath(os.path.join(dp, x), ROOT).replace(os.sep, "/")
            if _match(rel, pat):
                return True
    return False


def _match(rel, pat):
    if pat == "**":
        return True
    if pat.endswith("/**"):
        return rel.startswith(pat[:-3] + "/")
    return fnmatch.fnmatch(rel, pat)


def records_for(path, changed_classes=(), records=None):
    """경로(와 그 변경에 들어 있는 .ggc-* 클래스)를 지배하는 current 기록."""
    records = records or load_records()
    rel = path.replace(os.sep, "/")
    if rel.startswith("./"):
        rel = rel[2:]
    hits = []
    for r in records:
        if r.authority != "current":
            continue
        for g in r.governs:
            if g.startswith("class:"):
                if g[6:] in changed_classes:
                    hits.append((r, g)); break
            elif g == "**":
                continue  # AGENTS.md — 전부를 지배하므로 목록을 어지럽히지 않는다
            elif _match(rel, g):
                hits.append((r, g)); break
    return hits


def inventory_live_classes():
    """components.tsv 의 상태=있음 행 → (id, 첫 Tier1 클래스)."""
    out = []
    with open(INVENTORY, encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue
            c = line.rstrip("\n").split("\t")
            if len(c) < 8 or c[7].strip() != "있음":
                continue
            m = re.search(r"\.ggc-[\w-]+", c[2])
            if m:
                out.append((c[0], m.group(0)))
    return out


def main(argv):
    quiet = "--quiet" in argv
    recs = load_records()
    fails, warns = [], []
    paths = {r.path for r in recs}

    # K1
    for r in recs:
        if not os.path.exists(os.path.join(ROOT, r.path)):
            fails.append(f"K1 records.tsv:{r.line}  등록된 파일이 없다: {r.path}")
    for p in sorted(all_md_in_scope() - paths):
        fails.append(f"K1 미등록 기록: {p}  — docs/records.tsv 에 행을 추가한다 (kind · authority · governs)")
    dup = {p for p in paths if sum(1 for r in recs if r.path == p) > 1}
    for p in sorted(dup):
        fails.append(f"K1 중복 등록: {p}")

    # K2
    for r in recs:
        if r.kind not in KINDS:
            fails.append(f"K2 records.tsv:{r.line}  kind '{r.kind}' 는 허용값이 아니다 ({r.path})")
        if r.authority not in AUTHORITY:
            fails.append(f"K2 records.tsv:{r.line}  authority '{r.authority}' 는 current|draft|archived 여야 한다 ({r.path})")

    # K3
    classes = canon_classes()
    for r in recs:
        for g in r.governs:
            if g.startswith("class:"):
                if g[6:] not in classes:
                    fails.append(f"K3 records.tsv:{r.line}  정본 CSS 에 없는 선택자 {g[6:]} ({r.path})")
            elif not glob_hits(g):
                fails.append(f"K3 records.tsv:{r.line}  governs 글롭에 맞는 파일이 없다: {g} ({r.path})")

    # K4
    for r in recs:
        if r.authority == "draft" and not r.path.startswith("docs/specs/"):
            fails.append(f"K4 draft 기록은 docs/specs/ 안에만 산다: {r.path}")
        if r.authority == "archived" and r.kind == "decision":
            head = ""
            try:
                with open(os.path.join(ROOT, r.path), encoding="utf-8") as f:
                    head = "".join(f.readline() for _ in range(10))
            except OSError:
                pass
            if "대체" not in head and "archived" not in head.lower():
                fails.append(f"K4 대체된 결정은 첫머리에 「대체됨」을 적는다: {r.path}")
        if r.authority == "current" and r.kind == "spec":
            warns.append(f"K4 spec 이 current 다 — 구현이 끝났으면 지배 기록(가이드·컴포넌트)으로 옮기고 spec 은 archived 로: {r.path}")

    # K5
    for r in recs:
        if r.path.startswith("docs/templates/") and r.kind != "template":
            fails.append(f"K5 docs/templates/ 의 파일은 kind=template 이다: {r.path}")
        if r.kind == "template" and not r.path.startswith("docs/templates/"):
            fails.append(f"K5 템플릿은 docs/templates/ 에만 둔다: {r.path}")

    # K6
    covered = set()
    for r in recs:
        if r.authority == "current":
            covered.update(g[6:] for g in r.governs if g.startswith("class:"))
    for cid, cls in inventory_live_classes():
        if cls not in covered:
            warns.append(f"K6 인벤토리 '{cid}' ({cls}) 를 지배하는 컴포넌트 기록이 없다 — docs/components/ 에 쓰거나 기존 기록의 governs 에 더한다")

    if not quiet:
        for m in fails:
            print("FAIL ", m)
        for m in warns:
            print("WARN ", m)
    n_cur = sum(1 for r in recs if r.authority == "current")
    print(f"check-knowledge: 기록 {len(recs)} (current {n_cur}) · FAIL {len(fails)} · WARN {len(warns)}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
