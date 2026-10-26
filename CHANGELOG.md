# Changelog

소비자(11개 서비스)에게 영향이 있는 변경을 적는다.
**토큰 파일 바이트가 바뀌는 변경은 D1 재복사가 필요하다** — 그런 항목은 ⚠ D1 로 표시한다.

## [3.3.0] — 2026-10-26 ⚠ D1 · 핵심만 화면에, 보조 정보는 한 번 눌러서

사용자 지시 "화면에는 중요한 메뉴정보만 · 자세한 정보는 툴팁 · 메뉴가 많으면 사이드 내비 · 간단한 정보는 오른쪽 드로어 · 왼쪽 사이드바는 숨김 표시".
Codex(gpt-6-astra, ultra) 상의 · frontend-design 플러그인(Anthropic 공식) 절차 적용. 결정: [ADR 0015](docs/decisions/0015-key-info-on-screen-details-on-demand.md).
**토큰 파일은 바뀌지 않았다.** 컴포넌트 CSS · 동작 JS 바이트가 바뀌어 ⚠ D1 이다 — 서비스는 그 화면을 다음에 고칠 때 재복사한다(일괄 재복사 안 함, ADR 0012-7).
옛 마크업은 그대로 동작한다 — 새 기능은 모두 쓰는 쪽이 켠다.

- **컴포넌트 v3.3.0** ⚠ D1
  - §45 `.ggc-modal--sheet` — 오른쪽 정보 서랍(모달의 변형). 폭 400 · ≤900 가득 · 본문만 스크롤 · 열 때 한 번 밀려 들어옴(동작 줄이기면 없음). 읽기 전용.
  - §46 `.ggc-toggletip` — ⓘ 를 누르면 열리는 짧은 설명(네이티브 `<details>`). 폭 320 · `--end`.
  - §33 툴팁 — 포인터를 툴팁 위로 옮겨도 닫히지 않는다(WCAG 1.4.13 hoverable — 전에는 `pointer-events:none` 과 8px 간격 때문에 닫혔다). `--float`(아이콘 줄 이름 전용) 신설.
  - §9 LNB 완전 숨김 — `.ggc-lnb[data-ggc-lnb-collapse="hide"]` 이면 PC 단추가 메뉴를 숨긴다(`.ggc-lnb--hidden`). 속성이 없으면 아이콘 줄 그대로.
  - §3 KPI 라벨 줄 최소 높이 24 — ⓘ 가 있는 타일과 없는 타일의 숫자 줄이 맞는다.
- **동작 v3.3.0** ⚠ D1 — ② 정보 서랍을 열면 열린 「전체메뉴」 서랍을 닫는다 · 서랍도 뒤 문서를 고정한다 / ③ 접힘 · 숨김을 `localStorage` 에 서비스(첫 경로 조각, `data-ggc-lnb-key`)마다 기억 · 단추 이름 「메뉴 숨기기」/「메뉴 표시」 · 아이콘 줄 이름을 디자인 툴팁으로(브라우저 기본 `title` 넣기는 지움) / ⑥ 토글팁 ESC · 바깥 누르기 · 하나만 열기 · 가장자리 보정 — 서랍 안에서는 첫 ESC 가 토글팁만 닫는다. `GGC.initToggletips` 공개.
- **인벤토리** `components.tsv` — `sheet` · `toggletip` 행 · `modal` 에 `--sheet` · `drawer` 는 메뉴 전용이라고 밝힘.
- **문서** — 신설 `components/sheet.md` · `components/toggletip.md` · ADR 0015. 계약 §2 · §4 · §13(신설) · `guides/less.md`(「덜어낸 정보는 어디로」 배치표) · `layout-shell.md` · `shell.md` · `tooltip.md`(경계 표 · 실행 결과 예시 교체) ·
  처방형 문장을 조건형으로 — `table.md`(열 다섯 필수 → 비교 · 정렬 · 선택에 쓰는 열만) · `stat.md`(정확히 4 → 쓰임이 있을 때 0~4 · 추세 줄 기본 없음) · `page-head.md` · `list-row.md`(메타 줄 기본 없음) · `card.md`(부제 기본 없음) · `work-layout.md` · `detail-layout.md` · `sidebar.md`(6개 넘으면 "화면을 줄인다" → "구조를 검토한다") · 스킬 `SKILL.md` · `references/{components,archetypes}.md` · README.
- **갤러리** — 업무 13쪽 LNB 숨김 방식 · 대시보드(추세 줄 · 부제 · 행 메타 → 토글팁 · 정보 서랍, 위원회별 표 · 예산 단계 막대는 뺌) · 의안 목록(9열 → 6열, 종류 · 제안자 · 경과는 정보 서랍 · CSV) ·
  오버레이(토글팁 · 정보 서랍 절) · 내비게이션(왼쪽 메뉴 절 · 인사말 설명 줄 교체) · 덜어내기(옮길 자리 다섯 표). README 미리보기 캡처 재생성.
- 검증 — `check-all.sh` 전부 통과 · 브라우저 실측 75항목(서랍 초점 · Esc 순서 · 숨김 기억 · 저장 막힘 · 옛 마크업 아이콘 줄 · 툴팁 hoverable · 320/390/900/901/1440 가로 넘침 0 · 동작 줄이기 · 고대비).

## [3.2.2] — 2026-10-25 ⚠ D1 · 서명 패드가 좁은 화면에서 넘치던 것

출석 서비스에 v3.2 를 옮기다 잡았다 — 페이지 안에 둔 `.ggc-signature`(문서의 기본 마크업)가 400px 보다 좁은 화면에서 본문 밖으로 나갔다(390 에서 26px · 320 에서 96px).
갤러리는 서명 패드를 전체 화면 창 안에만 둬서(`aspect-ratio: auto`) 드러나지 않았다.

- **컴포넌트 v3.2.2** ⚠ D1 — §41 `.ggc-signature` 열 `minmax(0, 1fr)` · `.ggc-signature-pad` `width: 100%`. 원인: 비율을 가진 격자 칸은 늘어나지 않고 높이 하한(`--ggc-space-11` × 2) × 5/2 = 400px 폭이 됐다.
  좁은 화면에서는 높이 하한이 이겨 비율이 조금 낮아진다. 1440 · 전체 화면 창의 패드 크기는 그대로다.
- §41 「다시 쓰기」 단추 `flex-shrink: 0` — 상태 문구(「서명을 입력했습니다 — 아직 제출되지 않았습니다」)가 길면 단추 글자가 두 줄로 눌렸다(390 · 360 · 320).
- 문서 `components/signature.md` 프로필 절에 한 줄. 새 값 · 새 선택자 없음(기존 선택자에 속성만).
- 이 결함을 서비스 CSS 로 막아 둔 곳(`ggc-member-attendance` 의 `globals.css` 두 줄)은 재복사 뒤 그 줄을 지운다.

## [3.2.1] — 2026-10-25 ⚠ D1 · 상단 통합서비스 띠 기본 숨김 · 1인 링크 화면 셸 예외 승인

사용자 결정(2026-10-25) "상단 띠는 숨기고, 1인 링크 예외는 그대로 승인해".

- **토큰 v3.2.1** ⚠ D1 — `.ggc-utility-bar` 기본 `display: none`. v1.2 플랫폼 판의 2026-08-25 결정과 같다 — 서비스 간 이동은 GNB 와 SSO 가 맡는다.
  마크업은 지우지 않는다(검사기 D3 가 존재를 본다). 띠가 필요한 문서 허브만 서비스 CSS 에서 `display` 를 되돌린다. 값 · 다른 선택자는 그대로다.
- **계약** §2 에 띠 기본 숨김 · §9 휴대폰 1인 링크 화면(`.ggc-solo`)의 대민 셸 생략을 **사용자 승인**으로 적었다(문구는 그대로).
- **문서** `components/shell.md` · `guides/layout-shell.md` · 스킬 `SKILL.md` · 이전 안내 `migration/v3.1-to-v3.2.md`(v1.2 사본을 옮겨도 띠가 다시 나타나지 않는다 · v3.0/v3.1 사본은 재복사하면 띠가 사라진다) · 갤러리 첫 쪽 안내 문구.

## [3.2.0] — 2026-10-24~25 ⚠ D1 · GitHub 식 정돈 · 서비스 부품 다섯 · 판 갈라짐 바로잡기 · 휴대폰 메뉴 오른쪽 · 같은 부품 규칙

사용자 지시 "모든 서비스 목록을 참고해서 UI/UX 개선 · GitHub UI·claude.ai 도 고려". 서비스 18개 실측(정본 v3 6 · **v1.2 사본 12**) ·
세션 기록 속 화면 발언 1,076건 · Primer/claude.ai 공식 문서 조사 · Codex(gpt-6-astra, ultra) 교차 검토 2회. 결정: [ADR 0013](docs/decisions/0013-github-tidy-and-shared-parts.md).
이전 안내: [docs/migration/v3.1-to-v3.2.md](docs/migration/v3.1-to-v3.2.md).

- **토큰 v3.2** ⚠ D1 — 면은 흰 바탕 + 테두리: `--ggc-bg` #eef1f5 → #ffffff · `--ggc-border` #e6ebf1 → #d5dce5 · `--ggc-shell-border` #e2e7ee → #d5dce5 ·
  `--ggc-radius/-sm/-lg` 10/6/14 → 6/4/12 · `--ggc-shadow-primary` → none · 고대비(prefers-contrast) 테두리 #b9c6da. **새 색 없음**(전부 이미 있던 값).
  유틸리티 바 「통합서비스」 라벨 #9cb0cd(4.02:1) → #c9d6ea(6.04:1).
- **컴포넌트 v3.2** ⚠ D1 — 제목 굵기 600(카드 머리 · 행 제목 · 페이지 제목 · 알림 · 모달 · 토스트 · 빈 상태 · `.ggc-h1~3`) · ≤900px 액션바가 저장 상태를 숨기지 않는다 ·
  체크·라디오 상자 테두리 → `--ggc-text-faint`(3.07:1, WCAG 1.4.11). **파일 끝 §38~§44 신설**(기존 선택자 무변경): `.ggc-progress` · `.ggc-job`(긴 작업 진행, 상태 8종) ·
  `.ggc-solo`(휴대폰 1인 링크 화면, 100svh · 글자 크게) + `.ggc-modal--full` · `.ggc-signature`(서명 패드) · `.ggc-viewer`(문서 미리보기 틀) · `.ggc-split`(좌우 두 칸) · 고대비 보강.
- **동작 v3.2** ⚠ D1 — `ggc-behaviors.js` ⑪ 경과 시간·오래 걸림 ⑫ 글자 크게·iOS 키보드 ⑬ 서명(획 보존·비율 유지) ⑭ 문서 보기(배율·쪽) ⑮ 두 칸(끌기·키보드·좁게/넓게·폭 기억) ·
  ② 모달 `--full` 이 열린 동안 뒤 문서 고정.
- **가이드** 신설 [docs/guides/states.md](docs/guides/states.md) — 기다림 시간 기준 · 저장과 제출 · 폼 오류 · 못 쓰는 이유 · 빈 화면 넷 · 기능 저하 · 알림 위치 · 상태 사전 · 상자 하나에 행 목록.
  `components/toast.md`: 토스트는 기본 알림 수단이 아니다. 부품 문서 6 신설. 계약 §2 · §3 · §9(1인 링크 화면은 대민 셸 생략) · §12 신설.
- **갤러리** `workbench.html`(두 칸 + 문서 보기 + 긴 작업 — 상태 바꾸기) · `public/solo.html`(휴대폰 1인 링크 + 서명 전체 화면 창) 신설 · 대시보드 행마다 반복되던 같은 아이콘 받침 제거 · 전 쪽 LNB 두 항목.
- **검사기** D1 이 사본의 판을 적는다(「사본 v1.2 · 정본 v3.2 — 옛 판이다」) · `.claude`(worktree 사본) 건너뜀 · Next `app/favicon.ico` · Docusaurus `favicon:` 를 선언으로 인정.
- **도구** 신설 `tools/sync-canon.py` — 사본을 최신 / 공식 옛 판 / 현지 수정본으로 가르고, `--apply` 는 공식 옛 판만 바꾼다(기본은 미리보기).
- **정정** ADR 0012 · less.md 근거의 "화면마다 핵심 버튼 하나만 강조하고"(10-06)는 사용자 본인 말이 아니라 붙여넣은 검토문 속 문장이었다.
- **저장소 밖(플랫폼 폴더)** 새 서비스 틀 `_template` 의 사본을 v1.2 → v3.2 로(옛 사본 보관) · 배포 게이트 스윕이 v3 정본의 검사기를 부른다(v3 서비스 넷의 거짓 MISMATCH 해소, v1.2 서비스는 MISMATCH 로 드러남).
- **기존 서비스는 일괄로 옮기지 않는다** — 그 화면을 다음에 고칠 때 `sync-canon.py` 로 재복사하고 화면을 확인한다.

**10-25 추가 — 모든 쪽이 같은 부품 규칙**(사용자 지시 "모든 디자인 페이지에 동일하게 · CI 왼쪽이면 햄버거 오른쪽? 바닥 메뉴?"). 갤러리 18쪽 + 목업 41장을 Codex(ultra, 하위 에이전트 다섯)가 감사. 결정: [ADR 0014](docs/decisions/0014-mobile-menu-right-and-shared-rules.md).

- **셸** ⚠ D1 — ≤900 GNB 는 CI 왼쪽 · 「전체메뉴」 오른쪽, LNB 는 **오른쪽 서랍**(대민 셸과 같은 자리·폭·머리 「전체메뉴」+닫기). PC 접기는 `[data-ggc-lnb-toggle]`(GNB 맨 앞)로 나눔 —
  behaviors 가 두 단추를 만들고 옛 마크업의 서랍 단추는 맨 끝으로 옮긴다(서비스 마크업 변경 불필요). ≤600 GNB 검색은 아이콘으로 접혔다가 누르면 펼쳐진다. **바닥 탭바는 두지 않는다.**
- **같은 부품 한 모양** ⚠ D1 — 모서리 리터럴 → 토큰(카드·KPI·위저드 `--ggc-radius-lg` · 입력·작은 단추·아이콘 상자 `--ggc-radius` · 태그 `--ggc-radius-sm`, 태그 글자 `--ggc-text-xs`) ·
  카드 머리·바닥 여백 = `--ggc-row-pad` · `.ggc-work` 에만 있던 카드·KPI·행·페이지 머리·휴대폰 보정을 기본 부품으로(`.ggc-work` 는 배치만).
- **목록 행** ⚠ D1 — 제목 16 · 자르지 않고 줄바꿈 · `.end` 에 단추가 있으면 상태 위 · 단추 아래 · 오른쪽 끝(사용자 확정) · 휴대폰은 늘 세로. 의안 목록 카드도 같은 구조.
- **한글 줄바꿈** ⚠ D1 — 셸 뿌리 `word-break: keep-all` · 넓어진 표는 `.ggc-table-wrap` 안에서 가로로.
- **휴대폰 보정 공통** ⚠ D1 — 페이지 머리 세로 · 단추·페이지 이동 40 · 입력 16 이상 · KPI 두 칸(≤380 한 칸) · 액션바 안전 영역.
- **대민** ⚠ D1 `ggc-public.css` v3.2 — ≤900 사이드 메뉴 숨김(전체메뉴로 — 2단계 항목은 전체메뉴에도) · 전체메뉴 머리 굵기 600 · 메인 검색칸 높이 유지.
- **갤러리** 서랍 단추 마크업 · 대민 전체메뉴 「의안 처리 절차 안내」 · 낡은 설명(버튼 42 · 모서리 10/14 · 카드 radius 14) · 바닥글·쪽 머리 판 표기 v3.2 로.

## [3.1.0] — 2026-10-18 · 덜어내기 — 필요한 정보부터 보이게 한다 (문서·갤러리만, CSS·토큰 무변경)

다섯 서비스(주간업무보고 · 지식창고 · 의원 설문 · 조례 · 실시간 자막)의 세션 기록에서 화면에 대한 사용자 말을 모두 모아 대조했다.
되풀이된 지적은 "칸이 크다"가 아니라 **"보이는 종류가 많다"**("불필요한 고정된 글자들이 많아서 확인하기 어렵네요", "현재 뭘 해야 되는지 상태만").
가이드의 몇 문장(설명 한 줄 + 주 액션, KPI 정확히 4, 인사말, 표 필수 열, "아니오가 셋을 넘으면")이 오히려 정보를 더 넣게 했다. 결정: [ADR 0012](docs/decisions/0012-show-what-is-needed.md).
Codex(gpt-6-astra) 교차 검토 반영 — "없앤다"가 아니라 **"언제 보여 주나"** 로 썼다.

- **신설** [docs/guides/less.md](docs/guides/less.md) — 규칙 10개(각각 판정법) · 사용자가 실제로 빼라고 한 군더더기 열 가지 · 제목 기본형/간결형 · 기존 서비스 적용 원칙 · 근거(사용자 말 15건).
- **계약** §2(설명 줄 기본 없음 · 제목 기본형/간결형) · §11 신설 · 완료 정의 ⑫. ADR 0010 은 0012 가 일부 대체(제목 구조는 그대로).
- **스킬** 결정 트리에 「누가·무엇을 하러 오나」와 덜어내기 단계 · Phase 4 규칙 0 · 완료 목록 2줄.
- **archetypes** Monitor(KPI 0~4 · 다음 행동을 바꾸는 숫자만 · 인사말 없음) · Explore(건수는 결과 요약 한 곳) · Configure(스텝퍼는 단계를 오가는 입력에만) ·
  **Operate 정본** — 「실시간 시청」 · 「반복 처리 작업대」(첫 구현 = 회의 실시간 자막이 사용자와 확정한 배치). v3.0 의 파생 설계(상태 스트립 + 로그 + 권한 배지)는 버렸다.
- **domain-language** 첫 화면은 가장 자주 시작하는 일 · 밀도와 정보 종류 구분 · 판정 목록은 적용/미적용/해당 없음(개수로 합격 정하지 않음) ·
  아이콘 문장을 v3.0 lucide 규칙에 맞춤(유니코드 상태 기호·"아이콘 자산 없음"은 v3.0 과 어긋나 있었다).
- **갤러리** `less.html`(덜어내기 전/후 — 같은 자료·같은 일) · `operate.html`(실시간 시청 · 작업대) 신설, 전 쪽 LNB 에 두 항목.
  `dashboard.html` 인사말 · `explore.html`·`components-nav.html` 의 중복 건수 제거. `docs/components/page-head.md` 규칙 개정.
- **생성기** `build-standalone.py` 가 두 쪽과 **쪽 전용 `<style>`·인라인 스크립트**를 합본에 싣는다(그 전에는 `login.html` 의 상태 격자 스타일이 합본에서 빠져 있었다).
  `build-shots.py` 에 미리보기 3장(덜어내기 전·후 · Operate) — 쪽 주소에 `?state=` 를 쓸 수 있게 입력 해시는 파일 이름만 본다.
- **README** 앞부분을 디자인을 모르는 사람도 읽게 다시 썼다(전/후 그림 · 다섯 가지 · 담당자 확인법 · 말 풀이). 개발자용 내용은 그대로 아래로, 의안 B안 참고 시안은 "공통 기준 아님"을 밝히고 캡처를 접었다.
- **D1 재복사 불필요** — `ggc-tokens.css` · `ggc-components.css` · `ggc-behaviors.js` 바이트 그대로. 기존 서비스는 그 화면을 다음에 고칠 때 적용한다.
- **검사기** `check_design.py` D2 — HTML 숫자 문자 참조(`&#039;` · `&#10003;`)를 색으로 세던 오탐을 고쳤다(색 hex 는 3·4·6·8 자리만, `&` 바로 뒤는 제외 · 자기 점검 assert). 자막 서비스 v3 수렴에서 발견 — 기준을 낮춘 것이 아니라 색이 아닌 것을 빼는 수정이다.

## [Unreleased] — 2026-10-03 · 로그인 화면 플랫폼 개정(v1.3~v1.5)을 정본으로 ⚠ D1

경기도의회 업무플랫폼이 8월 말~9월에 로그인 화면에서 운영하던 개정을 정본 §11 로 올렸다. 그동안 v3 를 쓰는 서비스는 이 규칙을
자기 덧붙임 파일로 따로 붙여야 했다. **색·토큰은 바뀌지 않았다** — `ggc-components.css` 바이트만 바뀐다(⚠ D1 재복사).

- **두 래퍼(v1.3)** — `.ggc-qr-main`(찍는 것) · `.ggc-qr-aside`(읽는 것). 900px 이상에서 2단, 좁은 컨테이너에서는 `flex-wrap` 으로 스스로 한 줄로 접힌다.
  래퍼는 선택이라(`:has()` 가드) 안 옮긴 마크업은 한 줄 배치 그대로다. 2단이면 `.ggc-login` 카드가 820px 로 넓어진다.
- **앱 설치 안내** `.ggc-qr-install`(`<details>` 로 접힘 · 설치 QR · 주소 · 스토어 링크). 미등록·오류 상태에서는 저절로 접힌다.
- **좁은·낮은 화면 조임** — 옛 `max-width:420px` 블록을 `480px` 블록으로 대체(무대 216 · QR 184 · 안내 글자), `480×700` 이하 휴대폰과 `720` 이하 노트북에서 여백부터 줄인다.
  `.ggc-login` 바깥 여백도 줄였다(`space-7 … 64px` → `space-5 … space-6`, 카드 `space-7` → `space-6`) — 목표는 로그인 화면에서 스크롤을 없애는 것.
- **아이디 로그인(Login v1.5)** `.ggc-login-credentials` — 지원하는 서비스는 QR 과 같은 카드에, 숨기지 않고 둔다. PC 는 아이디 · 비밀번호 · 버튼 한 행.
- **앱 이름 정정** — "경기도의정포털 앱" → 스토어 등록명 **"모바일 의정지원서비스 앱"**(CSS 주석 · 갤러리 · 문서 · Tier 2 `ggc-qr-login` 문구).
- 갤러리 `login.html` — 실물을 2단 + 설치 안내로, "화면 전체 · 아이디 로그인 함께" 절 신설. `docs/components/qr-login.md` 개정.
- Tier 2 `ggc-qr-login` 은 문구만 고쳤다 — 두 래퍼 · 설치 안내 · 아이디 로그인은 아직 Tier 1 에만 있다.
- 검증: 덧붙임 파일을 뒤에 붙인 기존 v3(실제 운영 화면)와 새 정본만 쓴 화면을 9개 폭 × 상태 4종에서 계산 스타일 · 위치까지 비교해 차이 0.

## [Unreleased] — 2026-09-15 · PC·모바일 업무 UX 개선 ⚠ D1

- 공통 CSS·동작 개정: 모바일 메뉴 누락, 닫힌 메뉴 포커스 진입, 작은 화면 가로 넘침을 수정했다. PC 메뉴 접기와 모바일 메뉴 닫기·포커스 복귀를 제공한다.
- `.ggc-work` 배치: 설명을 접고 통계를 두 열로 유지한다. 모바일 업무/참고 전환, 표/카드 보기와 전체 정보 접근, 하단 작업 버튼을 지원한다.
- 의안 예제: 검색·필터·정렬·페이지 이동·전체 상세·CSV 다운로드를 구현했다. PC 기본은 15행, 모바일 기본은 5건이다. 실제 제출·회부 API는 호출하지 않는다.
- 초안 예제: 네 단계 이동, 입력 보존, 추가 조문, 브라우저 임시저장·복원, 필수 입력 확인, 텍스트 다운로드를 구현했다.
- 로컬 Pretendard GOV를 갤러리와 오프라인 합본에 연결했다. 새 브랜드색과 토큰 값 변경은 없다.
- 검증: 여섯 폭의 전체 갤러리·합본과 PC/모바일 주요 동선을 검사하는 `tools/check-responsive.cjs`를 추가했다.
- 소비 서비스는 수정된 `ggc-components.css`·`ggc-behaviors.js`·`ggc-public.css`를 재복사해야 한다. `.ggc-work`는 선택적으로 적용한다.

## [3.0.0] — 2026-09-05 ⚠ D1 — 업무 프로필을 shadcn 기본에, 제목은 본문에, 아이콘은 lucide 로

사용자 지적("내부 업무지원용으로는 아쉽다 · 디자인이 한눈에 안 들어온다")을 실측 진단([docs/audit/2026-09-05-shadcn-krds-audit.md](docs/audit/2026-09-05-shadcn-krds-audit.md))한 결과
색이 아니라 **위계 · 밀도 · 아이콘**이 원인이었다. **색은 하나도 바뀌지 않았다.** 결정: ADR [0009](docs/decisions/0009-work-profile-shadcn-density.md) · [0010](docs/decisions/0010-page-title-in-content.md) · [0011](docs/decisions/0011-tier2-primary-for-react.md).

- **토큰 v3.0** ⚠ D1 — 업무 치수 → shadcn 기본(버튼 32/36/40 · 입력 36 · 14px · 셀 8×12 · 행 12×16 · 카드 16×20). 신설 타이포 스케일
  `--ggc-text-xs~3xl` · `--ggc-leading-*` · `--ggc-h1/h2/h3-size` · `--ggc-kpi-size`, 아이콘 `--ggc-icon(-lg/-stroke)`, `--ggc-lnb-w-icon`. 대민 블록은 KRDS 그대로 + 타이포 스텝.
  검사기 `PROFILE_VARS` 에 타이포·아이콘 치수 추가.
- **컴포넌트 v3.0** ⚠ D1 — §9 `.ggc-gnb-page` 는 브레드크럼만(`.ggc-gnb-page-title` 폐기 예정) · LNB 항목 32px + 아이콘 슬롯 + `.ggc-lnb--icon` 접힘 ·
  §12 `.ggc-page-head` 가 `<h1 class="ggc-page-title">` 24px + `.desc` · §2·§3·§5·§6 리터럴 → 타이포 토큰 · §37 신설(`.ggc-h1/h2/h3` · `.ggc-icon`).
- **아이콘 정본 신설** — `design/icons/lucide/`(lucide-static 1.41.0 부분집합 90종, ISC) → `design/build-icons.py` → `design/ggc-icons.svg`(정본 6번째 파일, D1) + 갤러리 인라인 스프라이트.
  갤러리의 이모지·유니코드 기호(📋 ◷ ✕ ● ◆ ○ ▲ ＋ ← →) 전량 교체.
- **갤러리** — 업무 8쪽 h1 을 본문으로 이동, LNB 아이콘 + 현재 항목, **`explore.html` 신설**(의안 목록 — 필터 스트립 · 표 20행 · 페이지네이션, 첫 화면 15행 이상),
  `components-nav` GNB 절 개정. 합본은 쪽별 h1 id 분리 + 스프라이트 인라인. 스크린샷 18장(+ screen-explore · page-head).
- **Tier 2 레지스트리 v3** — **shadcn 공식 소스(4.19 · nova) + 토큰**으로 재작성. UI 45종(신설 22: sidebar · sheet · popover · command · calendar · chart · sonner · field ·
  separator · avatar · scroll-area · progress · collapsible · toggle · toggle-group · hover-card · kbd · empty · item · input-group · button-group · alert-dialog · native-select),
  `select` = Radix · `toast` → `sonner`. 블록: `ggc-shell` 재작성(sidebar 기반 · `AppSidebar` · `ShellHeader` · `ShellMain`) · `ggc-page-head`(h1) · 신설 `ggc-data-table`(TanStack v8) ·
  `ggc-filter-bar` · `ggc-detail-layout` · `ggc-wizard-layout` · 훅 `use-mobile`. 대민 블록 8종 무변경. `registry.json` 은 생성물(`tools/build-registry-json.py`). 항목 74 · R1~R5 PASS ·
  `tsc` 통과. 테마에 `font-heading` · radius 스텝 매핑, 소비자 css 에 `@import "shadcn/tailwind.css"` · `tw-animate-css` 추가.
- **PPT 가이드 신설** — `design/ppt/build-ppt.py`(python-pptx)가 토큰에서 16:9 발표용 템플릿(레이아웃 10종)과 샘플 덱 12장을 생성. `docs/guides/ppt.md`.
- **문서** — 계약 §2·§3·§9·§10 · `krds-alignment.md §9`(업무 프로필의 KRDS 범위) · `guides/typography.md` · `icons.md` · `ppt.md` · `components/shell.md` · `page-head.md` · `breadcrumb.md` ·
  신설 `data-table.md` · `sidebar.md` · `filter-bar.md` · `detail-layout.md` · `wizard-layout.md` · `quickstart/react-tier2.md` v3 · `migration/v2-to-v3.md` · 스킬 참조 · README · CLAUDE.md.
- **검사기** — D1 정본 6파일 · D6 gen 에 `build-icons.py` · `build-registry-json.py` · `build-ppt.py` · check-registry R3 에 chart 의 Recharts 속성 선택자 예외 · CI branches `v3-*`.

## [Unreleased] — v2 재구성

### README 컴포넌트 미리보기 (2026-09-04)

- `design/examples/build-shots.py` 신설 — 갤러리 실물 화면 3장 + 컴포넌트 13장을 헤드리스 Chrome 으로 찍어
  `design/examples/shots/*.png` 를 만든다. README 상단 "컴포넌트 미리보기" 절이 이걸로 보인다(GitHub 웹은 HTML 을
  렌더하지 않는다). 생성물이며 `manifest.json` 의 **입력 해시**로 신선도를 판정한다(픽셀은 환경마다 달라 바이트 비교 안 함).
  `check_design.py --canon` D6 `gen` 에 편입 — `--check` 는 표준 라이브러리만 써 CI 에서 그대로 돈다
- `.ggc-gnb-page` 브레드크럼 마지막 항목의 구분자 오른쪽 간격 보정(block 전환으로 빠진 gap) — ⚠ D1 `ggc-components.css`

### GNB 제목부 — 브레드크럼·페이지 제목을 GNB 로 (2026-09-04)

- `ggc-components.css` §9 `.ggc-gnb-page` + `.ggc-gnb-page-title` 신설 — 브레드크럼 + `<h1>` 이 본문 첫 줄이 아니라
  **GNB 안**(브랜드 슬롯과 검색 사이)에 산다. 업무 셸 기본 규칙([ADR 0008](docs/decisions/0008-page-title-in-gnb.md)).
  화면당 h1 은 GNB 에 하나, `<main aria-labelledby="page-title">`. 64px 고정이라 줄바꿈 없이 말줄임 —
  잘릴 수 있는 의안명은 본문에 전문. §10: ≤900 브레드크럼 숨김 · ≤480 제목 시각 숨김(접근성 트리 유지).
- `.ggc-page-head` 는 **메타 + 주 액션**으로 좁아졌다(선택자 불변 · `.meta:first-child` 마진 보정). Monitor 인사말은
  `<p class="title">`. 셸 ⓐ(GNB 없음)만 예전처럼 h1 을 여기 둔다.
- 갤러리 8쪽 GNB 에 제목부 적용(login 제외), dashboard·wizard 본문 헤더를 정본 `.ggc-page-head` 로 교체,
  components-nav 에 "GNB 제목부" 절 신설. 합본은 쪽 전환 시 제목부를 `<template>` 로 갈아 끼운다.
- Tier 2: `ggc-shell` 에 `GnbPage breadcrumb title titleId` · `ShellMain titleId`; `ggc-page-head` 는 `title` 선택,
  `greeting` 이면 `<p>`.
- 문서: 계약 §2 · layout-shell · shell · breadcrumb · page-head · archetypes · 스킬 components.md · ADR 0008
- 합본 결함 수정: `ggc-behaviors.js` 주석의 `</script>` 가 인라인 스크립트를 조기 종료시켜 합본에서 동작 스크립트 전체가
  SyntaxError 로 죽어 있었다(drawer · 탭 · 토스트 무반응). 생성기가 인라인 시에만 `<\/script` 로 이스케이프한다 — 정본 불변
- ⚠ D1 — `ggc-components.css` 바이트가 바뀌었다. 사본 재복사 필요(토큰 파일은 불변)

### Phase 9b — Tier 2 레지스트리 22항목 신설 (총 47) (2026-08-30)

- UI 6종: `switch` · `accordion` · `dropdown-menu` · `tooltip`(Radix + 토큰) · `toast`(GGC.toast 와 같은 규칙의
  React store — 3개 상한 · hover/focus 정지) · `listbox`(behaviors ⑨ 이식 — `aria-activedescendant` · 필터 · 다중)
- 블록 16종: `ggc-empty` · `ggc-file-upload`(`input.files` 역동기화) · `ggc-prose` · `ggc-list-row` · `ggc-search` ·
  `ggc-utility-bar` · `ggc-footer` · `ggc-qr-login` · **대민 셸 8종**(`ggc-masthead` · `ggc-identifier` ·
  `ggc-public-header`(PC 드롭다운 · 모바일 패널 · 통합검색) · `ggc-public-footer` · `ggc-public-layout` ·
  `ggc-hero` · `ggc-side-nav` · `ggc-structured-list`)
- `ggc-style` 이 UI 23종을 한 번에 설치. 색 리터럴 0(hex 대신 토큰·별칭) — R3 통과,
  **R5 WARN 0** — 인벤토리 '있음' 행 전부에 Tier 2 항목이 생겼다. check-registry 항목 47 · FAIL 0 · WARN 0
- 실증: Vite + Tailwind v4 소비자에 22항목 `shadcn add` → `tsc -b` · `vite build` 통과, 헤드리스 Chrome 26/26 —
  스위치 토글(40×22 · primary) · 토스트(polite · success 띠) · 메뉴 Esc · 툴팁 · 리스트박스 키보드/필터 ·
  파일 목록/삭제 · 대민 셸 렌더 · 대민 프로필 48px · 콘솔 오류 0
- 문서: 스킬 색인 · registry.md · react-tier2 의 "(Phase 9)" 예고를 실제 항목명으로 교체

### Phase 9a — Tier 1 P1·P2 컴포넌트 12종 (2026-08-30)

- `ggc-components.css` §24~§35 신설: `.ggc-switch`(`role="switch"`) · `.ggc-toast(-region)` · `.ggc-accordion`(`<details>`,
  `name` 배타) · `.ggc-date(-range)`(네이티브) · `.ggc-file` + `.ggc-file-list` · `.ggc-menu`(`<details>` + `role="menu"`) ·
  `.ggc-link` · `.ggc-empty`(ADR 0006 — 레이아웃만) · `.ggc-listbox`(`aria-activedescendant`) · `.ggc-tooltip` ·
  `.ggc-in-page-nav` · `.ggc-text-list`. §36 고대비 보강. **새 색 0 · 이미지 0** — 전부 토큰
- `ggc-behaviors.js` ⑤~⑩: `GGC.toast()`(3개 상한 · hover/focus 중 정지 · `[data-ggc-toast]` 선언형) · 메뉴 키보드
  (↑↓ Home End · ESC 복귀) · 파일 목록(삭제를 DataTransfer 로 `input.files` 에 되돌림) · 툴팁 ESC(WCAG 1.4.13) ·
  리스트박스(단일 선택은 포커스 따라감 · 앞글자 · 필터) · 페이지 내 내비(스크롤 기준선 25% + 바닥 규칙 —
  IntersectionObserver 띠 방식은 갱신을 건너뛰어 실측 후 폐기)
- 갤러리 3쪽(forms · nav · overlay)에 12절 추가, components.html "세 상태" 를 `.ggc-empty` · `.ggc-skeleton` 실물로 교체
- `docs/components/` 12쪽 신설(총 40종) · behaviors-js 가이드 · 스킬 `components.md` 색인 갱신 ·
  TSV 있음 48종(예정: combobox · calendar)
- 실증: 헤드리스 Chrome 48/48 PASS — 키보드(스위치 · 메뉴 · 리스트박스) · 토스트 상한/닫기/실행 취소 · 툴팁 ESC ·
  파일 `input.files` 동기화 · 스크롤스파이 중간/바닥 · 3쪽 × 3폭 오버플로 0 · 콘솔 오류 0 · 대민 프로필 치수
- ⚠ D1 — `ggc-components.css` · `ggc-behaviors.js` 바이트가 바뀌었다. 사본 재복사 필요(토큰 파일은 불변)

### Phase 8 — CI (2026-08-30)

- `tools/check-all.sh` — 정본(D6) · 갤러리 업무/대민(D1~D5) · 문서 링크 · Tier 2 레지스트리(R1~R5) 전수. Python 만 필요
- `.github/workflows/check.yml` — push · PR 마다 check-all + `npx shadcn build` 재빌드 diff(산출물 신선도)
- 실증: DESIGN.md 를 의도적으로 낡게 만들면 check-all 이 실패한다

### Phase 6 — 사람용 문서 (2026-08-30)

- `docs/README.md` 독자별 진입, `docs/quickstart/` 스택별 5단계 7종(정적 HTML · Jinja2 · FastAPI · JSP/Tiles · Vite React · Next · React Tier 2)
- `docs/guides/` tokens · accessibility · fonts · brand-assets · layout-shell · behaviors-js (+ profiles · public-shell)
- `docs/components/` 기존 컴포넌트 10종 문서(button · badge · card · stat · list-row · table · field · stepper · shell · qr-login) — 총 28종
- `docs/decisions/` ADR 7건(상태색 CI 유지 · 고대비 · 프로필 단일 파일 · 복사 배포/Tier 2 · Radix+Tailwind v4 · 빈 상태 조립 · 브랜드 별도 저장소)
- README 읽는 순서 갱신, 검사기 표에 D7

### Phase 5 — 스킬 v2 (2026-08-29)

- `skills/ggc-design/SKILL.md` 재작성 — 독립 실행(`$ROOT` 탐색 규칙), 결정 트리(프로필 → Tier → 셸 → 화면 → 컴포넌트 → 검증),
  7문항 결정 대화, 기록은 `<서비스>/docs/design-decisions.md` · 증거는 `docs/design-evidence/`.
  `/1ggc-deploy` · `state.json` · `G-DESIGN` 결합 제거
- 참조 신설 `components.md`(과업 → 클래스 색인) · `profiles.md` · `public-patterns.md` · `registry.md`, 개정 `contract.md`
  (정본 위치·토큰 색인 v2.0) · `verify.md`(검사 7종·증거 파일) · `porting.md`(폰트 정본·Tier 2) · `domain-language.md` · `archetypes.md`
- `tools/install-skill.sh`(링크 설치) · `.claude-plugin/plugin.json`(플러그인 매니페스트)

### Phase 7 — Tier 2 shadcn 레지스트리 (2026-08-29)

- `registry.json` + `registry/ggc/` 25항목: `ggc-tokens`(정본 사본, registry:file) · `ggc-theme`(shadcn 변수 → `var(--ggc-*)`,
  hex 0 · dark 없음) · `ggc-style`(한 번에 착지) · UI 17종(button · badge/tag · card · input/field · label · textarea ·
  select · checkbox · radio-group · dialog · tabs · alert · breadcrumb · pagination · table · skeleton · spinner) ·
  블록 5종(ggc-shell · ggc-stat · ggc-stepper · ggc-actionbar · ggc-page-head). shadcn v4 관례(`radix-ui` · `data-slot` ·
  함수 컴포넌트), 치수는 `--ggc-control-h*` 등 토큰이라 대민 프로필을 따른다
- `public/r/*.json` 빌드 산출물 커밋(서빙 대상). `npx shadcn build registry.json -o public/r`
- `tools/check-registry.py` 신설(R1 산출물 · R2 신선도 · R3 색 리터럴 · R4 테마 매핑 · R5 인벤토리), D6 gen 에 등록
- `check_design.py` **D7 REGISTRY** 신설 — `components.json` 이 있는 프로젝트에서 @ggc 등록 · 토큰 import · `:root` 매핑이
  전부 `var(--ggc-*)` 인지 · `.dark` 팔레트 유무
- 문서: `docs/quickstart/react-tier2.md`, 스킬 참조 `registry.md`, README
- 실증: Vite + Tailwind v4 + shadcn 4.19 소비자 프로젝트에서 `init -t vite -b radix -p nova` → `add @ggc/ggc-style` → 빌드 →
  계산 스타일 27/27 일치(버튼 42/#3C5D93/10px · 입력 44 · 표 13 · 대민 토글 48/17), `check_design --gate` D1·D7 PASS

### Phase 4 — 대민 프로필 + 공개 셸 (2026-08-29)

- `design/ggc-public.css` 신설 — 마스트헤드 · 헤더(유틸리티·브랜딩·통합검색) · 주 메뉴(PC 드롭다운/모바일 패널) ·
  본문 컨테이너·페이지 타이틀·히어로 · 사이드 내비(`<details>`) · 구조화 목록 · 공개 푸터 + 아이덴티파이어 ·
  반응형 · 고대비 · 인쇄. KRDS 마크업·ARIA, 색은 기관 CI. 이미지 자산 0(국가 상징은 서비스 슬롯)
- `ggc-behaviors.js` ④ 대민 메뉴 패널 · 2단 아코디언 · 통합검색 토글
- `ggc-components.css` §0 **box-sizing 잠금** — 정본이 서비스 리셋에 기대던 결함 수정(대민 갤러리에서 실측)
- `check_design.py`: D1 이 정본 5파일(tokens · components · public · fonts · behaviors) 사본을 LF 정규화 md5 로 대조,
  D3 프로필 분기(마크업 자동 판정 · `--profile`), 대민 화면의 업무 GNB/LNB 는 FAIL, 허용집합에 public css 포함
- 갤러리 `examples/public/` 4쪽(메인 · 의안 검색 · 의안 상세 · 의견 제출), 업무 갤러리 LNB 에 링크
- 문서: `docs/guides/profiles.md` · `public-shell.md`, `docs/components/` 대민 6종, 스킬 참조 `profiles.md` ·
  `public-patterns.md`, `domain-language.md` 대민 어휘 절
- 검증: 4쪽 접근성 린트(h1·alt·라벨·랜드마크·스킵·버튼 이름·id 중복) · 5폭 오버플로 0 · 모바일 메뉴/검색 동작 · 콘솔 오류 0

### Phase 3 — Tier 1 P0 컴포넌트 (2026-08-29)

- `ggc-components.css` §12~§24 신설: `.ggc-page-head` `.ggc-breadcrumb` `.ggc-tabs` `.ggc-pagination`
  `.ggc-select` `.ggc-check/.ggc-radio/.ggc-chip` `.ggc-alert` `.ggc-modal(<dialog>)` `.ggc-actionbar`
  `.ggc-spinner` `.ggc-skeleton` `.ggc-prose` `.ggc-sr` + 고대비 보강. 마크업·ARIA 는 KRDS 컴포넌트 HTML,
  CSS 는 토큰으로 재구현. 이미지 자산 0, 새 색 0
- `design/ggc-behaviors.js` 신설 — 탭(roving tabindex·화살표) · 모달(showModal·포커스 복귀·배경 클릭) ·
  LNB drawer. 외부 파일 1개, 인라인 0, 의존성 0
- 갤러리 3쪽 신설(`components-forms` · `components-nav` · `components-overlay`), 전 쪽 LNB 갱신,
  합본 생성기가 9쪽 + behaviors.js 를 담음
- `check_design.py` D6 inventory: `components.tsv` ↔ CSS 양방향 대조(있음 행 미정의 FAIL, 표 누락 계열 WARN)
- `components.tsv`: 12종 예정 → 있음

### Phase 2 — DESIGN.md 생성기 (2026-08-29)

- `design/components.tsv` 신설 — 컴포넌트 인벤토리 정본(현행 17 + 예정 30). 문서·DESIGN.md·
  레지스트리 lint 의 단일 원천
- `tools/build-design-md.py` 신설 — 루트 `DESIGN.md`(Claude Design 가져오기용 9절 구조)를
  토큰 CSS·인벤토리에서 생성. 대비비는 `check_design.contrast()` 재사용. `--check` 지원
- `check_design.py` D6 gen: `DESIGN.md` 신선도 검사 등록(경로 해석을 design/ 기준 상대로 일반화)
- README: 「Claude Design 에서 쓰기」 절

### Phase 1 — 토큰 v2.0 + 프로필 (2026-08-29) ⚠ D1

- `ggc-tokens.css` v2.0: 신설 `--ggc-space-8~11`, `--ggc-text-body` 승격, 컨트롤 치수·밀도·폭 토큰
  14종(`--ggc-control-h*` `--ggc-input-h` `--ggc-search-h` `--ggc-*-font` `--ggc-cell-pad`
  `--ggc-row-pad` `--ggc-card-pad` `--ggc-container-max`), **`[data-ggc-profile="public"]` 대민 블록**
  (값은 KRDS 토큰에서 기계적으로 옮김). **색은 하나도 바뀌지 않았다**
- `ggc-components.css` v2.0: 리터럴 → 토큰 값-불변 리팩터. 갤러리 6쪽 × 2폭 계산 스타일 해시
  리팩터 전후 12/12 일치 실측. `--ggc-text-body` 정의는 토큰으로 이동
- `check_design.py` D6: 프로필 블록 검사 — 허용 목록(치수 14종) 밖 토큰·색 값이 있으면 FAIL
- `docs/contract.md` §9 프로필 조항 신설, §3 에 `text-body` 색인 추가
- `.gitattributes` 로 줄끝 LF 고정 (OS 무관 D1)
- `docs/migration/v1.2-to-v2.md` 신설
- 갤러리 `tokens.html`: 신설 토큰 절 + 대민 프로필 미리보기 토글

### Phase 0 — 정본화 (2026-08-29)

- **이 저장소를 정본으로 승격.** 상위 플랫폼 저장소(`ggc_ai_platform`) 경로 의존을 전부 제거
- `skills/2ggc-design/` → `skills/ggc-design/` 개명 (파이프라인 번호 접두 제거)
- `docs/23-…-단일디자인-계약.md` → `docs/contract.md` 개명
- `tools/sync-from-platform.sh` · `redaction.local.sed.example` · `docs/03-공통디자인가이드.md`(구판)
  → `archive/` 로 이동
- `check_design.py`: 서비스 루트 하드코딩 기본값 제거 — `GGC_SERVICES` 환경변수 또는
  `--all <경로>` 로 지정한다. 미지정이면 자산 배포 검사는 "해당 없음" 으로 표기(SKIP ≠ PASS)
- `design/fonts/build-font.py`: 커버리지 기준 경로를 `GGC_FONT_BASELINE` 환경변수로 지정
- `tools/check-links.py` 신설 — 문서 상대링크 존재·절대경로(`D:\`·`/d/…`)·원문 IP 패턴 검사
- README: 「이 저장소의 지위」를 정본 선언으로 재작성, 「공개 전환 전 확인할 것」을
  「공개 이력과 남은 주의점」으로 정리. **검증 명령 예시에 정규식 이스케이프 형태로 남아
  있던 원문 IP 를 제거**

## [1.2.0] — 2026-08-22 (v2 이전 마지막 정본)

- 토큰 v1.2: WCAG AA 보정(상태색 4종·중립 램프 2단), `--ggc-text-faint` 를 비텍스트 전용으로 강등 ⚠ D1
- 컴포넌트 v1.2: `.ggc-qr` QR 로그인 블록 신설, `forced-colors`·`prefers-contrast` 미디어 블록
- 폰트 정본 v1.0: 가변 woff2 단일 파일 + `ggc-fonts.css`
