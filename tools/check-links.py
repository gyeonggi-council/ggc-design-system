#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check-links.py — 문서 무결성 검사

1. LINKS   — 마크다운 상대 링크·이미지가 실제 파일을 가리키는가
2. FORBID  — 절대경로(`D:\\`·`/d/<숫자>`)·원문 IP 패턴이 트리에 없는가
             (마스킹 형태 `27.96.x.x` 는 통과. 정규식 이스케이프 형태 `27\\.96\\.<숫자>` 도 잡는다
             — 2026-08-29 README 검증 명령 예시에서 실제로 그 형태로 새고 있었다)

사용법:  python tools/check-links.py        # 위반이 있으면 exit 1
"""
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))

SKIP_DIRS = {".git", "archive", "node_modules", ".next", "dist", "build",
             "__pycache__", ".playwright-mcp", "public"}
# public/ 은 레지스트리 빌드 산출물(JSON) 전용 — 원본은 registry/ 에서 검사된다.

MD_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
FORBID = [
    (re.compile(r"\b[A-Za-z]:\\[\w가-힣]"), "윈도우 절대경로"),
    (re.compile(r"/[a-z]/\d{4}"), "msys 절대경로(/d/2026… 형태)"),
    (re.compile(r"27\\?\.96\\?\.\d"), "원문 IP 패턴(이스케이프 형태 포함)"),
]
FORBID_EXT = {".md", ".py", ".sh", ".css", ".html", ".js", ".tsv",
              ".json", ".yml", ".yaml", ".tsx", ".jsx", ".ts"}
SELF = os.path.abspath(__file__)


def walk(root):
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


def main():
    bad = 0

    # --- 1. 마크다운 링크 ---------------------------------------------------
    for f in walk(ROOT):
        if not f.endswith(".md"):
            continue
        base = os.path.dirname(f)
        rel = os.path.relpath(f, ROOT)
        for i, line in enumerate(read(f).splitlines(), 1):
            for m in MD_LINK_RE.finditer(line):
                href = m.group(1).split("#")[0]
                if not href or href.startswith(("http:", "https:", "mailto:", "<")):
                    continue
                target = os.path.normpath(os.path.join(base, href))
                if not os.path.exists(target):
                    print(f"LINK  FAIL  {rel}:{i}  깨진 링크: {m.group(1)}")
                    bad += 1

    # --- 2. 금지 문자열 -----------------------------------------------------
    for f in walk(ROOT):
        if os.path.abspath(f) == SELF:
            continue
        if os.path.splitext(f)[1].lower() not in FORBID_EXT:
            continue
        rel = os.path.relpath(f, ROOT)
        for i, line in enumerate(read(f).splitlines(), 1):
            for pat, why in FORBID:
                if pat.search(line):
                    print(f"FORBID FAIL {rel}:{i}  {why}: {line.strip()[:80]}")
                    bad += 1

    if bad:
        print(f"\n총 {bad}건 — 위 항목을 고치기 전에는 커밋하지 않는다")
        return 1
    print("check-links: 깨진 링크 0 · 금지 문자열 0")
    return 0


if __name__ == "__main__":
    sys.exit(main())
