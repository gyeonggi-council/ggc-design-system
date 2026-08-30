# 0004 — 패키지가 아니라 복사, Tier 2 도 복사 (2026-08-29)

## 상황
프런트가 7종(Next 14/15/16 · React 18/19 · Vite · JSP/Tiles · Jinja2 · FastAPI · 정적 HTML)이고 npm 워크스페이스·사설 레지스트리가 0건, 망분리다.
React 서비스는 CSS 클래스만으로는 DX 가 나쁘다(타입 · props 없음).

## 결정
- **Tier 1**: CSS 커스텀 프로퍼티 + 클래스 파일을 **복사**한다(최소공배수). 바이트 동일을 D1 이 강제한다.
- **Tier 2**: React 계열은 **shadcn 커스텀 레지스트리**로 같은 것을 복사 설치한다. npm 배포가 아니라 `public/r/*.json` 정적 파일이며,
  테마 항목이 shadcn 변수를 전부 `var(--ggc-*)` 로 매핑해 값의 원천은 그대로 토큰 파일 하나다(D7).
- 공유 React 패키지는 만들지 않는다 — React 18/19 · Next 3세대가 섞여 peer 의존이 지옥이고 절반은 React 가 아니다.

## 근거
"이름은 복제해도 되고 값은 복제하면 안 된다." 복사는 이름과 구현을 함께 옮기지만 값의 정본은 하나다. 레지스트리는 정적 파일이라 망분리에서 내부 정적 서버로 서빙된다
(`file://` 는 CLI 4.19 미지원 실측).

## 결과
`registry.json` · `registry/ggc/` · `public/r/`, `tools/check-registry.py`, `docs/quickstart/react-tier2.md`.
