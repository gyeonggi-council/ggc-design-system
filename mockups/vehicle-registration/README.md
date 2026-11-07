# 차량등록지원 관리시스템 — 목업

경기도의회 청사 출입 차량(의원 · 직원 · 상시 방문)의 **등록 신청을 접수 · 검토 · 승인하고 등록 차량을 관리**하는 업무 화면 목업이다.
공통 디자인 시스템 **v4.0** 의 정본을 그대로 복사해 만들었고(값 복제 0), 사용자 지시(2026-11-07) "차량등록지원 관리시스템 만들어줘 목업으로"로 시작했다.

**여는 법** — 이 폴더를 내려받아 `index.html` 을 브라우저로 연다. 서버 · 빌드 · 설치 없음, 외부 요청 0(망분리 OK).

| 쪽 | 누가 · 무엇을 하러 | 패턴 |
|---|---|---|
| [`index.html`](index.html) | 담당자가 처리 대기 신청을 골라 승인/반려한다 — 첫 화면 | Explore |
| [`detail.html`](detail.html) | 신청 하나를 읽고 승인 · 반려를 결정한다 (중복 번호 경고 · AI 등록증 판독 · 검토 항목 · 확인 모달) | Learn/Decide |
| [`new.html`](new.html) | 대리 신청을 4단계로 작성한다 (등록증 올리면 자동 입력 · 소유자 불일치 오류) | Configure |
| [`vehicles.html`](vehicles.html) | 등록 차량 187대를 구역별로 보고 연장 · 변경 · 말소한다 (KPI 3) | Explore + KPI |

결정 기록 [`docs/design-decisions.md`](docs/design-decisions.md) · 증거 캡처 `docs/design-evidence/`(1440 · 390).
검사: `python design/check_design.py --gate mockups/vehicle-registration` → D1~D5 PASS.

가상 데이터다 — 차량번호 · 이름 · 소속 · 숫자 전부. 실제 등록 · 출입 시스템 · 문자 발송 · 등록증 판독은 동작하지 않는다.
실제 서비스로 만들 때는 이 폴더를 복사하지 말고 [스킬](../../skills/ggc-design/SKILL.md) 절차대로 정본에서 다시 복사한다(이 목업의 사본은 그날의 판이다).
