# 공개 푸터 — `.ggc-footer.ggc-footer--public` (대민)

KRDS `footer` — 관련 누리집 · 기관 정보 · 링크 · 하단 메뉴 · 아이덴티파이어. 업무 화면의 `.ggc-footer` 에
`--public` 변형을 얹은 것이라 토큰 파일의 기본 정의를 공유한다.

## 마크업

```html
<footer class="ggc-footer ggc-footer--public">
  <div class="quick"><div class="inner">
    <a href="…">경기도</a><a href="…">국회</a><a href="…">국가법령정보센터</a>
  </div></div>
  <div class="inner main">
    <div class="info">
      <p class="org">경기도의회</p>
      <p class="addr">(16508) 경기도 수원시 팔달구 효원로 1</p>
      <p class="tel"><strong>대표전화 031-8008-7000</strong><span>(평일 09:00~18:00)</span></p>
    </div>
    <div class="links"><a href="…">찾아오시는 길</a><a href="…">이용안내</a></div>
  </div>
  <div class="bottom"><div class="inner">
    <div class="menu">
      <a class="point" href="…">개인정보처리방침</a><a href="…">저작권 정책</a><a href="…">웹 접근성 안내</a>
    </div>
    <div class="ggc-identifier"><span class="logo" aria-hidden="true"></span><span class="text">이 누리집은 경기도의회 누리집입니다.</span></div>
    <p class="copy">© 경기도의회. All rights reserved.</p>
  </div></div>
</footer>
```

## 규칙

- **필수**: 기관명 · 주소 · 대표전화(운영시간) · 개인정보처리방침(강조색 `.point`) · 아이덴티파이어.
- `.quick`(관련 누리집)은 6개 이하. SNS 아이콘 줄은 아이콘 자산이 정본에 없으므로 서비스가 인라인 SVG 로 붙인다.
- 저작권은 "© 경기도의회" 로 시작한다. 연도는 갱신 부담만 만든다 — 넣지 않는다.
- ≤900 에서 세로로 쌓인다. 인쇄에서는 관련 누리집·링크가 사라지고 기관 정보만 남는다.

## Tier 2

`ggc-public-footer` (block).

## 근거

KRDS `footer.html`.
