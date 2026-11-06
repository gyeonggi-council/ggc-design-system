#!/usr/bin/env bash
# run.sh — 과제마다 에이전트(Claude Code CLI)에게 화면을 만들게 하고 grade.py 로 채점한다.
#
#   bash tools/vibe-test/run.sh                  # out 폴더: tools/vibe-test/out/<과제id>/   (gitignore)
#   bash tools/vibe-test/run.sh --only explore-bills
#   bash tools/vibe-test/run.sh --grade-only     # 이미 만든 출력만 채점
#
# 에이전트에게 주는 지시는 AGENTS.md 하나다 — 이 스크립트가 규칙을 더 말하지 않는다. 그래야 AGENTS.md 가 충분한지 잰다.
# claude CLI 가 없으면 생성 단계를 건너뛰고 채점만 한다(다른 에이전트로 out/ 을 채워도 된다).
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="${VIBE_OUT:-$HERE/out}"
PY="${PYTHON:-python}"
only=""; grade_only=0
while [ $# -gt 0 ]; do
  case "$1" in
    --only) only="$2"; shift 2;;
    --grade-only) grade_only=1; shift;;
    *) echo "모르는 옵션 $1"; exit 2;;
  esac
done
mkdir -p "$OUT"

if [ "$grade_only" -eq 0 ]; then
  if ! command -v claude >/dev/null 2>&1; then
    echo "claude CLI 가 없다 — 생성을 건너뛰고 $OUT 을 채점한다"
  else
    "$PY" - "$HERE/prompts.tsv" "$only" <<'PYEOF' | while IFS=$'\t' read -r id prof task; do
import sys
only = sys.argv[2]
for line in open(sys.argv[1], encoding="utf-8"):
    if line.startswith("#") or not line.strip(): continue
    c = line.rstrip("\n").split("\t")
    if only and c[0] != only: continue
    print("\t".join(c[:3]))
PYEOF
      dest="$OUT/$id"; rm -rf "$dest"; mkdir -p "$dest"
      echo "━━━ $id ($prof)"
      prompt="저장소 루트는 $ROOT 이다. 먼저 $ROOT/AGENTS.md 를 읽고 거기 적힌 순서대로 일한다.
과제: $task
결과는 $dest/index.html 하나와, 그 화면이 쓰는 정본 파일 사본(복사 — 옮겨 적지 않는다)을 $dest/ 에 둔다. 외부 요청은 없어야 한다.
끝나면 python $ROOT/design/check_design.py --gate $dest 가 PASS 여야 한다."
      ( cd "$dest" && claude -p "$prompt" --allowedTools "Read,Write,Edit,Bash,Glob,Grep" --max-turns 40 >"$dest/.agent.log" 2>&1 ) \
        && echo "    생성 완료" || echo "    생성 실패 — $dest/.agent.log"
    done
  fi
fi

"$PY" "$HERE/grade.py" "$OUT"
