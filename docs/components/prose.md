# 문서 본문 — `.ggc-prose`

조례 조문 · 검토보고서 · 안내문처럼 **긴 글**의 조판. Learn/Decide 화면의 `--doc` 본문 슬롯이다.
표·카드·목록 UI 에는 쓰지 않는다 — 그것들은 자기 컴포넌트가 있다.

## 마크업

```html
<div class="ggc-card ggc-card--pad">
  <div class="ggc-prose">
    <h2>Ⅱ. 검토 의견</h2>
    <p>이 조례안은 「청년기본법」 제3조의 청년 연령에 맞추어 …</p>
    <div class="article">
      <span class="no">제3조(정의)</span>이 조례에서 "청년"이란 19세 이상 34세 이하인 사람을 말한다.
      <span class="para">① 다만, 도지사는 청년 정책의 특성에 따라 그 범위를 달리 정할 수 있다.</span>
    </div>
    <blockquote><p>§ 「청년기본법 시행령」 제6조 제2항 — 위원회는 … 25명 이내의 위원으로 구성한다.</p></blockquote>
    <h3>검토 결과</h3>
    <ul><li>위원 정수 상한을 25명으로 조정한다.</li></ul>
  </div>
</div>
```

## 안에서 쓰는 것

| 요소 | 무엇 |
|---|---|
| `h2` `h3` `h4` | 절 제목 (17 / 15 / 14px). 문서 안 계층은 h2 부터 — h1 은 페이지 헤더다 |
| `p` `ul` `ol` | 단락·목록. 14px / 1.8 |
| `.article` + `.no` + `.para` | 조문 한 개 — 조 번호 굵게, 항·호 들여쓰기 |
| `blockquote` | 근거 조문 인용 (§ 기호 + 「낫표」) |
| `code` | 파일명·식별자 |
| `a` | 밑줄 링크 |

## 규칙

- 법령은 **「낫표」+ 공포 명칭 그대로**, 조문은 `§`. 문장은 평서형(–다).
- 측정 폭은 ≥1680px 에서 920px 로 캡된다(계약 §2-1). 그 아래에서는 카드 폭을 따른다.
- 본문 색은 `--ggc-text-body`(흰 위 10.23:1). 강조는 `strong` → `--ggc-text-strong`.
- 인쇄를 가정한다 — 검토보고서·명단은 출력된다. `@media print` 에서 내비를 걷어내고 제목·기관명·출력일시를 남긴다(서비스 CSS).

## 프로필

대민 안내문에도 같은 클래스를 쓴다. 글자 크기(14px)는 프로필과 무관하게 고정 — 대민 본문은 KRDS body 17px 를 원하면 서비스가 `.ggc-prose` 에 `font-size: var(--ggc-control-font)` 를 더한다.

## Tier 2

`ggc-prose` (Tailwind `prose` 유틸 대체 — Typography 플러그인을 쓰지 않는다).

## 근거

archetypes Learn/Decide `--doc` · 계약 §2-1 · domain-language "법령 인용은 낫표".
