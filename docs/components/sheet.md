# 정보 서랍 — `.ggc-modal--sheet` (v3.3)

**한 건의 부가 정보**를 오른쪽에서 덮어서 보인다 — 담당 · 소관 · 접수/수정 시각 · 장소 · 이력 요약.
목록에는 이름 · 상태 · 행동만 두고, 나머지는 「정보 보기」로 연다([ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md)).
모달(§19)의 변형이라 여닫기 · 초점 가두기 · ESC · 배경 클릭 · 초점 복귀가 모달과 같다.

## 언제 무엇을 쓰나

| 하려는 일 | 부품 |
|---|---|
| 집계 기준 · 용어처럼 짧은 설명 한 덩어리 | [토글팁](toggletip.md) |
| 고른 한 건의 부가 정보를 잠깐 확인 | **정보 서랍** |
| 확인 · 선택 · 짧은 입력을 마치고 돌아오기 | [모달](modal.md) |
| 목록을 바꿔 가며 문서를 계속 읽거나 고치기 | [두 칸 작업대](split.md) |
| 긴 본문 · 전체 이력 · 편집 · 결재 판단 | 상세 화면 |

## 마크업

```html
<!-- 상세 화면 주소가 기본 — 스크립트가 있으면 behaviors ② 가 가로채 서랍을 연다 -->
<a class="ggc-link ggc-link--quiet" href="/bills/2026-0147" data-ggc-modal-open="#bill-147">경기도 청년 기본조례 일부개정조례안</a>

<dialog class="ggc-modal ggc-modal--sheet" id="bill-147" aria-labelledby="bill-147-t">
  <div class="head">
    <h2 class="title" id="bill-147-t">경기도 청년 기본조례 일부개정조례안</h2>
    <button class="close" type="button" data-ggc-modal-close aria-label="닫기">
      <svg class="ggc-icon" aria-hidden="true"><use href="#i-x"/></svg>
    </button>
  </div>
  <div class="body">
    <dl>
      <dt>의안번호</dt><dd>2026-0147</dd>
      <dt>소관</dt><dd>기획재정위원회</dd>
      <dt>담당</dt><dd>정책지원관 이○○</dd>
      <dt>접수</dt><dd>2026-09-04 10:12</dd>
    </dl>
    <h3>처리 경과</h3>
    <ol class="ggc-text-list">…</ol>
  </div>
  <div class="foot">   <!-- 선택: 더 볼 곳이 있을 때만 -->
    <a class="ggc-btn ggc-btn--secondary" href="/bills/2026-0147">상세 화면 열기</a>
  </div>
</dialog>
```

여는 요소는 **이름이 보이는 링크나 단추**다(행 제목 · 「정보 보기」). 행 제목이면 상세 화면 주소를 `href` 에 두고 `data-ggc-modal-open` 을 더한다 — 스크립트가 없어도 같은 정보에 닿는다. 행 전체를 눌러 여는 것만으로 두지 않는다 — 키보드로 닿지 않는다.
본문의 `dl` 은 서랍 안에서 이름 · 값 두 칸으로 그려진다(따로 클래스가 없다). 머리는 대상 이름이다 — 페이지 h1 을 더하지 않는다.

## 변형·상태

| 무엇 | 어떻게 |
|---|---|
| 폭 | 400(`--ggc-space-11` × 5 — `.ggc-split` 기본 폭과 같다). ≤900 은 화면 가득 |
| 높이 | 화면 전체. 머리 · 바닥은 고정이고 본문만 스크롤한다 |
| 열기 | `data-ggc-modal-open="#id"` 또는 `GGC.openModal(el, opener)` — 열린 「전체메뉴」 서랍이 있으면 먼저 닫는다 |
| 움직임 | 열 때 한 번 오른쪽에서 밀려 들어온다. 「동작 줄이기」 설정이면 없다 |

## 키보드 · ARIA

`<dialog>` 의 `showModal()` 이라 배경이 실제로 막히고(inert) Tab 이 배경 요소로 가지 않는다(마지막 다음은 브라우저 주소창을 거쳐 서랍으로 돌아온다 — 네이티브 `<dialog>` 동작). 첫 초점은 `autofocus` > 본문 첫 입력 > 주 단추 > 닫기.
`Esc` · 닫기 단추 · 배경 클릭으로 닫히고, 초점은 연 요소로 돌아온다. 서랍 안 [토글팁](toggletip.md)이 열려 있으면 첫 `Esc` 는 토글팁만 닫는다.
이름은 `aria-labelledby` 로 머리 제목을 가리킨다. 긴 본문 전체를 `aria-describedby` 로 묶지 않는다.

## 주소 · 뒤로가기 (서비스 몫)

공통 JS 는 주소를 바꾸지 않는다. 서랍을 주소로 열게 하려면 서비스가 정한다 —
열 때 방문 기록 하나 추가 · 열린 채 다른 건을 고르면 교체 · 뒤로가기는 서랍을 닫고 목록 조건 · 스크롤을 되살린다.
주소에는 업무 식별자만 넣는다(개인정보 · 본문 · 토큰 금지). 스크립트가 없어도 같은 정보를 상세 화면 주소로 열 수 있어야 한다.

## 규칙

- **읽기 전용이다.** 편집 · 삭제 · 결재 확정을 서랍에 넣지 않는다 — 상세 화면이나 확인 모달이다.
- 목록에서 여러 행을 비교하는 항목(소관 · 접수일 등)은 서랍으로 빼지 않는다. 표에도 남긴다.
- 서랍 안에 서랍 · 모달을 겹치지 않는다(모달 안 모달 금지와 같다).
- 「전체메뉴」 서랍(오른쪽, 메뉴 전용)과 같은 쪽에서 나오지만 **머리가 다르다** — 메뉴는 「전체메뉴」, 정보 서랍은 대상 이름.

## 프로필

업무 · 대민 같다. 글자는 모달 본문을 따른다.

## Tier 2

`sheet`(`side="right"`) — shadcn 공식. 폭은 `className="w-[400px] sm:max-w-none"` 처럼 같은 값으로 맞춘다.

## 근거

[ADR 0015](../decisions/0015-key-info-on-screen-details-on-demand.md) · W3C APG Dialog (Modal) · 정본 §45.
