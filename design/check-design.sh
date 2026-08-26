#!/usr/bin/env bash
# check-design.sh — check_design.py 얇은 래퍼.
# 게이트는 스킬 없이도 돌아야 하므로 정본 옆에 둔다(CI·수동·/1ggc-deploy 공용).
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="$(command -v python3 || command -v python || true)"
if [ -z "$PY" ]; then echo "python 을 찾을 수 없다"; exit 2; fi
exec "$PY" "$HERE/check_design.py" "$@"
