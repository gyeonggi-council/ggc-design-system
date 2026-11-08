# 샘플 목업 — 업무용 한 장 · 대민용 한 장

공통 디자인 시스템 **v4.0** 정본을 그대로 복사해 만든 견본 화면 두 장이다(값 복제 0). 사용자 지시(2026-11-08) "샘플용 목업 파일 하나 만들어 봐 대민용과 내부용 해서 각각, 모바일에서도 다운 받을 수 있게"로 시작했다.

| 쪽 | 누가 · 무엇을 하러 | 프로필 · 패턴 |
|---|---|---|
| [`work.html`](work.html) | 의정자료 담당자가 의원 자료요구의 회신 기한을 보고 독촉 · 처리할 건을 고른다 | 업무 · Explore |
| [`public.html`](public.html) | 도민이 의안 · 회의를 찾거나 진행 중인 의견 제출 · 방청 신청으로 들어간다 | 대민 · 메인 |

**여는 법** — 이 폴더를 내려받아 쪽을 브라우저로 연다. 서버 · 빌드 · 설치 없음, 외부 요청 0.

**파일 하나로 받기(휴대폰)** — 아래 명령이 CSS · 폰트 · 아이콘 · 스크립트를 한 파일에 넣는다. 합본은 커밋하지 않는다.

```bash
python mockups/sample/build-single.py <출력 폴더>   # ggc-sample-work.html · ggc-sample-public.html
```

결정 기록 [`docs/design-decisions.md`](docs/design-decisions.md). 검사: `python design/check_design.py --gate mockups/sample --aa=observe` → D1~D5 PASS.

가상 데이터다 — 의원명 · 요구 내용 · 기관 · 일정 · 안건 · 소식 전부. 실제 서비스로 만들 때는 이 폴더를 복사하지 말고 [스킬](../../skills/ggc-design/SKILL.md) 절차대로 정본에서 다시 복사한다.
