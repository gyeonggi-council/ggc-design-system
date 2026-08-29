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

## 생성물 둘 — 직접 고치지 말 것

| 파일 | 무엇 | 왜 |
|---|---|---|
| `preview-palette.svg` | 팔레트 한 장 | GitHub 웹은 HTML 을 렌더하지 않는다. README 가 이걸로 보인다 |
| `examples-standalone.html` | **6쪽 합본 (약 239KB)** | 링크 하나로 열기 위한 판. 정본 CSS·JS·마크를 인라인해 **외부 요청 0** |

```bash
python design/examples/build-preview.py       # 또는 --check
python design/examples/build-standalone.py    # 또는 --check
```

둘 다 `check_design.py --canon` 이 신선도를 본다(D6 `gen`). 낡으면 WARN 이 뜬다.

> **합본은 사본이다** — 갤러리가 지키는 "사본을 두지 않는다" 와 정면으로 부딪친다.
> 그래서 손으로 만들지 않고 **생성**하며, 이 예외는 "링크 하나로 열어 보기" 하나뿐이다.
> 생성기는 `index.html` 의 "상대경로로 직접 링크한다" 문장을 **합본에 맞게 바꾼다** —
> 인라인해 놓고 그 말을 그대로 두면 페이지가 거짓말을 하게 된다.
> 원문이 바뀌면 생성기가 `assert` 로 즉시 멈춘다.
>
> ⚠ `<meta charset="utf-8">` 이 합본 첫 줄에 있다. 이 파일은 `<head>` 없이 쓰이므로
> 없으면 브라우저가 인코딩을 추측해 **한글이 통째로 깨진다**(실제로 그랬다).

## `examples.css` / `examples.js` 는 서비스에 복사하지 않는다

갤러리 페이지의 **설명 장치**(섹션 제목 · 스와치 격자 · 코드블록 · 주석 상자)일 뿐이다.
서비스가 복사할 것은 `ggc-tokens.css` 와 `ggc-components.css` 두 개다.

`examples.css` 는 `--ggc-*` 를 하나도 정의하지 않고 색·간격·형태를 직접 쓰지도 않는다.
전부 `var()` 로 정본을 참조한다.

> `dashboard.html` · `wizard.html` 의 **본문**에는 갤러리 전용 클래스가 없다.
> 토큰과 컴포넌트만으로 그려진다 — 2단 배치만 `flex-wrap` + `flex-basis` 로 직접 짰고,
> 그것도 미디어 쿼리 없이 접힌다.

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
