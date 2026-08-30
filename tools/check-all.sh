#!/usr/bin/env bash
# check-all.sh — 이 저장소가 스스로를 검사하는 전수 명령. CI 진입점이자 커밋 전 손검사.
#
#   bash tools/check-all.sh          # 전부 (Python 3.10+ 만 필요, node 불필요)
#
# 순서와 이유:
#   1. 정본 자체 (D6)         토큰 AA · 프로필 블록 · 인벤토리 ↔ CSS · 생성물 신선도(갤러리 합본 · DESIGN.md · 레지스트리 산출물)
#   2. 갤러리 (D1~D5)         업무 9쪽 + 대민 4쪽이 정본 규칙을 지키는가 — 정본의 스모크 테스트
#   3. 문서 무결성            깨진 상대 링크 · 절대경로 · 원문 IP 패턴
#   4. Tier 2 레지스트리      registry.json ↔ public/r ↔ 소스 (R1~R5)
# 브라우저 검증(동작 · 오버플로 · 계산 스타일)은 스킬의 Phase 5 가 서비스마다 한다 — 여기서는 돌리지 않는다.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
cd "$ROOT"
PY="${PYTHON:-python}"
fail=0
run() {  # run <이름> <명령...>
  local name="$1"; shift
  echo "━━━ $name"
  if "$@"; then echo "    ✔ $name"; else echo "    ✘ $name"; fail=$((fail+1)); fi
  echo
}

run "정본 자체 (D6, strict)"      "$PY" design/check_design.py --canon --strict
run "갤러리 · 업무 (D1~D5)"       "$PY" design/check_design.py --gate design/examples --aa=observe
run "갤러리 · 대민 (D1~D5)"       "$PY" design/check_design.py --gate design/examples/public --aa=observe --profile public
run "문서 링크 · 금지 문자열"      "$PY" tools/check-links.py
run "Tier 2 레지스트리 (R1~R5)"   "$PY" tools/check-registry.py

if [ "$fail" -eq 0 ]; then echo "check-all: 전부 통과"; else echo "check-all: $fail 항목 실패"; fi
exit "$fail"
