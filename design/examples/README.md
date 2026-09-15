# 예제 갤러리

**저장소를 내려받아 [`index.html`](index.html) 을 브라우저로 열면 된다.**
서버도 빌드도 패키지 설치도 필요 없다. (GitHub 웹에서는 HTML 이 렌더되지 않고
소스로만 보인다 — 그래서 README 에는 [`preview-palette.svg`](preview-palette.svg) 를 쓴다.)

| 파일 | 무엇 |
|---|---|
| `index.html` | 개요 · 3분 도입 · 관통 원칙 · 접근성 |
| `tokens.html` | 색 · 타이포 · 간격 · 형태 · 포커스 **전수**, 대비비 실측 |
| `components.html` | 버튼 · 배지 · 카드 · 통계 · 행리스트 · 표 · 폼 · 위저드 · 세 상태 |
| `components-forms.html` | 셀렉트 · 체크박스 · 라디오 · 칩 · Explore 필터 스트립 조립 (v2.0) |
| `components-nav.html` | 페이지 헤더 · 브레드크럼 · 탭 · 페이지네이션 (v2.0) |
| `components-overlay.html` | 알림 · 모달 · 스피너 · 스켈레톤 · 문서 본문 · 하단 액션바 (v2.0) |
| `dashboard.html` | Monitor archetype 실물 화면 |
| `wizard.html` | Configure archetype 실물 화면 |
| `login.html` | **QR 로그인 화면** — 전 시스템 공통 입구. 상태 6종 · 화면 안 3단계 안내 |
| `public/index.html` · `list.html` · `detail.html` · `form.html` | **대민(공개) 실물 화면 4쪽** (v2.0) — `<html data-ggc-profile="public">` + `ggc-public.css`. 메인 · 의안 검색 · 의안 상세 · 의견 제출. 업무 셸과 다르므로 합본에는 들어가지 않는다 |

## 이 갤러리의 규칙 — 값을 옮겨 적지 않는다

정본이 문서와 두 달간 어긋난 원인이 **값을 옮겨 적은 것**이었다.
갤러리는 그 실패를 되풀이하지 않으려고 세 가지를 지킨다.

**① 정본을 상대경로로 직접 링크한다.** `../ggc-tokens.css` · `../ggc-components.css`.
사본을 두지 않는다. 그래서 이 갤러리는 **정본의 스모크 테스트**이기도 하다 —
정본이 깨지면 여기가 눈에 띄게 망가진다. 실제로 이걸 만들면서 정본 결함 두 개를 찾았다
(`.ggc-gnb-brand` 의 밑줄, `.ggc-wizard-mini` 의 가로 오버플로).

**② 값과 대비비는 브라우저가 실측한다.** `tokens.html` 의 스와치는 마크업에 토큰
**이름**만 갖고, `getComputedStyle` 로 정본을 읽어 채운다. 그래서 낡을 수 없고,
고대비(`prefers-contrast: more`)를 켜면 숫자가 즉시 따라 바뀐다.

**③ 예제 코드는 렌더된 DOM 에서 읽는다.** `components.html` 의 “마크업” 블록은
손으로 적은 것이 아니라 그 위 데모의 `innerHTML` 이다. 코드와 화면이 갈라질 자리가 없다.

## 생성물 셋 — 직접 고치지 말 것

| 파일 | 무엇 | 왜 |
|---|---|---|
| `preview-palette.svg` | 팔레트 한 장 | GitHub 웹은 HTML 을 렌더하지 않는다. README 가 이걸로 보인다 |
| `shots/*.png` + `shots/manifest.json` | **컴포넌트·실물 화면 미리보기 16장** | 같은 이유 — 컴포넌트는 CSS 가 그리므로 브라우저가 찍어야 정본과 같다. README 상단이 이걸로 보인다 |
| `examples-standalone.html` | **9쪽 합본 (약 440KB)** | 링크 하나로 열기 위한 판. 정본 CSS·JS·마크를 인라인해 **외부 요청 0** |

```bash
python design/examples/build-preview.py       # 또는 --check
python design/examples/build-shots.py         # 또는 --check  (생성에는 node · playwright · Chrome 필요, --check 는 불필요)
python design/examples/build-standalone.py    # 또는 --check
```

셋 다 `check_design.py --canon` 이 신선도를 본다(D6 `gen`). 낡으면 WARN 이 뜬다.
미리보기 PNG 는 픽셀이 환경마다 조금씩 달라 바이트 비교 대신 **입력(정본 CSS·JS·갤러리 쪽) 해시**를
`manifest.json` 에 적어 두고 그것으로 판정한다 — 정본이 바뀌었는데 다시 찍지 않으면 낡은 것이다.

> **합본은 사본이다** — 갤러리가 지키는 "사본을 두지 않는다" 와 정면으로 부딪친다.
> 그래서 손으로 만들지 않고 **생성**하며, 이 예외는 "링크 하나로 열어 보기" 하나뿐이다.
> 생성기는 `index.html` 의 "상대경로로 직접 링크한다" 문장을 **합본에 맞게 바꾼다** —
> 인라인해 놓고 그 말을 그대로 두면 페이지가 거짓말을 하게 된다.
> 원문이 바뀌면 생성기가 `assert` 로 즉시 멈춘다.
>
> 합본은 HTML 표준 모드와 한국어 언어, UTF-8 인코딩, 모바일 viewport를 선언한다.
> 휴대폰에서도 실제 화면 폭을 사용하며 한글 인코딩을 추측하지 않는다.

## `examples.css` / `examples.js` 는 서비스에 복사하지 않는다

갤러리 설명 장치와 오프라인 예시 동작(의안 검색·정렬·CSV·초안 임시저장)을 담는다.
서비스는 정본 CSS와 `ggc-behaviors.js`를 사용하고 업무 데이터 처리는 자신의 API에 연결한다.
`gallery-fonts.css`는 `build-standalone.py`가 정본 폰트 선언에서 상대경로만 바꿔 생성한다.

`examples.css` 는 `--ggc-*` 를 하나도 정의하지 않고 색·간격·형태를 직접 쓰지도 않는다.
전부 `var()` 로 정본을 참조한다.

업무 화면은 정본의 `.ggc-work` 배치를 사용한다. PC는 본문과 참고 자료를 나란히 보여주고,
모바일은 전환 버튼으로 같은 데이터에 접근한다. 개발자용 설명은 화면 하단 가이드로 접는다.
의안 목록은 실제 예시 데이터에 대해 검색·필터·정렬·페이지 이동·상세·CSV가 동작한다.
초안 작성은 단계 이동, 입력 보존, 기기 임시저장, 텍스트 다운로드를 지원한다. 실제 제출은 하지 않는다.

```bash
npm install --no-save --package-lock=false playwright-core
node tools/check-responsive.cjs
```

브라우저 경로는 `GGC_CHROME`으로 지정한다. 검사 결과와 화면 이미지는 `docs/design-evidence/after/`에 생성된다.

## 검사

이 폴더도 검사기를 통과한다.

```bash
python design/check_design.py --report design/examples
```

폰트 파일이 없으므로 D4(외부 CDN 0)는 자명하게 통과하고, D5 포커스는 **링크된 정본**에서
찾는다. 서비스가 아니므로 D1(사본 바이트 동일)은 “토큰 파일 없음” 으로 나오는 것이 정상이다.

## 데이터

의안명 · 숫자 · 이름 · 날짜는 **전부 가상**이다. 위원회 이름만 실제 상임위 명칭이고,
사람 이름은 `이○○` 처럼 마스킹된 형태만 쓴다. 실제 의정 자료를 넣지 말 것.
