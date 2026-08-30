# 표 — `.ggc-table`

업무 화면의 기본이다. thead 상단 2px `--ggc-primary-deep`(공공 문서 표 관례) · 행 구분 hairline · 합계행 인셋. 한 화면에 15~20행.

## 마크업

```html
<div class="ggc-table-wrap">                              <!-- 넓으면 이 안에서만 가로 스크롤 -->
  <table class="ggc-table">
    <caption class="ggc-sr">위원회별 의안 처리 현황</caption>
    <thead><tr><th scope="col">위원회</th><th scope="col" class="num">접수</th><th scope="col">상태</th></tr></thead>
    <tbody>
      <tr><td>기획재정위원회</td><td class="num">38</td><td><span class="ggc-badge ggc-badge--session">● 회기 중</span></td></tr>
    </tbody>
    <tfoot><tr><td>합계</td><td class="num">147</td><td></td></tr></tfoot>
  </table>
</div>

<!-- 키-값 2열 (상세 기본 정보) -->
<table class="ggc-table ggc-table--kv"><tbody>
  <tr><th scope="row">의안번호</th><td>BILL-2026-0417</td></tr>
</tbody></table>
```

## 변형

| 클래스 | 무엇 |
|---|---|
| `.num` (th·td) | 우정렬 + `tabular-nums` — 숫자 열 전부 |
| `tr.total` · `tfoot` | 합계행 — 상단 2px · 인셋 배경 · 800 |
| `--kv` | 키-값 2열, 라벨셀 인셋 배경 160px |
| `--flat` | 상단 브랜드선 없이 헤더 음영만 (목록 헤더 관례) |

글자 `--ggc-table-font`(업무 13 / 대민 17), 셀 패딩 `--ggc-cell-pad`(11×10 / 12×16).

## 규칙

- `<caption class="ggc-sr">` 를 둔다 — 스크린리더가 표 이름을 읽는다. `<th scope>` 를 빼지 않는다.
- 열은 **식별자 · 소관 · 기간 · 담당 · 상태** 가 있어야 업무 표다. 접수번호·문서번호는 **왼쪽 첫 열**.
- 정렬 기본값은 최근 접수순, 필터 기본값은 내 소관 · 처리 대기. 페이지네이션 없이 전량 렌더하지 않는다.
- 셀 전체에 `word-break: break-all` 을 걸지 않는다 — 식별자가 쪼개진다. 긴 경로·토큰은 `<code>` 로 감싸면 그 안에서만 끊긴다.
- 390px 에서 표가 페이지를 넘치게 두지 않는다 — 래퍼가 스크롤한다.

## Tier 2

`table` — `TableHead num` `TableCell num` `TableFooter` `TableCaption`(화면 밖).

## 근거

ggc-components.css §8 · 예산분석 비용추계.dc.html 5년 추계표 실측 · KRDS table · domain-language "밀도".
