## 의도 — 정본 변경 (`design/ggc-*.css` · `ggc-behaviors.js` · 아이콘 · 폰트)

<!-- 무엇이 왜 바뀌나. 사용자 지시가 있었으면 인용 -->

## ⚠ D1 영향

- [ ] 토큰/컴포넌트/동작 파일 **바이트가 바뀐다** → CHANGELOG 에 `⚠ D1` · 소비 서비스는 `python tools/ggc.py upgrade <서비스>` 로 재복사
- [ ] 바이트 변경 없음(문서 · 갤러리만)

## 지키는 것

- [ ] 새 색 없음 · 새 토큰 **이름**만 늘었다(기존 이름 불변) · 다크 블록 없음
- [ ] 프로필 블록에는 치수만(색 · 포커스 · 서체 없음)
- [ ] 값은 토큰 — 부품 CSS 에 리터럴 없음 · `outline:none` 대체 없이 없음 · §36 고대비 보강
- [ ] 기존 선택자 무변경(새 § 절은 파일 끝에) · 패밀리 계약(`docs/families/`)을 따른다
- [ ] 아이콘은 lucide · 이모지 0

## 지배 기록 (`python tools/ggc.py specs --diff origin/main`)

<!-- 바뀐 선택자의 컴포넌트 기록 · 계약 §n · 패밀리 — 같은 PR 에서 현재형으로 고쳤나 -->

## 생성물 재생성

- [ ] `python tools/build-design-md.py` · `python design/examples/build-standalone.py` · `python design/examples/build-shots.py`(node · Chrome)
- [ ] (아이콘) `python design/build-icons.py` · (토큰) `python design/examples/build-preview.py` · `python design/ppt/build-ppt.py`

## 검사 · 증거

- [ ] `bash tools/check-all.sh` 전부 통과 — 마지막 줄:
- [ ] 1440×900 · 390×844 캡처 · 콘솔 0 · 가로 오버플로 0
- [ ] 키보드로 바뀐 부품을 끝까지 조작했다
