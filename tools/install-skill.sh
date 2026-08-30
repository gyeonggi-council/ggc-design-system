#!/usr/bin/env bash
# install-skill.sh — 이 저장소의 디자인 스킬을 Claude Code 가 찾는 자리에 **링크**한다 (복사하지 않는다 — 복사는 드리프트다).
#
#   bash tools/install-skill.sh            # 사용자 전역: ~/.claude/skills/ggc-design → 이 저장소의 skills/ggc-design
#   bash tools/install-skill.sh <프로젝트>  # 프로젝트 전용: <프로젝트>/.claude/skills/ggc-design
#   bash tools/install-skill.sh --unlink [<프로젝트>]
#
# 링크 뒤 Claude Code 에서 /ggc-design 으로 부른다. 스킬은 GGC_DS_ROOT 환경변수가 있으면 그것을,
# 없으면 링크 대상(이 저장소)을 정본 루트로 쓴다 — 심볼릭 링크라 SKILL.md 의 ../.. 가 저장소를 가리킨다.
# Windows 는 개발자 모드 또는 관리자 권한에서 심볼릭 링크가 만들어진다. 안 되면 정션(junction)으로 대신한다.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
SRC="$ROOT/skills/ggc-design"

mode="link"
if [ "${1:-}" = "--unlink" ]; then mode="unlink"; shift; fi
if [ -n "${1:-}" ]; then DEST_DIR="$1/.claude/skills"; else DEST_DIR="$HOME/.claude/skills"; fi
DEST="$DEST_DIR/ggc-design"

if [ "$mode" = "unlink" ]; then
  if [ -L "$DEST" ] || [ -d "$DEST" ]; then rm -rf "$DEST"; echo "해제: $DEST"; else echo "없음: $DEST"; fi
  exit 0
fi

[ -f "$SRC/SKILL.md" ] || { echo "스킬을 찾을 수 없다: $SRC"; exit 1; }
mkdir -p "$DEST_DIR"
if [ -e "$DEST" ]; then echo "이미 있다: $DEST (다시 걸려면 --unlink 먼저)"; exit 1; fi

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    win_src="$(cygpath -w "$SRC")"; win_dest="$(cygpath -w "$DEST")"
    if cmd //c "mklink /D \"$win_dest\" \"$win_src\"" >/dev/null 2>&1; then echo "심볼릭 링크: $DEST → $SRC"
    elif cmd //c "mklink /J \"$win_dest\" \"$win_src\"" >/dev/null 2>&1; then echo "정션: $DEST → $SRC"
    else echo "링크 실패 — 개발자 모드를 켜거나 관리자 셸에서 실행"; exit 1; fi ;;
  *)
    ln -s "$SRC" "$DEST"; echo "심볼릭 링크: $DEST → $SRC" ;;
esac

echo "확인: GGC_DS_ROOT=$ROOT  (환경변수로 두면 어디서 불러도 같은 정본을 본다)"
