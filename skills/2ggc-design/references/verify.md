# `G-DESIGN` — 증거와 실패 시 복귀 지점

## 검사기

```bash
CHK=/d/260712_경기도의회_시스템구축/design/check_design.py

python $CHK --canon                                   # 정본 자체 (서비스 인자 없음)
python $CHK --report /d/2026-ggc-vibe/ggc-services/<서비스명>
python $CHK --gate   /d/2026-ggc-vibe/ggc-services/<서비스명> --aa=observe
python $CHK --all                                     # 전 서비스 요약
```

`--report` 는 항상 exit 0(판정만), `--gate` 는 FAIL 이면 exit 1.
`check-design.sh` 는 같은 것의 래퍼다 — bash 게이트에서 쓴다.

**허용집합은 매 실행 시 정본 CSS 에서 파생한다.** 락파일이 없다 —
락파일은 "정본과 같아야 하는 파일" 을 하나 더 만드는 것이고, 그게 지금 문제의 형태다.

## 검사 6종

| ID | 무엇을 본다 | FAIL 조건 |
|---|---|---|
| **D1** TOKENS-COPY | `ggc-tokens.css` 사본 | 정본과 바이트가 다르다 |
| **D2** PALETTE | 소스의 색 리터럴 | 허용집합 밖 · 폐기값(`#256ef4`·`#246BEB`) |
| **D3** SHELL | 로드 순서 · 셸 3종 · 파비콘 | 토큰이 자기 스타일보다 늦게 로드된다 |
| **D4** FONT | 외부 폰트 CDN | jsDelivr·Google Fonts·unpkg·cdnjs 참조 |
| **D5** A11Y | 포커스 · 대비 | `:focus-visible` 부재 · 대체 없는 `outline:none` · (`enforce` 면) AA 미달 |
| **D6** CANON | 정본 자체 | 계약↔파일 불일치 · 토큰 AA 미달 · 자산 MANIFEST 불일치 |

**D2 가 본체다.** `diff -q` 로는 **원리상 판정할 수 없던** 인라인형(`hipass`·`hr`)을
판정 가능하게 만든다 — 비교할 파일이 없어도 값을 본다.

**D6 은 서비스가 아니라 정본을 본다.** 여기서 나오는 WARN 은 **정본 개정으로만 해소된다.**
서비스가 할 일이 아니다. 매번 출력되므로 잊히지 않는다 — 계약 v1.2 와 파일 v1.1 이
두 달간 어긋나 있던 것은 아무도 그 갭을 보지 않아서였다.

## 예외 등록

```css
/* ggc-design-allow: #13778e — 표창관리 이관 브랜드. 리스킨 대기 */
```

**사유 없는 예외는 불가능하다.** 집계는 `state.json.design.allow[]` 로 올려 총량이 보이게
한다. 예외는 늘어나기 마련이고, **보이지 않는 예외가 드리프트다.**

## 증거 3종

`state.json.gates["G-DESIGN"]` 에 기록한다.

1. **검사기 출력 전문** — `--gate` 의 stdout. 요약 줄만 붙이지 않는다
2. **스크린샷** — 1440×900 · 390×844 (확폭 채택 시 1920×1080 추가 — 계약 §8-5)
3. **브라우저 콘솔 0건** — `G-BROWSER` 와 짝이다.
   > CSS 가 `hidden` 을 덮어써 여러 화면이 동시에 보인 사고가 실재한다.
   > 콘솔이 조용해도 화면이 틀릴 수 있으니 스크린샷과 함께 본다.

리스킨이면 **기준선 스크린샷과 전후 비교**를 덧붙인다.

### 가로 오버플로는 눈으로 보지 말고 재라

스크린샷으로는 **8px 초과를 못 본다.** 실제로 그렇게 놓쳤다(2026-08-22, 대시보드
우측 레일). 브라우저 콘솔에 붙여 다섯 폭을 한 번에 재는 편이 빠르고 확실하다.

```js
for (const w of [390, 768, 1024, 1440, 1920]) {
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;left:-9999px;width:' + w + 'px;height:900px;border:0';
  document.body.appendChild(f);
  await new Promise(r => { f.onload = r; f.src = location.href; });
  await new Promise(r => setTimeout(r, 300));
  const d = f.contentDocument.documentElement;
  const ov = d.scrollWidth - d.clientWidth;
  if (ov > 0) {
    // 누가 넘치는지까지 짚어 준다
    const who = [...f.contentDocument.querySelectorAll('*')]
      .filter(e => e.getBoundingClientRect().right > d.clientWidth + 1)
      .map(e => e.tagName + '.' + (e.className.baseVal ?? e.className));
    console.log(w, '+' + ov + 'px', [...new Set(who)].slice(0, 4));
  }
  f.remove();
}
```

**기대값은 0 이다.** 넘치면 원인은 대개 셋 중 하나다 —
고정폭 2단 격자 · `min-width:0` 없는 `nowrap` 텍스트 · `overflow-x` 컨테이너 없는 넓은 표.
`references/contract.md` 의 “가로 오버플로” 절에 회피법이 있다.

## 자산이 실제로 서빙되는지

배포 후 확인한다. **200 이 떠도 옛 이미지가 돌고 있으면 옛 바이트가 온다** — 해시까지 본다.

```bash
curl -sk https://27.96.x.x/kb/favicon-32.png | sha256sum
# design/brand/dist/MANIFEST.sha256 의 값과 일치해야 배포가 실제로 닿은 것이다
```

렌더된 HTML 에서 `rel="icon"` 개수도 센다 — **페이지당 정확히 1**이어야 한다.
`ggc-ai-live-transcribe` 의 40건은 "페이지당 2" 였다. 개수를 기준선으로 기록하면 회귀가 보인다.
Next 는 href 에 해시가 붙으므로 정규식이 쿼리스트링을 허용해야 한다.

**선언된 href 를 그대로 GET 한다** — basePath 회귀는 오직 이것으로만 잡힌다
(`/icon.png` 404 vs `/hr/icon.png` 200).

## 사람 눈이 필요한 것

자동화할 수 없다. 하지 않았으면 하지 않았다고 적는다.

- **16px 탭에서 무엇으로 보이는가** — 밝은 테마·어두운 테마 양쪽
- **Tab 키 순회** — `:focus-visible` 링이 실제로 보이는가, 순서가 화면 순서와 맞는가
- **390px 실물** — 가로 스크롤 0, LNB drawer 가 열리고 닫히는가, 주요 동선 도달 가능한가
- **iOS 홈 화면** — 시뮬레이터로는 알파 합성 사고가 안 잡힌다
- **리스킨 서비스의 부조화** — 파비콘만 바꾸면 남은 팔레트와 충돌할 수 있다

**파비콘 캐시는 강제 새로고침으로 갱신되지 않는다.** 시크릿 창 또는 새 프로필로 본다.
자세한 것은 `brand-assets.md` "검증" 절.

## 실패했을 때 — 복귀 지점

| 증상 | 원인 후보 | 복귀 |
|---|---|---|
| D1 FAIL | 사본이 v1.1 이거나 손으로 고쳤다 | 정본에서 다시 `cp`. **값을 바꿔야 하면 정본을 먼저 고친다** |
| D2 FAIL 이 대량 | ❹ 독자형인데 매핑표 없이 손댔다 | 되돌리고 `reskin.md` 의 역방향 매핑표부터 |
| D2 가 남의 색을 잡는다 | 빌드 산출물·외부 캡처를 스캔했다 | 검사기가 제외하지만, 새 디렉터리면 `SKIP_DIRS` 에 추가 |
| D3 order FAIL | 자기 CSS 가 토큰보다 먼저 로드된다 | `<link>` 순서를 바꾼다. **증상은 "색이 안 먹는다" 로만 나타난다** |
| D4 FAIL | CDN 폰트를 그대로 이식했다 | 자체 호스팅 서브셋으로 교체 (`porting.md` 폰트 절) |
| D5 outline FAIL | 원본의 `outline:none` 을 베꼈다 | 토큰의 `:focus-visible` 규칙을 로드하거나 대체 스타일을 준다 |
| 색이 안 바뀐다 | 로드 순서 역전 · Tailwind 가 값을 복제하고 있다 | D3 확인 → `@theme` 이 `var(--ggc-*)` 를 참조하는지 |
| 파비콘이 안 바뀐다 | **브라우저 파비콘 DB 캐시** | 시크릿 창. 강제 새로고침은 증거가 아니다 |
| 배포했는데 옛 아이콘 | 이미지가 안 올라갔다 | 서빙 해시를 `MANIFEST.sha256` 과 대조 |

## 프런트가 없는 서비스

봇·배치는 `G-DESIGN` **해당 없음**이다. 그렇게 기록한다.
검사기가 ❶ 로 판정하고 종료한다 — 통과로 적지 않는다.
