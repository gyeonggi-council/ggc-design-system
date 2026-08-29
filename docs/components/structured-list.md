# 구조화 목록 — `.ggc-structured-list` (대민)

공모 · 접수 · 방청처럼 "제목 + 설명 + 기간 + 행동"이 한 묶음인 항목의 카드 격자. KRDS `structured_list`.
표로 보여 줄 만큼 열이 많지 않고, 한 항목마다 **다음 행동(신청하기)**이 붙을 때 쓴다. 업무 화면의 목록은 표다.

## 마크업

```html
<ul class="ggc-structured-list">
  <li class="item">
    <div class="top"><span class="ggc-badge ggc-badge--session">● 접수 중</span></div>
    <a class="text" href="/apply/2026-2">
      <p class="title">2026년 하반기 도민 정책제안 공모</p>
      <p class="desc">청년 · 돌봄 · 교통 분야의 조례 제·개정 아이디어를 접수합니다.</p>
      <p class="date"><strong>신청 기간</strong><span>2026-09-01 ~ 2026-09-30</span></p>
    </a>
    <div class="tags"><span class="ggc-tag">정책제안</span><span class="ggc-tag ggc-tag--primary">조례</span></div>
    <div class="btn"><a class="ggc-btn ggc-btn--secondary" href="/apply/2026-2">신청하기</a></div>
  </li>
</ul>
```

## 규칙

- 설명(`.desc`)은 **최대 3줄**로 잘린다(`line-clamp`). 전문은 상세 페이지에.
- 상태 배지는 텍스트·기호 병기(● 접수 중 · ◆ 방청 가능 · ○ 마감).
- 기간은 `YYYY-MM-DD ~ YYYY-MM-DD`. 마감 임박은 배지가 아니라 날짜 옆 문구로("D-3").
- 격자는 300px 최소 폭으로 자동 접힌다 — 390 에서 1열.
- 항목이 0개면 목록을 숨기지 말고 빈 상태 문구 + 지난 항목 링크.

## Tier 2

`ggc-structured-list`.

## 근거

KRDS `structured_list.html`.
