# 페이지 헤더 — `.ggc-page-head` (v3.0)

본문 첫 줄 — **`<h1 class="ggc-page-title">`(24px) + 설명 한 줄 + 주 액션 하나**. 화면의 h1 은 여기 하나다(ADR 0010).
브레드크럼은 GNB 경로부([shell.md](shell.md))에 있다. 제목은 그 화면에서 가장 큰 글자여야 시선의 닻이 된다 — 위계는 색이 아니라 크기·굵기로(ADR 0009).

## 마크업

```html
<div class="ggc-page-head">
  <div class="row">
    <div>
      <h1 class="ggc-page-title" id="page-title">의안 목록</h1>
      <p class="desc">제12대 · 제380회 정례회 · 접수 147건 · 처리 대기 21건</p>
    </div>
    <div class="actions">
      <button class="ggc-btn ggc-btn--secondary" type="button"><svg class="ggc-icon" aria-hidden="true"><use href="#i-download"/></svg>엑셀 내려받기</button>
      <button class="ggc-btn ggc-btn--primary" type="button"><svg class="ggc-icon" aria-hidden="true"><use href="#i-plus"/></svg>의안 등록</button>
    </div>
  </div>
</div>
<main … aria-labelledby="page-title">
```

## 변형 · 자리별 규칙

| 화면 | h1 | `.desc` |
|---|---|---|
| Monitor(대시보드) | 화면 이름 — "대시보드" | 인사말 + 회기 맥락 — `{이름}님, 오늘 처리할 {업무} {N}건이 있습니다 · 제12대 제3차 정례회 · 18일차` |
| Explore(목록) | "의안 목록" | 제N대 · 회기 · 접수 건수 · 대기 건수 |
| Learn/Decide(상세) | **레코드명**(의안명) — 두 줄까지 허용 | 의안번호 · 소관 · 제안자 · 접수일 |
| Configure(위저드) | 작업 이름 — "조례 초안 작성" | 레코드명 · 초안 번호(mono) |

`.title` · `.meta` · `--greeting` 은 v2 호환 별칭이다 — 렌더는 같고, v3.1 에서 지운다.

## 규칙

- **주 액션은 하나**(primary). 보조는 secondary·ghost. 둘 이상 primary 를 두면 무엇을 눌러야 하는지 흐려진다.
- 설명에 **기관 맥락**을 적는다 — 제N대 · 제NNN회 · 소관 · 건수. 상대시간("3시간 전")은 쓰지 않는다.
- **인사말을 h1 으로 쓰지 않는다.** 인사말은 설명이다.
- 버튼의 기호(＋ ← →)는 lucide 아이콘으로 — [guides/icons.md](../guides/icons.md).
- ≤480px 에서 h1 은 `--ggc-text-xl`(20)로 줄어든다. 숨기지 않는다.

## 프로필

대민 프로필은 `--ggc-h1-size` 가 32 로 커진다(KRDS title.large). 대민 화면은 보통 KRDS 페이지 타이틀 패턴(`.ggc-page-title` in `ggc-public.css`)을 쓴다 — 같은 클래스 이름이며 값은 프로필이 정한다.

## Tier 2

`@ggc/ggc-page-head` — `PageHead title desc actions titleId` · `SectionTitle`(카드 밖 구획 제목 18).

## 근거

`ggc-components.css` §12 · §37 · `skills/ggc-design/references/archetypes.md` · [ADR 0010](../decisions/0010-page-title-in-content.md).
