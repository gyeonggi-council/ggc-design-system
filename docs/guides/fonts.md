# 서체 — Pretendard GOV 자체 호스팅

**외부 CDN 을 링크하지 않는다.** 망분리 환경에서 요청이 나가지 않아 글꼴이 폴백으로 떨어진다(검사기 D4).

## 정본은 두 파일

| 파일 | 무엇 |
|---|---|
| `design/ggc-fonts.css` | `@font-face` 하나 — `"Pretendard GOV"` 가변, `url()` 이 **상대경로**라 두 파일을 나란히 두면 basePath 를 알 필요가 없다 |
| `design/fonts/PretendardGOVVariable.subset.woff2` | 가변 한 벌(45~930), 한글·기호 서브셋 약 617KB. 재생성은 `design/fonts/build-font.py` |

⛔ **다른 서비스의 `PretendardGOV-{Regular,Medium,Bold}.subset.woff2`(정적 3벌)를 복사하지 않는다.** 그 선언은 `font-weight: 700 800` 을
Bold 한 파일에 묶어 **800 이 700 과 똑같이 그려진다.** 정본은 제목·KPI 에 800 을 요구한다.

## 붙이는 법

```html
<link rel="stylesheet" href="fonts/ggc-fonts.css">   <!-- 토큰보다 먼저 — 토큰이 이 서체 이름을 쓴다 -->
<link rel="stylesheet" href="ggc-tokens.css">
```

Tier 2(레지스트리)는 폰트를 싣지 못한다 — 같은 두 파일을 `public/fonts/` 로 복사하고 `<link>` 한다.

## 확인

브라우저 콘솔에서 `document.fonts` 를 보면 `Pretendard GOV 45 930 loaded` 가 있어야 하고, 400 / 700 / 800 / 900 의 렌더 폭이 **전부 달라야** 한다
(같으면 정적 3벌을 쓰고 있는 것이다).

## 라이선스

Pretendard GOV 1.3.9 — **SIL Open Font License 1.1**. 원문 `design/fonts/OFL.txt` 를 함께 배포하고, 예약 서체명("Pretendard")을 수정본에 쓰지 않는다.

## 폴백

파일을 넣지 않으면 토큰의 폴백 체인(Pretendard → Noto Sans KR → Malgun Gothic → system-ui)이 동작한다. PoC 단계에서는 그것으로 충분하다 —
CDN 으로 때우지만 않으면 된다. Claude Design 원본은 jsDelivr 의 Pretendard 를 쓰므로 자간이 GOV 판과 미세하게 다르다 — 의도된 차이다.
