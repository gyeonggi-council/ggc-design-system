# 아이덴티파이어 — `.ggc-identifier` (대민)

"이 누리집은 경기도의회 누리집입니다." — 기관 식별 띠. KRDS `identifier`. 공개 푸터의 `.bottom` 안에 둔다.

## 마크업

```html
<div class="ggc-identifier">
  <span class="logo" aria-hidden="true"><img src="/assets/gov-mark.svg" alt=""></span>
  <span class="text">이 누리집은 경기도의회 누리집입니다.</span>
</div>
```

## 규칙

- 문구는 "이 누리집은 **기관명** 누리집입니다." 형식. 서비스명이 아니라 기관명이다.
- `.logo` 이미지는 마스트헤드의 `.flag` 와 같은 원칙 — 정부 제공 자산 슬롯, 비우면 기관색 원.
- 푸터 바깥에 단독으로 두지 않는다. 검사기 D3 가 대민 화면에서 이 클래스를 기대한다.

## 근거

KRDS `html/code/identifier.html` · `footer.html` 의 `.krds-identifier` 위치.
