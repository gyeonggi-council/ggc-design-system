# 0005 — Tier 2 는 Radix + Tailwind v4, 다크 없음, React 18/19 겸용 (2026-08-29)

## 결정
- 프리미티브는 **Radix**(shadcn v4 의 `radix-ui` 통합 패키지). Base UI 변형은 두 번째 스타일 디렉터리로 나중에 추가할 수 있지만 둘을 동시에 유지하지 않는다.
- **Tailwind v4** 기준(`@theme inline`, `bg-(--var)` 문법). v3 는 `bg-[var(--x)]` 로 바꾸거나 Tier 1 을 쓴다.
- `cssVars.dark` 를 만들지 않는다. 프리셋이 만든 `.dark` 블록은 지운다(D7 WARN).
- 컴포넌트는 shadcn v4 관례의 함수 컴포넌트(`data-slot`) — React 18 에서도 동작한다. `forwardRef` 를 되살리지 않는다.
- 치수는 Tailwind 스케일이 아니라 토큰(`h-(--ggc-control-h)`)을 쓴다 — 그래야 대민 프로필이 Tier 2 에도 먹는다.

## 근거
Radix 는 React 18 호환과 성숙도, shadcn 이 4.x 에서 여전히 기본. 다크는 계약 §3 비범위. 토큰 치수는 Tier 1 과 픽셀 단위로 같은 렌더를 보장한다(소비자 실증 27/27).

## 결과
`registry/ggc/ui/*.tsx`, `docs/quickstart/react-tier2.md`.
