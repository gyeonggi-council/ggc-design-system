# CLAUDE.md — 이 저장소에서 작업할 때

경기도의회 공통 디자인 시스템의 **정본** 저장소다. 값의 유일한 원천은 `design/ggc-tokens.css` 하나이고,
문서·갤러리·DESIGN.md·Tier 2 레지스트리는 전부 여기서 파생한다. 화면을 만드는 방법은
`skills/ggc-design/SKILL.md`(스킬)에 있다 — 이 파일은 **저장소 자체를 고칠 때**의 규칙이다.

## 철칙 (위반하면 검사기가 잡거나, 잡지 못하면 두 달 뒤에 갈라진다)

- **값은 한 곳에만.** 색·치수 리터럴을 문서·갤러리·레지스트리에 옮겨 적지 않는다. 이름(`--ggc-*`)은 어디에 적어도 된다.
- **새 주색 금지 · 다크모드 금지 · 외부 CDN 금지**(망분리) · v1.2 이후 토큰 이름 불변.
- **프로필(`[data-ggc-profile="public"]`)은 치수 14종만** 바꾼다. 색·포커스·서체가 프로필 블록에 들어가면 D6 FAIL.
- **생성물은 손으로 고치지 않는다**: `DESIGN.md` · `design/examples/examples-standalone.html` ·
  `design/examples/preview-*.svg` · `public/r/*.json`. 정본을 고치고 생성기를 돌린다.
- 접근성: 색 단독 의미 전달 금지, `:focus-visible` 링 제거 금지, `forced-colors` 보강 유지, WCAG AA 4.5:1.
- **마스킹을 되돌리는 커밋 금지**(공개 저장소) — 원문 IP·절대경로(`D:\`)는 `tools/check-links.py` 가 잡는다.

## 무엇을 고치면 무엇을 다시 만드나

| 고친 것 | 다시 만들 것 |
|---|---|
| `design/ggc-tokens.css` · `design/components.tsv` | `python tools/build-design-md.py` (DESIGN.md) |
| 정본 CSS/JS · 갤러리 쪽 | `python design/examples/build-standalone.py` |
| 토큰 값 | `python design/examples/build-preview.py` (미리보기 SVG) |
| `registry.json` · `registry/ggc/**` | `npx shadcn@4.19.0 build registry.json -o public/r` |

낡은 생성물은 `check_design.py --canon --strict` 가 FAIL 로 잡는다(CI 동일).

## 커밋 전 (CI 가 도는 것과 같다)

```bash
bash tools/check-all.sh     # 정본 D6(strict) · 갤러리 업무/대민 D1~D5 · 문서 링크 · 레지스트리 R1~R5
```

브라우저 실측(키보드·오버플로·계산 스타일)이 필요한 변경은 playwright-core + Chrome 헤드리스로
갤러리를 열어 확인한다(로컬 서버: 저장소 루트에서 `python -m http.server 8765`).

## 컴포넌트를 추가할 때 (순서 고정)

1. `design/components.tsv` 에 행 추가(예정 → 있음은 CSS 가 생긴 뒤에)
2. 정본 CSS 에 § 절 추가 — 값은 전부 토큰, 마크업·ARIA 는 KRDS 참조, §36 고대비 보강 포함
3. 동작이 필요하면 `design/ggc-behaviors.js` — ARIA 상태만 옮기고, 없어도 화면이 깨지지 않게
4. 갤러리 데모 절(`design/examples/components-*.html`) — 값 하드코딩 금지, 마크업은 `ex-reveal` 이 DOM 에서 읽는다
5. `docs/components/<name>.md`(용도 → 마크업 → 변형 → 키보드·ARIA → 프로필 → 규칙) + README 색인 + 스킬 `references/components.md`
6. Tier 2 가 필요하면 `registry/ggc/` 에 tsx(색 리터럴 금지 — hex 대신 토큰·별칭) + `registry.json` + 재빌드
7. 생성물 재생성 → `bash tools/check-all.sh` → CHANGELOG(토큰 바이트가 바뀌면 `⚠ D1` 표시)

## 지도

- `design/` — 정본 5파일(tokens·components·public·behaviors·fonts) + 검사기 `check_design.py` + 갤러리 13쪽
- `registry/ggc/` + `public/r/` — Tier 2 shadcn 레지스트리 47항목 (검사 `tools/check-registry.py`)
- `docs/` — contract(AUTHORITATIVE) · quickstart 7종 · guides · components 40종 · decisions(ADR) · migration
- `skills/ggc-design/` — Claude Code 스킬 + references 11종
- 브랜드 아이덴티티 원본은 **별도 저장소 `ggc-design-guide`** — 색 결정은 그쪽에서 나고 여기로 내려온다
