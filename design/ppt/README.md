# design/ppt — 대외 발표용 PPT 템플릿 (생성물)

`build-ppt.py` 가 `design/ggc-tokens.css` 의 값을 읽어 `dist/` 를 만든다. **`dist/` 를 손으로 고치지 않는다** — 다음 생성에서 덮어써진다.

| 파일 | 무엇 |
|---|---|
| `dist/ggc-presentation-template.pptx` | 16:9 · 레이아웃 10종(표지 · 목차 · 섹션 · 불릿 · 2단 · 이미지 · 표 · 차트 · 핵심 수치 · 마무리) |
| `dist/ggc-presentation-sample.pptx` | 12장 샘플 — "의정정보시스템 소개" (설명회 어휘 · 예시 데이터) |
| `dist/manifest.json` | 입력 해시 · 레이아웃 목록 (`check_design.py --canon` D6 gen) |

```bash
python design/ppt/build-ppt.py           # 생성 (pip install python-pptx)
python design/ppt/build-ppt.py --check   # 신선도 (stdlib)
```

쓰는 법 · 규칙: [docs/guides/ppt.md](../../docs/guides/ppt.md). 서체 Pretendard GOV(미설치 시 맑은 고딕).
