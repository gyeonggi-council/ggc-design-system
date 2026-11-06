## 의도 — 지식 기록 (`docs/**` · `skills/**` · `AGENTS.md`)

<!-- 어떤 기록을 왜. 새 기록이면 기존 기록을 늘릴 수 없었던 이유 -->

## 등록

- [ ] `docs/records.tsv` 에 kind · authority · governs 가 맞다 (새 기록이면 행 추가)
- [ ] draft 는 `docs/specs/` · archived 는 첫머리에 대체 기록
- [ ] 색인에 한 줄: `docs/README.md` / `docs/components/README.md` / `docs/decisions/README.md` / `docs/families/README.md` 중 해당
- [ ] 스킬 참조(`skills/ggc-design/references/`)가 같은 것을 말하면 그쪽도 고쳤다

## 쓰기 기준표 결과 (`docs/contributing/record-writing.md`)

<!-- W1 값 없음 · W2 현재형 · W3 한 주제 · W4 마크업=갤러리 · W5 governs · W6 판정 가능 · W7 사용자 말 인용 · W8 공개 · W9 독자
     예: W1 통과 · W2 통과 · W3 통과 · W4 해당 없음 · W5 통과(governs: class:.ggc-job) · W6 통과 · W7 해당 없음 · W8 통과 · W9 해당 없음 -->

## 검사

- [ ] `python tools/check-knowledge.py` FAIL 0
- [ ] `python tools/check-links.py` 깨진 링크 0
- [ ] `bash tools/check-all.sh` 마지막 줄:
