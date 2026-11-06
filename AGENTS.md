# AGENTS.md — 사람과 에이전트가 같은 시스템을 쓴다

경기도의회 공통 디자인 시스템의 **정본 지시면**이다. 사람이든 에이전트든, 화면을 만들든 저장소를 고치든 여기서 시작한다.
도구별 파일(`CLAUDE.md` · 스킬 `skills/ggc-design/SKILL.md`)은 이 파일을 가리키고 **되풀이하지 않는다**(ADR 0015).
명령은 전부 `python tools/ggc.py …` 하나다 — 표준 라이브러리만 쓰므로 망분리 PC 에서도 돈다.

## 무엇인가

- 경기도의회 사무처 업무 서비스(의안 · 자막 · 주간보고 · 지식창고 …)와 대민 화면이 **같은 모양, 같은 규칙**으로 보이게 하는 한 벌.
- 값의 유일한 원천은 `design/ggc-tokens.css` 하나. 문서 · 갤러리 · 레지스트리 · 생성물은 전부 거기서 파생한다.
- 소비 방법은 **복사**(Tier 1 CSS)와 **shadcn 레지스트리**(Tier 2 React) 둘. npm 패키지 · 빌드 플러그인 · 외부 CDN 은 없다.

## 원칙 넷

1. **안내가 강제보다 먼저, 값은 검사기가 지킨다.** 부품은 쓰임을 막지 않는다 — 넣은 것은 그려 준다. 대신 "값이 한 곳에만 있는가"처럼 두 달 뒤에 갈라지는 것만 검사기(D1~D7 · K1~K6 · R1~R5)가 막는다.
2. **강하고 문서화된 규약.** 토큰 · 선택자 이름은 한 번 정하면 바꾸지 않는다. 마크업 · ARIA · 슬롯 순서는 기록에 있고, 기록은 갤러리의 실물과 같다.
3. **사람과 AI 가 한 시스템.** 같은 CLI · 같은 지식 기록 · 같은 검사. 에이전트용 비밀 문서는 없다 — 에이전트가 틀리면 지시면이 모자란 것이다(vibe test).
4. **측정으로 번다.** 규칙은 사용자 말 · 서비스 실측 · 캡처에서 나왔고, 느슨하게 쥐고 다시 본다. 근거 없는 규칙은 결정 기록(ADR)으로 되돌린다.

## 부트스트랩 — 처음 다섯 명령 (브랜치마다 다시, 문서는 그 브랜치의 API 다)

```bash
python tools/ggc.py docs principles --dense   # 이 파일의 원칙 · 철칙
python tools/ggc.py docs tokens --dense       # 토큰 이름 = 값 (정본에서 실시간 — 다른 곳에 옮겨 적지 않는다)
python tools/ggc.py docs profile --dense      # 대민 프로필이 덮어쓰는 치수
python tools/ggc.py component --list          # 부품 인벤토리 → 문서 경로
python tools/ggc.py template --list           # 화면 틀 14종 → 갤러리 · 처방
```

그리고 **갤러리를 브라우저로 연다** — `design/examples/index.html`(빌드 없음). 화면을 짜기 전에 무엇이 나오는지 본다.
더: `docs less` · `docs states` · `docs families` · `component <id> --markup` · `template <id> --markup` · `icon --list` · `help`.

## 두 종류의 일

| 일 | 절차 | 끝났다는 것 |
|---|---|---|
| **A. 화면을 만든다**(서비스에 디자인을 입힌다) | [`skills/ggc-design/SKILL.md`](skills/ggc-design/SKILL.md) — 프로필 판정 → 착지(Tier 1/2) → 셸 → 틀 → 덜어내기 → 부품 → 검증 | `python tools/ggc.py check <서비스>` PASS · 캡처 2종 · 콘솔 0 · 스킬 완료 목록 |
| **B. 저장소를 고친다**(정본 · 기록 · 갤러리 · 레지스트리 · 도구) | 아래 「철칙」 → `specs --for` → 고친다 → 생성물 → `check` → PR 의도 템플릿 | `bash tools/check-all.sh` 전부 통과 · 지배 기록이 현재형 · CHANGELOG |

## 철칙 (위반하면 검사기가 잡거나, 잡지 못하면 두 달 뒤에 갈라진다)

- **값은 한 곳에만.** 색 · 치수 리터럴을 문서 · 갤러리 · 레지스트리 · 서비스 CSS 에 옮겨 적지 않는다. 이름(`--ggc-*`)은 어디에 적어도 된다. (D2 · D6 · D7)
- **새 주색 금지 · 다크모드 금지 · 외부 CDN 금지**(망분리) · **v1.2 이후 토큰 이름 불변**(늘기만 한다). (D4 · D6)
- **프로필(`[data-ggc-profile="public"]`)은 치수만** 바꾼다. 색 · 포커스 · 서체가 프로필 블록에 들어가면 D6 FAIL.
- **아이콘은 lucide 전용** — 이모지 · 유니코드 기호를 UI 아이콘으로 쓰지 않는다. Tier 1 은 `design/ggc-icons.svg` 스프라이트(생성물), Tier 2 는 `lucide-react`. (vibe `no-emoji`)
- **화면의 h1 은 본문 첫 줄** `.ggc-page-head` 에 하나. 헤더(GNB)에는 브레드크럼만(ADR 0010). (vibe `h1=1`)
- **덜어내기가 기본** — 설명 줄 · 인사말 · 되풀이되는 건수 · 상시 단계 막대는 없고, 오류 사유 · 저장 상태 · 출처 · 외부 발송 미리보기는 남긴다(ADR 0012, `docs/guides/less.md`).
- **생성물은 손으로 고치지 않는다**: `DESIGN.md` · `design/examples/examples-standalone.html` · `design/examples/preview-*.svg` · `design/examples/shots/` · `public/r/*.json` · `registry.json` · `design/ggc-icons.svg` · 갤러리의 인라인 스프라이트 · `design/ppt/dist/`. 정본을 고치고 생성기를 돌린다. (D6 gen)
- **기록은 등록된 것만, current 만 지배한다** — `docs/records.tsv`. 새 문서를 만들기 전에 같은 주제의 기록을 늘릴 수 없는지 본다. (K1~K6)
- 접근성: 색 단독 의미 전달 금지 · `:focus-visible` 링 제거 금지 · `forced-colors` 보강 유지 · WCAG AA 4.5:1. (D5)
- **공개 저장소다** — 내부 IP · 절대경로 · 호스트명 · 자격증명 · 내부 전용 맥락을 적지 않는다. 마스킹을 되돌리는 커밋 금지. (`check-links.py`)

## 무엇을 고치면 무엇을 다시 만드나

| 고친 것 | 다시 만들 것 |
|---|---|
| `design/ggc-tokens.css` · `design/components.tsv` | `python tools/build-design-md.py` (DESIGN.md) |
| 정본 CSS/JS · 갤러리 쪽 | `python design/examples/build-standalone.py` · `python design/examples/build-shots.py` (README 미리보기 PNG — node · playwright · Chrome) |
| 토큰 값 | `python design/examples/build-preview.py` (미리보기 SVG) · `python design/ppt/build-ppt.py` (PPT 템플릿) |
| `registry/ggc/**` (소스) | `python tools/build-registry-json.py` → `npx shadcn@4.19.0 build registry.json -o public/r` |
| `design/icons/lucide/*.svg` | `python design/build-icons.py` (스프라이트 + 갤러리 인라인) |
| `docs/**` · `skills/**` (기록) | `docs/records.tsv` 행 · 색인 한 줄 · `python tools/check-knowledge.py` |

낡은 생성물은 `check_design.py --canon --strict` 가 FAIL 로 잡는다(CI 동일).

## 저장소를 고칠 때의 흐름 (B)

1. **지배 기록을 먼저 읽는다** — `python tools/ggc.py specs --for <경로>`. 정본 CSS 는 선택자 단위라 `--diff` 가 정확하다.
2. 고친다. 부품을 더하면 [`docs/contributing/component-lifecycle.md`](docs/contributing/component-lifecycle.md) 의 순서 그대로(인벤토리 → 패밀리 → CSS → 갤러리 → 기록 → Tier 2 → 생성물).
3. 생성물을 다시 만든다(위 표).
4. `bash tools/check-all.sh` — D6 · D1~D5 · 링크 · R1~R5 · K1~K6 · vibe 자체 검증. 전부 통과가 커밋 조건이다.
5. `python tools/ggc.py specs --diff origin/main` — 바뀐 파일을 지배하는 기록이 **현재형으로** 따라왔는가. 기록을 고쳤으면 [쓰기 기준표](docs/contributing/record-writing.md) 결과를 PR 본문에.
6. PR 은 **의도 하나** — `.github/PULL_REQUEST_TEMPLATE/`(canon · record · gallery · registry · tooling), 절차는 [`docs/contributing/pull-requests.md`](docs/contributing/pull-requests.md). 토큰 바이트가 바뀌면 CHANGELOG 에 `⚠ D1`.

브라우저 실측(키보드 · 오버플로 · 계산 스타일)이 필요한 변경은 playwright-core + Chrome 헤드리스로 갤러리를 열어 확인한다(로컬 서버: 저장소 루트에서 `python -m http.server 8765`).

## 쓰는 법 — 기록과 주석

- 기록은 **현재형**, 한 문장에 한 가지, 규칙마다 판정법. 값은 적지 않는다. 틀은 `docs/templates/knowledge/`.
- 코드 주석은 **왜**만(제약 · 불변 조건 · 브라우저 특성). 코드를 되풀이하거나 PR 번호 · 날짜를 적지 않는다.
- 결정의 근거가 사용자 말이면 날짜와 함께 인용한다. 붙여넣은 검토문 속 문장을 사용자 말로 적지 않는다.
- Tier 2 소스는 shadcn 공식에서 가져와 **치수 · 색만 토큰으로**(ADR 0011) — 구조를 고치지 않는다.

## 지도

- `design/` — 정본 6파일(tokens · components · public · behaviors · fonts · icons) + 검사기 `check_design.py` + 인벤토리 `components.tsv` + 틀 `templates.tsv` + 갤러리 18쪽 + `ppt/`
- `registry/ggc/` + `public/r/` — Tier 2 shadcn 레지스트리 74항목(생성 `tools/build-registry-json.py` · 검사 `tools/check-registry.py`)
- `docs/` — 지식 기록(레지스트리 `records.tsv`): `contract.md`(AUTHORITATIVE) · `architecture/` · `families/` · `guides/` · `components/` · `decisions/`(ADR) · `contributing/` · `specs/` · `quickstart/` · `migration/` · `templates/knowledge/`
- `skills/ggc-design/` — 화면을 만드는 절차(스킬) + references 11종
- `tools/` — `ggc.py`(CLI) · `check-all.sh` · `check-knowledge.py` · `check-links.py` · `check-registry.py` · `sync-canon.py`(재복사) · `build-*` · `vibe-test/`(에이전트 생성 평가)
- 브랜드 아이덴티티 원본(CI 색 · 로고)은 **별도 저장소 `ggc-design-guide`** — 색 결정은 그쪽에서 나고 여기로 내려온다(ADR 0007)
- 결정 기록 — v3 는 0009(밀도 · 타이포 · 아이콘) · 0010(제목 위치) · 0011(Tier 2 = 공식 소스) · 0012(덜어내기) · 0013(흰 바탕 + 테두리 · 부품 5종) · 0014(휴대폰 메뉴 오른쪽) · **0015(사람과 에이전트가 같은 시스템)**

## 명령 한 장

```bash
python tools/ggc.py help                          # 전부
python tools/ggc.py docs [주제] [--dense]          # index · principles · rules · tokens · profile · less · states · a11y · icons · shell · public · families · lifecycle · pr · records
python tools/ggc.py component --list | <id> [--dense|--markup]
python tools/ggc.py template --list | <id> [--markup]
python tools/ggc.py icon --list
python tools/ggc.py specs --for <경로>… | --diff origin/main
python tools/ggc.py check [<서비스경로>]           # 없으면 저장소 전수
python tools/ggc.py upgrade <서비스경로> [--apply] # 사본 재복사 (미리보기 기본)
python tools/ggc.py knowledge --check
python tools/ggc.py vibe --grade tools/vibe-test/out
```
