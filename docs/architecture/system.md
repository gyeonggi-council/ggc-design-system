# 시스템 구조 — 출하된 것 · 경계 · 불변 조건

**권위: current.** 이 기록은 지금 출하된 시스템을 현재형으로 적는다. 왜 이렇게 됐는지는 [결정 기록](../decisions/README.md)에, 바꾸는 절차는 [contributing/](../contributing/pull-requests.md)에 있다.

## 세 층

| 층 | 무엇 | 정본 | 소비 방법 |
|---|---|---|---|
| **기반(Foundations)** | 색 · 서체 · 타이포 스케일 · 간격 · 형태 · 포커스 · 셸 치수 · 아이콘 치수 · 두 프로필 | `design/ggc-tokens.css` (값의 유일한 원천) · `design/ggc-fonts.css` + `design/fonts/` · `design/ggc-icons.svg` | 파일을 **바이트 그대로 복사**한다(D1). Tier 2 는 같은 토큰을 `@import` 한다 |
| **부품(Components)** | 버튼 · 표 · 폼 · 셸 · 오버레이 · 상태 부품 … 인벤토리 `design/components.tsv` 의 행 하나가 부품 하나 | Tier 1 `design/ggc-components.css` · `design/ggc-public.css` · `design/ggc-behaviors.js` / Tier 2 `registry/ggc/**` → `public/r/*.json` | Tier 1 은 클래스, Tier 2 는 `npx shadcn add @ggc/<항목>` |
| **패턴(Patterns)** | 화면 틀 — 업무 Archetype 6종 · 대민 패턴 6종 · 서비스 부품(작업대 · 1인 링크) · 덜어내기 · 상태 보이기 | `design/templates.tsv` → 갤러리 `design/examples/` + 처방 문서 | `ggc template <id>` 로 처방을 읽고 갤러리 DOM 에서 마크업을 복사한다 |

층은 위에서 아래로만 의존한다. 패턴은 부품을 조립하고, 부품은 토큰만 참조한다. 부품 CSS 에 리터럴 값이 생기면 D6 가 잡는다.

## 두 착지 방법(Tier)

- **Tier 1 — CSS 복사.** 정적 HTML · Jinja2 · FastAPI · JSP/Tiles · Tailwind 없는 React. 정본 6파일을 복사하고 순서대로 링크한다. 패키지 관리자가 없는 환경이 기준이다(ADR 0004).
- **Tier 2 — shadcn 레지스트리.** React · Next · Vite + Tailwind v4. shadcn 공식 소스에 치수·색만 토큰으로 바꾼 74항목(ADR 0011). npm 배포가 아니라 정적 JSON 이다.

두 Tier 는 **같은 토큰 파일**을 읽는다. 값이 둘이 되는 순간 갈라진다 — D7 이 Tier 2 소비 프로젝트의 매핑이 전부 `var(--ggc-*)` 인지 본다.

## 두 프로필

업무(기본)와 대민(`<html data-ggc-profile="public">`). 프로필은 **치수만** 바꾼다 — 컨트롤 높이 · 글자 크기 · 아이콘 크기(KRDS). 색 · 포커스 · 서체는 프로필이 건드릴 수 없다(ADR 0003 · D6). 판정은 [guides/profiles.md](../guides/profiles.md).

## 경계 — 이 저장소가 하지 않는 것

| 밖에 있는 것 | 어디에 | 왜 |
|---|---|---|
| 브랜드 아이덴티티(CI 원본 색 · 로고 파생 · 열람 사이트) | 별도 저장소 `ggc-design-guide` | 색 결정은 그쪽에서 나고 여기로 내려온다(ADR 0007) |
| 다크 모드 · 두 번째 팔레트 · 셋째 주색 | 없음 | 주색은 잉크(`--ggc-accent`)와 브랜드 남색(`--ggc-primary`) 둘(ADR 0016). 고대비는 `forced-colors` · `prefers-contrast` 로(ADR 0002). 토큰 표면이 2배가 되는 것을 막는다 |
| 외부 CDN(글꼴 · 스크립트 · 아이콘) | 없음 | 망분리 업무망에서 깨진다(D4) |
| 문서 렌더러(한글 · PDF) · 서명 흐름 · 내보내기 | 서비스 | 정본은 틀(`.ggc-viewer` · `.ggc-signature`)까지만(ADR 0013) |
| 서비스 배포 파이프라인 · 상태 파일 | 서비스 | 스킬은 배포를 전제하지 않는다 |
| 시안 도구의 산출물(Claude Design 등) | 파생판 | 값이 갈리면 이 저장소가 이긴다. 역변환해 들여온다 |

## 불변 조건 (검사기가 지킨다)

| # | 불변 조건 | 검사 |
|---|---|---|
| 1 | 값은 `design/ggc-tokens.css` 한 곳에만 산다. 문서 · 갤러리 · 레지스트리는 이름만 적는다 | D2 · D6 · D7 |
| 2 | 서비스 사본은 정본과 바이트 동일이다 | D1 |
| 3 | 토큰 이름은 v1.2 이후 바뀌지 않는다. 늘기만 한다 | D6 · 계약 §3 |
| 4 | 프로필 블록에는 치수만 있다 | D6 |
| 5 | 생성물(`DESIGN.md` · 합본 · 미리보기 · 스프라이트 · `registry.json` · `public/r` · PPT)은 정본보다 낡지 않는다 | D6 gen · CI registry |
| 6 | 인벤토리 ↔ 정본 CSS ↔ 컴포넌트 기록이 어긋나지 않는다 | D6 · K6 |
| 7 | 색 단독 의미 전달 없음 · `:focus-visible` 링 · `forced-colors` 보강 · AA 4.5:1 | D5 · D6 |
| 8 | 아이콘은 lucide 스프라이트 하나. 이모지 · 유니코드 기호 아이콘 없음 | 스킬 완료 목록 · vibe 채점 |
| 9 | 화면의 h1 은 본문 첫 줄 하나. 헤더에는 브레드크럼만 | 계약 §2 · vibe 채점 |
| 10 | 지식 기록은 전부 등록돼 있고, current 기록만 구현을 지배한다 | K1~K5 |

## 사람과 에이전트가 같은 면을 쓴다 (v3.3)

에이전트용 지시는 `AGENTS.md` 하나다. 도구별 파일(`CLAUDE.md` · 스킬)은 그것을 가리키고 보태지 않는다.
문서 · 토큰 · 부품 · 틀 · 검사기는 전부 `python tools/ggc.py` 한 명령에서 꺼낸다. 에이전트가 생성한 화면이 규칙을 지키는지는 `tools/vibe-test/` 가 같은 검사기로 잰다(ADR 0015).

## 한 번에 읽는 지도

```
design/            정본 6파일 · 검사기 check_design.py · 인벤토리 components.tsv · 틀 templates.tsv · 갤러리 examples/ · 아이콘 · 브랜드 · PPT
registry/ggc/      Tier 2 소스(74) → registry.json → public/r/*.json
docs/              지식 기록 (records.tsv 가 레지스트리): contract · architecture · families · guides · components · decisions · contributing · specs · quickstart · migration
skills/ggc-design/ Claude Code 스킬 + references 11종 (화면을 만드는 절차)
tools/             ggc.py(CLI) · check-all.sh · check-knowledge.py · check-links.py · check-registry.py · sync-canon.py · build-* · vibe-test/
```
