# JSP / Tiles (eGovFrame) — 5단계

삽입 지점이 **둘**이다 — `defaultLayout.jsp` 와 `loginLayout.jsp`. 둘은 태그 문법이 다르므로(`<%= request.getContextPath() %>` vs
`<c:url>`) **각자 기존 형태를 유지**한다. 벤더 번들(HWP 뷰어 등)은 손대지 않는다.

```bash
# 1. 복사 — 정적 루트는 보통 src/main/webapp/static 또는 resources/static
CANON=<저장소>/design
mkdir -p src/main/webapp/static/fonts
cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" src/main/webapp/static/fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" src/main/webapp/static/
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" src/main/webapp/static/
```

```jsp
<%-- 2·3·4. defaultLayout.jsp (contextPath 형) --%>
<html lang="ko">                                   <%-- 대민(/portal/**)이면 data-ggc-profile="public" --%>
<link rel="stylesheet" href="<%= request.getContextPath() %>/static/fonts/ggc-fonts.css">
<link rel="stylesheet" href="<%= request.getContextPath() %>/static/ggc-tokens.css">
<link rel="stylesheet" href="<%= request.getContextPath() %>/static/ggc-components.css">
<link rel="stylesheet" href="<%= request.getContextPath() %>/static/ggc-public.css">   <%-- 대민만 --%>
<link rel="stylesheet" href="<%= request.getContextPath() %>/static/css/custom.css">
<link rel="icon" type="image/png" sizes="32x32" href="<%= request.getContextPath() %>/static/favicon-32.png?v=1">
<link rel="apple-touch-icon" href="<%= request.getContextPath() %>/static/apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
```

```jsp
<%-- loginLayout.jsp (c:url 형) — 같은 순서, 문법만 유지 --%>
<link rel="stylesheet" href="<c:url value='/static/ggc-tokens.css'/>">
```

```bash
# 5. 검사 — .jsp 도 스캔한다. 벤더 번들 폴더(예: rhwp/)는 SKIP_DIRS 로 제외돼 있다
python <저장소>/design/check_design.py --gate bims-web
```

함정 — 기존 KRDS 번들(`krds.min.css`)을 통째로 쓰는 구조라면 `design/ggc-krds-bridge.css`(Phase 9) 대신 **KRDS 번들 뒤에 토큰을 로드**해
`--krds-*` 를 덮지 말고 자기 CSS 에서 `--ggc-*` 를 쓰는 것이 안전하다. 업무 `/work/**` 와 대민 `/portal/**` 는 레이아웃 파일을 나눈다 —
한 레이아웃에 두 프로필을 섞지 않는다(계약 §9). 기능 JSP 는 건드리지 않고 시각만 수렴한다(계약 §6).
