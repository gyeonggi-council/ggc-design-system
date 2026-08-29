# -*- coding: utf-8 -*-
"""build-standalone.py — 갤러리 9쪽을 **자기완결 단일 HTML** 로 합친다.

왜 필요한가 — `design/examples/` 는 정본을 상대경로로 링크하고 파일이 열두 개라,
"링크 하나로 열어 보게 해 달라" 는 요청에 답할 수 없다. 이 스크립트가 정본 CSS·JS·
브랜드 자산을 인라인하고 5쪽을 한 파일에 담아, 어디에 올려도 그대로 열리게 한다.
외부 요청이 0 이라 망분리 환경과 오프라인에서도 그대로 뜬다.

⚠ **이것은 사본이다.** 갤러리가 지키는 "사본을 두지 않는다" 와 정면으로 부딪친다.
   그래서 **손으로 만들지 않고 생성한다.** 정본이 바뀌면 다시 생성해야 하고,
   낡았는지는 `--check` 와 `check_design.py --canon` 이 본다.
   `examples-standalone.html` 을 직접 고치지 말 것.

의존성 0 — 표준 라이브러리만 쓴다.

    python design/examples/build-standalone.py           생성
    python design/examples/build-standalone.py --check   낡았는지만 (다르면 exit 1)
"""
import base64
import io
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = os.path.normpath(os.path.join(HERE, ".."))
OUT = os.path.join(HERE, "examples-standalone.html")

# 키 · 파일 · LNB 라벨 · GNB 서비스명 (각 쪽의 .svc 를 그대로 옮긴다)
PAGES = [
    ("index",      "index.html",      "개요",               "공통 디자인 시스템"),
    ("tokens",     "tokens.html",     "토큰 · 팔레트",       "공통 디자인 시스템"),
    ("components", "components.html", "컴포넌트 카탈로그",    "공통 디자인 시스템"),
    ("forms",      "components-forms.html",   "폼 컨트롤",            "공통 디자인 시스템"),
    ("nav",        "components-nav.html",     "내비게이션 · 탭",       "공통 디자인 시스템"),
    ("overlay",    "components-overlay.html", "오버레이 · 상태 · 본문", "공통 디자인 시스템"),
    ("dashboard",  "dashboard.html",  "대시보드 · Monitor",  "의정지원 플랫폼"),
    ("wizard",     "wizard.html",     "위저드 · Configure",  "조례 초안 작성"),
    ("login",      "login.html",      "QR 로그인 · Entry",   "공통 디자인 시스템"),
]

MAIN_RE = re.compile(r"<main\b([^>]*)>(.*)</main>", re.S)
CLASS_RE = re.compile(r'class="([^"]*)"')

# 원본 index.html 의 "이 페이지가 예제다" 문단은 **상대경로 링크**를 근거로 삼는다.
# 합본은 인라인이라 그 말이 더 이상 참이 아니다. 페이지가 거짓말하게 두지 않는다.
CLAIM_OLD = """        <p><b>지금 보고 있는 이 페이지가 예제다.</b> 별도 스타일시트를 갖지 않고
        <code>../ggc-tokens.css</code> 와 <code>../ggc-components.css</code> 를
        <b>상대경로로 직접</b> 링크한다."""
CLAIM_NEW = """        <p><b>지금 보고 있는 이 페이지가 예제다.</b> 이 화면은
        <code>ggc-tokens.css</code> 와 <code>ggc-components.css</code> 로만 그려진다."""

STANDALONE_NOTE = """
      <div class="ex-note ex-note--warn">
        <p><b>이 파일은 생성물이다.</b> 갤러리 9쪽과 정본 CSS·JS·브랜드 자산을
        한 파일로 합친 것이고, <code>design/examples/build-standalone.py</code> 가
        정본에서 다시 만든다. <b>직접 고치지 말 것</b> — 다음 생성에서 덮어써진다.</p>
        <p>저장소의 원본 갤러리는 정본을 <b>상대경로로 직접 링크</b>해 사본을 두지 않는다.
        이 합본만 예외이며, 링크 하나로 열어 보기 위한 것이다.
        낡았는지는 <code>--check</code> 와 <code>check_design.py --canon</code> 이 본다.</p>
      </div>
"""


def read(p):
    return io.open(p, encoding="utf-8").read()


def data_uri(path, mime):
    with open(path, "rb") as fh:
        return "data:%s;base64,%s" % (mime, base64.b64encode(fh.read()).decode())


def build():
    mark = data_uri(os.path.join(DESIGN, "brand", "dist", "assembly-mark.png"),
                    "image/png")

    # --- 각 쪽의 <main> 만 떼어 온다 -----------------------------------------
    mains, claim_hits = [], 0
    for key, fn, _label, _svc in PAGES:
        src = read(os.path.join(HERE, fn))
        if key == "index":
            assert CLAIM_OLD in src, (
                "index.html 의 '상대경로로 직접 링크' 문단을 찾지 못했다. "
                "원문이 바뀌었으면 CLAIM_OLD 를 맞춰야 한다 — "
                "그러지 않으면 합본이 사실이 아닌 말을 하게 된다.")
            src = src.replace(CLAIM_OLD, CLAIM_NEW, 1)
            claim_hits += 1
        m = MAIN_RE.search(src)
        assert m, "%s: <main> 을 찾지 못했다" % fn
        cm = CLASS_RE.search(m.group(1))
        cls = cm.group(1) if cm else "ggc-shell-main"
        body = m.group(2)
        if key == "index":
            body = STANDALONE_NOTE + body
        # 쪽 사이 이동을 해시로 바꾼다
        for k2, fn2, _l, _s in PAGES:
            body = body.replace('href="%s"' % fn2, 'href="#%s"' % k2)
        mains.append((key, cls, body))
    assert claim_hits == 1, "index.html 문단 치환 실패"

    lnb_rows = []
    for key, _fn, label, _svc in PAGES:
        if key == "dashboard":
            lnb_rows.append('      <div class="ggc-lnb-divider"></div>')
            lnb_rows.append('      <div class="ex-lnb-cap">실물 화면</div>')
        lnb_rows.append(
            '      <a class="ggc-lnb-item" href="#%s" data-page="%s">%s</a>'
            % (key, key, label))

    mains_html = "\n".join(
        '      <main class="%s" data-page="%s"%s>%s</main>'
        % (cls, key, "" if key == "index" else " hidden", body)
        for key, cls, body in mains)

    svc_map = "{" + ", ".join('%s: "%s"' % (k, s) for k, _f, _l, s in PAGES) + "}"

    # ⚠ %-포맷도 str.format 도 쓰지 않는다 — 인라인되는 CSS 에 `100%` 와 `{` 가
    #   가득해서 둘 다 그 자리에서 깨진다. 고유 표식을 넣고 replace 로 채운다.
    slots = {
        "@@TOKENS@@": read(os.path.join(DESIGN, "ggc-tokens.css")),
        "@@COMPONENTS@@": read(os.path.join(DESIGN, "ggc-components.css")),
        "@@EXAMPLES_CSS@@": read(os.path.join(HERE, "examples.css")),
        "@@BEHAVIORS_JS@@": read(os.path.join(DESIGN, "ggc-behaviors.js")),
        "@@EXAMPLES_JS@@": read(os.path.join(HERE, "examples.js")),
        "@@MARK@@": mark,
        "@@LNB@@": "\n".join(lnb_rows),
        "@@MAINS@@": mains_html,
        "@@SVCMAP@@": svc_map,
    }
    html = SHELL
    for k, v in slots.items():
        assert k in html, "표식이 템플릿에 없다: " + k
        html = html.replace(k, v, 1)
    left = re.findall(r"@@[A-Z_]+@@", html)
    assert not left, "치환되지 않은 표식: %s" % left
    return html


SHELL = """<meta charset="utf-8">
<title>경기도의회 디자인 시스템</title>
<!-- =============================================================================
  생성물이다. design/examples/build-standalone.py 가 정본에서 만든다.
  직접 고치지 말 것 — 다음 생성에서 덮어써진다.

  담긴 것: ggc-tokens.css v2.0 · ggc-components.css v2.0 · ggc-behaviors.js ·
  examples.css · examples.js · 의회 마크(data URI) · 갤러리 9쪽의 본문.
  외부 요청 0 — 망분리 환경과 오프라인에서도 그대로 열린다.

  <meta charset> 을 반드시 첫 줄에 둔다. 이 파일은 <head> 없이 쓰이므로,
  없으면 브라우저가 인코딩을 추측해 **한글이 통째로 깨진다**(로컬 파일로
  열거나 charset 없는 서버가 줄 때 실제로 그랬다).
============================================================================= -->
<style>
/* ---- design/ggc-tokens.css (정본) ---------------------------------------- */
@@TOKENS@@
/* ---- design/ggc-components.css (정본) ------------------------------------ */
@@COMPONENTS@@
/* ---- design/examples/examples.css (갤러리 전용) -------------------------- */
@@EXAMPLES_CSS@@
/* ---- 합본 전용 ------------------------------------------------------------
 * 이 디자인은 **단일 라이트 세계로 확정**돼 있다 — 계약이 다크모드를 비범위로 뒀고,
 * 고대비는 팔레트를 하나 더 만드는 대신 forced-colors·prefers-contrast 로 대응한다
 * (토큰 파일 참조). 그래서 테마 토글을 두지 않되, **배경과 글자색을 명시**해
 * 어떤 호스트 위에 얹혀도 그대로 서게 한다. */
body {
  background: var(--ggc-bg);
  color: var(--ggc-text);
  font-family: var(--ggc-font);
}
[hidden] { display: none !important; }
</style>

<a class="ggc-skip-link" href="#main">본문 바로가기</a>

<div class="ggc-shell">

  <div class="ggc-utility-bar">
    <div class="inner">
      <a class="brand" href="#index">경기도의회 업무플랫폼</a>
      <nav>
        <span class="label">통합서비스</span>
        <a class="active" href="#index">디자인 시스템</a>
        <span class="disabled">의정지원</span>
        <span class="disabled">표창관리</span>
        <span class="disabled">실시간 자막</span>
      </nav>
    </div>
  </div>

  <header class="ggc-gnb">
    <a class="ggc-gnb-brand" href="#index">
      <img src="@@MARK@@" alt="">
      <span class="ggc-gnb-title">
        <span class="org">경기도의회</span>
        <span class="svc" id="svc">공통 디자인 시스템</span>
      </span>
    </a>
    <span class="ggc-gnb-spacer"></span>
    <div class="ggc-search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true" style="color:var(--ggc-text-faint);flex-shrink:0">
        <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
      </svg>
      <label for="q" class="ex-sr">예제 검색</label>
      <input id="q" type="search" placeholder="예제 검색">
    </div>
    <button class="ggc-icon-btn" type="button" aria-label="알림 3건">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="color:var(--ggc-text-muted)">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
      </svg>
    </button>
  </header>

  <div class="ggc-shell-body">
    <nav class="ggc-lnb ggc-scroll" aria-label="예제 목록">
      <div class="ex-lnb-cap">갤러리</div>
@@LNB@@
    </nav>

@@MAINS@@
  </div>

  <footer class="ggc-footer">
    <div class="inner">
      경기도의회 의정정보시스템 · 공통 디자인 시스템 예제 갤러리 (합본) ·
      정본 <code style="font-family:var(--ggc-font-mono)">design/ggc-tokens.css</code> v2.0 ·
      <code style="font-family:var(--ggc-font-mono)">ggc-components.css</code> v2.0
    </div>
  </footer>
</div>

<script>
/* ---- design/ggc-behaviors.js (정본) ------------------------------------- */
@@BEHAVIORS_JS@@
</script>
<script>
@@EXAMPLES_JS@@
</script>
<script>
/* 쪽 전환 — 합본 전용. 원본 갤러리는 파일이 나뉘어 있어 이 코드가 없다. */
(function () {
  "use strict";
  var SVC = @@SVCMAP@@;
  var mains = document.querySelectorAll("main[data-page]");
  var items = document.querySelectorAll(".ggc-lnb-item[data-page]");
  var svc = document.getElementById("svc");

  function show(key) {
    if (!Object.prototype.hasOwnProperty.call(SVC, key)) key = "index";
    mains.forEach(function (m) {
      var on = m.getAttribute("data-page") === key;
      m.hidden = !on;
      /* '본문 바로가기' 가 항상 **보이는** 본문으로 가게 한다 */
      if (on) { m.id = "main"; } else { m.removeAttribute("id"); }
    });
    items.forEach(function (a) {
      if (a.getAttribute("data-page") === key) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    svc.textContent = SVC[key];
  }

  function fromHash() { show((location.hash || "#index").slice(1)); }

  window.addEventListener("hashchange", function () {
    fromHash();
    window.scrollTo(0, 0);
  });
  fromHash();
})();
</script>
"""


def main():
    html = build()
    check = "--check" in sys.argv
    cur = read(OUT) if os.path.exists(OUT) else None
    rel = os.path.relpath(OUT, os.path.join(DESIGN, ".."))
    if cur == html:
        print("OK    %s 가 정본과 일치한다." % rel)
        return 0
    if check:
        print("FAIL  %s 가 정본보다 낡았다." % rel)
        print("      python design/examples/build-standalone.py 로 다시 생성할 것.")
        return 1
    io.open(OUT, "w", encoding="utf-8", newline="\n").write(html)
    print("생성  %s  (%.0f KB)" % (rel, len(html.encode("utf-8")) / 1024))
    return 0


if __name__ == "__main__":
    sys.exit(main())
