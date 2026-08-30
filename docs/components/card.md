# 카드 — `.ggc-card`

흰 면 · 1px `--ggc-border` · radius 16 · **그림자 없음**(계약 §2). 목록을 담는 기본형과 자유 본문을 담는 `--pad` 두 가지.

## 마크업

```html
<div class="ggc-card">
  <div class="ggc-card-head">
    <div><div class="title">입법검토보고서 결재 흐름</div><div class="sub">최근 7일 · 12건</div></div>
    <a class="action" href="…">전체 보기</a>
  </div>
  <div class="ggc-list-row">…</div>
  <div class="ggc-list-row">…</div>
  <div class="ggc-card-foot ggc-card-foot--inset ggc-card-foot--center"><a class="action" href="…">9건 더 보기</a></div>
</div>

<div class="ggc-card ggc-card--pad">자유 본문 — 에디터 · 설명 · 긴 단락</div>
```

## 부분

| 클래스 | 무엇 |
|---|---|
| `.ggc-card-head` · `.title` · `.sub` · `.action` | 제목 16px/800 · 부제 · 우측 링크. `--band` 는 인셋 배경의 밴드형 헤더 |
| `.ggc-card--pad` | 패딩 `--ggc-card-pad`(업무 18×22, 대민 24), 넘침 허용 |
| `.ggc-card-foot` | 상단 hairline. `--inset` 인셋 배경, `--center` 가운데 정렬 |

기본형은 `overflow:hidden` 이라 행 리스트의 모서리를 잘라 준다. 안에 드롭다운·툴팁이 넘쳐야 하면 `--pad` 를 쓴다.

## 규칙

- 카드 안에 카드를 넣지 않는다. 단계를 나누려면 헤더 밴드나 hairline 으로 가른다.
- 헤더의 `.action` 은 링크 하나. 버튼 여러 개면 `.ggc-page-head` 나 카드 푸터로 옮긴다.
- 대시보드에서 카드 그리드로 첫 화면을 채우지 않는다 — 업무 화면의 기본은 표다(domain-language).

## Tier 2

`card` — `Card` `CardHeader` `CardTitle` `CardDescription` `CardAction` `CardContent padded` `CardFooter inset`.

## 근거

ggc-components.css §2 · 대시보드.dc.html 섹션 실측 · 계약 §2(radius 14~16, 그림자 없음).
