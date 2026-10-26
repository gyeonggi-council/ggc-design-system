# 행 리스트 — `.ggc-list-row`

카드 **안**에 쓰는 행. 표로 보여 줄 만큼 열이 많지 않고(제목 · 상태 · 필요하면 메타 한 줄), 큐 · 최근 항목 · 결재 흐름처럼 "다음에 처리할 것"을 나열할 때.
열이 셋을 넘으면 표(`.ggc-table`)다.

## 마크업

```html
<div class="ggc-card">
  <div class="ggc-list-row">
    <span class="sev-bar sev-bar--danger" aria-hidden="true"></span>        <!-- [선택] 심각도 바 -->
    <span class="icon" aria-hidden="true"><svg class="ggc-icon"><use href="#i-file-text"/></svg></span>                          <!-- [선택] 아이콘 박스 40px -->
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
| `.body` `.title` `.meta` | 제목 `--ggc-text-md`/600 — 자르지 않고 줄을 바꾼다 · 메타 `--ggc-text-xs` subtle |
| `.end` | 우측 슬롯 — 상태 배지 · 시각 · 소형 버튼. **단추가 있으면 세로로 쌓는다** — 상태 배지 위 · 단추 아래 · 둘 다 오른쪽 끝. 휴대폰(≤600)에서는 단추가 없어도 세로다 |
| `.icon` | 40px 인셋 박스 (문서 · 일정 아이콘). 모서리 `--ggc-radius` |
| `.sev-bar` (`--danger` `--warning` `--info`) | 좌측 5px 세로 막대 — 등급이 있을 때만 |

패딩은 `--ggc-row-pad` — 카드 머리 · 바닥과 같아 카드 제목과 행 제목의 왼쪽 끝이 맞는다(v3.2). 행 hover 는 `--ggc-row-hover`.

## 규칙

- 제목은 자르지 않는다 — 길면 줄을 바꾼다(v3.2, [ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md)). 의안명 · 회의명은 잘리면 다른 건으로 읽힌다. 한글은 낱말 단위로 바뀐다(`word-break: keep-all`).
- `.end` 에 상태와 단추를 함께 두면 마크업도 **상태 → 단추** 순으로 쓴다 — 세로로 쌓일 때 그 순서가 위 → 아래다(2026-10-25 사용자 확정).
- 메타 줄은 **기본 없음**(v3.3, [ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md)) — 그 목록에서 비교 · 선택에 쓰는 것만 한 줄. 나머지는 행 제목으로 여는 [정보 서랍](sheet.md).
  쓸 때 순서는 **식별자 · 소관 · 날짜(YYYY-MM-DD) · 담당**. 상대시간 금지.
- 상태는 `.end` 에 배지로, 심각도는 `.sev-bar` 로 — 둘을 한 행에 동시에 쓰지 않는다.
- 한 카드에 15행을 넘으면 페이지네이션이나 "더 보기" 푸터.

## Tier 2

`ggc-list-row`.

## 근거

ggc-components.css §5 · §10 · 대시보드.dc.html "입법검토보고서 결재 흐름" 행 실측 · 필수조례정비.dc.html 심각도 바.
