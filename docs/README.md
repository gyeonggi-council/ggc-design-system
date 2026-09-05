# 문서 — 무엇을 하려는가로 찾는다

정본은 `design/`(토큰·컴포넌트·검사기)이고, 이 폴더는 그것을 **쓰는 법**이다. 값은 어디에도 적지 않는다 —
값은 `design/ggc-tokens.css` 한 곳에만 있다.

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

## 업무용인가 대민용인가

[guides/profiles.md](guides/profiles.md) — 판정 질문 3개, 무엇이 같고 무엇이 다른지 한 표. 대민이면 [guides/public-shell.md](guides/public-shell.md).

## 컴포넌트 찾기

[components/README.md](components/README.md) — 한 컴포넌트 한 쪽(용도 · 마크업 · 상태 · 키보드 · 프로필 · 하지 말 것).
마크업은 갤러리 `design/examples/` 의 "마크업" 을 펼쳐 복사한다. 과업에서 찾으려면 `skills/ggc-design/references/components.md`.

## 규칙과 근거

| 문서 | 무엇 |
|---|---|
| [contract.md](contract.md) | **AUTHORITATIVE** 계약 — 셸 치수 · 토큰 · 접근성 · 아키타입 · 프로필 · 완료 정의 |
| [guides/tokens.md](guides/tokens.md) | 토큰 이름 색인과 역할(값 없음) · 확장 규칙 |
| [guides/accessibility.md](guides/accessibility.md) | AA · 색 단독 금지 · 포커스 · 고대비 · 키보드 |
| [guides/fonts.md](guides/fonts.md) | Pretendard GOV 자체 호스팅 |
| [guides/brand-assets.md](guides/brand-assets.md) | 파비콘 · 마크 |
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
python design/check_design.py --gate <서비스경로>   # D1~D5 (+ D7 Tier 2)
python design/check_design.py --canon              # 정본 자체 (D6)
```

검사 항목 설명은 `skills/ggc-design/references/verify.md`. 실패 시 복귀 지점도 거기 있다.
