# vibe test — 지시면이 에이전트에게 충분한가를 잰다

**권위: current.** Astryx 의 `/vibe-test` 를 이 저장소 식으로 옮긴 것이다(ADR 0015). 에이전트에게 `AGENTS.md` **하나만** 주고 업무 · 대민 화면 7종을 만들게 한 뒤, 같은 검사기(`design/check_design.py --gate`)와 규칙 몇 개로 채점한다. 점수가 떨어지면 고칠 것은 에이전트가 아니라 **지시면**(AGENTS.md · 스킬 · 기록)이다.

```bash
bash tools/vibe-test/run.sh                       # 생성(claude CLI) + 채점 → tools/vibe-test/out/
bash tools/vibe-test/run.sh --only public-bills
python tools/vibe-test/grade.py tools/vibe-test/out          # 채점만 (다른 에이전트의 출력도 된다)
python tools/vibe-test/grade.py --self-check                 # 갤러리 7쪽으로 채점기 자체 검증 — 전부 통과해야 한다
```

| 파일 | 무엇 |
|---|---|
| `prompts.tsv` | 과제 7종(id · 프로필 · 과제 문장 · 기대). 기대 문법은 파일 머리에 |
| `grade.py` | 채점기 — `gate`(D1~D5) · `copies` · `h1=1` · `has:/no:` · `profile:` · `no-emoji` · `no-desc` |
| `run.sh` | 과제마다 `claude -p` 로 생성 → 채점. CLI 가 없으면 채점만 |
| `out/` | 출력(gitignore). 증거로 남기려면 `docs/design-evidence/` 에 날짜와 함께 옮긴다 |

## 규칙

- 채점 규칙은 **먼저 기록에 있어야 한다**(AGENTS.md 철칙 · 패밀리 계약 · 계약 §2). 채점기에만 있는 규칙은 만들지 않는다.
- `--self-check` 는 CI 가 돈다(`check-all.sh`) — 갤러리가 정본의 스모크 테스트이듯, 채점기의 스모크 테스트는 갤러리다.
- 생성 단계는 CI 가 돌지 않는다(모델 호출 · 비결정). 지시면을 크게 고친 PR 은 손으로 한 번 돌리고 결과 표를 PR 본문에 붙인다.
- 과제 문장은 **사용자가 실제로 하는 말**에 가깝게 둔다("의안 목록 화면을 만든다"). 클래스 이름을 과제에 적지 않는다 — 그걸 찾는 것이 지시면의 일이다.
