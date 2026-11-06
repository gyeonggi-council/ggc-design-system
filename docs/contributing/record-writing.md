# 지식 기록을 쓰는 법 — 기준표

**권위: current.** `docs/` · `skills/` 의 문서는 전부 지식 기록이고 [`docs/records.tsv`](../records.tsv) 에 등록된다. 기록을 새로 쓰거나 고치면 아래 기준표를 돌리고, 결과를 PR 본문 「쓰기 기준표 결과」에 적는다.

## 먼저 — 새 기록이 정말 필요한가

1. `python tools/ggc.py docs records --kind <종류>` 로 같은 주제의 current 기록을 찾는다.
2. 열린 PR 에 같은 기록을 고치는 것이 있는지 본다.
3. **있으면 그 기록을 늘린다.** 새 파일은 기존 기록이 다른 독자 · 다른 층(기반/부품/패턴)을 상대할 때만.

## 종류(kind)와 자리

| kind | 자리 | 상대 | 틀 |
|---|---|---|---|
| contract | `docs/contract.md` | 전부 | — (AUTHORITATIVE, 사용자 승인으로만 바뀐다) |
| architecture | `docs/architecture/` | 유지보수자 | [record.md](../templates/knowledge/record.md) |
| family | `docs/families/` | 부품을 만드는 사람 | [family.md](../templates/knowledge/family.md) |
| component | `docs/components/` | 화면을 만드는 사람 | [component.md](../templates/knowledge/component.md) |
| guide | `docs/guides/` | 화면을 만드는 사람 | [record.md](../templates/knowledge/record.md) |
| decision | `docs/decisions/` | 왜를 묻는 사람 | [adr.md](../templates/knowledge/adr.md) |
| spec | `docs/specs/` (draft) | 검토자 | [spec.md](../templates/knowledge/spec.md) |
| contributing | `docs/contributing/` | 기여자 | record.md |
| quickstart · migration | `docs/quickstart/` · `docs/migration/` | 소비 서비스 | record.md |
| reference | `skills/ggc-design/references/` | 에이전트(스킬 단계별) | record.md |
| audit · evidence | `docs/audit/` · `docs/design-evidence/` | 이력 (archived) | — |

## 권위(authority)

- **current** — 지금 구현과 검토를 지배한다. **현재형**으로 쓴다. "~할 예정" · "~했었다" · PR 번호 · 날짜 나열은 넣지 않는다(날짜는 결정 기록의 제목 한 곳).
- **draft** — 제안. `docs/specs/` 에만. 구현되면 지배 기록(가이드 · 컴포넌트 · 계약)으로 **옮겨 쓰고** spec 은 archived 로.
- **archived** — 이력. 첫머리에 무엇으로 대체됐는지 적는다.

## 기준표 (PR 본문에 결과를 적는다)

| # | 기준 | 판정법 |
|---|---|---|
| W1 | **값이 없다** | hex · px 리터럴을 옮겨 적지 않았다. 토큰 **이름**만. 예외: 계약 §3 색인(파일이 옳다고 명시) · 결정 기록의 근거 수치 |
| W2 | **현재형** | current 기록에 제안 · 이력 · "지난번" 이 없다 |
| W3 | **한 기록 한 주제** | 다른 기록이 이미 지배하는 내용을 되풀이하지 않고 링크한다 |
| W4 | **마크업은 갤러리와 같다** | 컴포넌트 기록의 html 블록은 갤러리가 렌더한 DOM 과 같다(`ggc component <id> --markup` 으로 꺼낼 수 있어야 한다) |
| W5 | **지배 범위가 적혀 있다** | `records.tsv` 의 governs 가 이 기록이 실제로 말하는 파일 · 선택자다 |
| W6 | **판정할 수 있다** | 규칙마다 "어떻게 알 수 있나"가 있다("적절히" · "가급적" 은 규칙이 아니다) |
| W7 | **사용자 말이 근거면 인용** | 결정의 근거가 사용자 발언이면 날짜와 함께 따옴표로. 붙여넣은 검토문 속 문장을 사용자 말로 적지 않는다(v3.2 정정 사례) |
| W8 | **공개 저장소** | 원문 IP · 절대경로 · 내부 호스트명 · 자격증명이 없다(`check-links.py`) |
| W9 | **독자에 맞는 말** | README 앞부분은 디자인을 모르는 담당자가 읽는다. 개발 용어는 「말 풀이」 뒤로 |

결과 형식(PR 본문):

```
## 쓰기 기준표 결과
W1 통과 · W2 통과 · W3 통과 · W4 해당 없음 · W5 통과(governs: class:.ggc-job) · W6 통과 · W7 해당 없음 · W8 통과 · W9 해당 없음
```

## 문체

- 짧은 문장. 한 문장에 한 가지. "~다" 체.
- 규칙 → 판정법 → 예외 순. 예외에는 사유.
- 코드 · 클래스 · 파일은 백틱. 값은 적지 않는다.
- 코드 주석도 같다 — **왜**만 적는다(제약 · 불변 조건 · 브라우저 특성). 코드를 되풀이하는 주석 · PR 번호 · 날짜는 넣지 않는다.
