# 스켈레톤 — `.ggc-skeleton`

로딩 중에 **실제 레이아웃의 자리를 지키는** 골격. 행 높이·카드 크기가 로드 전후 같아야 한다
(archetypes: "로딩은 행 높이 유지"). 화면이 통째로 비었다가 튀어나오지 않게 하는 장치다.

## 마크업

```html
<div class="ggc-card" aria-busy="true">
  <div class="ggc-card-head">
    <div style="flex:1">
      <div class="ggc-skeleton ggc-skeleton--title" style="width:45%"></div>
      <div class="ggc-skeleton" style="width:28%"></div>
    </div>
  </div>
  <div class="ggc-list-row">
    <span class="ggc-skeleton ggc-skeleton--circle"></span>
    <div class="body">
      <div class="ggc-skeleton" style="width:78%"></div>
      <div class="ggc-skeleton" style="width:46%"></div>
    </div>
  </div>
  <span class="ggc-sr">목록을 불러오는 중</span>
</div>
```

폭은 인라인 `style="width:…"` 로 준다 — 골격은 실제 데이터 길이를 흉내 내는 것이라 값이 화면마다 다르다.

## 변형

| 클래스 | 무엇 |
|---|---|
| (기본) | 12px 높이 막대 (본문 한 줄) |
| `--title` | 15px (제목) |
| `--circle` | 40px 원 (아바타·아이콘 박스) |
| `--rect` | 120px 직사각 (썸네일·차트 자리) |

## 규칙

- 골격의 개수는 실제 첫 화면의 행 수(예: 페이지 크기 20)와 같게 한다. 3개만 보여 주고 20개가 튀어나오면 골격의 의미가 없다.
- 컨테이너에 `aria-busy="true"` + `.ggc-sr` 문구. 골격 막대 자체는 장식이다.
- 반짝임(shimmer)은 `prefers-reduced-motion` 에서 꺼진다(§10). 고대비에서는 테두리 상자로 보인다.
- 오류로 끝나면 골격을 오류 상태(`.ggc-alert--danger` 또는 세 상태 조립)로 바꾼다 — 영원히 반짝이게 두지 않는다.

## 프로필

치수 차이 없음.

## Tier 2

`skeleton`.

## 근거

갤러리 세 상태(components.html) 로딩 예시 · archetypes 공통 "세 상태".
