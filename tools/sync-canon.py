#!/usr/bin/env python3
"""sync-canon.py — 서비스 안 정본 사본(6파일)을 정본으로 다시 맞춘다. 기본은 미리보기(아무것도 바꾸지 않음).

    python tools/sync-canon.py <서비스경로>                         # 미리보기 — 사본마다 판과 처리 방법
    python tools/sync-canon.py <서비스경로> --known <옛 정본 폴더>   # 저장소 밖 옛 판(예: 동결된 v1.2 폴더)도 공식 판으로 인정
    python tools/sync-canon.py <서비스경로> --apply                  # 공식 옛 판인 사본만 정본으로 바꾼다

사본을 셋으로 가른다.
  최신         정본과 바이트가 같다(줄끝 무시)
  공식 옛 판   이 저장소의 git 이력이나 --known 폴더에 있던 바이트 그대로다 → --apply 가 바꾼다
  현지 수정본  어느 공식 판과도 다르다 → 바꾸지 않는다. 차이를 보고 정본으로 올릴지, 지울지 사람이 정한다

--apply 는 바꾸기 전 옛 사본을 --backup 폴더(기본 ~/.cache/ggc-canon-backup/<서비스>/<시각>/)에 둔다.
글꼴 파일(woff2)·브랜드 자산·서비스 자체 CSS 는 건드리지 않는다. 바꾼 뒤에는 화면을 열어 확인하고
python design/check_design.py --gate <서비스경로> 로 D1 을 다시 잰다(서비스 이전 안내: docs/migration/).
"""
import argparse
import datetime
import importlib
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(REPO, "design"))
cd = importlib.import_module("check_design")   # 사본 찾기 · 줄끝 무시 md5 · 판 표기를 검사기와 같은 규칙으로 쓴다


def official_hashes(name, known_dirs):
    """이 파일의 공식 판 md5 집합 — main 이력의 모든 판(작업 브랜치의 중간 판은 공식이 아니다) + --known 폴더의 같은 이름 파일.
    main 이 없는 사본이면 HEAD 이력으로 대신한다."""
    out = set()
    rel = "design/" + name
    revs = []
    for ref in ("main", "HEAD"):
        try:
            revs = subprocess.check_output(["git", "-C", REPO, "log", ref, "--format=%H", "--", rel],
                                           stderr=subprocess.DEVNULL).decode().split()
            break
        except (OSError, subprocess.CalledProcessError):
            continue
    for h in revs:
        try:
            blob = subprocess.check_output(["git", "-C", REPO, "show", f"{h}:{rel}"], stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError:
            continue
        out.add(cd.hashlib.md5(blob.replace(b"\r\n", b"\n")).hexdigest())
    for d in known_dirs:
        h = cd.md5_lf(os.path.join(d, name))
        if h:
            out.add(h)
    return out


def main():
    ap = argparse.ArgumentParser(description="서비스 안 정본 사본을 정본으로 다시 맞춘다(기본은 미리보기).")
    ap.add_argument("service")
    ap.add_argument("--known", action="append", default=[], help="저장소 밖 공식 옛 판 폴더(여러 번 줄 수 있다)")
    ap.add_argument("--apply", action="store_true", help="공식 옛 판인 사본만 정본으로 바꾼다")
    ap.add_argument("--backup", help="옛 사본을 둘 폴더(기본 ~/.cache/ggc-canon-backup/<서비스>/<시각>)")
    a = ap.parse_args()

    root = os.path.abspath(a.service)
    if not os.path.isdir(root):
        sys.exit(f"폴더가 없다: {root}")
    if os.path.exists(os.path.join(root, "design", "check_design.py")):
        sys.exit("정본 저장소다 — 서비스가 아니다. 이 도구는 서비스 폴더에만 쓴다.")
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = os.path.join(os.path.abspath(a.backup), stamp) if a.backup else os.path.join(
        os.path.expanduser("~"), ".cache", "ggc-canon-backup", os.path.basename(root.rstrip(os.sep)), stamp)
    if os.path.commonpath([backup, root]) == root:
        sys.exit("백업 폴더가 서비스 안이다 — 다음 실행이 백업을 사본으로 잡는다. 서비스 밖을 준다.")
    rows = []
    for name in cd.CANON_FILES:
        canon = os.path.join(REPO, "design", name)
        if not os.path.exists(canon):
            continue
        canon_md5, known = cd.md5_lf(canon), None
        for c in cd.find_token_copies(root, name):
            rel = os.path.relpath(c, root)
            if os.path.exists(os.path.join(os.path.dirname(c), "check_design.py")):
                print(f"건너뜀  {rel}  (정본 저장소의 다른 체크아웃 — 서비스 사본이 아니다)")
                continue
            m = cd.md5_lf(c)
            if m == canon_md5:
                kind = "최신"
            else:
                if known is None:
                    known = official_hashes(name, a.known)
                kind = "공식 옛 판" if m in known else "현지 수정본"
            ver = cd.file_version(c)
            rows.append((kind, rel, ver, cd.file_version(canon), c, canon, m))

    if not rows:
        print("정본 사본이 없다(인라인형·독자형) — 이 도구가 할 일이 없다.")
        return 0
    for kind, rel, ver, cv, _, _, _ in rows:
        print(f"{kind:<6}  {rel}  (사본 {ver} · 정본 {cv})")
    by_name = {}
    for _, rel, _, _, c, _, _ in rows:
        by_name.setdefault(os.path.basename(c), set()).add(cd.md5_lf(c))
    mixed = sorted(n for n, hs in by_name.items() if len(hs) > 1)
    if mixed:
        print("! 같은 파일의 사본끼리 서로 다르다: " + ", ".join(mixed) + " — 화면마다 다른 판이 붙는다. 한 묶음으로 맞춘다.")
    local = [r for r in rows if r[0] == "현지 수정본"]
    todo = [r for r in rows if r[0] == "공식 옛 판"]
    if local:
        print(f"! 현지 수정본 {len(local)}개는 바꾸지 않는다 — diff 로 차이를 보고 정본에 올릴지 정한다.")
    if not a.apply:
        print(f"미리보기다. 바꿀 사본 {len(todo)}개 — 바꾸려면 --apply")
        return 0
    if local:
        # 일부만 바꾸면 한 서비스 안에서 판이 섞인다(토큰은 새 판, 컴포넌트는 현지 수정본) — 아무것도 바꾸지 않고 멈춘다
        print("현지 수정본이 있어 아무것도 바꾸지 않았다 — 먼저 그 차이를 정리한 뒤 다시 돌린다.")
        return 2
    for _, rel, _, _, c, canon, seen in todo:
        if cd.md5_lf(c) != seen:   # 분류한 뒤 다른 작업이 고쳤다 — 덮지 않는다
            sys.exit(f"분류한 뒤 바뀌었다 — 바꾸지 않고 멈춘다: {rel}")
        dst = os.path.join(backup, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(c, dst)
        shutil.copyfile(canon, c)
        print(f"바꿈  {rel}  (옛 사본 → {dst})")
    print(f"{len(todo)}개를 바꿨다. 화면을 열어 확인하고 check_design.py --gate 로 다시 잰다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
