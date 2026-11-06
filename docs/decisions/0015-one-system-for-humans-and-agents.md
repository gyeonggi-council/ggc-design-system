# 0015 — 사람과 에이전트가 같은 시스템을 쓴다 (2026-11-06)

0001~0014 는 그대로다. 이 결정은 **저장소가 자신을 설명하고 검사하는 방식**을 바꾼다 — 토큰 · 부품 · 갤러리의 값과 선택자는 한 바이트도 바뀌지 않는다(D1 재복사 불필요).

## 상황

사용자 지시(11-06): "github.com/meta/astryx 이거 참고해서 전면 개편해줘".

Astryx 는 Meta 가 8년 쓰고 공개한 디자인 시스템이다. 150여 부품 · React 19 + StyleX · 테마 7종 · 다크 모드 · CLI · 모노레포(pnpm). 공개 README 가 내세우는 것은 기술이 아니라 **구성 방식**이다 —
"사람과 그 옆에서 일하는 에이전트가 함께 만드는 방식에 맞춰 지었다". 구체적으로:

1. `AGENTS.md` 하나가 도구 무관한 **정본 지시면**이고, 도구별 파일은 그것을 되풀이하지 않는다.
2. CLI(`astryx docs --dense` · `component --list` · `template --list`)가 **에이전트의 부트스트랩**이다. 문서를 맥락에 싣는 밀도 높은 판이 따로 있다.
3. `docs/` 는 **지식 기록**(architecture · families · specs · contributing · templates)이고, 기록마다 `authority: draft | current | archived` 가 있다. current 만 구현과 검토를 지배하고, 현재형으로 쓴다. `specs:for <경로>` 로 어느 기록이 그 경로를 지배하는지 찾는다.
4. 원칙 넷 — 안내가 강제보다 먼저 · 강하고 문서화된 규약 · 사람과 AI 가 한 시스템 · 측정으로 번다. 세 층 — 기반 · 부품 · 패턴.
5. PR 은 **의도 하나**, 의도별 템플릿. 기록 변경에는 쓰기 기준표 결과를 붙인다.
6. `/vibe-test` — AGENTS.md 가 LLM 에게 충분한지 생성 결과로 잰다.

이 저장소는 그 가운데 **2(스킬 안에서만) · 3(결정 기록과 가이드는 있으나 권위 · 지배 범위 · 템플릿은 없음) · 6(없음)** 이 빠져 있었다. 지시면은 `CLAUDE.md`(유지보수) 와 `SKILL.md`(소비) 둘로 갈라져 있었고, 에이전트는 11종 참조 문서를 어느 순서로 읽을지 스스로 정해야 했다.

## 선택지

1. **Astryx 의 기술을 들여온다** — React/StyleX 코어 · npm 패키지 · 테마 · 다크 모드로 다시 짓는다.
   - 이 저장소의 결정 넷과 정면으로 부딪친다: 복사 배포(0004 — 11개 프런트엔드 중 JSP · Jinja2 · 정적 HTML 이 셋, 사설 레지스트리 0건) · 다크 없음(0002 — 토큰 표면 2배) · 단일 CI 색(0001 · 0007 — 공공기관 기관 색은 하나) · 외부 CDN 금지(망분리). 150 부품은 18개 서비스가 쓰는 46종의 세 배이고, 쓰지 않는 부품은 갈라질 자리만 늘린다.
2. **Astryx 의 구성 방식을 들여온다** — 지시면 하나 · CLI · 권위 있는 지식 기록 · 패밀리 · 의도별 PR · 생성 평가. 정본 CSS 는 건드리지 않는다.
3. 하지 않는다 — 지금도 검사기가 갈라짐을 잡는다. 그러나 "무엇을 먼저 읽나"는 사람마다 · 에이전트마다 달랐고, 기록 114개 중 어느 것이 지배하는지는 아무 데도 적혀 있지 않았다.

## 결정 — 2

1. **`AGENTS.md` 가 정본 지시면.** 원칙 넷 · 부트스트랩 다섯 명령 · 두 종류의 일(A 화면 / B 저장소) · 철칙(검사기 ID 와 짝) · 생성물 표 · 흐름 · 쓰는 법 · 지도 · 명령 한 장. `CLAUDE.md` 는 그것을 끌어오고 Claude Code 전용 넉 줄만. 스킬은 §0 에서 CLI 부트스트랩을 가리킨다.
2. **CLI `tools/ggc.py`** — 표준 라이브러리만. `docs <주제> --dense`(토큰 · 프로필은 정본에서 실시간으로 읽는다 — 값 사본이 아니다) · `component` · `template` · `icon` · `specs --for/--diff` · `check` · `upgrade` · `knowledge` · `vibe`.
3. **지식 기록 레지스트리 `docs/records.tsv`** — 기록 139개 전부에 kind · authority(current/draft/archived) · governs(경로 글롭 또는 `class:.ggc-*`) · owner. 제목은 파일에서 읽는다(값은 한 곳에). 검사기 `tools/check-knowledge.py` K1~K6 가 `check-all.sh` 와 CI 에 들어간다.
   새 기록 종류: `architecture/system.md`(세 층 · 경계 · 불변 조건) · `families/`(입력 컨트롤 · 뜨는 층 · 상태 보이기 · 셸 — 형제 부품이 함께 지키는 계약) · `contributing/`(PR · 쓰기 기준표 · 부품 한살이) · `specs/`(draft 만) · `templates/knowledge/`(틀 5종 — 기록 사이에 섞이지 않는다).
4. **화면 틀 레지스트리 `design/templates.tsv`** — 갤러리 실물 14쪽을 틀로 등록(프로필 · 패턴 · 처방 문서 · 절). `template <id>` 가 처방 절을, `--markup` 이 그 쪽의 `<main>` 을 꺼낸다.
5. **PR 의도 다섯**(`.github/PULL_REQUEST_TEMPLATE/` canon · record · gallery · registry · tooling) + 기본 템플릿. 절차는 `docs/contributing/pull-requests.md`.
6. **vibe test `tools/vibe-test/`** — 과제 7종(업무 4 · 대민 2 · 작업대 1), 에이전트에게는 `AGENTS.md` 만 준다. 채점은 같은 검사기(`--gate`) + 기록에 이미 있는 규칙(h1 위치 · 이모지 · 프로필 · 셸 부품). `--self-check` 가 갤러리 7쪽으로 채점기를 검증하고 CI 가 돈다. 생성 단계는 CI 밖(모델 호출 · 비결정).

### 들여오지 않은 것과 이유

| Astryx | 여기 | 이유 |
|---|---|---|
| React 19 + StyleX 코어 · `@astryxdesign/*` npm 패키지 | Tier 1 CSS 복사 + Tier 2 shadcn 레지스트리 그대로 | 0004 · 11개 프런트엔드 · 사설 레지스트리 없음 · 망분리 |
| 테마 7종 · 다크 모드 | 프로필 둘(치수만) · 고대비는 `forced-colors` | 0001 · 0002 · 0003 — 기관 색은 하나, 토큰 표면을 늘리지 않는다 |
| 150+ 부품 · lab · richtext · native · charts | 인벤토리 54행(있음 46) | 쓰지 않는 부품은 갈라질 자리다. 서비스 둘 이상이 각자 만들 때만 올린다(0013) |
| Storybook · Changesets · Crowdin · Husky · pnpm 워크스페이스 | 갤러리(빌드 없음) · CHANGELOG 손 작성 · 한국어 단일 · `check-all.sh` | 설치 없이 열리는 것이 이 저장소의 조건이다 |
| `@starting-style` · `@container` 등 CSS 최신 기능 우선 규칙 | 받지 않음 | 정본 CSS 는 eGovFrame · JSP 의 구형 브라우저 범위까지 본다. 새 기능은 ADR 로 |
| `authority` 를 파일 front matter 에 | `records.tsv` 한 표에 | 기록 139개에 머리말을 넣으면 GitHub 렌더가 표를 얹고, 레지스트리 한 표가 인벤토리(`components.tsv`)와 같은 꼴이라 검사가 쉽다 |

## 결과

- 바뀐 기록: `AGENTS.md`(신설) · `CLAUDE.md`(축약) · `README.md` 개발자용 앞부분(원칙 · 세 층 · 부트스트랩) · `docs/README.md` · `SKILL.md` §0 · 참조 표 · `CHANGELOG` 3.3.0.
- 검사기: `check-all.sh` 에 K1~K6 · vibe 자체 검증 두 단계 추가. 기존 트리는 전부 통과한다(FAIL 0 · WARN 0).
- 소비 서비스: **재복사 없음.** `ggc-tokens.css` · `ggc-components.css` · `ggc-public.css` · `ggc-behaviors.js` 바이트 그대로.
- 되돌리려면: 새 ADR 로. CLI 와 레지스트리를 지우면 스킬 §0 과 `check-all.sh` 두 줄을 되돌린다.
- 다음: 지시면을 크게 고치는 PR 마다 `bash tools/vibe-test/run.sh` 를 한 번 돌려 결과 표를 PR 본문에 붙인다. 점수가 떨어지면 고칠 것은 에이전트가 아니라 지시면이다.
