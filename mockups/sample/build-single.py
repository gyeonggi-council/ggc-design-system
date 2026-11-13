# -*- coding: utf-8 -*-
"""build-single.py — 샘플 목업 아홉 쪽을 **파일 하나짜리 HTML** 로 합친다(휴대폰 내려받기 · 메신저 전달용).

이 폴더의 쪽은 정본 사본을 상대경로로 링크해서 파일 열몇 개가 함께 있어야 열린다.
휴대폰은 폴더째 내려받기 어렵다 — 그래서 CSS · 폰트 · 스크립트 · 이미지를 한 파일에 넣는다.
외부 요청 0 이라 오프라인 · 망분리에서도 그대로 열린다.

합본은 사본의 사본이다. 커밋하지 않고, 이 폴더를 고치면 다시 만든다.

    python mockups/sample/build-single.py <출력 폴더>
"""
import base64
import io
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = [(n + ".html", "ggc-sample-%s.html" % n) for n in ("work", "work-detail", "work-form", "public", "public-detail", "public-form",
                                                       "caption-dashboard", "caption-live", "caption-focus")]
# 쪽 사이 링크도 합본 이름으로 바꾼다 — 같은 폴더에 함께 받으면 서로 이어진다
RENAME = dict(PAGES)
MIME = {".png": "image/png", ".woff2": "font/woff2"}


def text(path):
    with io.open(path, encoding="utf-8") as fh:
        return fh.read()


def data_uri(path):
    with open(path, "rb") as fh:
        return "data:%s;base64,%s" % (MIME[os.path.splitext(path)[1]], base64.b64encode(fh.read()).decode("ascii"))


def inline_css(href):
    path = os.path.join(HERE, href)
    base = os.path.dirname(path)
    # 폰트 url() 만 상대경로다 — 그 자리를 data URI 로 바꾼다. 주석 속 빈 url() 은 건드리지 않는다.
    css = re.sub(r'url\("\./([^"]+)"\)', lambda m: 'url("%s")' % data_uri(os.path.join(base, m.group(1))), text(path))
    return "<style>/* %s */\n%s\n</style>" % (href, css.replace("</style", "<\\/style"))


def build(src):
    html = text(os.path.join(HERE, src))
    html = re.sub(r'href="([a-z-]+\.html)"', lambda m: 'href="%s"' % RENAME.get(m.group(1), m.group(1)), html)
    # 이미지부터 바꾼다 — 정본 CSS · JS 주석에도 <img src="…"> 예시가 있어서, 넣은 뒤에 바꾸면 주석까지 건드린다.
    html = re.sub(r'<link rel="(icon|apple-touch-icon)" href="([^"]+)">',
                  lambda m: '<link rel="%s" href="%s">' % (m.group(1), data_uri(os.path.join(HERE, m.group(2)))), html)
    html = re.sub(r'<img src="([^"]+\.png)"', lambda m: '<img src="%s"' % data_uri(os.path.join(HERE, m.group(1))), html)
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: inline_css(m.group(1)), html)
    # 스크립트는 본문 끝에 있어 defer 없이 넣어도 DOM 이 다 읽힌 뒤에 돈다.
    # 정본 JS 주석에 "</script>" 가 적혀 있다 — 그대로 넣으면 인라인 스크립트가 거기서 닫힌다. "<\/" 는 JS 에서 같은 글자다.
    html = re.sub(r'<script src="([^"]+)" defer></script>',
                  lambda m: "<script>/* %s */\n%s\n</script>" % (m.group(1), text(os.path.join(HERE, m.group(1))).replace("</", "<\\/")), html)
    # 넣은 CSS · JS 의 주석에도 사용법(<script src="…">)이 적혀 있다 — 그 안은 빼고 태그만 본다.
    tags = re.sub(r"<(style|script)>.*?</\1>", "", html, flags=re.S)
    left = re.findall(r'(?:href|src)="(?!#|data:|https?:)([^"]+\.(?:css|js|png|woff2))"', tags)
    if left:
        sys.exit("합본에 남은 상대경로: %s" % ", ".join(left))
    return html


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for src, dst in PAGES:
        html = build(src)
        path = os.path.join(out, dst)
        with io.open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(html)
        print("생성  %s  %dKB" % (path, len(html.encode("utf-8")) // 1024))


if __name__ == "__main__":
    main()
