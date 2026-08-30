# 링크 — `.ggc-link`

본문 흐름 안의 `<a>`. **밑줄**이 링크의 표식이다(색 단독 금지). 내비(LNB · 탭 · 브레드크럼)와 버튼은
자기 규칙이 있다 — 거기에는 쓰지 않는다.

## 마크업

```html
<a class="ggc-link" href="…">「경기도의회 회의규칙」 제42조</a>
<a class="ggc-link ggc-link--external" href="https://…" target="_blank" rel="noopener">국가법령정보센터<span class="ggc-sr"> (새 창)</span></a>
<a class="ggc-link ggc-link--download" href="…">검토보고서 (HWP, 184KB)</a>
<a class="ggc-link ggc-link--quiet" href="…">경기도 청년 기본 조례 일부개정조례안</a>   <!-- 표 · 목록 -->
```

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 새 창 | `--external` — 기호 ↗ (CSS) + 화면 밖 "(새 창)" (마크업) + `rel="noopener"` |
| 내려받기 | `--download` — 기호 ↓ + 텍스트에 형식·크기 |
| 조용히 | `--quiet` — 밑줄은 hover 에서만, 대신 굵기 600. 링크가 빽빽한 표·목록 |
| 굵게 | `--strong` |
| 비활성 | `aria-disabled="true"` — 회색, 클릭 불가. 가능하면 비활성 링크 대신 텍스트로 |

## 규칙

- 링크 텍스트만 읽어도 목적지를 알 수 있게 쓴다. "여기" · "자세히" 만 두지 않는다.
- 동작(저장 · 삭제 · 열기)은 링크가 아니라 버튼이다. 이동은 링크다.
- 새 창은 꼭 필요할 때만(외부 법령 · PDF 뷰어). 같은 서비스 안에서는 열지 않는다.
- `.ggc-prose` 안의 `a` 는 이미 같은 규칙을 받는다 — 클래스를 겹쳐 붙일 필요 없다.

## 프로필

글자 크기는 부모를 따른다. 변화 없음.

## Tier 2

없음 — `<a className="ggc-link">` 그대로.

## 근거

KRDS `link` · WCAG 1.4.1(색 단독 금지) · §30.
