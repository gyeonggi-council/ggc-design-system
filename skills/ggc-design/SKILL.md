---
name: ggc-design
description: 경기도의회 공통 디자인 시스템을 화면에 적용·검증하는 독립 스킬. "디자인 입혀줘", "화면 만들어줘", "대시보드 짜줘", "대민 사이트 만들어줘", "토큰 적용해줘", "shadcn 으로 붙여줘", "이 서비스만 색이 다르다", "디자인이 제각각이다", "KRDS 맞춰줘", "파비콘 넣어줘" 요청에 사용. 업무/대민 프로필 판정 → 착지 방식(Tier 1 CSS 복사 / Tier 2 shadcn 레지스트리) → 공통 셸 → 화면 패턴(업무 Archetype 6종 / 대민 패턴 6종) → 컴포넌트 → check_design.py 검증 순으로 진행한다. 배포 파이프라인·state.json 을 전제하지 않는다.
---

# 경기도의회 공통 디자인 스킬 (v2.0)

**디자인 드리프트는 되돌리기가 가장 비싼 부채다.** 색은 전 화면·전 스크린샷·전 인수 증적을 함께 바꿔야 한다.
이 조직의 주 색상이 한때 **9종**이었던 것은 "이번만" 이 아홉 번 쌓인 결과다. 이 스킬의 목적은 열 번째를 막는 것이고,
그래서 첫 명령은 문서가 아니라 **검사기**다.

## 0. 저장소를 찾는다 — 모든 경로는 `$ROOT` 기준

이 스킬은 `gyeonggi-council/ggc-design-system` 저장소 안에 산다. 정본(토큰·컴포넌트·검사기·갤러리)은 전부 그 저장소에 있다.

`$ROOT` 를 이 순서로 정한다. 정한 값은 `design-decisions.md` 첫머리에 적어 둔다.

1. 환경변수 `GGC_DS_ROOT` 가 있으면 그것.
2. 없으면 **이 SKILL.md 가 있는 폴더의 두 단계 위** (`skills/ggc-design/SKILL.md` → 저장소 루트). 심볼릭 링크로 설치했어도
   링크 대상이 저장소 안이라 같은 자리다.
3. 그것도 아니면 현재 작업 폴더의 git 루트(`git rev-parse --show-toplevel`)에 `design/ggc-tokens.css` 가 있는지 본다.
4. 어디에도 없으면 clone 부터: `git clone https://github.com/gyeonggi-council/ggc-design-system.git` 후 `GGC_DS_ROOT` 지정.

판정 기준은 하나다 — `$ROOT/design/ggc-tokens.css` 가 있으면 정본이다.

찾았으면 **먼저 갤러리를 브라우저로 연다**: `$ROOT/design/examples/index.html`. 화면을 짜기 전에 무엇이 나오는지 본다.

## 1. 관통 원칙 — 이름은 복제해도 되고, 값은 복제하면 안 된다

- **토큰 이름**(`--ggc-primary`)은 소비자와의 인터페이스 → 문서·코드 어디에 적어도 안전.
- **값**(`#3c5d93`)은 구현 → **`$ROOT/design/ggc-tokens.css` 한 곳에만** 산다. 서비스 CSS · Tailwind 설정 · 문서 어디에도 hex 를 적지 않는다.
- 값을 봐야 하면 그 파일을 연다. 바꿔야 하면 정본을 먼저 고친다.

## 2. 결정 트리

```
요청
├─ ⓪ 프로필  — 로그인 없이 도민이 보는가?  예 → public   아니오 → work        (references/profiles.md)
├─ ① 착지    — React/Next/Vite + Tailwind v4 인가?
│               예 → Tier 2 레지스트리 (references/registry.md)
│               아니오 (JSP · Jinja2 · FastAPI · 정적 HTML · Tailwind 없는 React) → Tier 1 CSS 복사 (references/porting.md)
├─ ② 셸      — work: 유틸리티 바 + GNB/LNB   public: 마스트헤드 + 헤더/주 메뉴 + 공개 푸터 (docs/guides/public-shell.md)
├─ ③ 화면    — work: archetypes.md 6종 중 구성요소로 판정   public: public-patterns.md 6종
├─ ④ 컴포넌트 — references/components.md 색인 → docs/components/<name>.md → 마크업은 갤러리 DOM 에서 복사
└─ ⑤ 검증    — check_design.py --gate  + 스크린샷 + 콘솔 0 + 오버플로 0   (references/verify.md)
```

## 3. Phase 0 — 판정 (추측하지 말고 실측한다)

```bash
python "$ROOT/design/check_design.py" --report <서비스경로>
```

| 형 | 무엇 | 다음 |
|---|---|---|
| ❶ 프런트 없음 | 봇·배치 | "해당 없음" 으로 기록하고 종료 |
| ❷ 사본형 | `ggc-tokens.css` 사본이 있다 | 정본에서 재복사(D1). v1.2 사본이면 `docs/migration/v1.2-to-v2.md` |
| ❸ 인라인형 | 값은 맞는데 파일이 없다 | 파일 도입 — 값 변경 0 이라 위험 최소 |
| ❹ 독자형 | 자체 팔레트 | `references/reskin.md` — 기준선을 먼저 고정 |

함께 기록: 스택 · 프로필 · 셸 유무 · 화면 목록. **리스킨이면 착수 전 기준선(팔레트 + 1440·390 스크린샷)을 남긴다.**

> ⚠ 빌드 산출물(`.next/` `dist/` `node_modules/`)은 스캔하지 않는다 — 검사기가 제외하고, 손으로 볼 때도 같다.

## 4. Phase 1 — 결정 대화 (7문항, 기본값이 명백하면 건너뛴다)

0. **프로필** — work / public. 섞이면 기본 public + 관리자 구역만 `data-ggc-profile="work"` 서브트리. (`references/profiles.md`)
1. **착지** — Tier 1 CSS 복사 / Tier 2 레지스트리.
2. **셸 형태** — work: ⓐ 유틸리티바만(단폭 PoC) / ⓑ 풀셸(GNB 64 + LNB 256) / ⓒ 이관 셸 유지 + 유틸리티바. **화면이 5개를 넘으면 ⓑ.**
   public: 항상 공개 셸 전체(마스트헤드 → 헤더 → 푸터 → 아이덴티파이어).
3. **화면별 패턴** — work 는 Archetype 6종, public 은 패턴 6종 중 하나. **"둘 다" 는 없다.**
4. **AA 모드** — `observe`(기존 미달을 늘리지 않는다) / `enforce`(4.5:1 전량). 정본은 이미 AA 다 — 이 스위치는 서비스 자체 CSS 에 적용.
5. **확폭(≥1680px)** — 채택하면 스크린샷에 1920×1080 추가(계약 §2-1). 기본 미채택.
6. **예외** — 브랜드색을 벗어나야 하는 자리. 있으면 사유와 함께 `/* ggc-design-allow: #hex — 사유 */` 로 등록.

정한 것을 **`<서비스>/docs/design-decisions.md`** 에 적는다(첫 줄 `프로필: work | public`, 이어 착지 · 셸 · 화면별 패턴 · AA · 확폭 · 예외).
이 파일이 다음 작업자의 출발점이다.

> 7문항을 다 정해도 "의회사무처 업무 같지 않다"는 지적은 남을 수 있다. 그 층은 색이 아니라 **어휘와 밀도**다 —
> `references/domain-language.md` 의 판정 목록을 함께 돌리고 결과를 `design-decisions.md` 에 남긴다. 게이트로 만들지 않는다.

## 5. Phase 2 — 착지

**Tier 1 (CSS 복사)** — 손으로 옮겨 적지 않는다. 바이트 동일이어야 D1 이 성립한다.

```bash
CANON="$ROOT/design"
cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2"  <정적루트>/fonts/   # 폰트는 두 파일을 나란히
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js"  <정적루트>/
cp "$CANON/ggc-public.css" <정적루트>/          # public 프로필만
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" <정적루트>/   # references/brand-assets.md
```

```html
<html lang="ko" data-ggc-profile="public">            <!-- public 만. work 는 속성 없음 -->
<link rel="stylesheet" href="fonts/ggc-fonts.css">   <!-- 순서가 곧 우선순위 (D3) -->
<link rel="stylesheet" href="ggc-tokens.css">
<link rel="stylesheet" href="ggc-components.css">
<link rel="stylesheet" href="ggc-public.css">        <!-- public 만 -->
<link rel="stylesheet" href="app.css">               <!-- 자기 스타일은 마지막 -->
<script src="ggc-behaviors.js" defer></script>
```

스택별 삽입 지점(Next basePath · Vite base · Jinja2 · FastAPI 마운트 2형 · JSP/Tiles)은 `references/porting.md`.
Tailwind 서비스는 `@theme { --color-brand: var(--ggc-primary); }` 처럼 **참조**만 한다 — 값을 옮기면 정본이 둘이 된다.

**Tier 2 (레지스트리)** — `references/registry.md`. 요약: `components.json` 의 `registries` 에 `@ggc` → `npx shadcn add @ggc/ggc-style -y`
→ 손으로 셋(토큰 `@import` 첫 줄 · 폰트 복사 · `.dark` 삭제).

## 6. Phase 3 — 공통 셸

- **work**: `.ggc-utility-bar` · `.ggc-badge` · `.ggc-footer` 는 토큰 파일에 들어 있어 복사하면 따라온다. GNB/LNB 풀셸은
  `ggc-components.css` §9. 마크업은 `$ROOT/design/examples/dashboard.html` 에서 복사한다.
- **public**: `docs/guides/public-shell.md` 순서대로 — 마크업은 `$ROOT/design/examples/public/index.html` 에서 복사.
  마스트헤드 문구는 바꾸지 않고, 국가 상징 이미지는 서비스가 정부 자산으로 채운다.
- **로그인 화면을 새로 그리지 않는다** — `.ggc-qr`(§11) 그대로. 절차는 `docs/components/README.md` 의 QR 로그인.
- 예외는 코드 옆에 사유와 함께: `/* ggc-design-allow: #13778e — 표창관리 이관 브랜드. 리스킨 대기 */`. 사유 없는 예외는 불가능하다.

## 7. Phase 4 — 화면 조립

**먼저 갤러리를 연다.** `dashboard.html`(Monitor) · `wizard.html`(Configure) · `public/list.html`(대민 목록) 이 실물이고,
`components*.html` 은 각 예제 아래에 **렌더된 그 DOM** 을 펼쳐 준다. 마크업을 짐작해 짜지 말고 거기서 가져온다.

work 는 `references/archetypes.md` 의 슬롯 순서를, public 은 `references/public-patterns.md` 를 따른다. 규칙 넷:

1. **빈 상태 · 오류 · 로딩 3종을 함께 만든다.** 시연 당일에 드러나는 것이 이것이다. 로딩은 `.ggc-skeleton`/`.ggc-spinner`, 빈 상태는 다음 행동을 말한다.
2. **정본에 없는 것을 정본이라 하지 않는다.** 디자인 원본(.dc.html)에는 반응형·접근성이 없다 — 그것은 계약 §2·§3 이 근거다.
3. **`outline:none` 을 복제하지 않는다.** 토큰의 `:focus-visible` 규칙을 쓴다.
4. **Claude Design 산출물은 그대로 붙이지 않는다** — `style-hover` 등 런타임 속성은 CSS 가 아니다(`references/porting.md` 역변환표).

## 8. Phase 5 — 검증

```bash
python "$ROOT/design/check_design.py" --gate <서비스경로> --aa=observe     # 프로필은 마크업으로 자동 판정, --profile 로 강제
```

증거 3종을 **`<서비스>/docs/design-evidence/`** 에 파일로 남긴다 — ① 검사기 출력 전문 ② 1440×900 · 390×844 스크린샷(확폭이면 1920×1080 추가)
③ 브라우저 콘솔 0건. 가로 오버플로는 눈이 아니라 `references/verify.md` 의 5폭 스크립트로 잰다(기대값 0).
실패 시 복귀 지점은 같은 문서의 표.

## 완료 체크리스트

- [ ] Phase 0 을 **검사기로 실측**했고 ❶~❹ 형을 `design-decisions.md` 에 적었다
- [ ] 프로필(work/public)과 착지(Tier 1/2)를 정했다
- [ ] 리스킨이면 착수 전 기준선(팔레트 + 스크린샷)이 있다
- [ ] 정본 파일을 **복사**했다(손으로 옮겨 적지 않았다) · 폰트 2파일이 나란히 있고 토큰보다 먼저 링크된다
- [ ] 로드 순서: fonts → tokens → components → (public) → 자기 스타일
- [ ] 새 색을 만들지 않았다. 예외는 전부 `ggc-design-allow` 로 등록됐다
- [ ] 셸이 붙었다 (work: 유틸리티바·GNB/LNB·푸터 / public: 마스트헤드·헤더·공개 푸터·아이덴티파이어)
- [ ] 파비콘이 붙었다
- [ ] 화면마다 패턴을 판정했고 슬롯 순서를 따랐다 · 빈 상태·오류·로딩 3종이 있다
- [ ] 로그인 화면이 있다면 `.ggc-qr` 정본 컴포넌트다
- [ ] `outline:none` 을 대체 없이 두지 않았다 · 외부 폰트 CDN 0건
- [ ] `check_design.py --gate` PASS · AA 기준선이 늘지 않았다 · (Tier 2) D7 PASS
- [ ] 스크린샷 2종(또는 3종)과 콘솔 0건 증거가 `docs/design-evidence/` 에 있다
- [ ] 어휘·밀도 판정 목록(`domain-language.md`)을 돌렸고 결과를 적었다

## 참조

| 문서 | 언제 |
|---|---|
| `references/contract.md` | **항상 먼저.** 바꾸면 안 되는 것 · 토큰 이름 색인 · 정본 위치 |
| `references/profiles.md` | Phase 1 ⓪ — 업무/대민 판정 |
| `references/archetypes.md` | Phase 4 (work) — 화면 6종 슬롯 |
| `references/public-patterns.md` | Phase 4 (public) — 화면 6종 슬롯 |
| `references/components.md` | Phase 4 — 컴포넌트 색인(과업 → 클래스 → 문서) |
| `references/domain-language.md` | Phase 1·4 — 어휘·밀도 판정 목록 (업무 · 대민) |
| `references/porting.md` | Phase 2·3 — Tier 1 스택별 착지점 · .dc.html 역변환 |
| `references/registry.md` | Phase 2 — Tier 2 레지스트리 |
| `references/brand-assets.md` | Phase 2 — 파비콘·마크 |
| `references/reskin.md` | ❹ 독자형 — 가동 중 서비스 수렴 절차 |
| `references/verify.md` | Phase 5 — 검사 7종 · 증거 · 오버플로 스크립트 · 복귀 지점 |
| `$ROOT/docs/contract.md` | **AUTHORITATIVE** 계약 — 셸 치수 · archetype · 프로필 · 완료 정의 |
| `$ROOT/design/examples/` | 실물 갤러리 (업무 9쪽 · 대민 4쪽) |
