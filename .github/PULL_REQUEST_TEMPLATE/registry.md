## 의도 — Tier 2 레지스트리 (`registry/ggc/**` · `registry.json` · `public/r`)

<!-- 어느 항목을 왜. shadcn 공식의 어느 판을 가져왔나 -->

## 지키는 것 (ADR 0011)

- [ ] shadcn 공식 소스 기준 diff 가 **치수 · 색(토큰)뿐**이다 — 구조 · 동작을 바꾸지 않았다
- [ ] `import { cn } from "@/lib/utils"` · `dark:` 0 · 포커스 링 `ring-ring/20`
- [ ] 색은 전부 `var(--ggc-*)` — hex 0 (D7)
- [ ] `tools/build-registry-json.py` META 에 제목 · 설명 한 줄

## 빌드

- [ ] `python tools/build-registry-json.py` → `npx shadcn@4.19.0 build registry.json -o public/r`
- [ ] `python tools/check-registry.py` R1~R5 FAIL 0

## 검사 · 증거

- [ ] `bash tools/check-all.sh` 마지막 줄:
- [ ] 소비 프로젝트에서 `npx shadcn add @ggc/<항목>` 으로 설치해 1440 캡처(`docs/design-evidence/` 사례처럼)
