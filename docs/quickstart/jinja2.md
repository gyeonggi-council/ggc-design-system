# Jinja2 / Flask — 5단계

정적 자산은 `static/`, 링크는 `url_for('static', filename=…)`. 삽입 지점은 `templates/base.html` 의 `<head>` 하나다.

```bash
# 1. 복사
CANON=<저장소>/design
mkdir -p static/fonts && cp "$CANON/ggc-fonts.css" "$CANON/fonts/PretendardGOVVariable.subset.woff2" static/fonts/
cp "$CANON/ggc-tokens.css" "$CANON/ggc-components.css" "$CANON/ggc-behaviors.js" static/
cp "$CANON/brand/dist/favicon-32.png" "$CANON/brand/dist/apple-touch-icon-180.png" static/
```

```html
{# 2. base.html — 순서: 폰트 → 토큰 → 컴포넌트 → 자기 스타일 #}
<html lang="ko"{% if public %} data-ggc-profile="public"{% endif %}>   {# 3. 프로필 #}
<link rel="stylesheet" href="{{ url_for('static', filename='fonts/ggc-fonts.css') }}">
<link rel="stylesheet" href="{{ url_for('static', filename='ggc-tokens.css') }}">
<link rel="stylesheet" href="{{ url_for('static', filename='ggc-components.css') }}">
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
{# 4. 파비콘 #}
<link rel="icon" type="image/png" sizes="32x32" href="{{ url_for('static', filename='favicon-32.png') }}?v=1">
<link rel="apple-touch-icon" href="{{ url_for('static', filename='apple-touch-icon-180.png') }}?v=1">
<meta name="theme-color" content="#3C5D93">
…
<script src="{{ url_for('static', filename='ggc-behaviors.js') }}" defer></script>
```

```bash
# 5. 검사 — 템플릿(.html)과 static/ 을 함께 스캔한다
python <저장소>/design/check_design.py --gate .
```

함정 — `style.css` 가 모바일 우선 자체 스타일이면 **주조색만** `var(--ggc-primary)` 로 바꾸고 나머지는 두어도 된다(❸ 인라인형 절차).
유틸리티 바·푸터 마크업은 `base.html` 에 한 번만 넣는다 — 페이지마다 복제하면 갈라진다.
