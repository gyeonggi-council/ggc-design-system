## 의도 — 갤러리 (`design/examples/**`)

<!-- 어느 쪽에 무엇을. 새 쪽이면 design/templates.tsv 에 틀로 등록했나 -->

## 지키는 것

- [ ] 값 하드코딩 0 — 정본을 상대경로로 링크, 스와치는 `getComputedStyle`
- [ ] 마크업 블록은 손으로 적지 않았다(`ex-reveal` 이 DOM 을 읽는다)
- [ ] 덜어내기(`docs/guides/less.md`) 판정 — 인사말 · 설명 줄 · 중복 건수 · 상시 단계 막대 없음
- [ ] h1 하나(본문 첫 줄) · 헤더는 브레드크럼만 · 이모지 0 · 빈/오류/로딩 상태가 있는 부품은 셋 다
- [ ] 휴대폰: CI 왼쪽 「전체메뉴」 오른쪽 · 바닥 탭바 없음 · 390 가로 스크롤 0

## 생성물

- [ ] `python design/examples/build-standalone.py` · `python design/examples/build-shots.py`(node · playwright · Chrome)
- [ ] 새 쪽이면 `build-standalone.py` · `build-shots.py` 의 목록에 등록

## 검사 · 증거

- [ ] `bash tools/check-all.sh` 마지막 줄:
- [ ] `node tools/check-responsive.cjs` (CI responsive) 통과
- [ ] 1440×900 · 390×844 캡처
