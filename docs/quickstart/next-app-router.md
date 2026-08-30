# Next.js App Router (Tailwind 없음) — 5단계

Tailwind v4 를 쓰면 [react-tier2.md](react-tier2.md). 여기는 CSS 복사(Tier 1)다. **basePath 가 빌드마다 다른 서비스**(같은 소스를
Vercel 은 빈 값, k3s 는 프리픽스로 내는 경우)가 있어 파비콘은 **파일 관례**를 쓴다.

```bash
# 1. 복사
CANON=<저장소>/design
mkdir -p public/fonts app
cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" public/fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" public/
cp "$CANON/brand/dist/favicon-32.png" app/icon.png                 # 4. 파일 관례 — <link> 를 손으로 쓰지 않는다
cp "$CANON/brand/dist/apple-touch-icon-180.png" app/apple-icon.png
```

```css
/* 2. app/globals.css 첫 줄 — @import 는 선두여야 한다 */
@import url("/fonts/ggc-fonts.css");
@import url("/ggc-tokens.css");
@import url("/ggc-components.css");
```

```tsx
// 3. app/layout.tsx — 대민이면 data-ggc-profile="public"
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="ggc-shell">
        {children}
        <script src="/ggc-behaviors.js" defer />
      </body>
    </html>
  )
}
```

```bash
# 5. 검사 — app/icon.png 파일 관례를 D3 가 파비콘 선언으로 인정한다
python <저장소>/design/check_design.py --gate .
```

함정 — **`app/favicon.ico` 를 두지 않는다.** `icon.png` 와 공존하면 페이지마다 `rel="icon"` 이 2개 나온다.
인증 미들웨어가 있으면 `/icon.png` · `/apple-icon.png` 를 **공개 경로에 넣는다** — 빠뜨리면 로그인 화면에 파비콘이 안 뜬다.
`@import url("/…")` 은 basePath 가 있으면 Next 가 붙여 주지 않으므로, basePath 서비스는 `public/` 대신 `app/` 안에서
`import "./ggc-tokens.css"` 로 번들하는 편이 안전하다(그때도 파일은 바이트 동일 사본이어야 한다).
