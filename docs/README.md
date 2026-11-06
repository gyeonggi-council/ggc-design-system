# 문서 — 무엇을 하려는가로 찾는다

정본은 `design/`(토큰·컴포넌트·검사기)이고, 이 폴더는 그것을 **쓰는 법**이다. 값은 어디에도 적지 않는다 —
값은 `design/ggc-tokens.css` 한 곳에만 있다.

여기 있는 문서는 전부 **지식 기록**이다(v3.3, ADR 0015). 기록마다 권위(current · draft · archived)와 지배 범위가 [`records.tsv`](records.tsv) 에 있고,
**current 기록만 구현과 검토를 지배한다.** 어떤 파일을 고치기 전에 그것을 지배하는 기록을 찾는다:

```bash
python tools/ggc.py specs --for design/ggc-components.css   # 또는 --diff origin/main
python tools/ggc.py docs records --kind family              # 종류별 목록
python tools/ggc.py docs less --dense                       # 기록을 밀도 높게 (제목 · 목록 · 표만)
```

사람도 에이전트도 같은 명령을 쓴다 — 시작점은 루트의 [`AGENTS.md`](../AGENTS.md).

## 5분 안에 붙이기 — 내 스택은?

| 스택 | 문서 |
|---|---|
| 정적 HTML | [quickstart/static-html.md](quickstart/static-html.md) |
| Jinja2 / Flask | [quickstart/jinja2.md](quickstart/jinja2.md) |
| FastAPI + StaticFiles | [quickstart/fastapi-static.md](quickstart/fastapi-static.md) |
| JSP / Tiles (eGovFrame) | [quickstart/jsp-tiles.md](quickstart/jsp-tiles.md) |
| Vite + React (Tailwind 없음) | [quickstart/vite-react.md](quickstart/vite-react.md) |
| Next.js App Router (Tailwind 없음) | [quickstart/next-app-router.md](quickstart/next-app-router.md) |
| **React · Next · Vite + Tailwind v4** | [quickstart/react-tier2.md](quickstart/react-tier2.md) — shadcn 레지스트리 |

전부 같은 다섯 단계다: **복사 → 링크 순서 → 프로필 속성 → 파비콘 → 검사**.

## 화면에 무엇을 둘지 — 먼저 덜어내기

[guides/less.md](guides/less.md) — 정보는 쓰임이 확인될 때 보인다(v3.1, ADR 0012). 규칙 10개 · 사용자가 실제로 빼라고 한 군더더기 열 가지 · 제목 기본형/간결형 · 판정 목록.
같은 화면의 덜어내기 전/후는 갤러리 `design/examples/less.html`.

## 업무용인가 대민용인가

[guides/profiles.md](guides/profiles.md) — 판정 질문 3개, 무엇이 같고 무엇이 다른지 한 표. 대민이면 [guides/public-shell.md](guides/public-shell.md).

## 컴포넌트 찾기

[components/README.md](components/README.md) — 한 컴포넌트 한 쪽(용도 · 마크업 · 상태 · 키보드 · 프로필 · 하지 말 것).
마크업은 갤러리 `design/examples/` 의 "마크업" 을 펼쳐 복사한다. 과업에서 찾으려면 `skills/ggc-design/references/components.md`.

## 구조 · 패밀리 · 기여

| 문서 | 무엇 |
|---|---|
| [architecture/system.md](architecture/system.md) | **세 층**(기반 · 부품 · 패턴) · 두 Tier · 두 프로필 · 경계(이 저장소가 하지 않는 것) · 불변 조건 10 과 검사기 |
| [families/](families/README.md) | **패밀리** — 형제 부품이 함께 지키는 계약: [입력 컨트롤](families/form-controls.md) · [뜨는 층](families/overlays.md) · [상태 보이기](families/status.md) · [셸](families/shell.md) |
| [contributing/pull-requests.md](contributing/pull-requests.md) | PR 은 의도 하나 — canon · record · gallery · registry · tooling 템플릿과 올리기 전 명령 |
| [contributing/record-writing.md](contributing/record-writing.md) | 기록을 쓰는 법 — 종류 · 권위 · 쓰기 기준표 W1~W9 |
| [contributing/component-lifecycle.md](contributing/component-lifecycle.md) | 부품의 한살이 — 제안 → 인벤토리 → 패밀리 → CSS → 갤러리 → 기록 → Tier 2 → 생성물 → 폐기 |
| [specs/](specs/README.md) | 제안(draft) — 결과가 큰 변경만. 채택되면 ADR + 지배 기록으로 옮긴다 |
| [templates/knowledge/](templates/knowledge/record.md) | 기록 틀 5종 — record · adr · component · family · spec |

## 규칙과 근거

| 문서 | 무엇 |
|---|---|
| [contract.md](contract.md) | **AUTHORITATIVE** 계약 — 셸 치수 · 토큰 · 접근성 · 아키타입 · 프로필 · 완료 정의 |
| [guides/tokens.md](guides/tokens.md) | 토큰 이름 색인과 역할(값 없음) · 확장 규칙 |
| [guides/accessibility.md](guides/accessibility.md) | AA · 색 단독 금지 · 포커스 · 고대비 · 키보드 |
| [guides/fonts.md](guides/fonts.md) | Pretendard GOV 자체 호스팅 |
| [guides/brand-assets.md](guides/brand-assets.md) | 파비콘 · 마크 |
| [guides/less.md](guides/less.md) | **덜어내기** — 필요한 정보부터, 언제 보여 주나 (v3.1) |
| [guides/states.md](guides/states.md) | **상태 보이기** — 기다림 · 저장과 제출 · 폼 오류 · 빈 화면 · 기능 저하 · 알림 위치 · 상태 사전 (v3.2) |
| [guides/layout-shell.md](guides/layout-shell.md) | 업무 셸 (헤더 · 사이드바 · 본문 · 아키타입) |
| [guides/typography.md](guides/typography.md) | 타이포 스케일 — 위계는 크기·굵기로 (v3.0) |
| [guides/icons.md](guides/icons.md) | 아이콘 — lucide 스프라이트, 이모지 금지 (v3.0) |
| [guides/ppt.md](guides/ppt.md) | 대외 발표용 PPT 템플릿 — 토큰에서 생성 (v3.0) |
| [audit/2026-09-05-shadcn-krds-audit.md](audit/2026-09-05-shadcn-krds-audit.md) | v2.0 진단 — shadcn 충실도 · KRDS 범위 · "한눈에 안 들어오는" 원인 |
| [guides/behaviors-js.md](guides/behaviors-js.md) | 탭 · 모달 · drawer · 대민 메뉴 동작 |
| [krds-alignment.md](krds-alignment.md) | KRDS 와 무엇이 같고 무엇이 다른가 |
| [decisions/](decisions/) | 결정 기록(ADR) — 왜 그렇게 정했나 |

## 올리기

- **v2.0 → v3.0**: [migration/v2-to-v3.md](migration/v2-to-v3.md) — 정본 6파일 재복사 · h1 을 본문으로 · 이모지 → 아이콘 · Tier 2 재설치
- v1.2 → v2.0: [migration/v1.2-to-v2.md](migration/v1.2-to-v2.md). 플랫폼 서비스별 실측은 [migration/platform-services-2026-08.md](migration/platform-services-2026-08.md).

## 검사

```bash
python tools/ggc.py check <서비스경로>             # = check_design.py --gate  D1~D5 (+ D7 Tier 2)
python tools/ggc.py check                          # = bash tools/check-all.sh  정본 D6 · 갤러리 · 링크 · R1~R5 · K1~K6 · vibe 자체 검증
python tools/check-knowledge.py                    # 지식 기록 K1~K6 만
```

검사 항목 설명은 `skills/ggc-design/references/verify.md`. 실패 시 복귀 지점도 거기 있다.
