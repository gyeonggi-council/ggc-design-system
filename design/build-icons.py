#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build-icons.py — 아이콘 정본 스프라이트를 **생성**한다 (v3.0, ADR 0009)

원천은 design/icons/lucide/*.svg — lucide-static(ISC) 에서 그대로 복사한 원본 파일이다(손으로 고치지 않는다).
이 스크립트가 그것을 <symbol id="i-<이름>"> 로 묶어 두 곳에 쓴다:

  ① design/ggc-icons.svg                 서비스가 정적루트에 복사해 <use href="ggc-icons.svg#i-check"> 로 참조하는 정본(D1 대조)
  ② design/examples/**/*.html            갤러리 각 쪽 <body> 첫 줄의 인라인 스프라이트 — 마커 사이를 갈아 끼운다
                                          (file:// 로 열면 브라우저가 외부 SVG 의 <use> 를 막는다. 갤러리는 더블클릭으로 열린다)

왜 이모지가 아닌가 — 📋 ◷ ✕ 는 글꼴 렌더러마다 모양이 다르고 Pretendard 옆에서 이질적이다. 제품 인상이 가장 크게
갈리는 지점이라 lucide 하나로 고정한다. 새 아이콘이 필요하면 lucide-static 에서 svg 를 design/icons/lucide/ 에
복사하고 이 스크립트를 돌린다 — 다른 아이콘 세트를 섞지 않는다.

    python design/build-icons.py           생성
    python design/build-icons.py --check   낡았는지만 (다르면 exit 1)
"""
import hashlib
import io
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(HERE, "icons", "lucide")
OUT = os.path.join(HERE, "ggc-icons.svg")
EXAMPLES = os.path.join(HERE, "examples")
BEGIN = "<!-- ggc-icons:begin — 생성물. design/build-icons.py 가 갈아 끼운다. 손으로 고치지 말 것 -->"
END = "<!-- ggc-icons:end -->"

INNER_RE = re.compile(r"<svg\b[^>]*>(.*?)</svg>", re.S)
TAG_WS_RE = re.compile(r">\s+<")


def read(p):
    with io.open(p, encoding="utf-8") as fh:
        return fh.read()


def write(p, s):
    with io.open(p, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(s)


def symbols():
    """원본 svg 의 자식 요소만 뽑아 <symbol> 로. 속성(stroke·fill·width)은 스프라이트 루트와 .ggc-icon 이 준다."""
    out = []
    for fn in sorted(os.listdir(SRC_DIR)):
        if not fn.endswith(".svg"):
            continue
        name = fn[:-4]
        m = INNER_RE.search(read(os.path.join(SRC_DIR, fn)))
        if not m:
            raise SystemExit("svg 파싱 실패: " + fn)
        inner = TAG_WS_RE.sub("><", m.group(1).strip())
        inner = re.sub(r"\s+", " ", inner).replace(" />", "/>")
        out.append((name, inner))
    if not out:
        raise SystemExit("design/icons/lucide/ 에 svg 가 없다")
    return out


def sprite_markup(syms, inline):
    """inline=True 는 갤러리용(화면을 차지하지 않게 클래스·aria-hidden), False 는 정본 파일."""
    head = ('<svg xmlns="http://www.w3.org/2000/svg" class="ggc-icon-sprite" aria-hidden="true" focusable="false">'
            if inline else
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">')
    body = "".join('<symbol id="i-%s" viewBox="0 0 24 24">%s</symbol>' % (n, s) for n, s in syms)
    return head + body + "</svg>"


def sha():
    h = hashlib.sha256()
    for fn in sorted(os.listdir(SRC_DIR)):
        if fn.endswith(".svg"):
            with open(os.path.join(SRC_DIR, fn), "rb") as fh:
                h.update(fn.encode() + b"\0" + fh.read() + b"\0")
    with open(os.path.abspath(__file__), "rb") as fh:
        h.update(fh.read())
    return h.hexdigest()


def canon_text(syms):
    return ("<!-- ggc-icons.svg — 경기도의회 아이콘 정본 v3.0 · lucide-static 부분집합(ISC, design/icons/lucide/LICENSE)\n"
            "     생성물이다: python design/build-icons.py · 원천 sha256 %s\n"
            "     사용: <svg class=\"ggc-icon\" aria-hidden=\"true\"><use href=\"ggc-icons.svg#i-check\"/></svg>  (같은 오리진에서 서빙)\n"
            "     망분리 정적 HTML · file:// 은 갤러리처럼 <body> 첫 줄에 인라인한다(외부 <use> 가 막힌다). -->\n"
            % sha()) + sprite_markup(syms, inline=False) + "\n"


def gallery_pages():
    for root, _dirs, files in os.walk(EXAMPLES):
        for fn in files:
            if fn.endswith(".html") and fn != "examples-standalone.html":   # 합본은 build-standalone.py 가 쪽에서 가져간다
                yield os.path.join(root, fn)


def inject(html, block):
    """마커가 있으면 사이를 교체, 없으면 <body …> 바로 뒤에 넣는다."""
    if BEGIN in html and END in html:
        a, b = html.index(BEGIN), html.index(END) + len(END)
        return html[:a] + block + html[b:]
    m = re.search(r"<body\b[^>]*>", html)
    if not m:
        return html
    return html[:m.end()] + "\n" + block + html[m.end():]


def build():
    syms = symbols()
    write(OUT, canon_text(syms))
    block = BEGIN + "\n" + sprite_markup(syms, inline=True) + "\n" + END
    n = 0
    for p in gallery_pages():
        html = read(p)
        new = inject(html, block)
        if new != html:
            write(p, new)
            n += 1
    print("생성  design/ggc-icons.svg  %d종 · 갤러리 %d쪽 갱신" % (len(syms), n))
    return 0


def check():
    if not os.path.exists(OUT):
        print("FAIL  design/ggc-icons.svg 가 없다 — python design/build-icons.py")
        return 1
    cur = read(OUT)
    if ("원천 sha256 " + sha()) not in cur:
        print("FAIL  design/ggc-icons.svg 가 원천(design/icons/lucide/)보다 낡았다 — python design/build-icons.py")
        return 1
    syms = symbols()
    block_body = sprite_markup(syms, inline=True)
    stale = [os.path.relpath(p, HERE) for p in gallery_pages() if block_body not in read(p)]
    if stale:
        print("FAIL  갤러리 인라인 스프라이트가 낡았다: " + ", ".join(stale) + " — python design/build-icons.py")
        return 1
    print("OK    design/ggc-icons.svg 와 갤러리 인라인 스프라이트가 원천과 일치한다 (%d종)." % len(syms))
    return 0


if __name__ == "__main__":
    sys.exit(check() if "--check" in sys.argv else build())
