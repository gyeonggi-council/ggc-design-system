# 스택별 착지점 · DC 원본 역변환 (Tier 1)

## 삽입 지점은 7종이다 (6종이 아니다)

FastAPI + StaticFiles 가 **마운트 지점에 따라 둘로 갈린다** — 이걸 놓치면 href 가 404 난다.
"서비스" 열은 2026-08 시점 플랫폼의 실제 사례다 — 같은 스택이면 같은 자리에 넣는다.

| # | 스택 | 서비스 (사례) | 토큰·CSS 를 어디에 | href 형태 |
|---|---|---|---|---|
| 1 | **Next App Router** | `ggc-poc-web` · `ggc_ai_hr` · `ggc_mobile_login` · `ggc-ai-live-transcribe` | `app/globals.css` 최상단 `@import` 또는 `layout.tsx` import | **파일 관례** (아래) |
| 2 | **Vite + React** | `award_office` | `src/index.css` 최상단 | `/` 기준 (`public/`) |
| 3 | **Jinja2 / Flask** | `ggc_ai_hipass` | `templates/base.html` `<head>` | `url_for('static', filename=…)` |
| 4 | **FastAPI + StaticFiles(`/` 마운트)** | `_template` · `ggc_kb` | `app/static/index.html` `<head>` | **상대** `favicon-32.png` |
| 5 | **FastAPI + StaticFiles(`/static` 마운트)** | `ggc_ai_aide` | 같음 | **상대** `static/favicon-32.png` |
| 6 | **정적 HTML** | `ggc_hermes` | `app/static/index.html` | 기존 CSS 선언 형태에 맞춘다 |
| 7 | **JSP / Tiles (eGovFrame)** | `bill-system` | `layout/*.jsp` | `<%= request.getContextPath() %>` 또는 `<c:url>` |

**로드 순서가 곧 우선순위다.** 토큰이 자기 스타일보다 **먼저** 와야 한다. 검사기 D3 이
역전을 잡는다 — 역전되면 토큰이 조용히 무효화되고 증상은 "왜 색이 안 먹지" 로만 나타난다.

### 1. Next App Router — basePath 함정

**`ggc_ai_hr`(`/hr`)·`ggc-ai-live-transcribe`(`/transcribe`)는 basePath 가 빌드마다 다르다** —
Vercel 빌드는 빈 값, k3s 빌드는 프리픽스가 붙는데 **같은 소스에서 낸다**.
따라서 자산은 **수동 `<link href="/...">` 를 쓰지 않는다.** k3s 에서 404 나고, 고치려면
`process.env.NEXT_PUBLIC_BASE_PATH` 를 href 마다 손으로 꿰어야 한다.

**파일 관례를 쓴다** — `app/icon.png` · `app/apple-icon.png`. Next 가 basePath 를 알아서
붙이고 **href 에 내용 해시까지 자동으로 붙여** 캐시 무효화가 공짜다.

> ⚠ **`app/favicon.ico` 를 두지 않는다.** `app/favicon.ico` 와 `app/icon.png` 가 공존하면
> 페이지마다 `rel="icon"` 이 **2개** 나온다. `ggc-ai-live-transcribe` 가 정확히 그 상태였고
> (페이지 20개 × 2 = 선언 40건), 그중 `public/favicon.ico` 는 **ICO 가 아니라 확장자만 바꾼
> 60KB PNG** 였다. 오리진 루트 `.ico` 는 `ggc-poc-web` 한 곳에만 둔다.

### 2. Vite — `--base` 가 이미 프리픽스를 붙인다

`award_office` 는 `--base=/award/` 로 빌드한다. **Vite 가 `index.html` 의 루트 상대
href 를 자동으로 재작성**하므로, 소스에 `/award` 를 직접 쓰면 `/award/award/...` 가 된다.

```html
<!-- 옳다 — Vite 가 /award/favicon-32.png 으로 만든다 -->
<link rel="icon" href="/favicon-32.png?v=1">
<!-- 틀렸다 — /award/award/favicon-32.png 이 된다 -->
<link rel="icon" href="/award/favicon-32.png?v=1">
```

**CSS 안의 `url()` 은 Vite 가 재작성하지 않는다.** award 는 그래서 `Containerfile` 이
빌드 후 `sed` 로 `url(/fonts/` → `url(/award/fonts/` 를 처리하고, 남은 게 있으면
`! grep -l` 로 빌드를 실패시킨다. **소스의 `url("/fonts/...")` 를 미리 바꾸지 말 것** —
로컬 dev(base 없음)에서 404 가 나고, sed 가 매칭할 대상이 사라진다.

> 2026-08-22 에 이 두 가지를 실제로 잘못 짚었다. `/fonts/...` 가 오리진 루트에서 307 로
> 로그인에 되돌려지는 것을 보고 "폰트가 깨져 있다" 고 판단했는데, **배포본은 이미
> `/award/fonts/` 를 쓰고 200 이었다.** 소스만 보고 판정하지 말고 **배포된 자산을 직접
> 받아 볼 것.**

### 3~6. 세션 게이트를 건드리지 않는다

`_template`·`ggc_kb` 계열의 공개 자산 정규식은 `^/[\w.-]+\.(?:css|js|ico|png|svg|woff2?)$` 다.
`.png`·`.ico`·`.woff2` 는 **이미 허용**돼 있으니 인증 코드에 손대지 않는다.
정적 자산이 401 이 나면 **증상이 원인과 멀다**("QR 이 아예 안 뜬다" 로 나타난다).
그래서 `.webmanifest` 를 자산 세트에서 뺐다 — 그 정규식에 걸리지 않는다.

### Next — 세션 게이트에 아이콘 경로를 열어야 한다

파일 관례가 만드는 `/icon.png`·`/apple-icon.png` 는 **인증 미들웨어의 공개 경로 목록에
들어가야 한다.** 빠뜨리면 307 로 로그인에 되돌려져 **로그인 화면에 파비콘이 뜨지 않는다.**

`ggc-poc-web` 의 `webapp/proxy.ts` 가 정확히 그랬다 — `PUBLIC_PATHS` 에 `/favicon.ico`
만 있고 둘이 없었다(2026-08-22 수정). 아이콘은 공개 브랜드 자산이라 노출에 문제가 없다.

### 7. JSP / Tiles — 삽입 지점이 셋이다

`defaultLayout.jsp` · `loginLayout.jsp` **두 곳 모두** 고쳐야 한다.
둘은 태그 문법이 다르다(`<%= request.getContextPath() %>` vs `<c:url value=''/>`) —
**각자 기존 형태를 유지**한다.

세 번째는 `src/main/webapp/rhwp/`(HWP 뷰어 벤더 번들)인데 **손대지 않는다.**
재빌드하면 덮어써진다. 자체 매니페스트가 아이콘 5개와 `sw.js` 를 404 내고 있고
`theme_color: #2b6cb0` 로 아홉 번째 주 색상을 보태고 있지만, 별건 이슈다.

### Tailwind 서비스 (`award_office` · `ggc-ai-live-transcribe` · `ggc_ai_hr`)

`@theme`/config 에 값을 이식하되 **`--ggc-*` 를 단일 원천으로 두고 Tailwind 가 그것을
참조하게** 한다. `ggc_ai_hr` 이 그렇게 했다:

```css
@theme { --color-brand: var(--ggc-primary); }
```

값을 Tailwind 쪽에 복제하면 정본이 둘이 되고, 검사기 D2 는 통과하지만 **다음 토큰 개정 때
갈라진다.**

---

## `.dc.html` 원본을 실제 코드로 옮길 때의 함정

원본은 Claude Design 캔버스 형식이라 **그대로는 브라우저 CSS 가 아니다.**

| 원본 표기 | 실제로는 | 어떻게 |
|---|---|---|
| `style-hover="background:#f3f5f9;"` | **CSS 가 아니다.** DC 런타임 전용 속성 (8파일 105건) | 손으로 `:hover { }` 규칙을 만든다. 자동 변환 없음 |
| `sc-camel-view-box` | `viewBox` | 번들 export 의 직렬화 아티팩트 |
| `sc-camel-on-click` | `onClick` | 같음 |
| `<sc-raw-td>` `<sc-raw-tr>` `<sc-raw-th>` | `<td>` `<tr>` `<th>` | 같음 |
| `<sc-for list="{{ rows }}" as="r">` | 반복 | 각 스택의 반복 문법으로 |
| `<sc-if value="{{ view_x }}">` | 조건부 렌더 | 라우팅으로 바꾸는 편이 낫다(원본은 SPA 한 파일이라 그랬을 뿐) |
| `hint-placeholder-count="4"` | 디자인용 더미 개수 | 실데이터 개수 범위의 근거로만 쓴다 |
| `{{ navStyle_dashboard }}` | 활성 상태 인라인 스타일 | `.ggc-lnb-item.is-active` 로 |
| `<link href="cdn.jsdelivr.net/…pretendard">` | **망분리 위반** | `Pretendard GOV` 자체 호스팅으로 교체 |

**인라인 `style=` 을 그대로 베끼지 않는다.** 원본은 캔버스 편집기 산출물이라 전부 인라인인데,
그대로 옮기면 토큰을 못 쓰고 hover·focus·반응형을 붙일 자리가 없어진다.
`ggc-components.css` 의 클래스로 흡수하고, 남는 것만 인라인으로 둔다.

## 폰트

**자체 호스팅 `Pretendard GOV`.** 외부 CDN 금지 — 망분리에서 깨진다.
**가져오는 곳은 정본 하나뿐이다** — `$ROOT/design/ggc-fonts.css` + `$ROOT/design/fonts/PretendardGOVVariable.subset.woff2`.
두 파일을 `<정적루트>/fonts/` 에 나란히 두고 토큰보다 먼저 링크한다. 다른 서비스의 `PretendardGOV-*.subset.woff2`(정적 3벌)를
복사하지 않는다 — 800 굵기가 700 과 같게 그려진다.

넣지 않으면 토큰의 폴백 체인(Pretendard → Noto Sans KR → Malgun Gothic → system-ui)이 동작한다 —
PoC 단계에서는 그것으로 충분하다. **CDN 으로 때우지만 않으면 된다.**

> Claude Design 원본은 jsDelivr 의 Pretendard v1.3.9 를 쓴다. 자간이 GOV 판과 미세하게 달라
> 줄바꿈이 어긋날 수 있다. 원본과 픽셀 단위로 같지 않은 것은 의도된 결과다.

## Tier 2 (React · Next · Vite + Tailwind v4)

위 표의 1·2 스택이 Tailwind v4 를 쓰면 CSS 복사 대신 `references/registry.md` 를 따른다 — 토큰 파일은 레지스트리가 복사하고,
컴포넌트는 tsx 로 들어온다. 파비콘·폰트 착지는 이 문서의 규칙이 그대로 적용된다.
