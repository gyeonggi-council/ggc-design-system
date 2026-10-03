# QR 로그인 블록 — `.ggc-qr` · `.ggc-login` · `.ggc-login-credentials`

모바일 의정지원서비스 앱으로 로그인하는 화면. **여러 시스템이 같은 입구를 노출**하므로 정본에 고정했다 — 새로 그리지 않는다.
실물 · 화면 전체 · 상태 6종은 `design/examples/login.html`.

## 마크업 (계약)

```html
<main class="ggc-login" id="main">
  <div class="ggc-card ggc-card--pad">
    <div class="ggc-qr">                              <!-- 카드의 직계 자식이어야 900px 이상에서 카드가 820px 로 넓어진다 -->
      <div class="ggc-qr-main">                       <!-- 왼쪽: 찍는 것 -->
        <div class="ggc-qr-stage" data-state="showing" role="status" aria-live="polite">
          <div class="ggc-qr-frame"> <!-- QR 200×200 · 오류정정 M --> </div>
          <div class="ggc-qr-spinner"></div>
          <div class="ggc-qr-veil"><span class="ggc-badge ggc-badge--pending">만료</span><p class="ggc-qr-veil-text">유효시간이 지났습니다</p></div>
        </div>
        <p class="ggc-qr-meta">남은 시간 <span class="ggc-qr-timer">4:32</span> · 이 코드는 1회용입니다</p>
      </div>
      <div class="ggc-qr-aside">                      <!-- 오른쪽: 읽는 것 -->
        <div class="ggc-qr-head">
          <p class="ggc-qr-eyebrow">경기도의회 업무플랫폼 · 서비스명</p>
          <h1 class="ggc-qr-title">모바일 의정지원서비스 앱으로 로그인</h1>
          <p class="ggc-qr-lead">휴대폰에서 모바일 의정지원서비스 앱을 열고 QR 코드를 스캔해 주세요.</p>
        </div>
        <ol class="ggc-qr-steps"> …3단계 안내… </ol>
        <details class="ggc-qr-install"> …앱 설치 안내(접힘)… </details>
        <p class="ggc-qr-callout ggc-qr-callout--danger" role="alert" hidden></p>
        <p class="ggc-qr-usercode" hidden></p>
        <div class="ggc-qr-actions"> …새 QR 발급(hidden) · 통합 로그인… </div>
      </div>
    </div>
    <!-- 아이디 로그인을 지원하는 서비스만 (v1.5) -->
    <section class="ggc-login-credentials" aria-labelledby="password-title">
      <h2 id="password-title">아이디 로그인</h2>
      <form>
        <div class="ggc-field"><label for="login-id">아이디</label><input id="login-id" autocomplete="username" required></div>
        <div class="ggc-field"><label for="login-password">비밀번호</label><input id="login-password" type="password" autocomplete="current-password" required></div>
        <button type="submit" class="ggc-btn ggc-btn--primary ggc-btn--block">로그인</button>
      </form>
    </section>
  </div>
</main>
```

전체 마크업(QR · 설치 안내의 스토어 링크 포함)은 갤러리 `login.html` 의 "화면 전체" 절에서 그대로 복사한다.

## 상태 — `data-state` 하나가 몬다

`idle` · `loading` · `showing` · `expired` · `unregistered` · `error`. 덮개(`.ggc-qr-veil`)는 **하나**만 두고 배지 클래스와 문구를 코드가 바꾼다.
덮개는 **상태**를, `.ggc-qr-callout` 은 **이유**를 말한다 — 둘이 같은 말을 하지 않는다. QR 은 200px · 오류정정 M 고정(줄이면 앱 인식률이 떨어진다).
미등록·오류에서는 3단계 안내와 설치 안내가 저절로 접힌다(`:has()`).

## 배치 — 두 래퍼 (v1.3)

- `.ggc-qr-main`(찍는 것) · `.ggc-qr-aside`(읽는 것)가 있으면 **900px 이상에서 2단**, 그 아래는 한 줄로 쌓인다. 래퍼는 **선택**이다 — 없으면 한 줄 배치 그대로라 서비스를 하나씩 옮길 수 있다.
- 2단으로 바꾼 이유는 **높이**다. 한 줄로 쌓으면 PC 에서 700px 을 넘겨 노트북(768px)에서 QR 을 보려면 스크롤해야 했다.
- 컨테이너가 좁으면(안내에 320px 을 못 주면) `flex-wrap` 으로 **스스로 한 줄로 접힌다** — 미디어 쿼리는 뷰포트만 봐서, 좁은 카드 안에서 안내 컬럼이 62~134px 로 짓눌린 실측이 있었다.
- 좁은(≤480px) · 낮은(≤700px) 휴대폰에서는 여백 → 간격 → 글자 순으로 조인다. 무대와 QR 은 마지막이다.

## 앱 설치 안내 — `.ggc-qr-install`

`<details>` 로 **접어 둔다**. 로그인용 QR 옆에 설치용 QR 을 펼쳐 두면 처음 쓰는 사람이 어느 것을 찍어야 하는지 헷갈린다. 자바스크립트가 없어 어느 스택에서나 같은 마크업이 동작한다.
앱 이름 · 설치 주소 · 스토어 링크 · 설치 QR 은 **배포 플랫폼의 앱 설치 정본 데이터**를 따른다 — 화면에서 지어내지 않는다. 앱 이름은 스토어 등록명과 같아야 사람이 스토어에서 찾을 수 있다(예전 이름 "경기도의정포털 앱"은 쓰지 않는다).

## 화면 전체 — v1.4 · v1.5

- 셸: 유틸리티 바 → 브랜드만 있는 GNB(LNB·계정 표시 없음) → `main.ggc-login` → 푸터. 서비스마다 바꾸는 것은 **머리의 서비스명**과 **통합 로그인의 `next`** 뿐이고 문구 · 순서 · 버튼은 글자까지 같게 둔다.
- 머리 제목은 그 화면의 유일한 `h1` 이다(셸에 다른 `h1` 이 있으면 `h2`).
- **아이디 로그인(v1.5)** — 지원하는 서비스는 QR 다음, **같은 카드 안**에 `.ggc-login-credentials` 를 둔다. 접거나 탭 · 다른 화면 뒤로 숨기지 않는다. PC 는 그 아래 한 행에 아이디 · 비밀번호 · 버튼, 모바일은 QR → 안내 → 폼 순서다. 아이디 로그인이 없는 서비스에 화면 때문에 새 인증 방식을 만들지 않는다.
- **통합 로그인** 버튼은 중앙 SSO 가 있는 배포에만 둔다 — 작동하지 않는 버튼을 만들지 않는다.

## 규칙

- 무대 높이가 고정이라 상태가 바뀌어도 화면이 튀지 않는다. 덮개를 상태마다 하나씩 만들지 않는다.
- 사용자 코드(`.ggc-qr-usercode`)는 전화로 읽거나 복사한다 — 등폭 · 큰 자간.
- 3단계 안내는 화면 안에 둔다(별도 도움말 페이지로 빼지 않는다).
- 새 알림은 `.ggc-alert` 를 써도 되지만 로그인 화면의 `.ggc-qr-callout` 은 호환을 위해 남겨 둔다.

## Tier 2

`ggc-qr-login` — 한 줄 배치(v1.2)까지다. 두 래퍼 · 설치 안내 · 아이디 로그인은 아직 없다(Tier 1 마크업을 따른다).

## 근거

ggc-components.css §11 · 경기도의정포털 앱 로그인 명세 3.2 · 2026-08-22 10개 서비스 수렴 · 2026-08-28 2단 배치(v1.3) ·
2026-09-10 화면 전체 고정(v1.4) · 2026-09-11 아이디 로그인 같은 카드(v1.5) — 경기도의회 업무플랫폼에서 운영하던 것을 2026-10-03 정본으로 올렸다.
