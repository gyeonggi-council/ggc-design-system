# PR 를 내는 법 — 의도 하나, 검사 전부

**권위: current.** 한 PR 은 **한 가지 의도**다. 의도에 맞는 템플릿을 고르면 체크리스트가 따라온다(`.github/PULL_REQUEST_TEMPLATE/`).

## 의도 다섯

| 의도 | 템플릿 | 무엇이 바뀌나 | 특히 보는 것 |
|---|---|---|---|
| 정본 변경 | [`canon.md`](../../.github/PULL_REQUEST_TEMPLATE/canon.md) | `design/ggc-*.css` · `ggc-behaviors.js` · 아이콘 · 폰트 | ⚠ D1 — 토큰 바이트가 바뀌면 11개 서비스가 재복사한다. CHANGELOG 에 표시 |
| 지식 기록 | [`record.md`](../../.github/PULL_REQUEST_TEMPLATE/record.md) | `docs/**` · `skills/**` · `AGENTS.md` | 쓰기 기준표 결과를 PR 본문에 · `records.tsv` 등록 · 값을 옮겨 적지 않았나 |
| 갤러리 | [`gallery.md`](../../.github/PULL_REQUEST_TEMPLATE/gallery.md) | `design/examples/**` | 생성물 셋 재생성 · 1440/390 캡처 · 값 하드코딩 0 |
| Tier 2 레지스트리 | [`registry.md`](../../.github/PULL_REQUEST_TEMPLATE/registry.md) | `registry/ggc/**` · `registry.json` · `public/r` | shadcn 공식 소스 기준 diff 가 치수·색뿐인가 · `.dark` 없음 · R1~R5 |
| 도구 · CI | [`tooling.md`](../../.github/PULL_REQUEST_TEMPLATE/tooling.md) | `tools/**` · `design/check_design.py` · `.github/**` | 검사가 더 엄해졌으면 기존 트리가 통과하는가 · 느슨해졌으면 왜 |

GitHub 에서 고르는 법: PR 만들기 주소 뒤에 `?template=canon.md` 처럼 붙인다. 기본 템플릿이 다섯 링크를 보여 준다.

## 올리기 전 (CI 와 같다)

```bash
python tools/ggc.py specs --diff origin/main   # 바뀐 파일을 지배하는 기록 — 기록이 바뀌어야 하면 같은 PR 에서
bash tools/check-all.sh                        # D6 · D1~D5 · 링크 · R1~R5 · K1~K6
```

생성물이 낡았다고 나오면 손으로 고치지 말고 생성기를 돌린다(`AGENTS.md` 「무엇을 고치면 무엇을 다시 만드나」).

## PR 본문에 반드시 있는 것

1. **의도 한 줄** — 무엇이 왜 바뀌나. 사용자 지시가 있었으면 그 말을 인용한다(이 저장소의 결정은 대부분 사용자 말에서 났다).
2. **지배 기록** — `specs --diff` 결과 중 이 변경이 바꾸는 기록. 기록을 안 바꿨다면 "기록 변경 없음 — 이유".
3. **검사 결과** — `check-all` 마지막 줄. 정본 변경이면 D1 영향(재복사 필요 여부).
4. **증거** — 화면이 바뀌면 1440×900 · 390×844 캡처. 접근성에 닿으면 키보드 경로.

## 하지 않는 것

- 생성물만 고치는 PR (정본을 고치고 생성한다)
- 마스킹을 되돌리는 커밋 (공개 저장소 — `check-links.py` 가 잡는다)
- 한 PR 에 정본 변경 + 레지스트리 + 기록 대개편을 섞는 것 — 리뷰가 불가능해진다. 정본 변경에 따라오는 기록 수정은 예외(같은 PR)
- 검사를 통과시키려고 검사를 끄는 것. 검사가 틀렸으면 `tooling` 의도의 별도 PR
