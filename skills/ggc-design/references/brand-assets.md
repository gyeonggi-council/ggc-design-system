# 브랜드 자산 — 파비콘과 마크

정본과 근거는 `design/brand/SOURCE.md` 다.
여기는 **서비스에 붙이는 절차**만 담는다.

## 복사원은 하나다

```
design\brand\dist\
  favicon.ico                 16+32+48, BMP 페이로드
  favicon-32.png              32x32 불투명
  apple-touch-icon-180.png    180x180 불투명
  assembly-mark.png           270x268 원본 (GNB 40x40 용)
  MANIFEST.sha256
```

`uploads/`·`docs/design-reference/`·다른 서비스의 `public/` 에서 가져오지 않는다.
같은 바이트가 저장소 안 6곳에 흩어져 있었고, 그 상태로는 "어느 것이 옳은가" 를 판별할 수 없다.

**배경판은 네이비 `#3C5D93`** 이다(2026-08-22 사용자 결정). 마크가 금색 화환 46% +
진홍 메달리언 26% 구성이라 어느 배경이든 절반이 죽는데, 지배적 형태인 금색 고리가
네이비 위에서 5.12:1 로 밝은·어두운 탭 양쪽에서 일관되게 읽힌다. 근거는 `SOURCE.md`.

## 대상 경로는 표가 고정한다

`design\brand\ASSET-MAP.tsv` 가 정본이다. **이름이 아니라 표로 매핑을 고정하는 이유**:
Next App Router 가 파일명을 `icon.png`/`apple-icon.png` 로 강제해 **전 서비스 이름 통일이
애초에 불가능**하다. 검사기는 이 표를 읽어 행마다 `diff` 를 돌린다.
표에 없는 서비스는 "미적용" 으로 드러난다 — 조용히 빠지지 않는다.

서비스를 새로 만들면 **표에 행을 더한다.** 그것이 이 자산의 "등록" 이다.

## 붙이는 법

### `.ico` 는 오리진당 하나뿐이다

모든 서비스가 `27.96.x.x` 한 오리진 아래 경로 프리픽스(`/kb`·`/hr`·`/award`…)로 살고,
**브라우저의 암묵적 `/favicon.ico` 요청은 항상 오리진 루트로 간다.** 그 루트를 점유한 것이
`ggc-poc-web` 이다. 즉 **거기 파일 하나가 나머지 전부의 기본 아이콘**이 되고, 하위 경로
서비스에 `.ico` 를 둬도 선언 없이는 영영 요청되지 않는다.

> ⚠ 그래서 `ggc-poc-web/webapp/public/favicon.ico` 는 **한 번 배포되면 갱신이 가장
> 어려운 파일**이다(암묵 요청은 쿼리스트링이 없어 `?v=` 로 무효화할 수 없다).
> 처음에 제대로 넣는다.

### Next App Router — 파일 관례, 선언 0줄

```
dist/favicon-32.png           →  <app루트>/icon.png
dist/apple-touch-icon-180.png →  <app루트>/apple-icon.png
```

`<link>` 를 손으로 쓰지 않는다. basePath 도 내용 해시도 Next 가 붙인다.
**`app/favicon.ico` 는 두지 않는다** — `icon.png` 와 공존하면 선언이 2중화된다.

### 나머지 스택 — 파일 2개 + 선언 3줄

```html
<link rel="icon" type="image/png" sizes="32x32" href="{정적루트}/favicon-32.png?v=1">
<link rel="apple-touch-icon" href="{정적루트}/apple-touch-icon-180.png?v=1">
<meta name="theme-color" content="#3C5D93">
```

`{정적루트}` 는 서비스가 **이미 쓰는 정적 마운트**를 그대로 쓴다. 새 마운트를 만들지 않는다 —
만들면 세션 게이트 정규식을 건드리게 된다. 스택별 형태는 `porting.md` 표.

`?v=1` 은 캐시 무효화 손잡이다. **정본 바이트가 바뀔 때만 올린다** — 취향이 아니라 규약이다.

`theme-color` 는 자산이 아니라 한 줄이고, `bill-system` 이 이미 이 값으로 쓰고 있다.

## 만들지 않는 것

| 무엇 | 왜 |
|---|---|
| `favicon.svg` | 마크가 금색 화환 + 진홍 메달리언의 세밀한 3색 래스터다. SVG 로 다시 그리는 것은 **마크를 다시 디자인하는 일**이다 |
| `favicon-16.png` | Chrome 이 32 를 잘 줄인다. 16 은 `.ico` 안에 있다 |
| `manifest.webmanifest` | PWA 계획이 없고, `_template`·`ggc_kb` 세션 게이트 정규식에 **매칭되지 않아 로그인 화면에서 401** 이 난다. 같은 함정이 `bill-system/rhwp/` 에서 이미 실현돼 있다(아이콘 5개 전부 404) |
| `mask-icon` | Safari 15(2021) 이후 사실상 죽은 선언 |

## 검증 — 파비콘은 특별히 안 보인다

**Chrome 은 파비콘을 프로필 안 별도 `Favicons` SQLite DB 에 URL 키로 보관**하고,
이 DB 는 일반 캐시 정책과 별개로 움직인다. 실무적 귀결:

1. **`Ctrl+Shift+R` 로는 파비콘이 갱신되지 않는다.** "안 바뀐다" 는 보고의 대부분이 이것이다.
   **강제 새로고침 결과를 증거로 인정하지 않는다.**
2. **URL 이 바뀌면 무조건 새로 받는다.** Next 는 `?<contenthash>`, 나머지는 `?v=N`.
3. **정직한 검증은 시크릿 창 또는 새 프로필이다.** 담당자 본인 창은 이미 오염돼 있어
   "나한테는 보인다" 가 증거가 되지 않는다.
4. 파비콘 URL 을 주소창에 직접 열면 그 URL 에 대해 DB 가 갱신된다 — 진단용으로 유용하다.
5. **서비스 워커가 있으면 `?v=` 조차 우회된다.** DevTools > Application > Service Workers 에서
   등록 0건을 확인하거나 Unregister 후 재확인. 시크릿 창을 쓰면 자동으로 회피된다.

자동으로 확인할 수 있는 것은 `verify.md` 에 있다.
**16px 에서 무엇으로 보이는가는 자동화할 수 없다** — 실제 탭에서 밝은 테마·어두운 테마
양쪽을 눈으로 본다. iOS 홈 화면 아이콘은 시뮬레이터로 알파 합성 사고가 안 잡히므로
실물 아이폰에서 한 번 확인한다.

## 재현

```bash
cd <저장소>/design/brand
python build-brand-assets.py           # dist/ 재생성
python build-brand-assets.py --check   # MANIFEST 대조만
```

의존성 0(Python stdlib). **생성 결과물이 정본이고, 게이트는 정본↔사본만 비교한다** —
`zlib.compress` 출력이 버전에 따라 달라질 수 있어 게이트가 스크립트를 재실행하지 않는다.

> ⚠ `/c/WINDOWS/system32/convert` 는 ImageMagick 이 아니라 **Windows 디스크 변환 유틸**이다.
> 절대 실행하지 말 것.
