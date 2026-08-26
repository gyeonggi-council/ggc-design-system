# -*- coding: utf-8 -*-
"""build-preview.py — 정본 토큰 CSS 에서 `preview-palette.svg` 를 **생성**한다.

왜 SVG 인가 — GitHub 웹에서는 HTML 이 렌더되지 않고 소스로만 보인다.
저장소에 들어온 사람이 아무것도 내려받지 않고 "이 디자인이 어떻게 생겼나" 를
보려면 README 안에서 렌더되는 이미지가 필요한데, 마크다운에서 렌더되는 것 중
우리가 **손으로 값을 적지 않고 만들 수 있는 것**이 SVG 다.

왜 생성물인가 — 팔레트 값을 SVG 에 적어 넣으면 그 순간 두 벌이 되고,
그것이 이 저장소가 통째로 막으려는 실패다(계약 문서가 선언한 success 값이
실물 CSS 와 두 달간 어긋나 있었다). 그래서 이 스크립트가 `ggc-tokens.css` 를
파싱해 매번 다시 만든다. **`preview-palette.svg` 를 직접 고치지 말 것.**

의존성 0 — 표준 라이브러리만 쓴다. 이 환경에는 Pillow 도 ImageMagick 도 없다.

    python design/examples/build-preview.py           생성
    python design/examples/build-preview.py --check   낡았는지만 확인 (다르면 exit 1)
"""
import io
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
TOKENS = os.path.join(HERE, "..", "ggc-tokens.css")
OUT = os.path.join(HERE, "preview-palette.svg")

# 무엇을 어떤 순서로 보일지만 여기서 정한다. **값은 정본에서 읽는다.**
ROWS = [
    ("브랜드", [
        ("primary", "주 색상"),
        ("primary-dark", "hover"),
        ("primary-deep", "유틸리티 바"),
        ("primary-light", "선택 배경"),
        ("primary-light-strong", "강조 배경"),
    ]),
    ("상태", [
        ("success", "승인·확정"),
        ("warning", "대기·주의"),
        ("danger", "반려·오류"),
        ("info", "정보·회기"),
    ]),
    ("중립 텍스트", [
        ("text-strong", "제목"),
        ("text", "본문"),
        ("text-muted", "보조"),
        ("text-subtle", "메타"),
        ("text-faint", "비텍스트"),
    ]),
    ("역할", [
        ("role-member", "의원"),
        ("role-staff", "사무처"),
        ("role-policy", "정책지원관"),
        ("role-other", "기타"),
    ]),
]

# 레이아웃
PAD = 24
LABEL_W = 96
CELL_W = 132
CELL_H = 58
GAP = 8
ROW_GAP = 20
HEAD_H = 62
FOOT_H = 34


def base_root_vars(css):
    """기본 :root 블록의 --ggc-* 만 돌려준다.

    @media (prefers-contrast: more) 안의 오버라이드는 기본값이 아니다.
    중첩 깊이를 세어 최상위 :root 만 고른다 — 검사기와 같은 판정이어야 한다."""
    out, i, n, depth = {}, 0, len(css), 0
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
            for m in re.finditer(r"--ggc-([\w-]+):\s*(#[0-9a-fA-F]{3,8})", css[j:k]):
                out.setdefault(m.group(1).lower(), m.group(2).lower())
            i = k + 1
            continue
        i += 1
    return out


def expand(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def luminance(rgb):
    a = []
    for v in rgb:
        v /= 255.0
        a.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def readable(rgb):
    """칩 위에 얹을 글자색 — 흰/먹 중 대비가 큰 쪽"""
    return "#ffffff" if contrast(rgb, (255, 255, 255)) >= contrast(rgb, (19, 23, 34)) else "#131722"


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def build():
    css = io.open(TOKENS, encoding="utf-8").read()
    tok = base_root_vars(css)
    missing = [n for _, cells in ROWS for n, _ in cells if n not in tok]
    if missing:
        print("FAIL  정본에 없는 토큰: " + ", ".join(missing))
        print("      ROWS 를 고치거나 토큰을 먼저 정본에 넣을 것.")
        return None

    cols = max(len(cells) for _, cells in ROWS)
    W = PAD * 2 + LABEL_W + cols * CELL_W + (cols - 1) * GAP
    H = HEAD_H + sum(CELL_H + ROW_GAP for _ in ROWS) - ROW_GAP + FOOT_H + PAD

    bg = tok.get("surface", "#ffffff")
    line = tok.get("border", "#e6ebf1")
    ink = tok.get("text-strong", "#131722")
    sub = tok.get("text-muted", "#4a5566")
    font = ("'Pretendard GOV',Pretendard,'Malgun Gothic','Noto Sans KR',"
            "system-ui,-apple-system,sans-serif")
    mono = "ui-monospace,Consolas,'D2Coding',Menlo,monospace"

    p = []
    p.append(
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" '
        'viewBox="0 0 %d %d" role="img" '
        'aria-label="경기도의회 공통 디자인 시스템 팔레트">' % (W, H, W, H))
    p.append('<rect width="%d" height="%d" fill="%s"/>' % (W, H, bg))

    # 머리말 — 값이 아니라 이름과 설명만 적는다
    p.append('<text x="%d" y="%d" font-family="%s" font-size="17" font-weight="700" '
             'fill="%s">경기도의회 공통 디자인 시스템</text>'
             % (PAD, PAD + 16, font, ink))
    p.append('<text x="%d" y="%d" font-family="%s" font-size="11.5" fill="%s">'
             'ggc-tokens.css · 이 그림은 정본에서 생성된다 — 직접 고치지 말 것</text>'
             % (PAD, PAD + 34, font, sub))
    p.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="1"/>'
             % (PAD, HEAD_H - 10, W - PAD, HEAD_H - 10, line))

    y = HEAD_H
    for title, cells in ROWS:
        p.append('<text x="%d" y="%d" font-family="%s" font-size="12" font-weight="700" '
                 'fill="%s">%s</text>'
                 % (PAD, y + CELL_H / 2 + 4, font, sub, esc(title)))
        x = PAD + LABEL_W
        for name, use in cells:
            hexv = tok[name]
            rgb = expand(hexv)
            fg = readable(rgb)
            p.append('<rect x="%d" y="%d" width="%d" height="%d" rx="8" fill="%s" '
                     'stroke="%s" stroke-width="1"/>'
                     % (x, y, CELL_W, CELL_H, hexv, line))
            p.append('<text x="%d" y="%d" font-family="%s" font-size="10.5" '
                     'font-weight="700" fill="%s">%s</text>'
                     % (x + 10, y + 20, mono, fg, esc(hexv.upper())))
            p.append('<text x="%d" y="%d" font-family="%s" font-size="10" fill="%s" '
                     'opacity="0.92">%s</text>'
                     % (x + 10, y + 36, font, fg, esc(use)))
            p.append('<text x="%d" y="%d" font-family="%s" font-size="9" fill="%s" '
                     'opacity="0.78">%s</text>'
                     % (x + 10, y + 49, mono, fg, esc(name)))
            x += CELL_W + GAP
        y += CELL_H + ROW_GAP

    # 꼬리말 — 대비 실측 한 줄. 숫자를 적는 게 아니라 계산해서 넣는다
    white = (255, 255, 255)
    worst_name, worst = None, 99.0
    for name in ("success", "warning", "danger", "info"):
        c = contrast(expand(tok[name]), expand(tok[name + "-tint"]))
        if c < worst:
            worst, worst_name = c, name
    p.append('<text x="%d" y="%d" font-family="%s" font-size="10.5" fill="%s">'
             'WCAG AA 4.5:1 · 상태색 4종은 자기 틴트 위에서 최소 %.2f:1 (--ggc-%s) · '
             '중립 램프는 흰 배경 위 최소 %.2f:1</text>'
             % (PAD, y + 10, font, sub, worst, worst_name,
                min(contrast(expand(tok[n]), white)
                    for n in ("text-strong", "text", "text-muted", "text-subtle"))))
    p.append("</svg>")
    return "\n".join(p) + "\n"


def main():
    svg = build()
    if svg is None:
        return 2
    check = "--check" in sys.argv
    cur = io.open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else None
    rel = os.path.relpath(OUT, os.path.join(HERE, "..", ".."))
    if cur == svg:
        print("OK    %s 가 정본과 일치한다." % rel)
        return 0
    if check:
        print("FAIL  %s 가 정본보다 낡았다." % rel)
        print("      python design/examples/build-preview.py 로 다시 생성할 것.")
        return 1
    io.open(OUT, "w", encoding="utf-8", newline="\n").write(svg)
    print("생성  %s  (%d bytes)" % (rel, len(svg.encode("utf-8"))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
