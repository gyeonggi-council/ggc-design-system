# 스피너 — `.ggc-spinner`

짧은 대기(수 초)를 알린다. 화면 골격을 유지해야 하는 긴 로딩은 스켈레톤(`.ggc-skeleton`)이다.
기존 `.ggc-qr-spinner`(§11)를 일반화했다.

## 마크업

```html
<!-- 단독 -->
<span class="ggc-spinner" role="status"><span class="ggc-sr">불러오는 중</span></span>

<!-- 버튼 안 (버튼은 비활성) -->
<button class="ggc-btn ggc-btn--primary" type="button" disabled>
  <span class="ggc-spinner ggc-spinner--sm" aria-hidden="true"></span> 상신 중
</button>

<!-- 카드·표 자리에 가운데 -->
<div class="ggc-card" aria-busy="true">
  <div class="ggc-spinner-block">
    <span class="ggc-spinner" role="status"><span class="ggc-sr">불러오는 중</span></span>
    <span aria-hidden="true">의안정보 연계 응답 대기 중 — 보통 2초 안에 끝난다</span>
  </div>
</div>
```

## 변형

| 클래스 | 크기 |
|---|---|
| `--sm` | 16px (버튼 안) |
| (기본) | 28px |
| `--lg` | 40px |
| `.ggc-spinner-block` | 컨테이너 — 세로 가운데 + 안내 문구 |

## 규칙

- 단독 스피너에는 `role="status"` + `.ggc-sr` 텍스트. 버튼 안에서는 버튼 글자가 상태를 말하므로 `aria-hidden`.
- 컨테이너에 `aria-busy="true"` 를 두고 끝나면 지운다.
- 2초를 넘길 수 있으면 예상 시간이나 다음 행동을 문구로 준다.
- `prefers-reduced-motion` 에서는 §10 이 애니메이션을 끈다 — 정지한 링으로 보인다. 그래도 텍스트가 있어야 한다.

## 프로필

치수 차이 없음.

## Tier 2

`spinner`.

## 근거

KRDS `spinner.html`(role="status" + sr-only) · 기존 §11.
