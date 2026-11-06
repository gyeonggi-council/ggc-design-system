# 패밀리 — 형제 부품이 함께 지키는 계약

**권위: current.** 부품 하나의 규칙은 `docs/components/<id>.md` 에 있다. 그런데 어떤 규칙은 부품 하나의 것이 아니다 — 입력 컨트롤 전부의 높이, 뜨는 층 전부의 닫는 법, 상태 부품 전부의 "색만으로 말하지 않기". 그런 규칙을 부품마다 되풀이하면 두 달 뒤에 갈라진다(이 저장소가 겪은 실패의 형태다). 그래서 **패밀리** 기록 하나에 두고 부품 기록은 링크한다.

| 패밀리 | 형제 | 계약 |
|---|---|---|
| [입력 컨트롤](form-controls.md) | `.ggc-field` `.ggc-select` `.ggc-check` `.ggc-radio` `.ggc-chip` `.ggc-switch` `.ggc-date` `.ggc-file` `.ggc-listbox` `.ggc-search` | 높이 · 글자 토큰 · 라벨/힌트/오류 순서 · 비활성 · 휴대폰 16 |
| [뜨는 층](overlays.md) | `.ggc-modal` `.ggc-menu` `.ggc-tooltip` `.ggc-toast` 「전체메뉴」 서랍 | 한 번에 하나 · 포커스 가두기와 돌려주기 · Esc · 그림자는 여기만 |
| [상태 보이기](status.md) | `.ggc-badge` `.ggc-tag` `.ggc-alert` `.ggc-toast` `.ggc-progress` `.ggc-job` `.ggc-empty` `.ggc-spinner` `.ggc-skeleton` | 색 단독 금지 · 어느 부품이 어느 상태를 맡나 · 상태 사전 |
| [셸](shell.md) | 업무 `.ggc-shell` · 대민 `.ggc-header` 계열 · 1인 링크 `.ggc-solo` · `.ggc-page-head` | h1 하나 · 브레드크럼은 헤더 · CI 왼쪽 「전체메뉴」 오른쪽 · 바닥 탭바 없음 · 한글 줄바꿈 |

## 규칙

- 새 부품은 패밀리 하나에 들어간다. 어느 패밀리에도 안 맞으면 그것이 새 패밀리의 신호다 — 둘째 형제가 생길 때 패밀리 기록을 쓴다.
- 패밀리 계약을 어기는 부품은 없다. 예외가 필요하면 패밀리 기록에 예외와 사유를 적는다(부품 기록에만 적으면 형제가 모른다).
- 패밀리 기록에도 **값은 없다.** 토큰 이름과 판정법만.
- 틀: [templates/knowledge/family.md](../templates/knowledge/family.md).
