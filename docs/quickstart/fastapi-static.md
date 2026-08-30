# FastAPI + StaticFiles — 5단계

**마운트 지점에 따라 둘로 갈린다** — 이걸 놓치면 href 가 404 난다.

| 마운트 | `app.mount(…)` | href 형태 |
|---|---|---|
| A. 루트 | `app.mount("/", StaticFiles(directory="app/static", html=True))` | **상대** `ggc-tokens.css` · `favicon-32.png` |
| B. `/static` | `app.mount("/static", StaticFiles(directory="app/static"))` | **상대** `static/ggc-tokens.css` · `static/favicon-32.png` |

```bash
# 1. 복사
CANON=<저장소>/design
mkdir -p app/static/fonts && cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" app/static/fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" app/static/
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" app/static/
```

```html
<!-- 2·3·4. app/static/index.html — A 형 기준. B 형은 href 앞에 static/ -->
<html lang="ko">                                   <!-- 대민이면 data-ggc-profile="public" -->
<link rel="stylesheet" href="fonts/ggc-fonts.css">
<link rel="stylesheet" href="ggc-tokens.css">
<link rel="stylesheet" href="ggc-components.css">
<link rel="stylesheet" href="app.css">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png?v=1">
<link rel="apple-touch-icon" href="apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
```

```bash
# 5. 검사
python <저장소>/design/check_design.py --gate .
```

함정 — **세션 게이트를 건드리지 않는다.** 공개 자산 정규식(`^/[\w.-]+\.(?:css|js|ico|png|svg|woff2?)$`)이 이미 css·js·png·woff2 를
허용한다. `.webmanifest` 는 그 정규식에 걸리지 않아 401 이 난다 — 자산 세트에서 뺀 이유다. 정적 자산이 401 이면
증상은 "QR 이 아예 안 뜬다" 로 나타난다.
