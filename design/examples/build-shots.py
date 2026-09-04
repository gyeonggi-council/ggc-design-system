# -*- coding: utf-8 -*-
"""build-shots.py — 갤러리 실물을 헤드리스 Chrome 으로 찍어 README 미리보기 PNG 를 **생성**한다.

왜 필요한가 — GitHub 웹은 HTML 을 렌더하지 않는다. 저장소에 들어온 사람이 아무것도
내려받지 않고 "컴포넌트가 어떻게 생겼나" 를 보려면 README 안에서 렌더되는 이미지가
필요하다. 팔레트는 SVG 로 만들 수 있었지만(build-preview.py) 컴포넌트는 CSS 가 그리는
것이라 **브라우저가 렌더한 그림**이어야 정본과 같다.

왜 생성물인가 — 손으로 찍은 스크린샷은 그 순간 정본과 갈라진다(어느 판을 찍었는지
아무도 모른다). 그래서 이 스크립트가 정본 CSS·JS·갤러리 쪽을 **입력 해시**로 묶어
`shots/manifest.json` 에 적고, 입력이 바뀌면 `--check` 가 낡았다고 판정한다.
PNG 픽셀은 환경(글꼴 렌더러)마다 조금씩 달라 바이트 비교를 하지 않는다 — 해시가 기준이다.
**`shots/*.png` 를 직접 고치거나 다른 도구로 찍어 넣지 말 것.**

의존성 — `--check` 는 표준 라이브러리만 쓴다(CI 가 그것만 돈다).
생성에는 node + playwright(-core) + Chromium 이 필요하다(CLAUDE.md 의 브라우저 실측 환경과 같다).

    python design/examples/build-shots.py           생성 (node · playwright · Chrome 필요)
    python design/examples/build-shots.py --check   낡았는지만 (다르면 exit 1 · Chrome 불필요)

    환경변수  GGC_CHROME=<chrome 실행파일>   playwright 번들 대신 쓸 브라우저 (선택)
"""
import hashlib
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = os.path.normpath(os.path.join(HERE, ".."))
ROOT = os.path.normpath(os.path.join(DESIGN, ".."))
OUT_DIR = os.path.join(HERE, "shots")
MANIFEST = os.path.join(OUT_DIR, "manifest.json")

# 무엇을 찍을지만 여기서 정한다. **모양은 전부 정본과 갤러리에서 온다.**
#   key · 갤러리 쪽 · 잘라낼 요소(없으면 뷰포트 전체) · 뷰포트 폭×높이 · README 캡션
SHOTS = [
    # 실물 화면 — 셸이 붙은 모습
    ("screen-dashboard", "dashboard.html", None,          (1440, 720), "Monitor — 대시보드 · GNB 제목부 + LNB + KPI"),
    ("screen-wizard",    "wizard.html",    None,          (1440, 640), "Configure — 조례 초안 위저드 · 브레드크럼 + 단계 표시"),
    ("screen-public",    "public/index.html", None,       (1440, 720), "대민 셸 — 마스트헤드 · 헤더 · 주 메뉴 (KRDS 패턴)"),
    # 컴포넌트 — 갤러리 데모 상자를 그대로 잘라낸다
    ("gnb-page",   "components-nav.html",     "#d-gnbpage",   (1440, 900), "GNB 제목부 `.ggc-gnb-page`"),
    ("buttons",    "components.html",         "#d-btn",       (1440, 900), "버튼 `.ggc-btn`"),
    ("badges",     "components.html",         "#d-badge",     (1440, 900), "배지 · 태그 `.ggc-badge` `.ggc-tag`"),
    ("cards",      "components.html",         "#d-card",      (1440, 900), "카드 `.ggc-card`"),
    ("stats",      "components.html",         "#d-stat",      (1440, 900), "통계 타일 `.ggc-stat`"),
    ("table",      "components.html",         "#d-table",     (1440, 900), "표 `.ggc-table`"),
    ("wizard",     "components.html",         "#d-wiz",       (1440, 900), "위저드 `.ggc-wizard`"),
    ("states",     "components.html",         "#d-states",    (1440, 900), "빈 상태 · 오류 · 로딩"),
    ("filter",     "components-forms.html",   "#d-filter",    (1440, 900), "Explore 필터 스트립 (조립)"),
    ("checks",     "components-forms.html",   "#d-check",     (1440, 900), "체크박스 · 라디오 `.ggc-check` `.ggc-radio`"),
    ("tabs",       "components-nav.html",     "#d-tabs-card", (1440, 900), "탭 `.ggc-tabs`"),
    ("pagination", "components-nav.html",     "#d-pg",        (1440, 900), "페이지네이션 `.ggc-pagination`"),
    ("alerts",     "components-overlay.html", "#d-alert",     (1440, 900), "알림 · 콜아웃 `.ggc-alert`"),
]

# 입력 해시에 들어가는 정본·갤러리 파일 — 이 중 하나라도 바뀌면 낡은 것이다.
SOURCES = [
    "design/ggc-tokens.css", "design/ggc-components.css", "design/ggc-public.css",
    "design/ggc-behaviors.js", "design/ggc-fonts.css", "design/examples/examples.css",
    "design/examples/examples.js", "design/examples/build-shots.py",
] + sorted({"design/examples/" + page for _k, page, _sel, _vp, _cap in SHOTS})

DPR = 2  # README 에서 절반 폭으로 보이므로 2배로 찍어야 글자가 선명하다


def sha_sources():
    h = hashlib.sha256()
    for rel in SOURCES:
        with open(os.path.join(ROOT, rel), "rb") as fh:
            h.update(rel.encode("utf-8") + b"\0" + fh.read() + b"\0")
    return h.hexdigest()


def read_manifest():
    if not os.path.exists(MANIFEST):
        return None
    with io.open(MANIFEST, encoding="utf-8") as fh:
        return json.load(fh)


def check():
    m = read_manifest()
    missing = [k for k, *_ in SHOTS if not os.path.exists(os.path.join(OUT_DIR, k + ".png"))]
    if m is None or missing:
        print("FAIL  design/examples/shots/ 가 없거나 비었다 (%s)." % (", ".join(missing) or "manifest"))
        return 1
    if m.get("sha256") != sha_sources() or [k for k, *_ in SHOTS] != m.get("shots"):
        print("FAIL  design/examples/shots/ 가 정본보다 낡았다.")
        print("      python design/examples/build-shots.py 로 다시 생성할 것 (node · playwright · Chrome).")
        return 1
    print("OK    design/examples/shots/ 가 정본과 일치한다 (%d장)." % len(SHOTS))
    return 0


# 촬영은 node 가 한다 — 값·선택자는 위 SHOTS 를 JSON 으로 넘긴다. 여기엔 모양이 없다.
NODE_JS = r"""
const fs = require("fs"), path = require("path");
const [,, specPath] = process.argv;
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
function load() {
  const cands = ["playwright-core", "playwright"];
  const roots = [spec.root];
  try { roots.push(require("child_process").execSync("npm root -g", { encoding: "utf8" }).trim()); } catch (e) {}
  for (const r of roots) for (const c of cands) {
    try { return require(require.resolve(c, { paths: [r] })); } catch (e) {}
  }
  throw new Error("playwright(-core) 를 찾지 못했다 — npm i -g playwright-core 또는 저장소에 설치");
}
(async () => {
  const { chromium } = load();
  const opts = {}; if (process.env.GGC_CHROME) opts.executablePath = process.env.GGC_CHROME;
  const browser = await chromium.launch(opts);
  for (const s of spec.shots) {
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: spec.dpr });
    const page = await ctx.newPage();
    const errs = []; page.on("pageerror", e => errs.push(String(e)));
    await page.goto("file://" + path.join(spec.examples, s.page), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(spec.out, s.key + ".png");
    if (s.sel) {
      const el = await page.$(s.sel);
      if (!el) throw new Error(s.page + ": " + s.sel + " 을 찾지 못했다");
      await el.scrollIntoViewIfNeeded();
      await el.screenshot({ path: out });
    } else {
      await page.screenshot({ path: out });
    }
    if (errs.length) throw new Error(s.page + ": 콘솔 오류 " + errs.join(" | "));
    console.log("  " + s.key + ".png");
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(String(e)); process.exit(1); });
"""


def build():
    if shutil.which("node") is None:
        print("FAIL  node 가 없다 — 생성에는 node + playwright + Chrome 이 필요하다.")
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)
    spec = {
        "root": ROOT, "examples": HERE, "out": OUT_DIR, "dpr": DPR,
        "shots": [{"key": k, "page": p, "sel": sel, "w": vp[0], "h": vp[1]} for k, p, sel, vp, _c in SHOTS],
    }
    with tempfile.TemporaryDirectory() as td:
        js = os.path.join(td, "shots.js")
        sp = os.path.join(td, "spec.json")
        io.open(js, "w", encoding="utf-8").write(NODE_JS)
        io.open(sp, "w", encoding="utf-8").write(json.dumps(spec))
        r = subprocess.run(["node", js, sp], cwd=ROOT)
        if r.returncode != 0:
            return r.returncode
    # 남은 옛 PNG 는 지운다 — SHOTS 에서 빠진 것이 README 에 남아 있으면 안 된다
    keep = {k + ".png" for k, *_ in SHOTS} | {"manifest.json"}
    for fn in os.listdir(OUT_DIR):
        if fn not in keep:
            os.remove(os.path.join(OUT_DIR, fn))
    manifest = {
        "_": "생성물이다. design/examples/build-shots.py 가 만든다 — 직접 고치지 말 것.",
        "sha256": sha_sources(),
        "sources": SOURCES,
        "dpr": DPR,
        "shots": [k for k, *_ in SHOTS],
        "captions": {k: c for k, _p, _s, _v, c in SHOTS},
    }
    io.open(MANIFEST, "w", encoding="utf-8", newline="\n").write(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    total = sum(os.path.getsize(os.path.join(OUT_DIR, k + ".png")) for k, *_ in SHOTS)
    print("생성  design/examples/shots/  %d장 · %.0f KB" % (len(SHOTS), total / 1024))
    return 0


def main():
    if "--check" in sys.argv:
        return check()
    return build()


if __name__ == "__main__":
    sys.exit(main())
