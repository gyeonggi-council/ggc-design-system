#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-brand-assets.py — 경기도의회 브랜드 자산(파비콘) 생성기

의존성 0. Python 표준 라이브러리(zlib·struct)만 쓴다.
이 PC 에는 Pillow 도 ImageMagick 도 없고, 망분리 환경이라 설치를 전제할 수 없다.
(`/c/WINDOWS/system32/convert` 는 Windows 디스크 변환 유틸이다 — 절대 실행하지 말 것)

  입력  assembly-mark.png   270x268 RGBA · 경기도의회 의회 마크
  출력  dist/favicon.ico                 16+32+48, BMP 페이로드
        dist/favicon-32.png              32x32 불투명
        dist/apple-touch-icon-180.png    180x180 불투명
        dist/assembly-mark.png           원본 바이트 그대로 (GNB 40x40 용)
        dist/MANIFEST.sha256

배경판은 **네이비 `#3C5D93`** 이다 (2026-08-22 사용자 결정).
마크는 금색 화환 고리 46% + 진홍 메달리언 26% 구성인데, 금색은 흰 배경에서 1.29:1 로
사실상 보이지 않는다. 네이비 판 위에서는 금색이 5.12:1 이라 밝은 탭·어두운 탭 양쪽에서
지배적 형태(고리)가 일관되게 읽힌다. 색은 브랜드 토큰 그대로이며 새 값이 아니다.

**생성 결과물을 정본으로 커밋한다. 게이트는 정본↔사본만 비교하고 이 스크립트를
재실행하지 않는다** — zlib 압축 출력은 파이썬·zlib 버전에 따라 달라질 수 있다.
이 스크립트는 재현·감사용이다.

사용법:  python build-brand-assets.py [--check]
"""
import os
import sys
import zlib
import struct
import hashlib
import argparse

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "assembly-mark.png")
DIST = os.path.join(HERE, "dist")

PLATE = (0x3C, 0x5D, 0x93)   # --ggc-primary 경기도의회 네이비
MARGIN = 0.08                # 판 대비 마크 여백 (원본은 여백이 0이라 직접 준다)


# ------------------------------------------------------------------ PNG 디코드
def decode_png(path):
    """8bit RGBA · non-interlaced 만 받는다. 범용 디코더를 만들지 않는 것이
    이 스크립트의 위험을 없애는 핵심이다 — 그 외는 즉시 거부한다."""
    data = open(path, "rb").read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"PNG 이 아니다: {path}")
    pos, idat = 8, b""
    w = h = bd = ct = il = None
    while pos < len(data):
        ln = struct.unpack(">I", data[pos:pos + 4])[0]
        typ = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + ln]
        if typ == b"IHDR":
            w, h, bd, ct, _cm, _fl, il = struct.unpack(">IIBBBBB", body)
        elif typ == b"IDAT":
            idat += body
        elif typ == b"IEND":
            break
        pos += 12 + ln
    if (bd, ct, il) != (8, 6, 0):
        raise SystemExit(
            f"8bit RGBA non-interlaced 만 지원한다 "
            f"(실제 bitdepth={bd} colortype={ct} interlace={il})")

    raw = zlib.decompress(idat)
    bpp, stride = 4, w * 4
    out = bytearray(w * h * 4)
    prev = bytearray(stride)
    i = 0
    for y in range(h):
        f = raw[i]; i += 1
        line = bytearray(raw[i:i + stride]); i += stride
        if f == 1:
            for x in range(bpp, stride):
                line[x] = (line[x] + line[x - bpp]) & 255
        elif f == 2:
            for x in range(stride):
                line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x - bpp] if x >= bpp else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x - bpp] if x >= bpp else 0
                b = prev[x]
                c = prev[x - bpp] if x >= bpp else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        elif f != 0:
            raise SystemExit(f"알 수 없는 PNG 필터 {f} (행 {y})")
        out[y * stride:(y + 1) * stride] = line
        prev = line
    if len(out) != w * h * 4:
        raise SystemExit("역필터 결과 크기가 맞지 않는다")
    return w, h, out


# ---------------------------------------------------------------- 리샘플·합성
def square_pad(w, h, px):
    """270x268 → 270x270. 투명으로 채워 중앙 정렬한다."""
    n = max(w, h)
    out = bytearray(n * n * 4)
    ox, oy = (n - w) // 2, (n - h) // 2
    for y in range(h):
        s = y * w * 4
        d = ((y + oy) * n + ox) * 4
        out[d:d + w * 4] = px[s:s + w * 4]
    return n, out


def resize_over_plate(n, px, size, plate, margin=MARGIN):
    """알파 프리멀티플라이 면적가중 박스 리샘플 후 배경판 위에 합성.

    프리멀티플라이를 빠뜨리면 투명 픽셀의 검정이 번져 가장자리에 검은 후광이 생긴다.
    270→32 는 8.4:1 비정수배라 면적가중이 필수다.
    """
    inner = max(1, int(round(size * (1 - 2 * margin))))
    off = (size - inner) // 2
    out = bytearray()
    for _ in range(size * size):
        out += bytes(plate) + b"\xff"

    for dy in range(inner):
        y0 = dy * n // inner
        y1 = max(y0 + 1, (dy + 1) * n // inner)
        for dx in range(inner):
            x0 = dx * n // inner
            x1 = max(x0 + 1, (dx + 1) * n // inner)
            ar = ag = ab = aa = 0.0
            cnt = 0
            for yy in range(y0, y1):
                base = yy * n * 4
                for xx in range(x0, x1):
                    o = base + xx * 4
                    a = px[o + 3] / 255.0
                    ar += px[o] * a
                    ag += px[o + 1] * a
                    ab += px[o + 2] * a
                    aa += a
                    cnt += 1
            aa /= cnt
            if aa < 0.004:
                continue
            r = ar / cnt / aa
            g = ag / cnt / aa
            b = ab / cnt / aa
            o = ((dy + off) * size + (dx + off)) * 4
            out[o + 0] = min(255, int(round(r * aa + plate[0] * (1 - aa))))
            out[o + 1] = min(255, int(round(g * aa + plate[1] * (1 - aa))))
            out[o + 2] = min(255, int(round(b * aa + plate[2] * (1 - aa))))
            out[o + 3] = 255
    return out


# ------------------------------------------------------------------ PNG 인코드
def encode_png(size, rgba):
    def chunk(t, b):
        return (struct.pack(">I", len(b)) + t + b
                + struct.pack(">I", zlib.crc32(t + b) & 0xFFFFFFFF))

    raw = b"".join(b"\x00" + bytes(rgba[r * size * 4:(r + 1) * size * 4])
                   for r in range(size))
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


# ------------------------------------------------------------------ ICO (BMP)
def ico_bmp_entry(size, rgba):
    """BITMAPINFOHEADER + BGRA 하향식 + AND 마스크(4바이트 정렬).

    PNG 페이로드가 아니라 BMP 로 쓴다 — Windows 셸(작업표시줄 고정·바로가기)은
    256 미만 PNG 페이로드를 공식 지원하지 않는다. 저장소에 두 전례가 공존하는데
    (hipass=PNG, award=BMP) 브라우저는 둘 다 읽지만 BMP 쪽이 양쪽에서 옳다.
    """
    hdr = struct.pack("<IiiHHIIiiII", 40, size, size * 2, 1, 32, 0,
                      size * size * 4, 0, 0, 0, 0)
    xor = bytearray()
    for y in range(size - 1, -1, -1):            # 하향식
        for x in range(size):
            o = (y * size + x) * 4
            xor += bytes((rgba[o + 2], rgba[o + 1], rgba[o + 0], rgba[o + 3]))
    row = ((size + 31) // 32) * 4                # AND 마스크 4바이트 정렬
    return hdr + bytes(xor) + b"\x00" * (row * size)


def build_ico(images):
    """images: [(size, rgba), ...]"""
    n = len(images)
    offset = 6 + 16 * n
    entries, blobs = b"", b""
    for size, rgba in images:
        blob = ico_bmp_entry(size, rgba)
        entries += struct.pack("<BBBBHHII",
                               0 if size >= 256 else size,
                               0 if size >= 256 else size,
                               0, 0, 1, 32, len(blob), offset)
        blobs += blob
        offset += len(blob)
    return struct.pack("<HHH", 0, 1, n) + entries + blobs


# ---------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="생성하지 않고 dist/ 가 MANIFEST 와 일치하는지만 본다")
    a = ap.parse_args()

    if a.check:
        mf = os.path.join(DIST, "MANIFEST.sha256")
        if not os.path.exists(mf):
            print("MANIFEST.sha256 이 없다"); sys.exit(1)
        bad = 0
        for line in open(mf, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            want, name = line.split(None, 1)
            p = os.path.join(DIST, name.strip())
            got = hashlib.sha256(open(p, "rb").read()).hexdigest() \
                if os.path.exists(p) else "(없음)"
            ok = got == want
            print(f"  {'OK  ' if ok else 'FAIL'} {name.strip():<28} {got[:16]}")
            bad += 0 if ok else 1
        print(f"--- 브랜드 자산 무결성 {'PASS' if not bad else f'FAIL({bad})'}")
        sys.exit(1 if bad else 0)

    if not os.path.exists(SRC):
        raise SystemExit(f"원본 마크가 없다: {SRC}")
    os.makedirs(DIST, exist_ok=True)

    w, h, px = decode_png(SRC)
    print(f"원본 디코드: {w}x{h} RGBA — {len(px):,} 바이트")
    n, sq = square_pad(w, h, px)
    print(f"정사각 패딩: {n}x{n}")

    plate_hex = "#%02X%02X%02X" % PLATE
    print(f"배경판: {plate_hex} · 여백 {MARGIN:.0%}")

    sizes = {}
    for s in (16, 32, 48, 180):
        sizes[s] = resize_over_plate(n, sq, s, PLATE)
        print(f"  {s:3d}x{s:<3d} 리샘플·합성 완료")

    written = []

    def write(name, blob):
        p = os.path.join(DIST, name)
        with open(p, "wb") as f:
            f.write(blob)
        written.append(name)
        print(f"  {name:<28} {len(blob):7,} bytes")

    print("\n생성:")
    write("favicon-32.png", encode_png(32, sizes[32]))
    write("apple-touch-icon-180.png", encode_png(180, sizes[180]))
    write("favicon.ico", build_ico([(16, sizes[16]), (32, sizes[32]),
                                    (48, sizes[48])]))
    write("assembly-mark.png", open(SRC, "rb").read())

    lines = ["# design/brand/dist — 배포 정본. 서비스는 오직 여기서만 복사한다.",
             f"# 배경판 {plate_hex} (--ggc-primary) · 여백 {MARGIN:.0%}"
             f" · 생성 build-brand-assets.py"]
    for name in sorted(written):
        digest = hashlib.sha256(
            open(os.path.join(DIST, name), "rb").read()).hexdigest()
        lines.append(f"{digest}  {name}")
    with open(os.path.join(DIST, "MANIFEST.sha256"), "w",
              encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  {'MANIFEST.sha256':<28} {len(written)}개 항목")


if __name__ == "__main__":
    main()
