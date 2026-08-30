# Vite + React (Tailwind 없음) — 5단계

Tailwind v4 를 쓰면 이 문서 대신 [react-tier2.md](react-tier2.md). 여기는 **CSS 복사(Tier 1)** 로 React 에 붙이는 경우다 —
JSX 에서 `.ggc-*` 클래스를 그대로 쓴다.

```bash
# 1. 복사 — public/ 은 Vite 가 루트로 서빙한다
CANON=<저장소>/design
mkdir -p public/fonts && cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" public/fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" public/
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" public/
```

```html
<!-- 2·3·4. index.html — 루트 상대 href. Vite 가 --base 프리픽스를 자동으로 붙인다 -->
<html lang="ko">
<link rel="stylesheet" href="/fonts/ggc-fonts.css">
<link rel="stylesheet" href="/ggc-tokens.css">
<link rel="stylesheet" href="/ggc-components.css">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=1">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
<script src="/ggc-behaviors.js" defer></script>
```

`src/index.css` 는 그 뒤에 온다(Vite 가 `<head>` 끝에 주입). 자기 스타일에서 `var(--ggc-*)` 만 쓴다.
동적으로 넣은 탭·모달은 `window.GGC.init(루트요소)` 로 다시 묶는다.

```bash
# 5. 검사
python <저장소>/design/check_design.py --gate .
```

함정 — **`--base=/award/` 로 빌드하면 소스에 `/award` 를 쓰지 않는다.** Vite 가 `index.html` 의 루트 상대 href 를 재작성하므로
직접 쓰면 `/award/award/…` 가 된다. 반대로 **CSS 안의 `url()` 은 재작성하지 않는다** — `ggc-fonts.css` 의 `url(…woff2)` 는
상대경로라 같은 폴더에 두면 문제가 없다. 소스만 보고 판정하지 말고 **배포된 자산을 직접 받아 본다.**
