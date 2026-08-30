# 행 리스트 — `.ggc-list-row`

카드 **안**에 쓰는 행. 표로 보여 줄 만큼 열이 많지 않고(제목 · 메타 · 상태), 큐 · 최근 항목 · 결재 흐름처럼 "다음에 처리할 것"을 나열할 때.
열이 셋을 넘으면 표(`.ggc-table`)다.

## 마크업

```html
<div class="ggc-card">
  <div class="ggc-list-row">
    <span class="sev-bar sev-bar--danger" aria-hidden="true"></span>        <!-- [선택] 심각도 바 -->
    <span class="icon" aria-hidden="true">📄</span>                          <!-- [선택] 아이콘 박스 40px -->
    <div class="body">
      <div class="title">경기도 옥외광고물 등의 관리와 옥외광고산업 진흥에 관한 조례</div>
      <div class="meta">상위법 개정 2026-03-14 · 경과 161일</div>
    </div>
    <div class="end"><span class="ggc-tag ggc-tag--danger">시급</span><button class="ggc-btn ggc-btn--secondary ggc-btn--sm" type="button">검토</button></div>
  </div>
</div>
```

## 부분

| 클래스 | 무엇 |
|---|---|
| `.body` `.title` `.meta` | 제목 14px/700 한 줄 말줄임 · 메타 12px subtle |
| `.end` | 우측 슬롯 — 상태 배지 · 시각 · 소형 버튼 |
| `.icon` | 40px 인셋 박스 (문서 · 일정 아이콘) |
| `.sev-bar` (`--danger` `--warning` `--info`) | 좌측 5px 세로 막대 — 등급이 있을 때만 |

패딩은 `--ggc-row-pad`(업무 15×22 · 대민 20×24). 행 hover 는 `--ggc-row-hover`.

## 규칙

- 제목은 한 줄 — 줄바꿈하지 않는다(밀도). 긴 의안명은 말줄임되고 상세에서 전문을 본다.
- 메타는 **식별자 · 소관 · 날짜(YYYY-MM-DD) · 담당** 순. 상대시간 금지.
- 상태는 `.end` 에 배지로, 심각도는 `.sev-bar` 로 — 둘을 한 행에 동시에 쓰지 않는다.
- 한 카드에 15행을 넘으면 페이지네이션이나 "더 보기" 푸터.

## Tier 2

`ggc-list-row` (Phase 9). 그전에는 `Card` 안에 flex 로 조립한다.

## 근거

ggc-components.css §5 · 대시보드.dc.html "입법검토보고서 결재 흐름" 행 실측 · 필수조례정비.dc.html 심각도 바.
