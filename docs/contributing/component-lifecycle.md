# 부품의 한살이 — 제안부터 출하 · 폐기까지

**권위: current.** 부품(컴포넌트) 하나는 인벤토리 행 하나다. 이 순서를 바꾸지 않는다 — 순서가 곧 검사기가 어긋남을 잡는 지점이다.

## 0. 제안 — 정말 새 부품인가

- 서비스 둘 이상이 각자 만들고 있거나(v3.2 의 부품 다섯이 그랬다), 패밀리 계약([families/](../families/README.md))으로 설명할 수 없는 새 역할일 때만.
- 변형(`--xxx`)으로 되는 것은 새 부품이 아니다. 조립으로 되는 것(빈 상태, ADR 0006)도 아니다.
- 크면 `docs/specs/` 에 draft 로 적고 검토를 받는다([spec.md](../templates/knowledge/spec.md)). 작으면 PR 본문으로 충분하다.

## 1. 인벤토리 — `design/components.tsv`

행을 더한다: id · 이름 · Tier 1 클래스 · Tier 2 항목 · 근거(KRDS/shadcn/자체) · 프로필 · 우선순위 · **상태 = 예정** · 단계. CSS 가 생긴 뒤에 「있음」으로 바꾼다.

## 2. 패밀리 — 형제 부품과의 계약

어느 패밀리에 속하는지 정하고([families/](../families/README.md)) 그 계약을 그대로 받는다 — 높이 토큰 · 포커스 · 비활성 표현 · 키보드 · 휴대폰 보정. 패밀리에 없는 새 규칙이 필요하면 **패밀리 기록을 먼저 고친다**(형제도 따라야 하니까).

## 3. Tier 1 — 정본 CSS

- `design/ggc-components.css` 파일 끝에 § 절로 더한다. 기존 선택자는 건드리지 않는다.
- 값은 전부 토큰. 모서리 · 간격 · 글자 크기 · 높이에 리터럴이 있으면 D6 가 잡는다.
- 마크업 · ARIA 는 KRDS 의 같은 부품을 참조한다(없으면 shadcn). §36 고대비(`forced-colors` · `prefers-contrast`) 보강을 같이 쓴다.
- 대민 전용이면 `design/ggc-public.css`. 프로필 치수가 필요하면 토큰 파일의 프로필 블록에 **치수만**.
- 동작이 필요하면 `design/ggc-behaviors.js` — ARIA 상태만 옮기고, 스크립트가 없어도 화면이 깨지지 않게.

## 4. 갤러리 — 실물

`design/examples/components-*.html` 에 데모 절. 값 하드코딩 금지. 마크업 블록은 손으로 적지 않는다 — `ex-reveal` 이 렌더된 DOM 을 읽는다. 상태(빈 · 오류 · 로딩)가 있는 부품은 셋을 다 보여 준다.

## 5. 기록 — `docs/components/<id>.md`

[component.md](../templates/knowledge/component.md) 틀대로: 용도 → 마크업 → 변형 · 상태 → 키보드 · ARIA → 프로필 → 규칙. 마크업은 갤러리와 같다(W4). 그리고

- `docs/records.tsv` 에 행(kind=component · governs=`class:.ggc-<id>`)
- `docs/components/README.md` 색인에 한 줄
- 스킬 `references/components.md` 의 과업 표에 한 줄(어떤 일에 쓰나)

## 6. Tier 2 (React 가 쓸 부품이면)

`registry/ggc/` 에 tsx — **shadcn 공식 소스를 가져와 치수 · 색만 토큰으로**(ADR 0011). `import { cn } from "@/lib/utils"` · `dark:` 제거 · 포커스 링은 `ring-ring/20`. `tools/build-registry-json.py` 의 META 에 제목 · 설명 한 줄 → `python tools/build-registry-json.py` → `npx shadcn@4.19.0 build registry.json -o public/r`.

## 7. 생성물 · 검사 · 기록

```bash
python tools/build-design-md.py                     # DESIGN.md
python design/examples/build-standalone.py          # 합본
python design/examples/build-shots.py               # README 미리보기 (node · playwright · Chrome)
bash tools/check-all.sh                             # D6 · D1~D5 · 링크 · R1~R5 · K1~K6
```

인벤토리 상태를 「있음」으로. CHANGELOG 에 한 줄 — 토큰 바이트가 바뀌었으면 ⚠ D1.

## 8. 바꾸기 · 폐기

- 선택자 이름은 바꾸지 않는다(토큰 이름과 같다 — 소비자 인터페이스). 모양이 바뀌면 같은 이름 안에서, 역할이 바뀌면 새 부품 + 옛 부품 「폐기 예정」.
- 폐기: 인벤토리 상태 「폐기」 · 기록 첫머리에 대체 부품 · 두 판(마이너) 뒤 CSS 에서 제거. 제거는 ⚠ D1 이고 마이그레이션 기록이 따른다.

## 한 눈에

```
제안 → components.tsv(예정) → 패밀리 계약 → Tier 1 CSS(+JS) → 갤러리 → docs/components + records.tsv + 색인 2곳 → (Tier 2) → 생성물 → check-all → 있음 · CHANGELOG
```
