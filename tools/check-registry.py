#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-registry.py — Tier 2(shadcn 레지스트리) 정본 검사

registry.json(원본) ↔ public/r/*.json(빌드 산출물) ↔ registry/ggc/**(소스) 를 대조한다.
빌드는 `npx shadcn build` 가 하고(node 필요), 검사는 여기서 한다(stdlib 만).

  R1 산출물 존재      registry.json 의 항목마다 public/r/<name>.json 이 있다
  R2 내용 일치        산출물 files[].content 가 소스 파일과 같다 (LF 정규화) — 낡은 산출물 감지
  R3 값 규율          산출물 어디에도 정본 밖 색 리터럴이 없다 (허용집합은 정본 CSS 에서 파생, D2 와 같은 규칙)
  R4 테마 매핑        ggc-theme 의 cssVars 값이 var(--ggc-…) 또는 흰색이고, dark 키가 없다
  R5 인벤토리         components.tsv 의 '있음' 행이 가리키는 Tier2 항목이 registry.json 에 있다 (없으면 WARN)

사용법:  python tools/check-registry.py [--check]     # 위반이 있으면 exit 1
"""
import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
DESIGN = os.path.join(ROOT, "design")
sys.path.insert(0, DESIGN)
import check_design as cd  # noqa: E402

REGISTRY = os.path.join(ROOT, "registry.json")
OUT = os.path.join(ROOT, "public", "r")
INVENTORY = os.path.join(DESIGN, "components.tsv")


def lf(path):
    return cd.read(path).replace("\r\n", "\n")


def main():
    fails = warns = 0
    if not os.path.exists(REGISTRY):
        print("R0 FAIL  registry.json 이 없다")
        return 1
    reg = json.loads(cd.read(REGISTRY))
    items = reg.get("items", [])
    names = [i["name"] for i in items]
    if len(names) != len(set(names)):
        print("R0 FAIL  registry.json 에 중복 이름이 있다")
        fails += 1

    allow, rgba_bases = cd.build_allowset()

    for it in items:
        name = it["name"]
        outp = os.path.join(OUT, name + ".json")
        if not os.path.exists(outp):
            print(f"R1 FAIL  {name:<16} public/r/{name}.json 이 없다 — npx shadcn build")
            fails += 1
            continue
        built = json.loads(lf(outp))
        # R2 — 소스와 산출물 내용 대조
        for f in it.get("files", []):
            src = os.path.join(ROOT, f["path"])
            bf = next((b for b in built.get("files", []) if b.get("path") == f["path"]), None)
            if bf is None:
                print(f"R2 FAIL  {name:<16} 산출물에 {f['path']} 가 없다")
                fails += 1
            elif (bf.get("content") or "").replace("\r\n", "\n") != lf(src):
                print(f"R2 FAIL  {name:<16} 산출물이 소스보다 낡았다: {f['path']} — npx shadcn build")
                fails += 1
        # R3 — 색 리터럴. 파일 내용은 주석을 벗겨 본다(정본 토큰 파일 머리말이 폐기값을 **설명**한다 —
        # check_design 과 같은 이유). cssVars·css 등 나머지는 그대로 본다.
        meta = {k: v for k, v in built.items() if k != "files"}
        blob = json.dumps(meta, ensure_ascii=False) + "\n" + "\n".join(
            "\n".join(cd.strip_comments(cd.strip_doc_text(bf.get("content") or "")))
            for bf in built.get("files", []))
        for h in cd.HEX_RE.findall(blob):
            n = cd.norm_hex(h)
            if n in cd.RETIRED:
                print(f"R3 FAIL  {name:<16} 폐기값 {h}")
                fails += 1
            elif n not in allow:
                print(f"R3 FAIL  {name:<16} 정본에 없는 색 {h}")
                fails += 1
        for m in cd.RGBA_RE.finditer(blob):
            base = tuple(int(float(x)) for x in m.groups())
            if base not in rgba_bases and base not in {(0, 0, 0), (255, 255, 255)}:
                print(f"R3 WARN  {name:<16} 정본 파생이 아닌 rgb{base}")
                warns += 1
        # R4 — 테마 매핑
        if it.get("type") == "registry:theme":
            cv = built.get("cssVars", {})
            if "dark" in cv:
                print(f"R4 FAIL  {name:<16} cssVars.dark 가 있다 — 다크 팔레트 금지(계약 §3-2)")
                fails += 1
            for scope in ("theme", "light"):
                for k, v in cv.get(scope, {}).items():
                    universal_white = v.startswith("#") and cd.norm_hex(v) in cd.UNIVERSAL
                    if not (v.startswith("var(--ggc-") or universal_white):
                        print(f"R4 FAIL  {name:<16} {scope}.{k} = {v} — var(--ggc-*) 가 아니다")
                        fails += 1

    # R5 — 인벤토리 ↔ 레지스트리
    if os.path.exists(INVENTORY):
        missing = []
        for line in cd.read(INVENTORY).splitlines():
            if not line.strip() or line.startswith("#"):
                continue
            p = line.split("\t")
            if len(p) < 9 or p[7] != "있음":
                continue
            tier2 = p[3].strip()
            first = re.split(r"[\s(]", tier2)[0] if tier2 else ""
            if not first or first in ("—", "-") or first.startswith("("):
                continue
            if first not in names:
                missing.append(f"{p[0]}→{first}")
        if missing:
            print("R5 WARN  인벤토리 '있음' 행의 Tier2 항목이 레지스트리에 없다: " + ", ".join(missing))
            warns += 1

    # 산출물 쪽 고아
    if os.path.isdir(OUT):
        extra = sorted(f[:-5] for f in os.listdir(OUT) if f.endswith(".json") and f[:-5] not in names and f != "registry.json")
        if extra:
            print("R1 WARN  registry.json 에 없는 산출물: " + ", ".join(extra))
            warns += 1

    print(f"check-registry: 항목 {len(items)} · FAIL {fails} · WARN {warns}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
