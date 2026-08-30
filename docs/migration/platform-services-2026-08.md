# 플랫폼 서비스 실측 — 2026-08 리스킨 기준선

`skills/ggc-design/references/reskin.md` 의 **절차**를 2026-08-22 시점 플랫폼 11개 서비스에 적용할 때의 실측표다.
서비스가 바뀌면 이 문서를 갱신한다 — 절차 문서에는 서비스 이름을 두지 않는다.

## 무엇이 갈라져 있었나 (2026-08-22)

프런트 11개 중 토큰을 실제로 소비하는 건 **5개**였다.

| 형 | 서비스 | 주 색상 |
|---|---|---|
| ❷ 사본형 | `_template` · `ggc_ai_aide` · `ggc_kb` | `#3c5d93` ✓ |
| ❸ 인라인형 | `ggc_ai_hipass` · `ggc_ai_hr` | `#3c5d93` ✓ |
| ❹ 독자형 | `ggc-poc-web` | `#0369A1` |
| ❹ | `ggc_hermes` | `#0b4da2` |
| ❹ | `award_office` | `#13778e` (청록) |
| ❹ | `ggc_mobile_login` | `#eef2f8` 계열 |
| ❹ | `ggc-ai-live-transcribe` | **`#256ef4` — 계약이 폐기한 값** |
| ❹ | `bill-system` | 혼재 (+ 벤더 번들 `#2b6cb0`) |

주 색상 **9종** · 회색 램프 4종 · 성공색 5종 · 서체 4파. `QrLoginBox` 는 5곳에 복제돼 스타일 언어가 셋으로 갈렸다
→ 2026-08-22 정본에 `.ggc-qr`(§11)을 신설하고 10개 서비스를 전부 그리로 옮겨 해소.

**토큰 계약 성립 뒤인 2026-08-20 에 만든 `ggc_hermes` 조차 `--brand:#0b4da2` 를 또 만들었다.**
규약이 문서로만 있으면 신규 서비스에 강제되지 않는다는 증거다 — 그래서 게이트가 있다.

형제 프로젝트(`의정포털` `--gg-*` · `의안처리` `--gac-*` #3C5D89 · `법령정보` `--ggc-*` #256EF4)도 같은 드리프트다 —
v2 마이그레이션 대상이며 `docs/migration/v1.2-to-v2.md` 의 절차를 따른다.

## 순서 — 쉬운 것부터

배포 경로가 서비스마다 다르고, 앞의 것에서 배운 것이 뒤에 쓰인다.

| # | 서비스 | 왜 이 순서 | 재배포 |
|---|---|---|---|
| 1 | `ggc_hermes` | 정적 HTML. 가장 단순하고 원격도 없다 | 이미지 재빌드 |
| 2 | `ggc-poc-web` | **오리진 루트 `.ico` 를 잡으면 나머지 전부에 기본 아이콘이 생긴다.** basePath 없는 Next 로 파일 관례를 먼저 검증 | 파이프라인 |
| 3 | `ggc_ai_aide` | FastAPI `/static` 마운트 변형 확정 | 이미지 재빌드 |
| 4 | `ggc_ai_hr` | **basePath 있는 Next 의 첫 검증.** 파일 관례가 프리픽스를 붙이는지 실증 | 이미지 재빌드 |
| 5 | `award_office` | Vite. 기존 선언 교체 + theme-color 변경 — **시각 회귀 가능** | 이미지 재빌드 |
| 6 | `ggc_mobile_login` | **Vercel 이 배포 정본** — 리스킨이 외부 배포로 나간다 | Vercel |
| 7 | `ggc-ai-live-transcribe` | **가장 위험. 마지막** (아래) | 이미지 재빌드 |
| 8 | `bill-system` | eGovFrame. 범위가 크다 | WAR 재빌드 |

## 위험이 실재하는 곳

### `ggc-ai-live-transcribe` — 세 겹

1. `frontend/public/favicon.ico` 는 **ICO 가 아니다.** 매직 바이트가 PNG 이고 60,733 바이트다. **삭제 대상.**
2. `src/app/favicon.ico`(정상 ICO) + `src/app/icon.png`(**512×512, 203KB**)가 공존해 페이지마다 `rel="icon"` 이 2개(20페이지 × 2 = 40건).
   32 로 교체하면 "아이콘이 흐려졌다" 는 반응이 나올 수 있다.
3. **오리진이 둘이다** — 내부 IP 오리진과 `aisub.ggc.go.kr`. 후자의 루트 `/favicon.ico` 를 무엇이 받는지 Traefik 라우팅을 확인해야 한다.

### `award_office` — theme-color 가 눈에 보인다

`#13778e`(청록) → `#3C5D93`(네이비)는 모바일 주소창 색이 바뀌는 변화다. 팔레트 전체가 청록으로 드리프트해 있어서,
**파비콘·theme-color 만 바꾸면 부조화가 도드라진다.** 파비콘을 먼저(가역적·범위 작음), 색 통일을 뒤에.

### `bill-system` — 명시적 예외를 선언한다

eGovFrame WAR 무수정 원칙과 리스킨이 충돌한다. `custom.css` 2,620줄에 계약 §6 의 BIMS 특별 규칙까지 걸려 있다.
**시각만 수렴하고 기능·JSP 매핑은 건드리지 않는다.** 수렴 불가능한 부분은 `ggc-design-allow` 로 **등록**한다.
`src/main/webapp/rhwp/` 벤더 번들은 손대지 않는다(재빌드하면 덮어써진다).

### `ggc-poc-web` — 도면은 예외다

`webapp/styles/document.css` 의 색은 **범례**다(공개 영역 / 사설 영역 / 차단). **셸(`hub.css`)만 수렴**하고 도면 본문은
`ggc-design-allow` 로 등록한다. `hub.css` 의 `--ggc-*` 참조는 0회였다 — 리스킨의 실제 작업은 **이름을 `--ggc-*` 로 옮기는 것**이다.

## 원격 push 정책

리스킨은 서비스 저장소를 건드린다. **원격 push 가 승인된 것만 push 한다** —
`ggc-ai-live-transcribe` · `ggc_ai_hr` · `ggc_ai_hipass` · `ggc_mobile_login` · `ggc_ai_aide` 다섯(조직 private 저장소).
나머지는 **로컬 커밋까지**만 한다. `ggc-poc-web` 은 git 저장소가 아니다.
