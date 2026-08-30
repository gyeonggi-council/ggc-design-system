# QR 로그인 블록 — `.ggc-qr` · `.ggc-login`

경기도의정포털 앱으로 로그인하는 화면. **9개 시스템이 같은 입구를 노출**하므로 정본에 고정했다 — 새로 그리지 않는다.
실물과 상태 6종은 `design/examples/login.html`.

## 마크업 (계약)

```html
<main class="ggc-login">
  <div class="ggc-card ggc-card--pad">
    <div class="ggc-qr">
      <div class="ggc-qr-head">
        <p class="ggc-qr-eyebrow">경기도의회사무처</p>
        <h2 class="ggc-qr-title">경기도의정포털 앱으로 로그인</h2>
        <p class="ggc-qr-lead">앱의 QR 인식으로 아래 코드를 비춥니다.</p>
      </div>
      <div class="ggc-qr-stage" data-state="showing" role="status" aria-live="polite">
        <div class="ggc-qr-frame"> <!-- QR 200×200 · 오류정정 M --> </div>
        <div class="ggc-qr-veil"><span class="ggc-badge ggc-badge--pending">만료</span><p class="ggc-qr-veil-text">유효시간이 지났습니다</p></div>
      </div>
      <p class="ggc-qr-meta">남은 시간 <span class="ggc-qr-timer">4:32</span> · 1회용</p>
      <ol class="ggc-qr-steps"> …3단계 안내… </ol>
      <div class="ggc-qr-actions"><button class="ggc-btn ggc-btn--secondary" type="button">새 코드 받기</button></div>
      <p class="ggc-qr-callout ggc-qr-callout--warning">…미등록·오류 안내…</p>
      <p class="ggc-qr-usercode">GGC-7F3K-2Q</p>
    </div>
  </div>
</main>
```

## 상태 — `data-state` 하나가 몬다

`idle` · `loading` · `showing` · `expired` · `unregistered` · `error`. 덮개(`.ggc-qr-veil`)는 **하나**만 두고 배지 클래스와 문구를 코드가 바꾼다.
덮개는 **상태**를, 아래 `.ggc-qr-callout` 은 **이유**를 말한다 — 둘이 같은 말을 하지 않는다. QR 은 200px · 오류정정 M 고정(줄이면 앱 인식률이 떨어진다).

## 규칙

- 무대 높이가 고정이라 상태가 바뀌어도 화면이 튀지 않는다. 덮개를 상태마다 하나씩 만들지 않는다.
- 사용자 코드(`.ggc-qr-usercode`)는 전화로 읽거나 복사한다 — 등폭 · 큰 자간.
- 3단계 안내는 화면 안에 둔다(별도 도움말 페이지로 빼지 않는다).
- 로그인 화면에는 GNB/LNB 가 없다. 유틸리티 바 + `.ggc-login`(폭 440 캡) + 푸터.
- 새 알림은 `.ggc-alert` 를 써도 되지만 로그인 화면의 `.ggc-qr-callout` 은 호환을 위해 남겨 둔다.

## Tier 2

`ggc-qr-login`.

## 근거

ggc-components.css §11 · 경기도의정포털 앱 로그인 명세 3.2 · 2026-08-22 10개 서비스 수렴.
