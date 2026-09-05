#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""build-ppt.py — 대외 발표용 PPT 템플릿을 **토큰에서 생성**한다 (v3.0, 2026-09-05)

왜 생성물인가 — PPT 색을 손으로 적으면 그 순간 정본과 갈라진다("값은 한 곳에만"). 이 스크립트는 design/ggc-tokens.css 의
hex 를 check_design 의 파서로 읽어 python-pptx 로 마스터·레이아웃·샘플 덱을 만든다. 토큰이 바뀌면 다시 돌린다.
낡았는지는 manifest.json 의 입력 해시로 판정한다(check_design.py --canon D6 gen).

산출물 (design/ppt/dist/):
  ggc-presentation-template.pptx   16:9 · 레이아웃 10종 · 대외 발표·설명회용 (사용자 결정 2026-09-05)
  ggc-presentation-sample.pptx     같은 템플릿으로 만든 샘플 덱 12장 — "의정정보시스템 소개"
  manifest.json                    입력 해시 · 레이아웃 목록

    python design/ppt/build-ppt.py           생성 (python-pptx 필요: pip install python-pptx)
    python design/ppt/build-ppt.py --check   낡았는지만 (표준 라이브러리만 — CI)

서체: Pretendard GOV(자체 설치 필요, docs/guides/ppt.md). 미설치 PC 는 맑은 고딕으로 대체된다 — 레이아웃은 그대로다.
규칙(무엇을 어디에)은 docs/guides/ppt.md. 여기는 값이 아니라 배치만 갖는다.
"""
import hashlib
import io
import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = os.path.normpath(os.path.join(HERE, ".."))
ROOT = os.path.normpath(os.path.join(DESIGN, ".."))
sys.path.insert(0, DESIGN)
import check_design as cd  # noqa: E402  (토큰 파서 · 대비 계산 재사용)

DIST = os.path.join(HERE, "dist")
TEMPLATE = os.path.join(DIST, "ggc-presentation-template.pptx")
SAMPLE = os.path.join(DIST, "ggc-presentation-sample.pptx")
MANIFEST = os.path.join(DIST, "manifest.json")
MARK = os.path.join(DESIGN, "brand", "dist", "assembly-mark.png")

FONT = "Pretendard GOV"
FONT_FALLBACK = "맑은 고딕"
SOURCES = ["design/ggc-tokens.css", "design/ppt/build-ppt.py", "design/brand/dist/assembly-mark.png"]

LAYOUTS = [
    ("cover", "표지"), ("toc", "목차"), ("section", "섹션 구분"), ("bullets", "본문 · 불릿"),
    ("two-col", "본문 · 2단"), ("image", "이미지 강조"), ("table", "표"), ("chart", "차트"),
    ("kpi", "핵심 수치"), ("closing", "마무리"),
]


def sha_sources():
    h = hashlib.sha256()
    for rel in SOURCES:
        with open(os.path.join(ROOT, rel), "rb") as fh:
            h.update(rel.encode() + b"\0" + fh.read() + b"\0")
    return h.hexdigest()


def check():
    if not (os.path.exists(TEMPLATE) and os.path.exists(SAMPLE) and os.path.exists(MANIFEST)):
        print("FAIL  design/ppt/dist/ 가 없거나 비었다 — python design/ppt/build-ppt.py")
        return 1
    with io.open(MANIFEST, encoding="utf-8") as fh:
        m = json.load(fh)
    if m.get("sha256") != sha_sources():
        print("FAIL  design/ppt/dist/ 가 정본(토큰)보다 낡았다 — python design/ppt/build-ppt.py")
        return 1
    print("OK    design/ppt/dist/ 가 토큰과 일치한다 (레이아웃 %d종)." % len(m.get("layouts", [])))
    return 0


# ----------------------------------------------------------------------------- 생성
def tokens():
    """토큰 파일의 :root 기본값(hex) — 이름 → '#rrggbb'. 값은 여기서만 읽는다."""
    t = cd.base_root_vars(cd.read(cd.CANON_TOKENS))
    need = ["primary", "primary-dark", "primary-deep", "primary-light", "primary-light-strong",
            "success", "warning", "danger", "info", "success-tint", "warning-tint", "danger-tint", "info-tint",
            "text-strong", "text", "text-muted", "text-subtle", "text-faint", "text-body",
            "border", "border-strong", "shell-border", "hairline", "bg", "surface", "surface-inset"]
    missing = [n for n in need if n not in t]
    if missing:
        raise SystemExit("토큰이 없다: " + ", ".join(missing))
    return t


def build():
    try:
        from pptx import Presentation
        from pptx.chart.data import CategoryChartData
        from pptx.dml.color import RGBColor
        from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
        from pptx.enum.shapes import MSO_SHAPE
        from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
        from pptx.util import Emu, Inches, Pt
    except ImportError:
        print("FAIL  python-pptx 가 없다 — pip install python-pptx")
        return 1

    T = tokens()

    def rgb(name):
        return RGBColor.from_string(T[name].lstrip("#").upper())

    WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    W, H = Inches(13.333), Inches(7.5)
    M = Inches(0.6)                      # 좌우 여백
    CONTENT_W = W - 2 * M

    # ------------------------------------------------------------- 저수준 도우미
    def font(run, size, bold=False, color=None, name=FONT):
        run.font.name = name
        run.font.size = Pt(size)
        run.font.bold = bold
        if color is not None:
            run.font.color.rgb = color
        # 동아시아 폰트도 같은 서체로 — 이것이 없으면 한글이 기본 서체로 떨어진다
        rpr = run._r.get_or_add_rPr()
        ea = rpr.find("{http://schemas.openxmlformats.org/drawingml/2006/main}ea")
        if ea is None:
            from pptx.oxml.ns import qn
            from lxml import etree
            ea = etree.SubElement(rpr, qn("a:ea"))
        ea.set("typeface", name)

    def text(slide, left, top, width, height, s, size, bold=False, color=None, align=PP_ALIGN.LEFT,
             anchor=MSO_ANCHOR.TOP, line=1.2, name=FONT):
        tb = slide.shapes.add_textbox(left, top, width, height)
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        tf.vertical_anchor = anchor
        lines = s if isinstance(s, list) else [s]
        for i, ln in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.alignment = align
            p.line_spacing = line
            r = p.add_run()
            r.text = ln
            font(r, size, bold, color, name)
        return tb

    def rect(slide, left, top, width, height, fill, line=None, shape=MSO_SHAPE.RECTANGLE):
        sh = slide.shapes.add_shape(shape, left, top, width, height)
        sh.fill.solid()
        sh.fill.fore_color.rgb = fill
        if line is None:
            sh.line.fill.background()
        else:
            sh.line.color.rgb = line
            sh.line.width = Pt(0.75)
        sh.shadow.inherit = False
        if sh.has_text_frame:
            sh.text_frame.text = ""
        return sh

    def footer(slide, n, total, dark=False):
        """푸터 — 기관명 · 쪽번호 · 배포 구분 슬롯. 모든 본문 슬라이드 동일 자리."""
        c = WHITE if dark else rgb("text-subtle")
        text(slide, M, H - Inches(0.45), Inches(6), Inches(0.3), "경기도의회 · 의정정보시스템", 10, color=c, anchor=MSO_ANCHOR.MIDDLE)
        text(slide, W - M - Inches(3), H - Inches(0.45), Inches(3), Inches(0.3), "%d / %d" % (n, total), 10, color=c, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)
        if not dark:
            ln = slide.shapes.add_connector(1, M, H - Inches(0.55), W - M, H - Inches(0.55))
            ln.line.color.rgb = rgb("border")
            ln.line.width = Pt(0.75)

    def title_bar(slide, title, sub=None):
        """본문 슬라이드 제목 — 28pt 700 + 왼쪽 네이비 띠 4px. 부제는 14pt muted."""
        rect(slide, M, Inches(0.55), Inches(0.07), Inches(0.62), rgb("primary"))
        text(slide, M + Inches(0.22), Inches(0.5), CONTENT_W - Inches(0.22), Inches(0.7), title, 28, True, rgb("text-strong"), anchor=MSO_ANCHOR.MIDDLE)
        if sub:
            text(slide, M + Inches(0.22), Inches(1.2), CONTENT_W - Inches(0.22), Inches(0.4), sub, 14, color=rgb("text-muted"))

    def bullets(slide, left, top, width, height, items, size=18, gap=1.35):
        tb = slide.shapes.add_textbox(left, top, width, height)
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for i, it in enumerate(items):
            level = 1 if it.startswith("  ") else 0
            it = it.strip()
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.line_spacing = gap
            p.level = level
            r = p.add_run()
            r.text = ("•  " if level == 0 else "–  ") + it
            font(r, size if level == 0 else size - 2, False, rgb("text") if level == 0 else rgb("text-muted"))
        return tb

    # ------------------------------------------------------------- 레이아웃 10종 (슬라이드 생성 함수)
    def l_cover(prs, title, sub, meta):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        rect(s, 0, 0, W, H, rgb("primary-deep"))
        rect(s, 0, H - Inches(0.9), W, Inches(0.9), rgb("primary"))
        if os.path.exists(MARK):
            s.shapes.add_picture(MARK, M, Inches(0.8), height=Inches(1.0))
        text(s, M + Inches(1.2), Inches(0.85), Inches(6), Inches(0.9), ["경기도의회", "GYEONGGI PROVINCIAL COUNCIL"], 16, True, WHITE, anchor=MSO_ANCHOR.MIDDLE, line=1.15)
        text(s, M, Inches(2.6), CONTENT_W, Inches(1.6), title, 40, True, WHITE, line=1.15)
        text(s, M, Inches(4.3), CONTENT_W, Inches(0.7), sub, 20, False, RGBColor.from_string(T["primary-light-strong"].lstrip("#").upper()))
        text(s, M, H - Inches(0.75), CONTENT_W, Inches(0.5), meta, 12, False, WHITE, anchor=MSO_ANCHOR.MIDDLE)
        return s

    def l_toc(prs, items, n, total):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, "목차")
        top = Inches(1.7)
        for i, it in enumerate(items):
            y = top + Inches(0.72) * i
            rect(s, M, y, Inches(0.55), Inches(0.5), rgb("primary-light"), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
            text(s, M, y, Inches(0.55), Inches(0.5), "%02d" % (i + 1), 14, True, rgb("primary"), align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
            text(s, M + Inches(0.75), y, CONTENT_W - Inches(0.75), Inches(0.5), it, 18, False, rgb("text"), anchor=MSO_ANCHOR.MIDDLE)
        footer(s, n, total)
        return s

    def l_section(prs, no, title, sub, n, total):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        rect(s, 0, 0, W, H, rgb("primary"))
        text(s, M, Inches(2.2), Inches(3), Inches(0.8), "%02d" % no, 48, True, RGBColor.from_string(T["primary-light-strong"].lstrip("#").upper()))
        text(s, M, Inches(3.1), CONTENT_W, Inches(1.2), title, 36, True, WHITE)
        if sub:
            text(s, M, Inches(4.3), CONTENT_W, Inches(0.8), sub, 18, False, RGBColor.from_string(T["primary-light"].lstrip("#").upper()))
        footer(s, n, total, dark=True)
        return s

    def l_bullets(prs, title, sub, items, n, total, note=None):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        bullets(s, M, Inches(1.8), CONTENT_W, Inches(4.4), items)
        if note:
            rect(s, M, H - Inches(1.45), CONTENT_W, Inches(0.7), rgb("info-tint"))
            rect(s, M, H - Inches(1.45), Inches(0.06), Inches(0.7), rgb("info"))
            text(s, M + Inches(0.25), H - Inches(1.45), CONTENT_W - Inches(0.4), Inches(0.7), note, 13, False, rgb("text"), anchor=MSO_ANCHOR.MIDDLE)
        footer(s, n, total)
        return s

    def l_two_col(prs, title, sub, left_title, left_items, right_title, right_items, n, total):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        colw = (CONTENT_W - Inches(0.5)) / 2
        for i, (h, items) in enumerate(((left_title, left_items), (right_title, right_items))):
            x = M + (colw + Inches(0.5)) * i
            rect(s, x, Inches(1.8), colw, Inches(4.6), rgb("surface"), line=rgb("border"), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
            rect(s, x, Inches(1.8), colw, Inches(0.6), rgb("surface-inset"), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
            text(s, x + Inches(0.3), Inches(1.8), colw - Inches(0.6), Inches(0.6), h, 16, True, rgb("text-strong"), anchor=MSO_ANCHOR.MIDDLE)
            bullets(s, x + Inches(0.3), Inches(2.6), colw - Inches(0.6), Inches(3.6), items, size=16, gap=1.3)
        footer(s, n, total)
        return s

    def l_image(prs, title, sub, caption, n, total, image=None):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        box = (M, Inches(1.8), CONTENT_W, Inches(4.5))
        if image and os.path.exists(image):
            pic = s.shapes.add_picture(image, box[0], box[1], width=box[2])
            if pic.height > box[3]:
                pic.height = box[3]
                pic.width = int(pic.width * box[3] / pic.height) if pic.height else pic.width
        else:
            rect(s, *box, fill=rgb("surface-inset"), line=rgb("border-strong"), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
            text(s, box[0], box[1], box[2], box[3], "화면 캡처 · 도해 자리 (16:9 · 여백 없이 · 실제 데이터 마스킹)", 14, False, rgb("text-subtle"), align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(s, M, Inches(6.4), CONTENT_W, Inches(0.4), caption, 12, False, rgb("text-muted"), align=PP_ALIGN.CENTER)
        footer(s, n, total)
        return s

    def l_table(prs, title, sub, header, rows, n, total, num_cols=(), total_row=False):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        nrows, ncols = len(rows) + 1, len(header)
        gt = s.shapes.add_table(nrows, ncols, M, Inches(1.8), CONTENT_W, Inches(0.42) * nrows)
        tbl = gt.table
        tbl.first_row = True
        for c, h in enumerate(header):
            cell = tbl.cell(0, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = rgb("primary-deep")
            cell.text = ""
            p = cell.text_frame.paragraphs[0]
            p.alignment = PP_ALIGN.RIGHT if c in num_cols else PP_ALIGN.LEFT
            r = p.add_run(); r.text = h; font(r, 13, True, WHITE)
            cell.margin_left = cell.margin_right = Inches(0.12)
        for ri, row in enumerate(rows, start=1):
            last = total_row and ri == nrows - 1
            for c, v in enumerate(row):
                cell = tbl.cell(ri, c)
                cell.fill.solid()
                cell.fill.fore_color.rgb = rgb("surface-inset") if last else (rgb("surface") if ri % 2 else rgb("bg"))
                cell.text = ""
                p = cell.text_frame.paragraphs[0]
                p.alignment = PP_ALIGN.RIGHT if c in num_cols else PP_ALIGN.LEFT
                r = p.add_run(); r.text = str(v); font(r, 13, last, rgb("text-strong") if last else rgb("text-body"))
                cell.margin_left = cell.margin_right = Inches(0.12)
        footer(s, n, total)
        return s

    def l_chart(prs, title, sub, categories, series, n, total, kind="bar"):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        data = CategoryChartData()
        data.categories = categories
        for name, vals in series:
            data.add_series(name, vals)
        ctype = {"bar": XL_CHART_TYPE.COLUMN_CLUSTERED, "line": XL_CHART_TYPE.LINE_MARKERS, "hbar": XL_CHART_TYPE.BAR_CLUSTERED}[kind]
        gf = s.shapes.add_chart(ctype, M, Inches(1.7), CONTENT_W, Inches(4.7), data)
        ch = gf.chart
        ch.has_legend = len(series) > 1
        if ch.has_legend:
            ch.legend.position = XL_LEGEND_POSITION.BOTTOM
            ch.legend.include_in_layout = False
            ch.legend.font.size = Pt(12)
            ch.legend.font.name = FONT
        palette = ["primary", "info", "success", "warning", "danger"]   # = chart-1..5 (ggc-theme)
        for i, ser in enumerate(ch.series):
            fmt = ser.format
            fmt.fill.solid()
            fmt.fill.fore_color.rgb = rgb(palette[i % len(palette)])
            if kind == "line":
                fmt.line.color.rgb = rgb(palette[i % len(palette)])
                fmt.line.width = Pt(2.25)
        for ax in (ch.category_axis, ch.value_axis):
            ax.tick_labels.font.size = Pt(12)
            ax.tick_labels.font.name = FONT
            ax.tick_labels.font.color.rgb = rgb("text-muted")
            ax.format.line.color.rgb = rgb("border-strong")
        ch.value_axis.major_gridlines.format.line.color.rgb = rgb("hairline")
        ch.value_axis.has_major_gridlines = True
        ch.plots[0].gap_width = 80
        footer(s, n, total)
        return s

    def l_kpi(prs, title, sub, kpis, n, total):
        """핵심 수치 3~4 — 숫자 44pt 800 · 단위 · 라벨 · 추이(성공/경고/오류색)"""
        s = prs.slides.add_slide(prs.slide_layouts[6])
        title_bar(s, title, sub)
        k = len(kpis)
        gap = Inches(0.3)
        cw = (CONTENT_W - gap * (k - 1)) / k
        for i, (label, value, unit, trend, tone) in enumerate(kpis):
            x = M + (cw + gap) * i
            rect(s, x, Inches(2.0), cw, Inches(3.2), rgb("surface"), line=rgb("border"), shape=MSO_SHAPE.ROUNDED_RECTANGLE)
            text(s, x + Inches(0.35), Inches(2.3), cw - Inches(0.7), Inches(0.4), label, 14, True, rgb("text-muted"))
            tb = s.shapes.add_textbox(x + Inches(0.35), Inches(2.9), cw - Inches(0.7), Inches(1.2))
            tf = tb.text_frame; tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            r = p.add_run(); r.text = value; font(r, 44, True, rgb("text-strong"))
            if unit:
                r2 = p.add_run(); r2.text = " " + unit; font(r2, 16, True, rgb("text-subtle"))
            if trend:
                text(s, x + Inches(0.35), Inches(4.3), cw - Inches(0.7), Inches(0.5), trend, 13, True, rgb({"up": "success", "warn": "warning", "down": "danger"}.get(tone, "text-muted")))
        footer(s, n, total)
        return s

    def l_closing(prs, title, lines, n, total):
        s = prs.slides.add_slide(prs.slide_layouts[6])
        rect(s, 0, 0, W, H, rgb("primary-deep"))
        if os.path.exists(MARK):
            s.shapes.add_picture(MARK, M, Inches(1.0), height=Inches(0.9))
        text(s, M, Inches(2.6), CONTENT_W, Inches(1.2), title, 36, True, WHITE)
        text(s, M, Inches(3.9), CONTENT_W, Inches(1.8), lines, 16, False, RGBColor.from_string(T["primary-light-strong"].lstrip("#").upper()), line=1.5)
        text(s, M, H - Inches(0.75), CONTENT_W, Inches(0.5), "이 자료는 경기도의회 의정정보시스템 공식 발표 자료입니다 · 경기도의회사무처", 11, False, WHITE, anchor=MSO_ANCHOR.MIDDLE)
        return s

    # ------------------------------------------------------------- 템플릿: 레이아웃마다 자리표시 한 장
    def new_prs():
        prs = Presentation()
        prs.slide_width, prs.slide_height = W, H
        return prs

    os.makedirs(DIST, exist_ok=True)
    total = len(LAYOUTS)
    prs = new_prs()
    l_cover(prs, "발표 제목을 여기에", "부제 · 설명회 이름", "2026. 09. 05 · 경기도의회사무처 ○○과")
    l_toc(prs, ["첫 번째 항목", "두 번째 항목", "세 번째 항목", "네 번째 항목"], 2, total)
    l_section(prs, 1, "섹션 제목", "섹션 부제 — 한 줄", 3, total)
    l_bullets(prs, "본문 슬라이드 제목", "부제 또는 출처", ["첫 번째 요점 — 한 줄에 하나", "  하위 설명은 한 단계만", "두 번째 요점", "세 번째 요점", "네 번째 요점", "다섯 번째 요점 — 여섯 줄을 넘기지 않는다"], 4, total, note="강조 상자 — 핵심 메시지 한 문장")
    l_two_col(prs, "2단 비교", "현행 · 개선", "현행", ["항목 1", "항목 2", "항목 3"], "개선", ["항목 1", "항목 2", "항목 3"], 5, total)
    l_image(prs, "화면 · 도해", "캡션은 아래 한 줄", "그림 1. 설명 — 출처", 6, total)
    l_table(prs, "표", "단위: 건", ["구분", "접수", "가결", "계속심사", "처리율"], [["기획재정위원회", "38", "31", "5", "81.6%"], ["경제노동위원회", "29", "24", "4", "82.8%"], ["문화체육관광위원회", "22", "19", "2", "86.4%"], ["합계", "89", "74", "11", "83.1%"]], 7, total, num_cols=(1, 2, 3, 4), total_row=True)
    l_chart(prs, "차트", "단위: 건 · 색은 데이터에만", ["1월", "2월", "3월", "4월", "5월", "6월"], [("접수", (24, 31, 28, 35, 30, 27)), ("가결", (19, 26, 25, 30, 26, 24))], 8, total)
    l_kpi(prs, "핵심 수치", "제380회 정례회 기준", [("접수 의안", "147", "건", "▲ 전 회기 대비 12건", "up"), ("가결", "118", "건", "처리율 80.3%", "up"), ("계속심사", "21", "건", "기한 임박 4건", "warn"), ("부결 · 폐기", "8", "건", "▼ 전 회기 대비 3건", "down")], 9, total)
    l_closing(prs, "감사합니다", ["담당 부서 · 대표전화 · 이메일", "www.ggc.go.kr"], 10, total)
    prs.save(TEMPLATE)

    # ------------------------------------------------------------- 샘플 덱 12장 — 의정정보시스템 소개 (대외 어휘: 존댓말 · 쉬운 말)
    prs = new_prs()
    N = 12
    l_cover(prs, "경기도의회 의정정보시스템", "도민과 함께 만드는 의정 — 설명회 자료", "2026. 09. 05 · 경기도의회사무처")
    l_toc(prs, ["의정정보시스템이란", "무엇이 달라지나", "주요 기능 — 의안 · 회의 · 참여", "이용 현황과 앞으로의 계획"], 2, N)
    l_section(prs, 1, "의정정보시스템이란", "의안 · 회의록 · 의원 활동을 한 곳에서 찾아보실 수 있습니다", 3, N)
    l_bullets(prs, "의정정보시스템이란", "경기도의회가 운영하는 의정정보 통합 누리집입니다",
              ["의안, 회의록, 의원 활동을 한 곳에서 찾아보실 수 있습니다", "회기 중 본회의는 인터넷 방송으로 보실 수 있습니다", "정책 의견을 온라인으로 제출하실 수 있습니다", "  의견은 소관 위원회에 전달되고, 처리 결과를 알려 드립니다", "PC · 휴대폰 어디서나 같은 화면으로 이용하실 수 있습니다"],
              4, N, note="공식 누리집 표시(마스트헤드)와 기관 식별 표시(아이덴티파이어)가 있는 화면만 경기도의회의 공식 서비스입니다.")
    l_two_col(prs, "무엇이 달라지나", "기존 · 개편", "기존", ["시스템마다 다른 화면과 메뉴", "의안 검색에 여러 단계", "휴대폰에서 글자가 작음"], "개편", ["모든 시스템이 같은 디자인(공통 디자인 시스템 v3)", "통합검색 한 번으로 의안 · 회의록 · 의원", "글자 17px · 버튼 48px — 정부 디지털 서비스 기준(KRDS)"], 5, N)
    l_section(prs, 2, "주요 기능", "의안 · 회의 · 도민 참여", 6, N)
    l_image(prs, "의안 검색 화면", "대민 누리집 — 의안 목록", "그림 1. 의안 목록 화면 (예시 데이터)", 7, N, image=os.path.join(DESIGN, "examples", "shots", "screen-public.png"))
    l_table(prs, "제380회 정례회 의안 처리 현황", "단위: 건 · 2026-09-05 기준", ["위원회", "접수", "가결", "계속심사", "처리율"], [["기획재정위원회", "38", "31", "5", "81.6%"], ["경제노동위원회", "29", "24", "4", "82.8%"], ["문화체육관광위원회", "22", "19", "2", "86.4%"], ["보건복지위원회", "34", "28", "6", "82.4%"], ["건설교통위원회", "24", "16", "4", "66.7%"], ["합계", "147", "118", "21", "80.3%"]], 8, N, num_cols=(1, 2, 3, 4), total_row=True)
    l_chart(prs, "월별 의안 접수 · 가결", "2026년 상반기 · 단위: 건", ["1월", "2월", "3월", "4월", "5월", "6월"], [("접수", (24, 31, 28, 35, 30, 27)), ("가결", (19, 26, 25, 30, 26, 24))], 9, N)
    l_kpi(prs, "이용 현황", "2026년 8월 · 대민 누리집", [("월간 방문", "184,200", "명", "▲ 전월 대비 12%", "up"), ("의안 검색", "61,300", "건", "▲ 전월 대비 8%", "up"), ("의견 제출", "1,240", "건", "처리율 96%", "up"), ("방송 시청", "9,800", "회", "본회의 6회", None)], 10, N)
    l_bullets(prs, "앞으로의 계획", "2026년 하반기", ["회의록 전문 검색 고도화 (2026-10)", "의원별 활동 요약 페이지 (2026-11)", "정책 의견 처리 결과 알림 (2026-12)", "  문자 · 이메일로 알려 드립니다", "접근성 인증(KWCAG 2.2) 갱신 (2027-01)"], 11, N)
    l_closing(prs, "감사합니다", ["경기도의회사무처 공간정보화과 · 031-8008-7000", "www.ggc.go.kr · 의정정보시스템"], 12, N)
    prs.save(SAMPLE)

    manifest = {
        "_": "생성물이다. design/ppt/build-ppt.py 가 만든다 — 직접 고치지 말 것.",
        "sha256": sha_sources(),
        "sources": SOURCES,
        "layouts": [{"id": k, "name": v} for k, v in LAYOUTS],
        "font": FONT, "font_fallback": FONT_FALLBACK,
        "aspect": "16:9 (13.333 x 7.5 in)",
    }
    with io.open(MANIFEST, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print("생성  design/ppt/dist/  템플릿(레이아웃 %d) · 샘플 %d장 · %.0f KB"
          % (len(LAYOUTS), N, (os.path.getsize(TEMPLATE) + os.path.getsize(SAMPLE)) / 1024))
    return 0


if __name__ == "__main__":
    sys.exit(check() if "--check" in sys.argv else build())
