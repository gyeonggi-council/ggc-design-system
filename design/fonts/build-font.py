#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ggc 공통 폰트 정본 만들기 — Pretendard GOV 가변 서브셋 1파일

    python build-font.py            # 원본 내려받기 → 서브셋 → PretendardGOVVariable.subset.woff2
    python build-font.py --verify   # 만들지 않고 현재 산출물의 커버리지·축만 찍는다

왜 가변 폰트 1파일인가 (2026-08-25 실측으로 정한 것이다. 바꾸기 전에 다시 재라)

  정본 CSS 는 제목·KPI 에 font-weight:800 을 22곳에서 요구한다. 그런데 그동안 배포한
  정적 3벌(Regular/Medium/Bold)은 @font-face 가 `font-weight: 700 800` 을 Bold 하나에
  묶어 놔서 **800 이 700 과 똑같이 그려지고 있었다.** 굵기 단계가 하나 통째로 죽어 있었다.

  세 방식을 실측해 비교했다 (예산 집행현황 소스 전량 1,002자 기준):

    정적 3벌          파일 3개   777KB   400 / 500·600 / 700=800   ← 800 이 죽는다
    120분할 동적서브셋 39개 히트 1,317KB  45~920                    ← 조각이 흩어져 더 무겁다
    가변 단일 서브셋   파일 1개   617KB   45~930                    ← 채택

  Claude Design 정본(경기도의회 공통 디자인 시스템)은 120분할을 쓰지만, 그것은 유니코드
  한글 11,172자를 전부 담기 위한 구성이다. 이 플랫폼이 실제로 배포해 온 커버리지는
  KS X 1001 계열 2,780자이고, 그 범위에서는 분할이 이득이 되지 않는다 — 한글 음절이
  120조각에 흩어져 있어 한 화면에 39조각이 걸린다. **커버리지를 넓히려면**(이름에 쓰이는
  희귀 음절 등) 한글 전량 판이 1,786KB 이므로, 그때는 분할이 다시 답이 된다.

커버리지는 기존 정적 서브셋과 **같게** 잡는다 — 넓히지도 좁히지도 않는다.
글꼴을 바꾸면서 커버리지까지 건드리면 「폰트가 바뀌어 깨졌다」와 「원래 없던 글자다」를
가를 수 없게 된다. 기준 파일은 이미 배포된 PretendardGOV-Regular.subset.woff2 다.
"""
import io
import os
import sys
import json
import tarfile
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "PretendardGOVVariable.subset.woff2")

# 커버리지 기준 — 이미 배포돼 있는 정적 서브셋. 여기서 코드포인트 목록을 그대로 가져온다.
BASELINE = os.path.join(
    HERE, "..", "..", "..", "2026-ggc-vibe", "ggc-services",
    "ggc-poc-web", "webapp", "public", "fonts", "PretendardGOV-Regular.subset.woff2",
)

# 디자인 시스템이 상태 표기의 정식 어휘로 정한 기호 — 커버리지에서 빠지면
# 그 자리만 폴백 글꼴로 그려져 배지 안에서 크기·굵기가 튄다.
SYMBOLS = "●◆○✓◷✕▲▼§⚠＋←→↔·—…「」『』○◻▸⚖"

NPM = "https://registry.npmjs.org/pretendard-gov"
VERSION = "1.3.9"


def _log(msg):
    sys.stdout.write(msg + "\n")
    sys.stdout.flush()


def coverage(path):
    from fontTools.ttLib import TTFont
    return set(TTFont(path).getBestCmap().keys())


def verify():
    from fontTools.ttLib import TTFont
    f = TTFont(OUT)
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in f["fvar"].axes]
    _log("파일   : %s (%d KB)" % (os.path.basename(OUT), os.path.getsize(OUT) // 1024))
    _log("커버리지: %d 코드포인트" % len(f.getBestCmap()))
    _log("가변 축 : %s" % axes)
    missing = [c for c in SYMBOLS if ord(c) not in f.getBestCmap()]
    _log("기호 누락: %s" % ("없음" if not missing else "".join(missing)))


def build():
    from fontTools.ttLib import TTFont
    from fontTools.subset import Subsetter, Options

    keep = coverage(BASELINE) | {ord(c) for c in SYMBOLS}
    _log("커버리지 기준 %s → %d 코드포인트" % (os.path.basename(BASELINE), len(keep)))

    with urllib.request.urlopen(NPM, timeout=60) as r:
        tarball = json.load(r)["versions"][VERSION]["dist"]["tarball"]
    _log("원본 내려받는 중: %s" % tarball)
    with urllib.request.urlopen(tarball, timeout=600) as r:
        blob = r.read()

    member = "package/dist/web/variable/woff2/PretendardGOVVariable.woff2"
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as tf:
        src = tf.extractfile(member).read()
        lic = tf.extractfile("package/dist/LICENSE.txt").read()
    tmp = os.path.join(HERE, "_src.woff2")
    with open(tmp, "wb") as fh:
        fh.write(src)
    with open(os.path.join(HERE, "OFL.txt"), "wb") as fh:
        fh.write(lic)

    font = TTFont(tmp)
    keep &= set(font.getBestCmap().keys())
    o = Options()
    o.layout_features = ["*"]      # kern·liga 를 지우면 한글 자간이 미세하게 달라진다
    o.name_IDs = ["*"]
    o.name_legacy = True
    o.name_languages = ["*"]
    o.notdef_outline = True
    o.drop_tables = []
    s = Subsetter(options=o)
    s.populate(unicodes=keep)
    s.subset(font)
    font.flavor = "woff2"
    font.save(OUT)
    os.remove(tmp)
    verify()


if __name__ == "__main__":
    if "--verify" in sys.argv:
        verify()
    else:
        build()
