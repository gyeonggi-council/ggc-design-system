# 정적 HTML — 5단계

빌드도 서버도 없는 가장 단순한 경우. 다른 스택도 결국 이것과 같다 — 파일이 어디에 놓이고 `href` 가 어떻게 생기는지만 다르다.

```bash
# 1. 복사 — 손으로 옮겨 적지 않는다 (바이트 동일이어야 D1)
CANON=<저장소>/design
mkdir -p fonts && cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" .
cp "$CANON/ggc-public.css" .                       # 대민 화면만
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" .
```

```html
<!-- 2. 링크 순서 — 순서가 곧 우선순위. 폰트 → 토큰 → 컴포넌트 → (대민) → 자기 스타일 -->
<!doctype html>
<html lang="ko">                                   <!-- 3. 대민이면 <html lang="ko" data-ggc-profile="public"> -->
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="fonts/ggc-fonts.css">
<link rel="stylesheet" href="ggc-tokens.css">
<link rel="stylesheet" href="ggc-components.css">
<!-- <link rel="stylesheet" href="ggc-public.css"> -->
<link rel="stylesheet" href="app.css">
<!-- 4. 파비콘 -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png?v=1">
<link rel="apple-touch-icon" href="apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
</head>
<body class="ggc-shell">  …셸 마크업은 design/examples/dashboard.html 에서 복사…
<script src="ggc-behaviors.js" defer></script>
```

```bash
# 5. 검사
python <저장소>/design/check_design.py --gate .
```

함정 — `app.css` 에 hex 를 적지 않는다(`var(--ggc-*)`). 갤러리에서 복사할 때 `ex-*` 클래스(갤러리 설명 장치)는 가져오지 않는다.
실물 예: `design/examples/login.html` 을 이 절차로 옮긴 것이 [스킬의 실증 샘플](../../skills/ggc-design/SKILL.md)이다.
