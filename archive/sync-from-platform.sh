#!/usr/bin/env bash
# sync-from-platform.sh — 상위 플랫폼 저장소의 정본을 이 공유용 배포판으로 복사하고,
#                          복사하면서 **마스킹을 적용**한다.
#
# **정본은 여기가 아니다.** 서비스 소스와 배포 파이프라인이 플랫폼 저장소에 있어
# 작업이 거기서 일어난다. 여기는 공유용 판이다.
#
# 이 프로젝트는 네트워크 구성도에서 이미 같은 모델을 쓴다 —
# 정본 하나 + 마스킹된 공유용 생성물. 치환 목록도 그쪽 정본을 따른다:
#   ggc-poc-web/webapp/content/redaction-map.json  의 shared 규약
#
#   bash tools/sync-from-platform.sh           복사 + 마스킹
#   bash tools/sync-from-platform.sh --check   갈라졌는지만 (다르면 exit 1)
#
# 플랫폼 저장소 위치는 GGC_PLATFORM 으로 덮어쓸 수 있다.
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${GGC_PLATFORM:-/d/260712_경기도의회_시스템구축}"
CHECK=0
[ "${1:-}" = "--check" ] && CHECK=1

if [ ! -d "$SRC/design" ]; then
  echo "FAIL: 플랫폼 저장소를 찾을 수 없다: $SRC"
  echo "      GGC_PLATFORM 환경변수로 지정할 수 있다."
  exit 2
fi

# ── 마스킹 규약 ──────────────────────────────────────────────────────────────
# 이 저장소는 public 이다. 실주소 치환 규칙을 여기에 적으면 규칙 자체가
# 실주소를 폭로하므로, 규칙은 저장소 밖 파일로 분리한다.
#   1) 환경변수 GGC_REDACTION_SED 가 가리키는 파일
#   2) 없으면 이 스크립트 옆의 tools/redaction.local.sed (.gitignore 대상)
# 파일이 없으면 복사하지 않고 중단한다 — 마스킹 없는 유출 방지(fail closed).
# 실제 규칙 파일은 담당자에게 받는다(형식은 redaction.local.sed.example 참조).
# 값의 정본은 플랫폼 redaction-map.json 의 shared 값과 같고, 인프라 주소 4종에
# 더해 내부 업무시스템 배포 주소·내부망 포트 표기도 가린다.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REDACTION_SED="${GGC_REDACTION_SED:-$SCRIPT_DIR/redaction.local.sed}"
if [ ! -f "$REDACTION_SED" ]; then
  echo "중단: 마스킹 규칙 파일이 없다 ($REDACTION_SED)" >&2
  echo "      담당자에게 받아 tools/redaction.local.sed 로 두고 다시 실행한다." >&2
  exit 3
fi
redact() { sed -f "$REDACTION_SED"; }
# 텍스트만 마스킹한다. 바이너리는 그대로 복사한다.
is_text() { case "$1" in *.md|*.css|*.js|*.py|*.sh|*.tsv|*.txt|*.json|*.html|*.svg) return 0;; *) return 1;; esac; }

# 정본경로|이곳경로
#
# 스킬 폴더는 2026-08-22 에 ggc-design -> 2ggc-design 으로 바뀌었다(호출명이 /2ggc-design).
# 이 표가 그 개명을 못 따라가 2026-08-25 까지 스킬 문서 7개가 "정본에 없음" 으로 조용히
# 빠져 있었고, 저장소의 스킬 문서가 08-22 이전 판에 멈춰 있었다. 폴더명을 바꾸면 여기도 바꾼다.
#
# design/ggc-nav.json 과 design/check_nav.py 는 일부러 빼 놓았다.
# nav.json 은 디자인 산출물이 아니라 공인 IP 가 박힌 런타임 설정이다. 마스킹하면 파일이
# 깨지고, 마스킹하지 않으면 주소가 새어 나간다. 둘 다 안 되므로 이 저장소의 범위 밖이다.
MAP="
design/ggc-tokens.css|design/ggc-tokens.css
design/ggc-components.css|design/ggc-components.css
design/ggc-fonts.css|design/ggc-fonts.css
design/fonts/PretendardGOVVariable.subset.woff2|design/fonts/PretendardGOVVariable.subset.woff2
design/fonts/build-font.py|design/fonts/build-font.py
design/fonts/OFL.txt|design/fonts/OFL.txt
design/check_design.py|design/check_design.py
design/check-design.sh|design/check-design.sh
design/brand/SOURCE.md|design/brand/SOURCE.md
design/brand/ASSET-MAP.tsv|design/brand/ASSET-MAP.tsv
design/brand/build-brand-assets.py|design/brand/build-brand-assets.py
design/brand/assembly-mark.png|design/brand/assembly-mark.png
design/brand/dist/favicon.ico|design/brand/dist/favicon.ico
design/brand/dist/favicon-32.png|design/brand/dist/favicon-32.png
design/brand/dist/apple-touch-icon-180.png|design/brand/dist/apple-touch-icon-180.png
design/brand/dist/assembly-mark.png|design/brand/dist/assembly-mark.png
design/brand/dist/MANIFEST.sha256|design/brand/dist/MANIFEST.sha256
design/examples/README.md|design/examples/README.md
design/examples/index.html|design/examples/index.html
design/examples/tokens.html|design/examples/tokens.html
design/examples/components.html|design/examples/components.html
design/examples/dashboard.html|design/examples/dashboard.html
design/examples/wizard.html|design/examples/wizard.html
design/examples/login.html|design/examples/login.html
design/examples/examples.css|design/examples/examples.css
design/examples/examples.js|design/examples/examples.js
design/examples/build-preview.py|design/examples/build-preview.py
design/examples/preview-palette.svg|design/examples/preview-palette.svg
design/examples/build-standalone.py|design/examples/build-standalone.py
design/examples/examples-standalone.html|design/examples/examples-standalone.html
plugins/ggc-deploy/skills/2ggc-design/SKILL.md|skills/2ggc-design/SKILL.md
plugins/ggc-deploy/skills/2ggc-design/references/contract.md|skills/2ggc-design/references/contract.md
plugins/ggc-deploy/skills/2ggc-design/references/archetypes.md|skills/2ggc-design/references/archetypes.md
plugins/ggc-deploy/skills/2ggc-design/references/domain-language.md|skills/2ggc-design/references/domain-language.md
plugins/ggc-deploy/skills/2ggc-design/references/porting.md|skills/2ggc-design/references/porting.md
plugins/ggc-deploy/skills/2ggc-design/references/brand-assets.md|skills/2ggc-design/references/brand-assets.md
plugins/ggc-deploy/skills/2ggc-design/references/reskin.md|skills/2ggc-design/references/reskin.md
plugins/ggc-deploy/skills/2ggc-design/references/verify.md|skills/2ggc-design/references/verify.md
docs/23-Claude-Design-전시스템-단일디자인-계약.md|docs/23-Claude-Design-전시스템-단일디자인-계약.md
docs/03-공통디자인가이드.md|docs/03-공통디자인가이드.md
"

TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT
same=0; diff_n=0; missing=0
while IFS='|' read -r from to; do
  [ -z "$from" ] && continue
  s="$SRC/$from"; d="$HERE/$to"
  if [ ! -f "$s" ]; then
    printf '  ? %-52s 정본에 없음\n' "$to"; missing=$((missing+1)); continue
  fi
  if is_text "$from"; then redact < "$s" > "$TMP"; else cp "$s" "$TMP"; fi
  if [ -f "$d" ] && cmp -s "$TMP" "$d"; then same=$((same+1)); continue; fi
  diff_n=$((diff_n+1))
  if [ "$CHECK" = 1 ]; then
    printf '  ~ %-52s 갈라져 있다\n' "$to"
  else
    mkdir -p "$(dirname "$d")" && cp "$TMP" "$d" && printf '  + %-52s 갱신\n' "$to"
  fi
done <<< "$MAP"

echo
if [ "$CHECK" = 1 ]; then
  echo "동일 $same · 차이 $diff_n · 정본없음 $missing"
  if [ "$diff_n" -gt 0 ]; then
    echo "→ 이 배포판이 정본보다 낡았다. 'bash tools/sync-from-platform.sh' 로 갱신할 것."
    exit 1
  fi
  echo "→ 정본과 일치한다(마스킹 적용 기준)."
else
  echo "동일 $same · 갱신 $diff_n · 정본없음 $missing"
  echo "→ 커밋해서 배포판을 올릴 것."
fi
