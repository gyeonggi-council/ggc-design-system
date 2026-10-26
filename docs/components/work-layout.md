# 반응형 업무 배치

`ggc-components.css`의 `.ggc-work`는 업무 화면의 선택적 배치다. 기존 토큰과 상태색을 사용한다.
v3.2([ADR 0014](../decisions/0014-mobile-menu-right-and-shared-rules.md))부터 **배치만** 맡는다 — 격자 · 영역 전환 · 필터 · 결과 표 · 결과 카드 · 편집 · 하단 동작.
예전에 여기에만 있던 카드 모서리 · 여백, KPI 치수, 목록 행 줄바꿈, 페이지 머리 정렬, 휴대폰 보정(단추 40 · 입력 16)은 기본 부품으로 옮겼다.
그래서 `.ggc-work` 를 붙이지 않은 화면에서도 부품 모양은 같다.
실물은 [대시보드](../../design/examples/dashboard.html), [의안 목록](../../design/examples/explore.html),
[초안 작성](../../design/examples/wizard.html)이다.

## 마크업

```html
<main class="ggc-shell-main ggc-work" data-pane="primary">
  <div class="ggc-page-head"><h1 class="ggc-page-title">업무 화면</h1></div>
  <div class="ggc-work-switch" aria-label="화면 보기">
    <button type="button" data-work-pane="primary" aria-pressed="true">업무</button>
    <button type="button" data-work-pane="secondary" aria-pressed="false">참고 자료</button>
  </div>
  <div class="ggc-work-grid">
    <section class="ggc-work-primary">업무 입력</section>
    <aside class="ggc-work-secondary">참고 자료</aside>
  </div>
</main>
```

좁은 화면에서는 선택한 영역을 보여주고, 넓은 화면에서는 두 영역을 나란히 보여준다.
서비스는 전환 버튼으로 main의 `data-pane`과 버튼의 `aria-pressed`를 함께 갱신한다.
DOM을 재생성하지 않아 입력값·선택·스크롤 상태를 보존할 수 있다.
예제의 데이터 처리 코드는 `examples.js`에 있으며 서비스에 그대로 복사하지 않는다.

## 목록과 입력

- `.ggc-work-filter`: 검색을 먼저 배치하고 상세 조건은 기본 `<details>`로 펼친다. 적용 조건 수를 표시한다.
- `.ggc-work-results`: PC에서는 고정 헤더를 갖는 표, 모바일에서는 카드 보기를 기본으로 한다.
  보기 전환 버튼으로 두 형태 모두 사용할 수 있다. 표와 카드에서 뺀 항목은 「정보 보기」 [정보 서랍](sheet.md)에서 모두 볼 수 있다(v3.3).
- 카드 보기는 목록 행 구조다(v3.2) — `article.ggc-work-record.ggc-list-row` 안에 `.body`(번호 · 제목 · 비교에 쓰는 메타 한 줄)와
  `.end`(상태 배지 위 · 동작 단추 아래 · 오른쪽 끝). 카드 제목은 자르지 않는다([list-row.md](list-row.md)).
- 결과 표는 열 폭이 고정이라 칸 글자를 말줄임하고, 상세 열기와 카드 보기에서 전체 내용을 제공한다. 표 내부만 가로 스크롤한다.
- 페이지 이동과 페이지당 건수는 동일한 결과 집합에 적용한다. 필터 변경 시 첫 페이지로 돌아간다.
- `.ggc-work-actions`: 이전·다음 작업을 화면 하단에 유지한다. 폼 내용을 덮지 않도록 문서 흐름 안에 둔다.
- 필수 입력 오류는 해당 단계를 열고 첫 오류 필드로 포커스를 옮긴다.
- 업무 통계 두 칸 유지 · 터치 단추 40(업무 셸 안) · 입력 글자 16 은 v3.2 부터 기본 부품 규칙이다 — `.ggc-work` 없이도 걸린다([stat.md](stat.md) · [button.md](button.md) · [field.md](field.md)).

## 접근성·검증

필터는 기본 HTML `details`·`summary`, 보기 전환은 `aria-pressed` 버튼, 상세는 `dialog`를 사용한다.
메뉴는 닫힌 상태에서 `inert`이며 열기·닫기·Escape·Tab 순환·포커스 복귀를 공통 동작이 처리한다.
모바일에서 접은 정보와 기능을 삭제하지 않는다. 색 외에도 텍스트와 선택 상태를 표시한다.
인쇄 시 업무·참고 영역을 함께 출력한다.

`node tools/check-responsive.cjs`로 갤러리의 여섯 화면 폭과 주요 동작을 검증한다.
필요한 개발 의존성은 `playwright-core`, 브라우저 경로는 `GGC_CHROME`으로 지정할 수 있다.
결과는 [검증 기록](../design-evidence/after/responsive.json)과
[동작 기록](../design-evidence/after/interactions.json)에 남는다.

## 예제의 범위

검색·정렬·필터·페이지 이동·상세 조회·CSV 다운로드는 예시 의안으로 동작한다.
초안은 사용 중인 브라우저에 임시저장하고 파일로 내려받을 수 있다. 실제 제출·회부 API는 호출하지 않는다.
실제 서비스는 동일한 접근 가능한 UI에 권한, 데이터 조회, 저장 및 업무 처리 API를 연결해야 한다.
