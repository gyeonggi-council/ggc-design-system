# 마스트헤드 — `.ggc-masthead` (대민)

공개 누리집 맨 위의 공식 띠. KRDS `masthead` — 문구 "이 누리집은 대한민국 공식 전자정부 누리집입니다." 는
바꾸지 않는다. 업무 화면에는 쓰지 않는다.

## 마크업

```html
<div class="ggc-masthead">
  <div class="inner">
    <span class="flag" aria-hidden="true"><img src="/assets/flag.svg" alt=""></span>
    <span class="text">이 누리집은 대한민국 공식 전자정부 누리집입니다.</span>
    <details class="more">
      <summary>안내</summary>
      <p>공식 누리집 주소는 <b>.go.kr</b> 로 끝납니다. 주소가 다르거나 개인정보·금전을 요구하면 대표전화로 확인하십시오.</p>
    </details>
  </div>
</div>
```

## 규칙

- `.flag` 안의 국가 상징 이미지는 **서비스가 정부 제공 자산으로 채운다.** 이 저장소는 그 이미지를 담지 않는다
  (기관 CI 자산과 별개의 판단). 비워 두면 CSS 가 기관색 원으로 자리를 표시한다.
- `.more` 의 안내 접기는 선택이다. 넣으면 `<details>` 라 JS 가 없다.
- 스킵 링크(`.ggc-skip-link`) 가 이 띠보다 **앞**에 있어야 한다 — 키보드 첫 Tab 은 본문 바로가기다.

## 프로필

대민 전용. 검사기 D3 가 대민 화면에서 이 클래스를 기대한다.

## 근거

KRDS `html/code/masthead.html` · 계약 §9.
