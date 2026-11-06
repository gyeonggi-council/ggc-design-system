# CLAUDE.md — Claude Code 에서 이 저장소를 다룰 때

정본 지시면은 **[`AGENTS.md`](AGENTS.md)** 하나다. 이 파일은 그것을 가리키고 Claude Code 에만 해당하는 것만 보탠다(ADR 0015 — 도구별 파일은 되풀이하지 않는다).

@AGENTS.md

## Claude Code 에서만

- 화면을 만드는 일(A)은 스킬 `/ggc-design` 으로 한다. 설치는 `bash tools/install-skill.sh`(링크 — 복사본을 만들지 않는다). 스킬은 `GGC_DS_ROOT` 또는 이 저장소를 정본 루트로 본다.
- 저장소를 고치는 일(B)은 AGENTS.md 의 「저장소를 고칠 때의 흐름」 그대로. 첫 명령은 `python tools/ggc.py specs --for <경로>`, 마지막은 `bash tools/check-all.sh`.
- 한 턴에 생성물을 손으로 고치지 않는다 — 생성기를 돌린다. 생성에 node · Chrome 이 필요한 것(README 미리보기 PNG)은 환경에 없으면 PR 본문에 적고 넘긴다.
- 커밋 · PR 본문에 모델 이름을 적지 않는다. PR 은 `.github/PULL_REQUEST_TEMPLATE/` 의 의도 하나.
